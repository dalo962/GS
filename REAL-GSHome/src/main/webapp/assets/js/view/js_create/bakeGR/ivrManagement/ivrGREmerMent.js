var fnObj = {};
var dnis_options = [];
var fisrt_search_flag = true;
 
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {        
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrEmerMent/EmerMentSearch",
            data: "",
            callback: function (res) {
            	if(fisrt_search_flag == true){
            		setTimeout(function(){
                		caller.gridView01.setData(res);
                        fnObj.excelgrid.initView();
                        fisrt_search_flag = false;
                	}, 200);
            	}else{
            		caller.gridView01.setData(res);
                    fnObj.excelgrid.initView();
            	}
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
    	var bldnis = 0;
    	var blstime = 0;
    	var bletime = 0;
    	var blvayn = 0;
    	saveList.forEach(function (n){
    		if(n.dnis == null || n.dnis == "")
    		{
    			bldnis = bldnis + 1;
    		}
    		if(n.stime == null || n.stime == "")
    		{
    			blstime = blstime + 1;
    		}
    		if(n.etime == null || n.etime == "")
    		{
    			bletime = bletime + 1;
    		}
    		if(n.va_yn == null || n.va_yn == "")
    		{
    			blvayn = blvayn + 1;
    		}    		
    	});
    	if(bldnis > 0) 
    	{ 
    		alert("대표번호를 입력하시기 바랍니다."); 
    		return;
    	}
    	if(blstime > 0) 
    	{ 
    		alert("시작시간을 입력하시기 바랍니다."); 
    		return;
    	}
    	if(bletime > 0) 
    	{ 
    		alert("종료시간을 입력하시기 바랍니다."); 
    		return;
    	}
    	if(blvayn > 0) 
    	{ 
    		alert("성우여부를 선택하시기 바랍니다."); 
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
		            url: "/gr/api/ivr/ivrEmerMent/EmerMentSave",
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
		var fileName = "블랙컨슈머_목록.xls";
		
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
    SET_DNIS: function (caller, act, data) {
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrDnis/DnisSearchY",
            data: "",
            callback: function (res) {
            	dnis_options.push({value:"ALL", text:"전체"});
                res.forEach(function (n) {
                	dnis_options.push({
                		value:n.dnis, text: n.dnis
                    });
                });
                fnObj.gridView01.initView();
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });
    },
    GET_TTS: function (caller, act, data) {
    	var ttsList = [].concat(fnObj.gridView01.getData("selected"));
    	console.log(ttsList);
    	console.log(JSON.stringify(ttsList));
    	
    	axboot.ajax({
            type: "POST",
    		cache: false,
            url: "/gr/api/ivr/ivrEmerMent/EmerMentTTS",
            data: JSON.stringify(ttsList),
            callback: function (res) {
            	console.log(res);
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });
    }
});

var CODE = {};

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
//    _this.gridView01.initView();	// SET_DNIS로 위치변경

    ACTIONS.dispatch(ACTIONS.SET_DNIS);
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
            "tts": function () {
                ACTIONS.dispatch(ACTIONS.GET_TTS);
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
            	{key: "seq", label: "seq", width: 0, align: "center"},
            	{key: "dnis", label: "대표번호", width: 100, align: "center", sortable: true,  editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: dnis_options
                	}
                }, formatter: function() {
	                	if(this.item.dnis == 'ALL'){
	                		return "전체";
	                	}else{
	                		return this.item.dnis;
	                	}
                	}
                },//
            	{key: "sdate", label: "시작날짜", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var sdate = "";
                		if(this.item.sdate != null && this.item.sdate != '')
                		{
                			sdate = this.item.sdate.substr(0,4) + "-" + this.item.sdate.substr(4,2) + "-" + this.item.sdate.substr(6,2);
                		}
                		return sdate;
                }},
            	{key: "stime", label: "시작시각", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var stime = "";
                		if(this.item.stime != null && this.item.stime != '')
                		{
                			stime = this.item.stime.substr(0,2) + ":" + this.item.stime.substr(2,2) + ":" + this.item.stime.substr(4,2);
                		}
                		return stime;
                }},
            	{key: "edate", label: "종료날짜", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var edate = "";
                		if(this.item.edate != null && this.item.edate != '')
                		{
                			edate = this.item.edate.substr(0,4) + "-" + this.item.edate.substr(4,2) + "-" + this.item.edate.substr(6,2);
                		}
                		return edate;
                }},
            	{key: "etime", label: "종료시각", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var etime = "";
                		if(this.item.etime != null && this.item.etime != '')
                		{
                			etime = this.item.etime.substr(0,2) + ":" + this.item.etime.substr(2,2) + ":" + this.item.etime.substr(4,2);
                		}
                		return etime;
                }},
                {key: "va_yn", label: "성우여부", width: 120, align: "center", sortable: true, editor: {
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
                	switch(this.item.va_yn) {
                		case "1":
            				return "사용";
            				break; 	
                		case "0":
                			return "미사용";
                			break;                    		
                		default :
                			return "선택";
                			break;
                	}
                }},    
                {key: "ment", label: "멘트", width: 400, align: "center", sortable: true, editor:"text"},
                {key: "ttsBtn", label: "듣기", width: 50, align: "center", 
                	formatter: function() {                
	                	switch(this.item.va_yn) {
		            		case "1":
		        				return '';
		        				break; 	
		            		case "0":		            			
		            			return '<a href="#" data-grid-view-01-btn="add"><img src="/assets/images/speaker.png" width="20 height="18" border="0"><a>';
		            			break;                    		
		            		default :
		            			return '';
		            			break;
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
                    if (this.column.key == "ttsBtn" && this.item.va_yn == '0') 
                    {                    
                    	var data = this.list[this.dindex];
                    	if(data.__depth__ != '0')
                    	{
                    		ACTIONS.dispatch(ACTIONS.GET_TTS);
                    	}
                    }  
                },
                onDBLClick: function () {
                	console.log(this);
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
    	this.target.exportExcel("블랙컨슈머_목록.xls");
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
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>블랙컨슈머 번호</th>";
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
 
var input_dom_element;
