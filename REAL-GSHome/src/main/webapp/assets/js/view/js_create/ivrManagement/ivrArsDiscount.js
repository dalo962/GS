var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/api/ivr/ivrArsDiscount/DiscountSearch",
            data: "",
            callback: function (res) {
                caller.gridView01.setData(res);
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });

        return false;
    },    
    PAGE_ADD: function (caller, act, data) {
    	caller.gridView01.addRow();
    },   
    PAGE_SAVE: function (caller, act, data) {
    	var saveList = [].concat(caller.gridView01.getData());
    	saveList = saveList.concat(caller.gridView01.getData("deleted"));
    	 	
    	var reqExp = /^[0-9]*$/;
    	var admedia = 0;
    	var aduseyn = 0;
    	var adwaitcnt = 0;
    	var addiscnt = 0;
    	var adwaitnum = 0;
    	var addisnum = 0;
    	
    	saveList.forEach(function (n){
    		if(n.media == null || n.media == "")
    		{
    			admedia = admedia + 1;
    		}
    		if(n.useyn == null || n.useyn == "")
    		{
    			aduseyn = aduseyn + 1;
    		}
    		if(n.wait_cnt == null || n.wait_cnt == "")
    		{
    			adwaitcnt = adwaitcnt + 1;
    		}
    		if(n.dis_cnt == null || n.dis_cnt == "")
    		{
    			addiscnt = addiscnt + 1;
    		}
    		
    		if(reqExp.test(n.wait_cnt) == false)
    		{
    			adwaitnum = adwaitnum + 1;
    		}
    		if(reqExp.test(n.dis_cnt) == false)
    	    {
    			addisnum = addisnum + 1;
    	    }
    	});
    	if(admedia > 0) 
    	{ 
    		alert("매체를 선택하시기 바랍니다."); 
    		return;
    	}
    	if(aduseyn > 0) 
    	{ 
    		alert("적용유무를 선택하시기 바랍니다."); 
    		return;
    	}
    	if(adwaitcnt > 0) 
    	{ 
    		alert("대기고객수를 입력하시기 바랍니다."); 
    		return;
    	}
    	if(addiscnt > 0) 
    	{ 
    		alert("할인금액을 입력하시기 바랍니다."); 
    		return;
    	}
    	
    	if(adwaitnum > 0) 
    	{ 
    		alert("대기고객수는 숫자만 입력하시기 바랍니다."); 
    		return;
    	}
    	if(addisnum > 0) 
    	{ 
    		alert("할인금액은 숫자만 입력하시기 바랍니다."); 
    		return;
    	}
    	
    	axDialog.confirm({
    		title:"확인",
            msg: "저장하시겠습니까?" // 여기까지 추가한 소스
        }, function () {
            if (this.key == "ok") {
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/api/ivr/ivrArsDiscount/DiscountSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);
		            	axToast.push("저장 되었습니다.");		            	
		            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            },
		            options: {
		                onError: function (err) {
		                    alert("저장 작업에 실패하였습니다");
		                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		                }
		            }
		        });
            }
        });    	
    },
    PAGE_DEL: function (caller, act, data) {
    	caller.gridView01.delRow("selected");
    },
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    }
});

var CODE = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

   	_this.pageButtonView.initView();
    _this.searchView.initView();
    _this.gridView01.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
        });
    }
});


fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter"); 
    },
    getData: function () {
        return {

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
            multipleSelect: true,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [            	
            	{key: "media", label: "매체", width: 150, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "LIVE", text: "LIVE"},
                			{value: "MYSHOP", text: "MYSHOP"}
                    	]
                	},disabled:function(){
        				var dis = "";
        				if(typeof this.item["crt_dt"] != null && this.item["crt_dt"] != "" && this.item["crt_dt"] != undefined)
        				{
        					dis = true
        				}
        				else
        				{
        					dis = false;
        				}
        				return dis;
        			}
                }, formatter: function() {
                	switch(this.item.media) {
                		case "LIVE":
            				return "LIVE";
            				break; 	
                		case "MYSHOP":
                			return "MYSHOP";
                			break;                    		
                		default :
                			return "선택";
                			break;
                	}
                }}, 
                {key: "useyn", label: "적용유무", width: 120, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "Y", text: "사용"},
                			{value: "N", text: "미사용"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.useyn) {
                		case "Y":
            				return "사용";
            				break; 	
                		case "N":
                			return "미사용";
                			break;                    		
                		default :
                			return "선택";
                			break;
                	}
                }},
                {key: "wait_cnt", label: "대기고객수", width: 140, align: "center", sortable: true, editor:"text"},
                {key: "dis_cnt", label: "할인금액", width: 140, align: "center", sortable: true, editor:"text"},
                {key: "crt_dt", label: "작성일자", width: 180, align: "center", sortable: true,
                	formatter: function() {
                		var crdt = "";
                		if(this.item.crt_dt != null)
                		{
                			crdt = this.item.crt_dt.substr(0,4) + "-" + this.item.crt_dt.substr(4,2) + "-" + this.item.crt_dt.substr(6,2) + 
                			" " + this.item.crt_dt.substr(8,2) + ":" + this.item.crt_dt.substr(10,2) + ":" + this.item.crt_dt.substr(12,2)
                		}
                		return crdt;
                }},
                {key: "crt_by", label: "작성자", width: 150, align: "center", sortable: true},
                {key: "upt_dt", label: "수정일자", width: 180, align: "center", sortable: true, 
                	formatter: function() {
                		var updt = "";
                		if(this.item.upt_dt != null)
                		{
                			updt = this.item.upt_dt.substr(0,4) + "-" + this.item.upt_dt.substr(4,2) + "-" + this.item.upt_dt.substr(6,2) +
                			" " + this.item.upt_dt.substr(8,2) + ":" + this.item.upt_dt.substr(10,2) + ":" + this.item.upt_dt.substr(12,2)
                		}
                		return updt;
                }},
                {key: "upt_by", label: "수정자", width: 150, align: "center", sortable: true}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                }
            }
        });
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"add": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_ADD);
            },            
        	"save": function () {
        		ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
        	},
        	"delete": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_DEL);
            }      
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.dnis;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true}, "last");
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
    	this.target.exportExcel("ARS자동할인_목록.xls");
    }
});