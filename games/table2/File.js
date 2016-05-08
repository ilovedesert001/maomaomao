var AAATable = (function () {
    function AAATable() {
        this.fixedHeader = false;
        this.fixedCol = false;
        this.width100 = false; //表格充满div区域
        this.tableStyle = "AAAA";
        this.offsetW = 0; //完全不可能调好
        AAATable.log("固定标题行标题列的表格v2.0");
    }
    AAATable.log = function (msg) {
        if (AAATable.debug) {
            console.log(msg);
        }
    };
    //获取元素高宽
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
        AAATable.log("width:" + width + "     " + "borderLeftWidth:" + borderLeftWidth + "     " + "paddingLeft:" + paddingLeft);
        return width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight;
    };
    //有则删除
    AAATable.tryRemove = function (parentE, childE) {
        try {
            parentE.removeChild(childE);
        }
        catch (err) {
            AAATable.log(err);
        }
    };
    //配置表格
    AAATable.prototype.setupTable = function (divTable) {
        AAATable.log("固定标题:" + this.fixedHeader);
        AAATable.log("固定第一列:" + this.fixedCol);
        this.divTable = divTable;
        AAATable.log(this.divTable);
    };
    //形成表格
    AAATable.prototype.buildTable = function () {
        //删除多余节点
        AAATable.tryRemove(this.divTable, this.divTable.getElementsByClassName("divTableHeader")[0]);
        AAATable.tryRemove(this.divTable, this.divTable.getElementsByClassName("divTableCol")[0]);
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
            //同步滑动事件
            divTableMain.addEventListener('scroll', function () {
                divTableHeader.scrollLeft = divTableMain.scrollLeft;
            });
            var that = this;
            //不需要显示时隐藏
            document.addEventListener('scroll', function () {
                if (that.divTable.getBoundingClientRect().top < -20 && that.divTable.getBoundingClientRect().bottom - 100 > 0) {
                    AAATable.hide(divTableHeader, false);
                }
                else {
                    AAATable.hide(divTableHeader, true);
                }
            });
            //先不显示
            AAATable.hide(divTableHeader, true);
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
            // divTableMain.style.width = AAATable.getWidth(this.divTable) -parseFloat(divTableCol.style.width) - 1+"px";
            //divTableMain.style.width = divMainAndCol.clientWidth- divTableCol.getBoundingClientRect().width+"px";
            divTableMain.style.width = "100%";
            divTableMain.style.marginLeft = -parseFloat(divTableCol.style.width) + "px";
            divMainAndCol.insertBefore(divTableCol, divTableMain);
        }
        //divMainAndCol.appendChild(divTableMain);
    };
    //显示隐藏
    AAATable.hide = function (el, hideFlag) {
        if (hideFlag) {
        }
        else {
        }
    };
    AAATable.debug = false; //调试模式
    return AAATable;
}());
//# sourceMappingURL=File.js.map