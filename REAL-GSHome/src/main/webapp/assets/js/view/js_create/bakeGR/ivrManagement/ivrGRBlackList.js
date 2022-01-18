var fnObj = {};
var rec_url = '';
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {    
    	axboot.ajax({
            type: "GET",
            url: "/gr/api/ivr/ivrBlackList/BlackListSearch",
            cache : false,
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
    	
    	var reqExp = /^[0-9]*$/;
    	var blani = 0;
    	var blnumber = 0;
    	var bluse = 0;
    	var bldeg = 0;
    	
    	// 20211230 추가 :: 정합성체크 및 필수값으로
    	var blagid = 0;
    	var blagnm = 0;
    	var blconnid = 0;
    	var ckconnid = 0;
    	
    	var ovdesc = 0;
    	_saveList.forEach(function (n){
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외
    			saveList.push(n);
	    		if(n.ani == null || n.ani == "")
	    		{
	    			blani = blani + 1;
	    		}
	    		if(n.ani != null || n.ani != "")
	    		{
	    			if(reqExp.test(n.ani) == false)
	    			{
	    			blnumber = blnumber + 1;
	    			}
	    		}
	    		if(n.bl_useyn == null || n.bl_useyn == "") {
	    			bluse = bluse + 1;
	    		}
	    		if(n.degree == null || n.degree == "") {
	    			bldeg = bldeg + 1;
	    		}

	        	// 20211230 추가 :: 정합성체크 및 필수값으로
	    		if(n.agentid == null || n.agentid == "") {
	    			blagid = blagid + 1;
	    		}
	    		if(n.agentname == null || n.agentname == "") {
	    			blagnm = blagnm + 1;
	    		}
	    		if(n.connid == null || n.connid == "") {
	    			blconnid = blconnid + 1;
	    		}
	    		if(n.connid != null && n.connid != "") {
	    			if(n.connid.length != 16) {
	    				ckconnid = ckconnid + 1;
	    			}
	    		}
	    		
	    		if(n.description != null && n.description != ""){
	    			if(getByteLength((n.description))> 3000){
	        			ovdesc = ovdesc + 1;
	            	}
	    		}
    		}
    	});
    	if(blani > 0) 
    	{ 
    		alert("이슈고객 번호를 입력하시기 바랍니다."); 
    		return;
    	}    	
    	if(blnumber > 0) 
    	{ 
    		alert("이슈고객 번호는 숫자만 입력하시기 바랍니다."); 
    		return;
    	}    	
    	if(bluse > 0) 
    	{ 
    		alert("사용유무를 선택하시기 바랍니다."); 
    		return;
    	}    	
    	if(bldeg > 0) 
    	{ 
    		alert("차수를 선택하시기 바랍니다."); 
    		return;
    	}    

    	// 20211230 추가 :: 정합성체크 및 필수값으로
    	if(blagid > 0) { 
    		alert("상담사 사번을 입력하시기 바랍니다."); 
    		return;
    	}    	
    	if(blagnm > 0) { 
    		alert("상담사 이름를 입력하시기 바랍니다."); 
    		return;
    	}    	
    	if(blconnid > 0) { 
    		alert("ConnID를 입력하시기 바랍니다."); 
    		return;
    	}    	
    	if(ckconnid > 0) { 
    		alert("ConnID 값은 16글자여야 합니다."); 
    		return;
    	}
    	
    	if(ovdesc > 0) 
    	{ 
    		alert("사유가 1000자를 넘습니다. 1000자 이내로 작성해주세요.");
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
		            url: "/gr/api/ivr/ivrBlackList/BlackListSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);
		            	
		            	if(res.message.indexOf('관리자') == -1) {
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
    EXCEL_EXPORT: function (caller, act, data) {
    	caller.gridView01.exportExcel();
    },
    EXCEL_DOWNLOAD: function (caller, act, data) {
    	window.open('/assets/js/common/black_list_template.xlsx');
    },
    GET_REC: function (caller, act, data) {
    	var recList = [].concat(fnObj.gridView01.getData("selected"));
    	
    	window.open(rec_url+"/recseePlayer/?SEQNO="+recList[0].connid, "Recording", 'width=800, height=300');
//    	axboot.modal.open({
//           width: 800,
//           height: 200,
//           header: false,
//           iframe: {
//               url: rec_url+"/recseePlayer/?SEQNO="+recList[0].connid
//           },
//           sendData: function(){
//     
//           },
//           callback: function(){
//               axboot.modal.close();
//               this.close();
//           }
//       });
    },
    GET_RECURL: function (caller, act, data) {
    	var recList = [].concat(fnObj.gridView01.getData("selected"));
    	
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrBlackList/RecUrlSearch",
            data: "",
            callback: function (res) {
            	if(res.length > 0){
            		rec_url = res[0].name;
            	}            	
            },
            options: {
                onError: function (err) {
                    alert("저장 작업에 실패하였습니다");
                }
            }
        });
    }
});

