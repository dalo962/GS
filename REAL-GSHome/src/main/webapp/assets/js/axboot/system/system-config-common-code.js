var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["commonCodes"],
            cache : false,
            data: caller.searchView.getData(),
            callback: function (res) {
                caller.gridView01.setData(res);
            }
        });
        return false;
    },
    PAGE_SAVE: function (caller, act, data) {
        var saveList = [].concat(caller.gridView01.getData("modified"));
        saveList = saveList.concat(caller.gridView01.getData("deleted"));

        axboot.ajax({
            type: "POST",
            url: ["commonCodes"],
            cache : false,
            data: JSON.stringify(saveList),
            callback: function (res) {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                axToast.push(LANG("onsave"));
            }
        });
    },
    ITEM_ADD: function (caller, act, data) {
        caller.gridView01.addRow();
    },
    ITEM_DEL: function (caller, act, data) {
        caller.gridView01.delRow("selected");
    },    
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    }
});

var info = {};

//fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    $("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});
    
    axboot.promise()
    .then(function (ok, fail, data){
    	axboot.ajax({
    		type: "POST",
    		url: "/api/mng/searchCondition/codeSelect",
    		cache : false,
    		data: JSON.stringify($.extend({}, info)),
    		callback: function (res) {
    			var resultSet = [{value: "", text: "전체" }];
    		   	res.list.forEach(function (n) {
    		   		resultSet.push({
    		   			value: n.groupCd, text: n.groupNm,
    		   		});
    		   	});
    		   	$("[data-ax5select='codesel']").ax5select({
    		   		theme: 'primary',
    		   		options: resultSet,
    		   		onChange: function () {
    		   			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
    		   		}
    		   	});
    		   	ok();
    		}
    	});    	
    }).then(function(ok){
    	_this.pageButtonView.initView();
        _this.searchView.initView();
        _this.gridView01.initView();

        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
   });
};

fnObj.pageResize = function () {

};


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            }
        });
    }
});

//== view 시작
/**
 * searchView
 */
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter"); 
        
    },
    getData: function () {
        return {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            filter: this.filter.val(),
            sel:  $("[data-ax5select='codesel']").ax5select("getValue")[0].value
        }
        
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;
        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 0,
            sortable: true,
            multipleSelect: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "groupCd", label: COL("ax.admin.commoncode.group.code"), width: 150, align: "center", editor: {type: "text", disabled: "notCreated"}},
                {key: "groupNm", label: COL("ax.admin.commoncode.group.name"), width: 170, align: "center", editor: "text"},
                {key: "code", label: COL("ax.admin.commoncode.code"), width: 160, align: "center", editor: {type: "text", disabled: "notCreated"}},
                {key: "name", label: COL("ax.admin.commoncode.name"), width: 280, align: "left", editor: "text"},
                {key: "sort", label: COL("ax.admin.sort"), editor: "number"},
                {key: "useYn", label: COL("ax.admin.use.or.not"), width: 100, editor: "checkYn"},
                {key: "remark", label: COL("ax.admin.remark"), width: 120, align: "left", editor: "text"},
                {key: "data1", label: COL("ax.admin.commoncode.data1"), width: 110, align: "left", editor: "text"},
                {key: "data2", label: COL("ax.admin.commoncode.data2"), width: 110, align: "left", editor: "text"},
                {key: "data3", label: COL("ax.admin.commoncode.data3"), width: 110, align: "left", editor: "text"},
                {key: "data4", label: COL("ax.admin.commoncode.data4"), width: 110, align: "left", editor: "text"},
                {key: "data5", label: COL("ax.admin.commoncode.data5"), width: 110, align: "left", editor: "text"}
            ],
            body: {       
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                }
            }
        });

        axboot.buttonClick(this, "data-grid-view-01-btn", {
            "add": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_ADD);
            },
            "delete": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_DEL);
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.groupCd && this.code;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
    	var seltext = $("[data-ax5select='codesel']").ax5select("getValue")[0].text;
    	var selval = $("[data-ax5select='codesel']").ax5select("getValue")[0].value;
    	
    	if(seltext == "전체" && selval == "")
    	{
    		seltext = "";
    		selval = "";
    	}
    	
        this.target.addRow({__created__: true, posUseYn: "N", useYn: "Y", groupCd:selval, groupNm:seltext}, "last");
        this.target.focus("END");  
    },
    exportExcel: function () {
    	var date = new Date();
    	var dateString = "";
    	dateString += date.getFullYear();
    	if(date.getMonth()<10){
    		dateString += "0"+(date.getMonth() + 1);
    	}
    	else{
    		dateString += (date.getMonth() + 1);
    	}
    	
    	if(date.getDate()<10){
    		dateString += "0"+date.getDate();
    	}
    	else{
    		dateString += date.getDate();
    	}  	
    	this.target.exportExcel("공통코드_관리_" +dateString+ ".xls");
    	//this.target.exportExcelXlsx("공통코드 관리_" +dateString);
    }
});