var fnObj = {};
var dnis_options = [];

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {        
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrDnisTimeList/DnisListSearch",
            data: $.extend({}, this.searchView.getData()),
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
    	var reqExp2 = /^\d{6}$/;
    	var wkdnis = 0;
    	var wkuseyn = 0;
    	var wklcuseyn = 0;
    	var wkhluseyn = 0;
    	var wkovuseyn = 0;
    	var wknumber = 0;    	
    	var wknumber2 = 0;
    	saveList.forEach(function (n){
    		if(n.dnis == null || n.dnis == "")
    		{
    			wkdnis = wkdnis + 1;
    		}
    		if(n.useyn == null || n.useyn == "")
    		{
    			wkuseyn = wkuseyn + 1;
    		}
    		if(n.lc_useyn == null || n.lc_useyn == "")
    		{
    			wklcuseyn = wklcuseyn + 1;
    		}
    		if(n.hl_useyn == null || n.hl_useyn == "")
    		{
    			wkhluseyn = wkhluseyn + 1;
    		}
    		if(n.ov_useyn == null || n.ov_useyn == "")
    		{
    			wkovuseyn = wkovuseyn + 1;
    		}
    		/*
    		if(reqExp.test(n.dnis) == false 
    		  || reqExp.test(n.wr_stime) == false  || reqExp.test(n.wr_etime) == false
    		  || reqExp.test(n.lc_stime) == false  || reqExp.test(n.lc_etime) == false
    		  || reqExp.test(n.sat_stime) == false || reqExp.test(n.sat_etime) == false
    		  || reqExp.test(n.sun_stime) == false || reqExp.test(n.sun_etime) == false
    		  || reqExp.test(n.hl_stime) == false  || reqExp.test(n.hl_etime) == false)
    		{
    			wknumber = wknumber + 1;
    		}
    		if(  reqExp2.test(n.wr_stime) == false  || reqExp2.test(n.wr_etime) == false
    	      || reqExp2.test(n.lc_stime) == false  || reqExp2.test(n.lc_etime) == false
    	      || reqExp2.test(n.sat_stime) == false || reqExp2.test(n.sat_etime) == false
    	      || reqExp2.test(n.sun_stime) == false || reqExp2.test(n.sun_etime) == false
    	      || reqExp2.test(n.hl_stime) == false  || reqExp2.test(n.hl_etime) == false)
    	    {
    			wknumber2 = wknumber2 + 1;
    	    }*/
    	});
    	if(wkdnis > 0) 
    	{ 
    		alert("대표번호를 선택하시기 바랍니다."); 
    		return;
    	}
    	if(wkuseyn > 0) 
    	{ 
    		alert("근무시간 사용유무를 선택하시기 바랍니다."); 
    		return;
    	}
    	if(wklcuseyn > 0) 
    	{ 
    		alert("점심시간 사용유무를 선택하시기 바랍니다."); 
    		return;
    	}
    	if(wkhluseyn > 0) 
    	{ 
    		alert("휴일 사용유무를 선택하시기 바랍니다."); 
    		return;
    	}
    	if(wkovuseyn > 0) 
    	{ 
    		alert("초과근무 사용유무를 선택하시기 바랍니다."); 
    		return;
    	}
    	if(wknumber > 0) 
    	{ 
    		alert("대표번호는 숫자만 입력하시기 바랍니다."); 
    		return;
    	}
    	if(wknumber2 > 0) 
    	{ 
    		alert("근무시간을 HH24MISS형식으로 입력하시기 바랍니다."); 
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
		            url: "/gr/api/ivr/ivrDnisTimeList/DnisListSave",
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
    SET_DNIS: function (caller, act, data) {
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrDnis/DnisSearchY",
            data: "",
            callback: function (res) {
            	// dnis_options.push({value:"ALL", text:"전체"});
            	if(res.length > 0){
            		res.forEach(function (n) {
                    	dnis_options.push({
                    		value:n.dnis, text: n.dnis
                        });
                    });
            	}
            	fnObj.gridView01.initView();
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });
    },
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    }
});