var CODE = {};
var info = {};

fmtDay = function (strValue) {
    var val = (strValue || "").replace(/\D/g, "");
    var regExpPattern = /^([0-9]{4})\-?([0-9]{2})?\-?([0-9]{2})?/,
        returnValue = val.replace(regExpPattern, function (a, b) {
        var nval = [arguments[1]];
        if (arguments[2]) nval.push(arguments[2]);
        if (arguments[3]) nval.push(arguments[3]);
        return nval.join("-");
    });
    return returnValue;
};

fmtTime = function (strValue) {
    var val = (strValue || "").replace(/\D/g, "");
    var regExpPattern = /^([0-9]{2})\-?([0-9]{2})?\-?([0-9]{2})?/,
        returnValue = val.replace(regExpPattern, function (a, b) {
        var nval = [arguments[1]];
        if (arguments[2]) nval.push(arguments[2]);
        if (arguments[3]) nval.push(arguments[3]);
        return nval.join(":");
    });
    return returnValue;
};

nullChk = function(strValue){
	var returnValue = "";
	if(typeof strValue != "undefined" && strValue != "undefined"){
		returnValue = strValue;
	} 
	return returnValue;
};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

   	_this.pageButtonView.initView();
    _this.searchView.initView();
    _this.gridView01.initView();

