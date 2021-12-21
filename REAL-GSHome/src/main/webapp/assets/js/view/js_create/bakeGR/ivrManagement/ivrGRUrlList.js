var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {        
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrUrlList/UrlListSearch",
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
    	// Grid의 모든 data (deleted 포함)
    	var _saveList = [].concat(caller.gridView01.getData());
    	_saveList = _saveList.concat(caller.gridView01.getData("deleted"));
    	
    	var saveList = []; 
    	
    	var reqExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/; 		 
    	var ulnm = 0;
    	var ulip = 0;
    	var ulnumber = 0;
    	_saveList.forEach(function (n){
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외
    			saveList.push(n);
	    		if(n.url_nm == null || n.url_nm == "")
	    		{
	    			ulnm = ulnm + 1;
	    		}
	    		if(n.svr_ip == null || n.svr_ip == "")
	    		{
	    			ulip = ulip + 1;
	    		}
	    		if(n.svr_ip != null || n.svr_ip != "")
	    		{
	    			if(reqExp.test(n.svr_ip) == false)
	    			{
	    				ulnumber = ulnumber + 1;
	    			}
	    		}
    		}
    	});
    	if(ulnm > 0) 
    	{ 
    		alert("URL명을 입력하시기 바랍니다."); 
    		return;
    	}
    	if(ulip > 0) 
    	{ 
    		alert("URL IP를 입력하시기 바랍니다."); 
    		return;
    	}
    	if(ulnumber > 0) 
    	{ 
    		alert("URL IP를 형식에 맞게 입력하시기 바랍니다."); 
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
		            url: "/gr/api/ivr/ivrUrlList/UrlListSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);
		            	if(res.message == 'success'){
		            		axToast.push("저장 되었습니다.");
			            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            	}
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
    FILE_SAVE: function (caller, act, data) {
    	var saveList = [].concat(caller.gridView01.getData("selected"));

    	if(saveList.length == 0)
    	{
    		alert("URL을 선택하시기 바랍니다."); 
    		return;
    	}
    	
    	axDialog.confirm({
    		title:"확인",
            msg: "동기화 하시겠습니까?" // 여기까지 추가한 소스
        }, function () {
            if (this.key == "ok") {
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/gr/api/ivr/ivrUrlList/UrlFileSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);
		            	axToast.push("동기화 되었습니다.");
		            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            },
		            options: {
		                onError: function (err) {
		                    alert("동기화 작업에 실패하였습니다");
		                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		                }
		            }
		        });
            }
        });   
    }, // 콜 초기화 및 실시간은 점유율 0으로 누적은 건수를 밀어넣음
    RESET_SAVE: function (caller, act, data) {
    	var saveList = [].concat(caller.gridView01.getData("selected"));

    	if(saveList.length == 0)
    	{
    		alert("URL을 선택하시기 바랍니다."); 
    		return;
    	}
    	
    	axDialog.confirm({
    		title:"확인",
            msg: "콜 초기화는 DR상황에서 \n초기화하여야 합니다.\n\n초기화 하시겠습니까?" // 여기까지 추가한 소스
        }, function () {
            if (this.key == "ok") {
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/gr/api/ivr/ivrUrlList/UrlResetSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);
		            	axToast.push("초기화 되었습니다.");
		            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            },
		            options: {
		                onError: function (err) {
		                    alert("초기화 작업에 실패하였습니다");
		                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		                }
		            }
		        });
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
    _this.gridView01.initView();

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
		    		//url: "/api/mng/searchCondition/company",
		    		url: "/api/mng/searchCondition/companyRE",
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
            	{key: "url_nm", label: "URL 명", width: 200, align: "center", sortable: true, 
            		editor: {
	            		type: "text", disabled:function(){
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
            		},
            		formatter: function () {
            			var url_nm = this.item.url_nm;
            			if(url_nm == '' || url_nm == null) {
            				return '<span style="color: red;">입력</span>';
            			}
            			return url_nm;
            		}
            	}, 
                {key: "svr_ip", label: "서버IP", width: 200, align: "center", sortable: true, editor: "text",
            		formatter: function () {
            			var svr_ip = this.item.svr_ip;
            			if(svr_ip == '' || svr_ip == null) {
            				return '<span style="color: red;">입력</span>';
            			}
            			return svr_ip;
            		}
            	},                
                {key: "crt_dt", label: "작성일자", width: 200, align: "center", sortable: true,
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
                {key: "upt_dt", label: "수정일자", width: 200, align: "center", sortable: true, 
                	formatter: function() {
                		var updt = "";
                		if(this.item.upt_dt != null)
                		{
                			updt = this.item.upt_dt.substr(0,4) + "-" + this.item.upt_dt.substr(4,2) + "-" + this.item.upt_dt.substr(6,2) +
                			" " + this.item.upt_dt.substr(8,2) + ":" + this.item.upt_dt.substr(10,2) + ":" + this.item.upt_dt.substr(12,2)
                		}
                		return updt;
                }},
                {key: "upt_by", label: "수정자", width: 150, align: "center", sortable: true},
                {key: "file_rst", label: "근무시간 동기화 여부", width: 200, align: "center", sortable: true},
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
            },
        	"file": function () {
                ACTIONS.dispatch(ACTIONS.FILE_SAVE);
            },
            "reset": function () {
                ACTIONS.dispatch(ACTIONS.RESET_SAVE);
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.url_nm;
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
    	this.target.exportExcel("URL_목록_" + dateString + ".xls");
    }
});