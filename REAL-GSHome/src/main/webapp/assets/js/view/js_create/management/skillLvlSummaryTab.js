var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
	PAGE_CLOSE: function (caller, act, data) {
        parent.axboot.modal.close();
    },
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    }
});

var CODE = {};
var aglist = [];
var data = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
    data.gpId = parent.axboot.modal.getData().gpId;
    data.loginCheck = parent.axboot.modal.getData().loginCheck;
        
    axboot
    .call({
        type:"POST",
        url: "/api/mng/skillLvlSummary/selectAgList",
        cache : false,
        data: JSON.stringify($.extend({}, data)),
        callback: function (res) {
        	aglist = res;
        }
    })
    .done(function () {
    	_this.pageButtonView.initView();
        _this.gridView01.initView();
        _this.gridView01.setData(aglist);
    });
};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
            },
        });
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
	initView: function () {
		 var _this = this;
		 
		 var Columns = [];
		 
		 Columns.push({key: "compNm", label: "소속", width: 100, align: "center", sortable: true});
		 Columns.push({key: "deptNm", label: "그룹", width: 120, align: "center", sortable: true});
		 Columns.push({key: "teamNm", label: "팀", width: 180, align: "center", sortable: true});
		 Columns.push({key: "last_name", label: "시스템사번", width: 100, align: "center", sortable: true});
		 Columns.push({key: "employee_id", label: "인사사번", width: 100, align: "center", sortable: true});
		 Columns.push({key: "first_name", label: "이름", width: 80, align: "center", sortable: true});
		 Columns.push({key: "state", label: "상태", width: 90, align: "center", sortable: true, 
	 			formatter:function()
				{
					if(this.item.state != undefined)
					{
						if(this.item.state != 0 && this.item.state != 10)
						{
							return "로그인";
						}
						else
						{
							return "로그아웃";
						}    						
					}
					else
					{
						return "로그아웃";
					}
				}
		 });
		 Columns.push({key: "default_group", label: "대표그룹", width: 105, align: "center", sortable: true});
		 Columns.push({key: "apply_group", label: "현재그룹", width: 105, align: "center", sortable: true});

		 this.target = axboot.gridBuilder({
	        	showRowSelector: false,
	            frozenColumnIndex: 0,
	            multipleSelect: false,
	            showLineNumber:true,
	            target: $('[data-ax5grid="grid-view-01"]'),
	            columns: Columns,                  		            
	            body: {
	                onClick: function () {
	                    this.self.select(this.dindex, {selectedClear: true});
	                }
	            }
	        });
    },
    getData: function (_type) {
    	var _list = this.target.getList(_type);
        return _list;
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
    	this.target.exportExcel("상담사_목록.xls");
    }
});