//  ACTIONS.dispatch(ACTIONS.PAGE_SEARCH); // searchView - comp_cd 불러온 이후로 위치변경
    ACTIONS.dispatch(ACTIONS.GET_RECURL);
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
            "sample": function() {
            	ACTIONS.dispatch(ACTIONS.EXCEL_DOWNLOAD);
            }
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
        	},
        	ani: $("#selText").val()
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
            	{key: "seq", label: "seq", width: 0, align: "center"},
            	{key: "new", label: "", width: 35, align: "center",
                	formatter: function() {   
                		if(this.item.description == null || this.item.description == ''){
                			return '<img src="/assets/images/warning_1.png" width="20 height="18" border="0">';
                		}
                		else{
                			return '';
                		}
                	}
                },
            	{key: "ani", label: "이슈고객 번호", width: 150, align: "center", sortable: true,
            		formatter: function () {
            			var ani = this.item.ani;
            			if(ani == '' || ani == null) {
            				return '<span style="color: red; font-size: 0.5rem;">"-" 제외한 전화번호 입력</span>';
            			}
            			var result_ani = ani;
            			var regex = /^(0[1-9][0-9]|02)(\d{3,4})(\d{4})$/g;
            			var matcher = regex.exec(result_ani);
            			
            			if(matcher) {
            				var middle_number = matcher[2];
            				return matcher[1]+middle_number.split('').fill('*',0,middle_number.length).join('')+matcher[3];
            			}
            			
            			return result_ani;
            		},
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
            		}
            	},
            	{key: "bl_useyn", label: "사용유무", width: 80, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "1", text: "사용"},
                			{value: "0", text: "미사용"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.bl_useyn) {
                		case "1":
            				return "사용";
            				break; 	
                		case "0":
                			return "미사용";
                			break;                    		
                		default :
                			return '<span style="color: red;">선택</span>';
                			break;
                	}
                }}, 
            	{key: "degree", label: "차수", width: 50, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "1", text: "1"},
                			{value: "2", text: "2"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.degree) {
                		case "1":
            				return "1";
            				break; 	
                		case "2":
                			return "2";
                			break;                    		
                		default :
                			return '<span style="color: red;">선택</span>';
                			break;
                	}
                }}, 
            	{key: "description", label: "사유", width: 240, align: "center", editor:"text"},
            	{key: "agentid", label: "사번", width: 80, align: "center", editor:"text",
                	formatter: function() {
                    	// 20211230 추가 :: 정합성체크 및 필수값으로
                		var agentid = this.item.agentid;
                		if(agentid == '' || agentid == null) {
                			return '<span style="color: red;">입력</span>';
                		}

                		return agentid;
                }},
            	{key: "agentname", label: "상담사", width: 80, align: "center", editor:"text",
                	formatter: function() {
                    	// 20211230 추가 :: 정합성체크 및 필수값으로
                		var agentname = this.item.agentname;
                		if(agentname == '' || agentname == null) {
                			return '<span style="color: red;">입력</span>';
                		}

                		return agentname;
                }},
            	{key: "connid", label: "ConnID", width: 130, align: "center", editor:"text",
                	formatter: function() {
                    	// 20211230 추가 :: 정합성체크 및 필수값으로
                		var connid = this.item.connid;
                		if(connid == '' || connid == null) {
                			return '<span style="color: red;">입력</span>';
                		}

                		return connid;
                }},
            	{key: "recBtn", label: "듣기", width: 50, align: "center", 
                	formatter: function() {     
                		if(this.item.connid != null && this.item.connid != ''){
                			return '<a href="#"><img src="/assets/images/speaker.png" width="20 height="18" border="0"><a>';
                		}else{
                			return '';
                		}
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
                {key: "upt_by", label: "수정자", width: 150, align: "center", sortable: true}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                    if (this.column.key == "recBtn" && (this.item.connid != null && this.item.connid != '')) 
                    {    
                    	var data = this.list[this.dindex];
                    	if(data.__depth__ != '0')
                    	{
                    		ACTIONS.dispatch(ACTIONS.GET_REC);
                    	}
                    }  
                },
                onDataChanged: function () {
                	var key = this.key;
                	// 전화번호 형식 //
                	if(key == "ani") {
                		var ani = this.item.ani.replaceAll('-', '');		// 현재 입력된 ani에서 - 제외
	                    var index = this.item.__index;						// 현재 입력된 ani의 위치
            			var regex = /^(0[1-9][0-9]|02)(\d{3,4})(\d{4})$/g;
            			var matcher = regex.exec(ani);						// 입력된 ani와 정규식의 매칭 결과

            			if(ani != "" && !matcher) {	// 입력된 ani가 전화번호 형식과 다른 경우
            				alert("전화번호를 올바르게 입력하시기 바랍니다."); // alert 띄우고
            	    		ani = "";	// 입력된 값을 빈칸으로
            			}
	                    
	                    this.self.setValue(index, key, ani);
                	}
                	// 20211230 추가 :: 정합성체크 및 필수값으로
                	// CONNID //
                	else if(key == "connid") {
                		var index = this.item.__index;
                		var connid = this.item.connid;
                		var length = connid.length;
                		// 20220111 수정 :: 정규식 이상 ( 안되는 것 만 넣는 경우만 걸러냄 => d*는 통과시킴 ) 
                		var regex = /[a-z|0-9]*/g; // 숫자문자 또는 영문자 정규식
                		var exec = regex.exec(connid);
                		
                		if(length != 0 && (!exec || !(exec[0] == exec.input))) {
                			alert("ConnID는 숫자, 영어 소문자만 입력할 수 있습니다."); // alert 띄우고
            	    		connid = "";	// 입력된 값을 빈칸으로
            	    		
                    		this.self.setValue(index, key, connid);
                    		return;
                		}
                		
                		if(length != 0 && length != 16) {
                			alert("ConnID 값은 16글자여야 합니다."); // alert 띄우고
                    		return;
                		}
                		
                	}
                	// 상담사 //
                	else if(key == "agentname") {
                		var index = this.item.__index;
                		var agentname = this.item.agentname;
                		var length = agentname.length;
                		// 20220111 수정 :: 정규식 이상 ( 안되는 것 만 넣는 경우만 걸러냄 => d*는 통과시킴 ) 
                		var regex = /[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*/g; // 영문자 또는 한글 정규식
                		var exec = regex.exec(agentname);
                		
                		if(length != 0 && (!exec || !(exec[0] == exec.input))) {
                			alert("상담사 이름은 한글 또는 영문자만 입력할 수 있습니다."); // alert 띄우고
            	    		agentname = "";	// 입력된 값을 빈칸으로
            	    		
                    		this.self.setValue(index, key, agentname);
                			
                    		return;
                		}
                		
                		if(length > 10) {
                			alert("상담사 이름은 최대 10자까지 입력할 수 있습니다."); // alert 띄우고
                			//agentname = "";	// 입력된 값을 빈칸으로
                			agentname = agentname.substr(0, 10); // 자리수에 맞게 자름
                			
                    		this.self.setValue(index, key, agentname);
                    		return;
                		}
                	} 
                	// 사번 //
                	else if(key == "agentid") {
                		var index = this.item.__index;
                		var agentid = this.item.agentid;
                		var length = agentid.length;
                		
                		if(length > 10) {
                			alert("상담사 사번은 최대 10자까지 입력할 수 있습니다."); // alert 띄우고
                			//agentid = "";	// 입력된 값을 빈칸으로
            	    		agentid = agentid.substr(0, 10); // 자리수에 맞게 자름
            	    		
                    		this.self.setValue(index, key, agentid);
                    		return;
                		}
                	} 
                	// 사유 //
                	else if(key == "description") {
                		var index = this.item.__index;
                		var description = this.item.description;
                		
                		if(description != null && description != ""){
                			var length = getByteLength(description);
        	    			if(length > 3000){
        	    				alert("사유가 1000자를 넘습니다. 1000자 이내로 작성해주세요.");
                	    		
                        		this.self.setValue(index, key, description);
                        		return;
        	            	}
        	    		}
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
                return this.ani;
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
    addRowExcel: function (ani, bl_useyn, degree, description, agentid, agentname, connid) {
        this.target.addRow({ani, bl_useyn, degree, description, agentid, agentname, connid, __created__: true}, "last");
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
    	this.target.exportExcel("이슈고객_목록_" + dateString + ".xls");
    }
});


fnObj.excelgrid = axboot.viewExtend(axboot.gridView, {
    initView: function () {    	
        var _this = this;
        var data = fnObj.gridView01.getData();
        excelTable = [];
        excelTable.push('<table border="1">');
        
        var detailHeadStr="";        
        
        detailHeadStr += "<tr>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>이슈고객 번호</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>사용유무</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>작성일자</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>작성자</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>수정일자</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>수정자</th>";

		detailHeadStr += "</tr>";
	        
		$("#gridExcel-detail-thead").append(detailHeadStr);
	    excelTable.push(detailHeadStr);
	        
	    var detailbodyStr="";
	    
	    data.forEach(function(m){	     	
		    detailbodyStr += "<tr>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.ani) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.flag) + "</td>";
		    
		    var cday = "";
		    var ctime = "";
		    if(m.crt_dt != undefined)
		    {
		    	cday = m.crt_dt.substr(0,8);
		    	ctime = m.crt_dt.substr(8,6);
		    }
		    
		    detailbodyStr += "<td colspan=1 rowspan=1>" + fmtDay(cday) + " " + fmtTime(ctime) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.crt_by) + "</td>";
		    
		    var uday = "";
		    var utime = "";
		    if(m.udt_dt != undefined)
		    {
		    	uday = m.udt_dt.substr(0,8);
		    	utime = m.udt_dt.substr(8,6);
		    }
		    
		    detailbodyStr += "<td colspan=1 rowspan=1>" + fmtDay(uday) + " " + fmtTime(utime) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.udt_by) + "</td>";

		    detailbodyStr += "</tr>";
		});
	            
	    $("#gridExcel-detail-tbody").append(detailbodyStr); 
	    excelTable.push(detailbodyStr); 
    }
});

