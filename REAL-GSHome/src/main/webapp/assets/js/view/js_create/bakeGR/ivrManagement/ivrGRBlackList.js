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
    	
    	// TODO 추가 ( 20211230 정합성체크 및 필수값으로 )
    	var blagid = 0;
    	var blagnm = 0;
    	var blconnid = 0;
    	
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

	        	// TODO 추가 ( 20211230 정합성체크 및 필수값으로 )
	    		if(n.agentid == null || n.agentid == "") {
	    			blagid = blagid + 1;
	    		}
	    		if(n.agentname == null || n.agentname == "") {
	    			blagnm = blagnm + 1;
	    		}
	    		if(n.connid == null || n.connid == "") {
	    			blconnid = blconnid + 1;
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

    	// TODO 추가 ( 20211230 정합성체크 및 필수값으로 )
    	if(blagid > 0) { 
    		alert("상담사 사번을 입력하시기 바랍니다."); 
    		return;
    	}    	
    	if(blagnm > 0) { 
    		alert("상담사 이름를 입력하시기 바랍니다."); 
    		return;
    	}    	
    	if(blconnid > 0) { 
    		alert("CONNID를 입력하시기 바랍니다."); 
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
            			var regex = /^(01[0-9]|02|0[3-4][1-3]|05[1-5]|06[1-4])(\d{3,4})(\d{4})$/g;
            			var matcher = regex.exec(result_ani);
            			
            			if(matcher) {
            				console.log(matcher)
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
        	        	// TODO 추가 ( 20211230 정합성체크 및 필수값으로 )
                		var agentid = this.item.agentid;
                		if(agentid == '' || agentid == null) {
                			return '<span style="color: red;">입력</span>';
                		}

                		return agentid;
                }},
            	{key: "agentname", label: "상담사", width: 80, align: "center", editor:"text",
                	formatter: function() {
        	        	// TODO 추가 ( 20211230 정합성체크 및 필수값으로 )
                		var agentname = this.item.agentname;
                		if(agentname == '' || agentname == null) {
                			return '<span style="color: red;">입력</span>';
                		}

                		return agentname;
                }},
            	{key: "connid", label: "ConnID", width: 130, align: "center", editor:"text",
                	formatter: function() {
        	        	// TODO 추가 ( 20211230 정합성체크 및 필수값으로 )
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
	                    var regex = /^(01[0-9]|02|0[3-4][1-3]|05[1-5]|06[1-4])(\d{3,4})(\d{4})$/g;			// 전화번호 형식 정규식
            			var matcher = regex.exec(ani);						// 입력된 ani와 정규식의 매칭 결과

            			if(ani != "" && !matcher) {	// 입력된 ani가 전화번호 형식과 다른 경우
            				alert("전화번호를 올바르게 입력하시기 바랍니다."); // alert 띄우고
            	    		ani = "";	// 입력된 값을 빈칸으로
            			}
	                    
	                    this.self.setValue(index, key, ani);
                	}
    	        	// TODO 추가 ( 20211230 정합성체크 및 필수값으로 ) 
                	else if(key == "connid") {
                		var index = this.item.__index;
                		var connid = this.item.connid;
                		var length = connid.length;
                		var regex = /[a-z|0-9]/gi; // 숫자문자 또는 영문자 정규식
                		
                		if(length != 0 && !regex.test(connid)) {
                			alert("CONNID는 숫자, 영어 소문자만 입력할 수 있습니다."); // alert 띄우고
            	    		connid = "";	// 입력된 값을 빈칸으로
            	    		
                    		this.self.setValue(index, key, connid);
                    		return;
                		}
                		
                		if(length > 16) {
                			alert("CONNID는 최대 16자까지 입력할 수 있습니다."); // alert 띄우고
            	    		//connid = "";	// 입력된 값을 빈칸으로
                			connid = connid.substr(0, 16); // 자리수에 맞게 자름
            	    		
                    		this.self.setValue(index, key, connid);
                    		return;
                		}
                		
                	} else if(key == "agentname") {
                		var index = this.item.__index;
                		var agentname = this.item.agentname;
                		var length = agentname.length;
                		var regex = /[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi; // 영문자 또는 한글 정규식
                		
                		if(length != 0 && !regex.test(agentname)) {
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
                	} else if(key == "agentid") {
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
    addRowExcel: function (Exani, Exflag) {
    	
    	if(Exflag == "사용" || Exflag == "Y")
    	{
    		Exflag = "Y";
    	}
    	else
    	{
    		Exflag = "N";
    	}
    	
        this.target.addRow({__created__: true, ani:Exani, flag:Exflag}, "last");
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