var CODE = {};
var info = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
	
   	_this.pageButtonView.initView();
    _this.searchView.initView();
//    _this.gridView01.initView();	// SET_DNIS로 위치변경

    ACTIONS.dispatch(ACTIONS.SET_DNIS);
//  ACTIONS.dispatch(ACTIONS.PAGE_SEARCH); // searchView - comp_cd 불러온 이후로 위치변경
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

	    // 센터 선택 설정 //
	    $("[data-ax5select='comSelect']").ax5select({
	        theme: 'primary',
	        onStateChanged: function () {
	        	//
	        }
	    });
	    
		axboot.ajax({
	    	type: "POST",
		    url: "/api/statLstMng/userAuthLst",
		    data: "",
		    callback: function (res) {
 	    		var grpcd = res[0].grp_auth_cd;
 	    		var comcd = res[0].company_cd;
 	    		// 권한코드 :: 공통코드관리 => 권한그룹
 	    		
		    	axboot.ajax({
		    		type: "POST",
		    		url: "/api/mng/searchCondition/company",
		    		cache : false,
		    		data: JSON.stringify($.extend({}, info)),
		    		callback: function (res) {
		    			var resultSet = [];
		 	    		
//		 	    		if(grpcd == "S0001") { // 시스템 권한인 경우 "전체" 추가
//		 	    			resultSet.push({value:"", text:"전체"});
//		 	    		}
		 	    		
		    			res.list.forEach(function (n) {
		    				if(grpcd == 'S0001') {
		    					if(n.name == "GS홈쇼핑")
		    					{
		    						resultSet.push({
				    					value: "HOMESHOPING", text: n.name,
				    				});
		    					}	
		    					else if(n.name == "GS리테일")
		    					{
		    						resultSet.push({
				    					value: "RETAIL", text: n.name,
				    				});
		    					}
			    				
			    			} else {
			    				if(n.id == comcd) {
			    					if(n.name == "GS홈쇼핑")
			    					{
			    						resultSet.push({
					    					value: "HOMESHOPING", text: n.name,
					    				});
			    					}
			    					else if(n.name == "GS리테일")
			    					{
			    						resultSet.push({
					    					value: "RETAIL", text: n.name,
					    				});
			    					}				    				
				    	        }
			    			}
		    			});
		    			
				        $("[data-ax5select='comSelect']").ax5select("setOptions", resultSet);
				        
				        // 센터 다 불러온 다음 검색 //
				        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		    		}
		    	});
		    	
//    		    resultSet.push({value: "RETAIL", text: "GS리테일"});
		    }
	    });
    },
    getData: function () {
    	var comp_cd = $("#comSel").ax5select("getValue");
        return {       
        	comp_cd: function() {
        		if(comp_cd.length > 0) {
        			return comp_cd[0].value;
        		} else {
            		return "";	
        		}
        	}
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
            	{key: "dnis", label: "대표번호", width: 150, align: "center", sortable: true, 
            		editor: {
	            		type: "select",
	            		config: {
	            			columnKeys: {
	            				optionValue: "value", optionText: "text"
	            			},
	            			options: dnis_options
	            		},
	            		disabled:function(){
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
	            		var dnis = this.item.dnis;
	            		// dnis 값이 빈칸이거나 null이면 "선택" 출력 //
	            		if(dnis == '' || dnis == null) {
                			return '<span style="color: red;">선택</span>';
	            		} else {
	            			return dnis;
	            		}
	            	}
	            }, 
                {key: "useyn", label: "근무시간 사용유무", width: 140, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "0", text: "미사용"},
                			{value: "1", text: "월-금"},
                			{value: "2", text: "월-토"},
                			{value: "3", text: "월-일"},
                			{value: "4", text: "월-일(휴일포함)"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.useyn) {
                		case "0":
            				return "미사용";
            			break;
                		case "1":
            				return "월-금";
            				break; 	
                		case "2":
                			return "월-토";
                			break;       
                		case "3":
                			return "월-일";
                			break;   
                		case "4":
                			return "월-일(휴일포함)";
                			break;   
                		default :
                			return '<span style="color: red;">선택</span>';
                			break;
                	}
                }},
                {key: "wr_stime", label: "평일근무 시작시간", width: 140, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
                {key: "wr_etime", label: "평일근무 종료시간", width: 140, align: "center", sortable: true, editor:"text", formatter:"hour_colon"}, 
                {key: "ov_useyn", label: "초과근무 사용유무", width: 140, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "0", text: "미사용"},
                			{value: "1", text: "월-금"},
                			{value: "2", text: "월-토"},
                			{value: "3", text: "월-일"},
                			{value: "4", text: "월-일(휴일포함)"}           			
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.ov_useyn) {
            		case "0":
            			return "미사용";
            			break; 	
            		case "1":
        				return "월-금";
        				break; 	
            		case "2":
            			return "월-토";
            			break;       
            		case "3":
            			return "월-일";
            			break;   
            		case "4":
            			return "월-일(휴일포함)";
            			break;                 		
            		default :
            			return '<span style="color: red;">선택</span>';
            			break;
            	}
                }},
                {key: "ov_stime", label: "초과근무 시작시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
                {key: "ov_etime", label: "초과근무 종료시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},  
                {key: "lc_useyn", label: "점심시간 사용유무", width: 140, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "0", text: "미사용"},
                			{value: "1", text: "월-금"},
                			{value: "2", text: "월-토"},
                			{value: "3", text: "월-일"},
                			{value: "4", text: "월-일(휴일포함)"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.lc_useyn) {
                		case "0":
                			return "미사용";
                			break; 	
                		case "1":
	        				return "월-금";
	        				break; 	
	            		case "2":
	            			return "월-토";
	            			break;       
	            		case "3":
	            			return "월-일";
	            			break;   
	            		case "4":
	            			return "월-일(휴일포함)";
	            			break;                 		
                		default :
                			return '<span style="color: red;">선택</span>';
                			break;
                	}
                }},
                {key: "lc_stime", label: "점심 시작시간", width: 140, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
                {key: "lc_etime", label: "점심 종료시간", width: 140, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},                
                {key: "sat_stime", label: "토요일근무 시작시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
                {key: "sat_etime", label: "토요일근무 종료시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},                
                {key: "sun_stime", label: "일요일근무 시작시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
                {key: "sun_etime", label: "일요일근무 종료시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
                {key: "hl_useyn", label: "휴일근무 사용유무", width: 140, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "0", text: "미사용"},
                			{value: "1", text: "사용"}                			
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.hl_useyn) {
                		case "0":
                			return "미사용";
                			break; 	
                		case "1":
	        				return "사용";
	        				break;              		
                		default :
                			return '<span style="color: red;">선택</span>';
                			break;
                	}
                }},
                {key: "hl_stime", label: "휴일근무 시작시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
                {key: "hl_etime", label: "휴일근무 종료시간", width: 150, align: "center", sortable: true, editor:"text", formatter:"hour_colon"},
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
                },
                onDataChanged: function () {
                	var key = this.key;
                	if (key.indexOf("time") != -1) {
                		var time = this.item[key].replaceAll(':','');	// 입력된 시간에서 : 제외
	                    var index = this.item.__index;					// 변경될 index
                		var regex = /^([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/g;	// 시간 (HHMMSS) => 숫자 6자리
                		var matcher = regex.exec(time);					// 입력된 시간과 정규식의 매칭 결과

            			if(time != "" && !matcher) {	// 입력된 시간이 정규식과 다른 경우
            				alert("올바른 시간 형식으로 입력하시기 바랍니다."); // alert 띄우고
            	    		time = "";	// 입력된 값을 빈칸으로
            			}
	                    
	                    this.self.setValue(index, key, time);
	                    
                	}                	
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
        this.target.addRow({__created__: true, wr_stime:"000000", wr_etime:"000000", ov_stime:"000000", ov_etime:"000000", lc_stime:"000000", lc_etime:"000000", sat_stime:"000000", sat_etime:"000000", sun_stime:"000000", sun_etime:"000000", hl_stime:"000000", hl_etime:"000000"}, "last");
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
    	this.target.exportExcel("근무시간_목록.xls");
    }
});