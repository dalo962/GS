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
    	var saveList = [].concat(caller.gridView01.getData());
    	saveList = saveList.concat(caller.gridView01.getData("deleted"));
    	
    	var reqExp = /^[0-9]*$/;
    	var blani = 0;
    	var blnumber = 0;
    	var ovdesc = 0;
    	saveList.forEach(function (n){
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
    		if(n.description != null && n.description != ""){
    			if(getByteLength((n.description))> 3000){
        			ovdesc = ovdesc + 1;
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
		            	if(res.message == "success"){
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
    	//caller.gridView01.exportExcel();
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
    	
    	var base64 = function base64(s) {
		    return window.btoa(unescape(encodeURIComponent(s)));
		};
		
		var uri = "data:application/vnd.ms-excel;base64,";
		
		var getExcelTmpl = function getExcelTmpl() {
		    return "\uFEFF\n{{#tables}}{{{body}}}{{/tables}}\n";
		};
		var table = [excelTable.join('')];
		var fileName = "이슈고객_목록.xls";
		
		var link = void 0,
		    a = void 0,
		    output = void 0,
		    tables = [].concat(table);
		
		output = ax5.mustache.render(getExcelTmpl(), {
		    worksheet: function () {
		        var arr = [];
		        tables.forEach(function (t, ti) {
		            arr.push({ name: "Sheet" + (ti + 1) });
		        });
		        return arr;
		    }(),
		    tables: function () {
		        var arr = [];
		        tables.forEach(function (t, ti) {
		            arr.push({ body: t });
		        });
		        return arr;
		    }()
		});
		
		var isChrome = navigator.userAgent.indexOf("Chrome") > -1,
		    isSafari = !isChrome && navigator.userAgent.indexOf("Safari") > -1,
		    isIE = false || !!document.documentMode; // this works with IE10 and IE11 both :)
		
		var blob1 = void 0,
		    blankWindow = void 0,
		    $iframe = void 0,
		    iframe = void 0,
		    anchor = void 0;
		
		if (navigator.msSaveOrOpenBlob) {
		    blob1 = new Blob([output], { type: "text/html" });
		    window.navigator.msSaveOrOpenBlob(blob1, fileName);
		} else if (isSafari) {
		    // 사파리는 지원이 안되므로 그냥 테이블을 클립보드에 복사처리
		    //tables
		    blankWindow = window.open('about:blank', this.id + '-excel-export', 'width=600,height=400');
		    blankWindow.document.write(output);
		    blankWindow = null;
		} else {
		    if (isIE && typeof Blob === "undefined") {
		        //otherwise use the iframe and save
		        //requires a blank iframe on page called txtArea1
		        $iframe = jQuery('<iframe id="' + this.id + '-excel-export" style="display:none"></iframe>');
		        jQuery(document.body).append($iframe);
		
		        iframe = window[this.id + '-excel-export'];
		        iframe.document.open("text/html", "replace");
		        iframe.document.write(output);
		        iframe.document.close();
		        iframe.focus();
		        iframe.document.execCommand("SaveAs", true, fileName);
		        $iframe.remove();
		    } else {
		        // Attempt to use an alternative method
		        anchor = document.body.appendChild(document.createElement("a"));
		
		        // If the [download] attribute is supported, try to use it
		        if ("download" in anchor) {
		            anchor.download = fileName;
		            anchor.href = URL.createObjectURL(new Blob([output], { type: 'text/csv' }));
		            anchor.click();
		            document.body.removeChild(anchor);
		        }
		    }
		}
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
            			var regex = /(\d{2,3})(\d{3,4})(\d{4})/g;
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
            	{key: "agentid", label: "사번", width: 80, align: "center", editor:"text"},
            	{key: "agentname", label: "상담사", width: 80, align: "center", editor:"text"},
            	{key: "connid", label: "ConnID", width: 130, align: "center", editor:"text"},
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
	                    var regex = /^(\d{2,3})(\d{3,4})(\d{4})$/g;			// 전화번호 형식 정규식
            			var matcher = regex.exec(ani);						// 입력된 ani와 정규식의 매칭 결과

            			if(ani != "" && !matcher) {	// 입력된 ani가 전화번호 형식과 다른 경우
            				alert("전화번호를 올바르게 입력하시기 바랍니다."); // alert 띄우고
            	    		ani = "";	// 입력된 값을 빈칸으로
            			}
	                    
	                    this.self.setValue(index, key, ani);
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
    	this.target.exportExcel("이슈고객_목록.xls");
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

//엑셀 업로드
var rABS = true; 

function fixdata(data) {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
}

function getConvertDataToBin($data){
    var arraybuffer = $data;
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
 
    return bstr;
}

function getCsvToJson($csv){
 
    var startRow = 2;
    var csvSP = $csv.split( "|" );
    var csvRow = [], csvCell = [];
    var cellName = ["ani", "flag"];
    csvSP.forEach(function(item, index, array){
 
        var patt = new RegExp(":"); 
        var isExistTocken = patt.test( item );
 
        if( isExistTocken && ( startRow - 1 ) <= index ){
            csvRow.push( item );
        }
    });
 
    csvRow.forEach(function(item, index, array){
        var row = item.split(":");
        var obj = {};
        row.forEach(function(item, index, array){
            obj[ cellName[index] ] = item;
        });
 
        csvCell[index] = obj;
    });
    return csvCell;
}

function handleFile(e) {
    var files = e.target.files;
    var i,f;
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
            	for (var i=0; i < length; i++){
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
            
 			workbook.SheetNames.forEach(function(item, index, array) 
 			{
 				if(index == 0)
 				{
 					var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[item],{FS:":",RS:"|"} );
	                
 					console.log(getCsvToJson(csv));
 					for(var i =0; i < getCsvToJson(csv).length; i++)
 					{
 						fnObj.gridView01.addRowExcel(getCsvToJson(csv)[i].ani, getCsvToJson(csv)[i].flag);
 					}
 				}
 			});//end. forEach 			 			
        }; //end onload
 
        if(rABS) reader.readAsArrayBuffer(f); //reader.readAsBinaryString(f);
        else reader.readAsBinaryString(f); //reader.readAsArrayBuffer(f);
 
    }//end. for
}

function getByteLength(s,b,i,c){
    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
    return b;
}