function getByteLength(s,b,i,c){
    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
    return b;
}

// 20220103 추가 :: 이슈고객 엑셀 업로드
// 엑셀 업로드 //
var rABS = true; 

function fixdata(data) {
    var o = "", l = 0, w = 10240;
    for(; l < data.byteLength / w; ++l) {
    	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    }
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

function getConvertDataToBin($data){
    var arraybuffer = $data;
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) { 
    	arr[i] = String.fromCharCode(data[i]);
    }
    var bstr = arr.join("");
 
    return bstr;
}

function getCsvToJson($csv){
 
    var startRow = 2;
    var csvSP = $csv.split("|");
    var csvRow = [], csvCell = [];
    var cellName = ["ani", "bl_useyn", "degree", "description", "agentid", "agentname", "connid"];

    csvSP.forEach(function(item, index, array){
        var patt = new RegExp(":"); 
        var isExistTocken = patt.test( item );
 
        if( isExistTocken && ( startRow - 1 ) <= index ){
            csvRow.push( item );
        }
    });

    var errorCase = 0;
    
    csvRow.forEach(function(item, index, array){
        var row = item.split(":");
        var obj = {};
    	var error = 0;
        row.forEach(function(item, index, array){
    		var length = item.length;
        	if(index == 0) { // 이슈고객 번호
        		if(item.charAt(0) == '\'') {
        			item = item.substring(1, length);
        		} else if(item.charAt(0) != '0') {
        			item = '0' + item;
        		}
        		
        		item = item.replaceAll('-', '');
    			var regex = /^(0[1-9][0-9]|02)(\d{3,4})(\d{4})$/g;
    			var matcher = regex.exec(item);						// 입력된 ani와 정규식의 매칭 결과

    			if(item != "" && !matcher) {	// 입력된 ani가 전화번호 형식과 다른 경우
    				error++;
    			}
        	} else if(index == 1) { // 사용유무
        		if(item == "사용") {
        			item = "1";
        		} else if(item == "미사용") {
        			item = "0";
        		} else {
        			error++;
        		}
        	} else if(index == 2) { // 차수
        		if(item != "1" && item != "2") {
        			error++;
        		}
        	} else if(index == 3) { // 사유
    			var _length = getByteLength(item);
    			if(_length > 3000){
    				error++;
            	}
        	} else if(index == 4) { // 사번
        		if(length == 0 || length > 10) {
        			error++;
        		}
        	} else if(index == 5) { // 상담사
        		var regex = /[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*/g; // 영문자 또는 한글 정규식
        		var exec = regex.exec(item);
        		
        		if(length == 0 || (!exec || !(exec[0] == exec.input))) {
        			error++;
        		} else if(length > 10) {
        			error++;
        		}
        	} else if(index == 6) { // ConnId
        		var regex = /[a-z|0-9]*/g; // 숫자문자 또는 영문자 정규식
        		var exec = regex.exec(item);
        		
        		if(length == 0 || (!exec || !(exec[0] == exec.input))) {
        			error++;
        		} else if(length != 0 && length != 16) {
        			error++;
        		}
			}
        	
            obj[cellName[index]] = item;
        });
        
        if(error == 0) {
        	csvCell[index - errorCase] = obj;
        } else {
        	errorCase++;
        }
    });
    return { total: csvCell.length + errorCase, items: csvCell, error: errorCase };
}

function handleFile(e) {
    var files = e.target.files;
    var i, f;
    
    var suss = 0;
    var fail = 0;

    for (i = 0; i != files.length; ++i) {
        f = files[i];
        var reader = new FileReader();
        var name = f.name;
 
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook;
 
            if(rABS) {
                /* if binary string, read with type 'binary' */
                //workbook = XLSX.read(data, {type: 'binary'});
            	var binary = "";
            	var bytes = new Uint8Array(data);
            	var length = bytes.byteLength;
            	for(var i = 0; i < length; i++) {
            		binary += String.fromCharCode(bytes[i])
            	}
            	workbook = XLSX.read(binary, {type:'binary'});          	
            	
            } else {
                /* if array buffer, convert to base64 */
                //var arr = fixdata(data);
                //workbook = XLSX.read(btoa(arr), {type: 'base64'});
            	workbook = XLSX.read(data, {type:'binary'}); 
            }//end. if
            
 			console.log(workbook);
            
 			var find = workbook.SheetNames.find(function(item, index, array) {
 				if(item == 'Sheet1') {
 					var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[item],{FS:":",RS:"|"} );
 					var csvJson = getCsvToJson(csv);
	                var items = csvJson.items;
	                
 					console.log(csvJson);
 					
 					for(var i = 0; i < items.length; i++) {
 						fnObj.gridView01.addRowExcel(items[i].ani, items[i].bl_useyn, items[i].degree, items[i].description, items[i].agentid, items[i].agentname, items[i].connid);
 					}
 					
					alert("[엑셀업로드] " + csvJson.total + "명 중 " + items.length + "명 성공 " + csvJson.error + "명 실패");
					
					return true;
 				}
 			});//end. workbook.forEach
 			
 			if(!find) {
 				console.log("[이슈고객 엑셀업로드] Sheet1을 찾을 수 없습니다.");
				// alert("[엑셀업로드] Sheet1을 찾을 수 없습니다.");
 			}
        }; //end reader.onload
 
        if(rABS) {
        	reader.readAsArrayBuffer(f); //reader.readAsBinaryString(f);
        } else {
        	reader.readAsBinaryString(f); //reader.readAsArrayBuffer(f);
        }
 
    }//end. for
}
 
var input_dom_element;
$(function() {
    input_dom_element = document.getElementById('excel');
    if(input_dom_element.addEventListener) {
        input_dom_element.addEventListener('change', handleFile, false);
    }
});