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
    data.logid = parent.axboot.modal.getData().AGTLOGID;
    data.first_name = parent.axboot.modal.getData().AGTNAME;
        
    axboot
    .call({
        type:"POST",
        url: "/api/mng/skillLvlChnMain/selectAgtTab",
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
		 
		 Columns.push({key: "logid", label: "시스템사번", width: 100, align: "center"});
		 Columns.push({key: "first_name", label: "상담사", width: 100, align: "center"});
		 Columns.push({key: "skill_name", label: "스킬", width: 280, align: "center", sortable: true});
		 Columns.push({key: "skill_lvl", label: "스킬 레벨", width: 100, align: "center", sortable: true, formatter:function(){
 			if(this.value == 99)
			{
				return "분배 제외"
			}
 			else
 			{
 				return this.value;
 			}
		}});

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
    	this.target.exportExcel("상담사_보유스킬.xls");
    }
});