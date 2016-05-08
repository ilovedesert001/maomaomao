
class AAATable{

    constructor(divTable,options){
        AAATable.log("固定标题行标题列的表格v3.0 ,使用原生scroll");


        for ( var i in options ) {
            this.options[i] = options[i];
        }


        AAATable.log("参数:");
        AAATable.log(this.options);

        this.divTable = divTable;

        if(this.options.autoSetForFx && Browser.getType()== Browser.Firefox){
            AAATable.log("火狐浏览器，offsetW -1");
            this.options.offsetW -=1;
        }

    }


    static debug = false;//调试模式
    options = {
        fixedHeader : false,
        fixedCol : false,
        width100 : false,//表格充满div区域
        tableStyle : "AAAA",
        tableHeigth : 1,//整个表格区域的高度 1->100% 相对可使区域
        offsetW : 0,//完全不可能调好

        autoSetForFx:true,//为火狐自适应offsetW
        dragscroll: "dragscroll", //使用dragscroll插件
    };


    static jq = null;//使用jq？
    static fullHeigth = -100;
    divTable;//root

    static log(msg){
        if (AAATable.debug){
            console.log(msg);
        }
    }


    // static tryGet {}


    //获取元素高宽   {不完全兼容很多浏览器}
    static getHeight(el) {
        const styles = window.getComputedStyle(el);
        const height = el.offsetHeight;
        const borderTopWidth = parseFloat(styles.borderTopWidth);
        const borderBottomWidth = parseFloat(styles.borderBottomWidth);
        const paddingTop = parseFloat(styles.paddingTop);
        const paddingBottom = parseFloat(styles.paddingBottom);
        return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }
    
    static getWidth(el) {
        if(this.jq != null ){
            return AAATable.jq(el).width();
        }else {
            const styles = window.getComputedStyle(el);
            const width = el.offsetWidth;
            const borderLeftWidth = parseFloat(styles.borderLeftWidth);
            const borderRightWidth = parseFloat(styles.borderRightWidth);
            const paddingLeft = parseFloat(styles.paddingLeft);
            const paddingRight = parseFloat(styles.paddingRight);
            // AAATable.log("width:"+width+"     "+"borderLeftWidth:"+borderLeftWidth+"     "+"paddingLeft:"+paddingLeft);
            return width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight;
        }

    }

    //试图移除节点
    static tryRemove(parentE,childE){
        try {
            parentE.removeChild(childE);
        }catch(err) {
            AAATable.log("删除节点出错,不用处理");
        }
    }

