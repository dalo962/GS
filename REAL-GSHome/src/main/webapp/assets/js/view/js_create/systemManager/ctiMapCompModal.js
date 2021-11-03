var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        /* 소속 리스트조회 후 셋팅하는 부분 */ 
    	axboot.ajax({
    	    type: "POST",
    	    url: "/api/mng/searchCondition/company",
    	    cache : false,
    	    data: JSON.stringify($.extend({}, info)),
    	    callback: function (res) {
                caller.gridView.setData(res);
    	    }
    	});
    },
    PAGE_SAVE: function (caller, act, data) {
    	var _list = caller.gridView.getData();
    	_list.forEach(function(n){
    		n.menuGb = "업무그룹 CTI 매핑";
    	});
    	
    	var _deletedList = caller.gridView.getData("deleted");
    	_deletedList.forEach(function(n){
    		n.menuGb = "업무그룹 CTI 매핑";
    	});
        
        var gridObj = {
                list: _list,
                deletedList: _deletedList
            };
        
        axboot.ajax({
            type: "POST",
            url: "/api/mng/ctiMapComp/save",
            cache : false,
            data: JSON.stringify(gridObj),
            callback: function (res) {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            }
        });
        
    },
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridView.exportExcel();
    },
	PAGE_CLOSE: function (caller, act, data) {
        parent.axboot.modal.close();
    },
    ITEM_ADD: function (caller, act, data) {
        caller.gridView.addRow();
    },
    ITEM_DEL: function (caller, act, data) {
        caller.gridView.delRow("selected");
    }
});
var CODE = {};
var info = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
	_this.pageButtonView.initView();
	_this.gridView.initView();
	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};

fnObj.pageResize = function () {

};


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "save": function () {
            	axDialog.confirm({
            		title:"확인",
                    msg: "저장하시겠습니까?" // 여기까지 추가한 소스
                }, function () {
                    if (this.key == "ok") {
                        ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
                    }
                });
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_EXCEL);
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
            }
        });
        axboot.buttonClick(this, "data-grid-view-01-btn", {
            "add": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_ADD);
            },
            "del": function () {
            	axDialog.confirm({
            		title:"확인",
                    msg: "소속 삭제시\n하위 채널, 스킬, 부서, 팀 모두 삭제 됩니다.\n삭제하시겠습니까?" // 여기까지 추가한 소스
                }, function () {
                    if (this.key == "ok") {
                        ACTIONS.dispatch(ACTIONS.ITEM_DEL);
                    }
                });
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
    },
    setData: function (data){
    },
    getData: function () {
        var data = {}; 
        return $.extend({}, data)
    }
});

/**
 * gridView
 */
fnObj.gridView = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 0,
            sortable: true,
            multipleSelect: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
            	// 그냥 키로 생성만 안해주면 화면에 안보이고 데이터는 가지고 있는다.
                {key: "name", label: "소속", width: 150, align: "center", editor: "text"},
                {key: "sort", label: "정렬순서", width: 200, align: "center", editor: "text"}
            ],
            body: {
                onClick: function () {
                }
            }
        });
    },
    getData: function (_type) {
        var _list = this.target.getList(_type);
        return _list;
    },
    exportExcel: function () {
    	this.target.exportExcel("소속_리스트.xls");
    }
});
