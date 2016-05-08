var AAATable = (function () {
    function AAATable() {
        this.fixedHeader = false;
        this.fixedCol = false;
        this.width100 = false; //表格充满div区域
        this.tableStyle = "AAAA";
        this.tableHeigth = 1; //真个表格区域的高度 1->100% 相对可使区域
        this.offsetW = 0; //完全不可能调好
        AAATable.log("固定标题行标题列的表格v3.0 ,是用原生scroll");
    }
    AAATable.log = function (msg) {
        if (AAATable.debug) {
            console.log(msg);
        }
    };
    //获取元素高宽   {不完全兼容很多浏览器}
    AAATable.getHeight = function (el) {
        var styles = window.getComputedStyle(el);
        var height = el.offsetHeight;
        var borderTopWidth = parseFloat(styles.borderTopWidth);
        var borderBottomWidth = parseFloat(styles.borderBottomWidth);
        var paddingTop = parseFloat(styles.paddingTop);
        var paddingBottom = parseFloat(styles.paddingBottom);
        return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    };
    AAATable.getWidth = function (el) {
        var styles = window.getComputedStyle(el);
        var width = el.offsetWidth;
        var borderLeftWidth = parseFloat(styles.borderLeftWidth);
        var borderRightWidth = parseFloat(styles.borderRightWidth);
        var paddingLeft = parseFloat(styles.paddingLeft);
        var paddingRight = parseFloat(styles.paddingRight);
        // AAATable.log("width:"+width+"     "+"borderLeftWidth:"+borderLeftWidth+"     "+"paddingLeft:"+paddingLeft);
        return width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight;
    };
    //试图移除节点
    AAATable.tryRemove = function (parentE, childE) {
        try {
            parentE.removeChild(childE);
        }
        catch (err) {
            AAATable.log("删除节点出错,不用处理");
        }
    };
    //配置表格
    AAATable.prototype.setupTable = function (divTable) {
        AAATable.log("固定标题:" + this.fixedHeader);
        AAATable.log("固定第一列:" + this.fixedCol);
        AAATable.log("样式:" + this.tableStyle);
        AAATable.log("高度" + this.tableHeigth);
        this.divTable = divTable;
    };
    //形成表格
    AAATable.prototype.buildTable = function () {
        //删除多余节点
        AAATable.tryRemove(this.divTable, this.divTable.getElementsByClassName("divTableHeader")[0]);
        AAATable.tryRemove(this.divTable, this.divTable.getElementsByClassName("divTableCol")[0]);
        //能滑动的
        var tableScrollerDiv = document.createElement("div");
        tableScrollerDiv.className = "TableScroller";
        var tableScroller = document.createElement("div");
        tableScroller.className = "ABox";
        //tableScroller.innerHTML = "BBBBB";
        tableScrollerDiv.appendChild(tableScroller);
        this.divTable.appendChild(tableScrollerDiv);
        var divMainAndCol = document.createElement("div");
        divMainAndCol.className = "divMainAndCol";
        this.divTable.appendChild(divMainAndCol);
        var divTableMain = this.divTable.getElementsByClassName("divTableMain")[0];
        divMainAndCol.appendChild(divTableMain);
        var i = 0;
        if (this.width100) {
            divTableMain.getElementsByTagName("table")[0].style.width = "100%";
        }
        //console.log(divTableMain.getElementsByTagName("table")[0].style.classList.add(""));
        divTableMain.getElementsByTagName("table")[0].className = this.tableStyle;
        //增加header
        if (this.fixedHeader) {
            var headerTr = divTableMain.children[0].getElementsByTagName("tr")[0];
            var divTableHeader = document.createElement("div");
            divTableHeader.classList.add("divTableHeader");
            var tb_str = '<table class="' + this.tableStyle + '"><tbody><tr>';
            for (i = 0; i < headerTr.childNodes.length; i++) {
                //console.log(headerTr.childNodes[i]);
                var w = AAATable.getWidth(headerTr.childNodes[i]) + this.offsetW + "px";
                tb_str += '<td style="min-width:' + w + ';">' + headerTr.childNodes[i].innerHTML + '</td>';
            }
            tb_str += "</tr></tbody></table>";
            divTableHeader.innerHTML = tb_str;
            this.divTable.insertBefore(divTableHeader, divMainAndCol);
            //限定整体宽度
            divTableHeader.style.width = AAATable.getWidth(this.divTable) + "px";
            divTableHeader.style.left = this.divTable.getBoundingClientRect().left + this.divTable.borderWidth;
            divTableHeader.getElementsByTagName("table")[0].style.width = AAATable.getWidth(divTableMain.getElementsByTagName("table")[0]) + "px";
        }
        //增加fixedCol
        if (this.fixedCol) {
            //获取所有第一列
            var trs = divTableMain.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            var strTrInColumn = "<table class=" + this.tableStyle + "><tbody><tr>";
            for (i = 0; i < trs.length; i++) {
                var td = trs[i].firstElementChild;
                var h = AAATable.getHeight(td);
                strTrInColumn += '<td style="min-height: ' + h + 'px">' + td.innerHTML + '</td>';
            }
            strTrInColumn += '</tr></tbody></table>';
            var divTableCol = document.createElement("div");
            divTableCol.classList.add("divTableCol");
            divTableCol.innerHTML = strTrInColumn;
            divTableCol.style.width = trs[0].firstElementChild.getBoundingClientRect().width + "px";
            //            divTableMain.style.width = "100%";
            //             divTableMain.style.marginLeft = -parseFloat(divTableCol.style.width)+"px";
            divMainAndCol.insertBefore(divTableCol, divTableMain);
        }
        divMainAndCol.appendChild(divTableMain);
        tableScroller.style.width = divTableMain.getElementsByTagName("table")[0].offsetWidth + "px"; //地下的方法ip上出错
        tableScroller.style.height = divTableMain.getElementsByTagName("table")[0].getBoundingClientRect().height + "px";
        //TODO 需要脏检查
        //同步滑动事件
        tableScrollerDiv.addEventListener('scroll', function () {
            divTableHeader.scrollLeft = tableScrollerDiv.scrollLeft;
            divTableMain.scrollLeft = tableScrollerDiv.scrollLeft;
            divMainAndCol.scrollTop = tableScrollerDiv.scrollTop;
        });
        this.divTable.style.height = document.documentElement.clientHeight * this.tableHeigth + "px";
    };
    AAATable.debug = false; //调试模式
    return AAATable;
}());
//# sourceMappingURL=File.js.map