    //形成表格
    buildTable(){
        var divTableMain = this.divTable.getElementsByClassName("divTableMain")[0];

        //删除多余节点
        AAATable.tryRemove(this.divTable,this.divTable.getElementsByClassName("TableScroller")[0]);
        AAATable.tryRemove(this.divTable,this.divTable.getElementsByClassName("divTableHeader")[0]);
        AAATable.tryRemove(this.divTable,this.divTable.getElementsByClassName("divMainAndCol")[0]);


        //能滑动的
        var tableScrollerDiv = document.createElement("div");
        tableScrollerDiv.className = "TableScroller "+this.options.dragscroll;

        var tableScrollerDivLargeBox = document.createElement("div");
        tableScrollerDivLargeBox.className = "ABox";
        tableScrollerDiv.appendChild(tableScrollerDivLargeBox);

        this.divTable.appendChild(tableScrollerDiv);

        var divMainAndCol = document.createElement("div");
        divMainAndCol.className = "divMainAndCol";
        this.divTable.appendChild(divMainAndCol);


        divMainAndCol.appendChild(divTableMain);
        var i=0;
        if (this.options.width100){
            divTableMain.getElementsByTagName("table")[0].style.width = "100%";
        }
        
        divTableMain.getElementsByTagName("table")[0].className = this.options.tableStyle;

        //增加header
        if (this.options.fixedHeader){
            
            var headerTr = divTableMain.children[0].getElementsByTagName("tr")[0];

            var divTableHeader = document.createElement("div");
            divTableHeader.classList.add("divTableHeader");
            var tb_str = '<table class="'+this.options.tableStyle+'"><tbody><tr>';
            for (i=0;i<headerTr.childNodes.length ; i++){
                var w =  AAATable.getWidth(headerTr.childNodes[i])+ this.options.offsetW + "px";
                tb_str +='<td style="min-width:'+w+';">'+headerTr.childNodes[i].innerHTML+'</td>';
            }
            tb_str += "</tr></tbody></table>";
            divTableHeader.innerHTML = tb_str;

            this.divTable.insertBefore(divTableHeader,divMainAndCol);

            //限定整体宽度
            //divTableHeader.style.width = AAATable.getWidth(this.divTable) +"px";
            //divTableHeader.style.left = this.divTable.getBoundingClientRect().left +this.divTable.borderWidth;
            //divTableHeader.getElementsByTagName("table")[0].style.width = AAATable.getWidth(divTableMain.getElementsByTagName("table")[0]) + "px";

        }


        //增加fixedCol
        if (this.options.fixedCol){
            //获取所有第一列
            var trs = divTableMain.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            var strTrInColumn = "<table class="+this.options.tableStyle+"><tbody><tr>";
            for(i=0;i<trs.length;i++){
                var td = trs[i].firstElementChild;
                var h = AAATable.getHeight(td);
                strTrInColumn +='<td style="min-height: '+h+'px">' +td.innerHTML+'</td>';
            }

            strTrInColumn += '</tr></tbody></table>';
            var divTableCol = document.createElement("div");
            divTableCol.classList.add("divTableCol");
            divTableCol.innerHTML = strTrInColumn;
            divTableCol.style.width =trs[0].firstElementChild.getBoundingClientRect().width+"px";

//            divTableMain.style.width = "100%";
//             divTableMain.style.marginLeft = -parseFloat(divTableCol.style.width)+"px";

            divMainAndCol.insertBefore(divTableCol,divTableMain);


        }

        divMainAndCol.appendChild(divTableMain);

        tableScrollerDivLargeBox.style.width =  divTableMain.getElementsByTagName("table")[0].offsetWidth+"px"; //地下的方法ip上出错

        tableScrollerDivLargeBox.style.height = divTableMain.getElementsByTagName("table")[0].getBoundingClientRect().height+"px";



        //TODO 需要脏检查
        //同步滑动事件
        // 情况1 固定列，标题
        if (this.options.fixedHeader && this.options.fixedCol){
            tableScrollerDiv.addEventListener('scroll',function () {
                divTableHeader.scrollLeft = tableScrollerDiv.scrollLeft;
                divTableMain.scrollLeft = tableScrollerDiv.scrollLeft;
                divMainAndCol.scrollTop = tableScrollerDiv.scrollTop;
            });
        }

        // 情况2 固定标题，不固定列
        if (this.options.fixedHeader && !this.options.fixedCol){
            tableScrollerDiv.addEventListener('scroll',function () {
                divMainAndCol.scrollTop = tableScrollerDiv.scrollTop;
            });
        }

        // 情况3 不固定标题，固定列
        if (!this.options.fixedHeader && this.options.fixedCol){
            tableScrollerDiv.addEventListener('scroll',function () {
                divTableMain.scrollLeft = tableScrollerDiv.scrollLeft;
                divMainAndCol.scrollTop = tableScrollerDiv.scrollTop;
            });
        }


        if(this.options.tableHeigth == AAATable.fullHeigth){
            this.divTable.style.height =AAATable.getHeight(divTableMain) + "px";
        }else if(String(this.options.tableHeigth).indexOf("px")>0){
            this.divTable.style.height = String(this.options.tableHeigth);
        }else {
            this.divTable.style.height =document.documentElement.clientHeight* this.options.tableHeigth + "px";
        }




    }

}


class Browser{

    static Opera = "Opera";
    static Firefox = "Firefox";
    static Chrome = "Chrome";
    static Safari = "Safari";
    static compatible = "compatible";

    static getType(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        //判断是否Opera浏览器
        if (userAgent.indexOf(this.Opera) > -1) {
            return this.Opera;
        }
        // /判断是否Firefox浏览器
        if (userAgent.indexOf(this.Firefox) > -1) {
            return this.Firefox;
        }
        if (userAgent.indexOf(this.Chrome) > -1) {
            return this.Chrome;
        }
        //判断是否Safari浏览器
        if (userAgent.indexOf(this.Safari) > -1) {
            return this.Safari;
        }
        //判断是否IE浏览器
        if (userAgent.indexOf(this.compatible) > -1) {
            return this.compatible;
        }
    }

}











