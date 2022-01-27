var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
	PAGE_CLOSE: function (caller, act, data) {
        parent.axboot.modal.close();
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
		var fileName = "call Trace_상세_" +dateString+ ".xls";
		
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
    }
});

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

var CODE = {};
var list = [];

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
    var connid = parent.axboot.modal.getData().connid;
    
    axboot
    .call({
        type: "GET",
        url: "/gr/api/hist/callTr/callTrSearchTab",
        data: {connid : connid},
        callback: function (res) {
        	list = res;
        }
    })
    .done(function () {
    	_this.pageButtonView.initView();
        _this.gridView01.initView();
        _this.gridView01.setData(list);
        _this.excelgrid.initView();
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
 * 내선통화는 발신자만 트레이스에서 확인가능하고 수신자로 조회시 확인불가
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
	initView: function () {
		 var _this = this;
		 
		 this.target = axboot.gridBuilder({
	        	showRowSelector: false,
	            frozenColumnIndex: 0,
	            multipleSelect: false,
	            showLineNumber:true,
	            target: $('[data-ax5grid="grid-view-01"]'),
	            columns: [
	            	{key: "ROW_DATE", label: "날짜", width: 100, align: "center", sortable: true},
	            	{key: "STARTTIME", label: "인입시간", width: 100, align: "center", sortable: true, 
	            	/*
	            		formatter: function(){	            	
        				var stime = "";
        				stime = this.item.STARTTIME.substr(0,2) + " : " + this.item.STARTTIME.substr(2,2) + " : " + this.item.STARTTIME.substr(4,2)
        				
        				return stime;
        			}
        			*/
	            	},
	            	{key: "ENDTIME", label: "종료시간", width: 100, align: "center", sortable: true, 
	            	/*
	            		formatter: function(){	            	
	        				var etime = "";
	        				etime = this.item.ENDTIME.substr(0,2) + " : " + this.item.ENDTIME.substr(2,2) + " : " + this.item.ENDTIME.substr(4,2)
	        				
	        				return etime;
	        		}
	        		*/
	            	},
	            	{key: "CONNID", label: "CONNID", width: 130, align: "center", sortable: true},
	            	{key: "CALLTYPE", label: "콜타입", width: 100, align: "center", sortable: true},
	            	{key: "EVENT", label: "이벤트", width: 115, align: "center", sortable: true},
	            	{key: "DES", label: "이벤트명", width: 115, align: "center", sortable: true},
	            	{key: "THISDN", label: "THISDN", width: 100, align: "center", sortable: true,
	    	        	/*
	            		formatter:function(){
	                		if(this.value != null)
	                		{
	                			var thisdn = this.value;
	    	        			
	                			if(thisdn != "" && thisdn != null) {
	                				var len = thisdn.length;
	                    			// 자리수 체크
	                    	        if(len == 11) { // 010****1234
	                    	        	return thisdn.substr(0, 3) + "****" + thisdn.substr(7, 4);
	                    	        } else if(len == 10) { // 02****1234
	                    	        	return thisdn.substr(0, 2) + "****" + thisdn.substr(6, 4);
	                    	        } else if(len == 9) { // 02***1234
	                    	        	return thisdn.substr(0, 2) + "***" + thisdn.substr(5, 4);
	                    	        } else {
	                    	        	//return "****";
	                    	        	return thisdn;
	                    	        }
	                			}
	                		}
	                		return null;
	                	}
	                	*/
	            	},
	            	{key: "OTHERDN", label: "OTHERDN", width: 100, align: "center", sortable: true,
		    	        	/*
	            			formatter:function(){
		                		if(this.value != null)
		                		{
		                			var otherdn = this.value;
		    	        			
		                			if(otherdn != "" && otherdn != null) {
		                				var len = otherdn.length;
		                    			// 자리수 체크
		                    	        if(len == 11) { // 010****1234
		                    	        	return otherdn.substr(0, 3) + "****" + otherdn.substr(7, 4);
		                    	        } else if(len == 10) { // 02****1234
		                    	        	return otherdn.substr(0, 2) + "****" + otherdn.substr(6, 4);
		                    	        } else if(len == 9) { // 02***1234
		                    	        	return otherdn.substr(0, 2) + "***" + otherdn.substr(5, 4);
		                    	        } else {
		                    	        	//return "****";
		                    	        	return otherdn;
		                    	        }
		                			}
		                		}
		                		return null;
		                	}
		                	*/
		                	},
	    	        {key: "THIRDDN", label: "THIRDDN", width: 100, align: "center", sortable: true,
			    	        	/*
		                		formatter:function(){
			                		if(this.value != null)
			                		{
			                			var thirddn = this.value;
			    	        			
			                			if(thirddn != "" && thirddn != null) {
			                				var len = thirddn.length;
			                    			// 자리수 체크
			                    	        if(len == 11) { // 010****1234
			                    	        	return thirddn.substr(0, 3) + "****" + thirddn.substr(7, 4);
			                    	        } else if(len == 10) { // 02****1234
			                    	        	return thirddn.substr(0, 2) + "****" + thirddn.substr(6, 4);
			                    	        } else if(len == 9) { // 02***1234
			                    	        	return thirddn.substr(0, 2) + "***" + thirddn.substr(5, 4);
			                    	        } else {
			                    	        	//return "****";
			                    	        	return thirddn;
			                    	        }
			                			}
			                		}
			                		return null;
			                	}
			                	*/
		                		},   	        
	    	        {key: "THISQUEUE", label: "인입경로", width: 90, align: "center", sortable: true},
	    	        {key: "ANI", label: "고객번호", width: 90, align: "center", sortable: true,
	    	        	/*
	    	        	formatter:function(){
	                		if(this.value != null)
	                		{
	                			var ani = this.value;
	    	        			
	                			if(ani != "" && ani != null) {
	                				var len = ani.length;
	                    			// 자리수 체크
	                    	        if(len == 11) { // 010****1234
	                    	        	return ani.substr(0, 3) + "****" + ani.substr(7, 4);
	                    	        } else if(len == 10) { // 02****1234
	                    	        	return ani.substr(0, 2) + "****" + ani.substr(6, 4);
	                    	        } else if(len == 9) { // 02***1234
	                    	        	return ani.substr(0, 2) + "***" + ani.substr(5, 4);
	                    	        } else {
	                    	        	//return "****";
	                    	        	return ani;
	                    	        }
	                			}
	                		}
	                		return null;
	                	}
	                	*/
	    	        },
	                {key: "GROUP_NAME", label: "연결스킬명", width: 100, align: "center", sortable: true},
	                {key: "AGENT_ID", label: "상담사사번", width: 100, align: "center", sortable: true},
	    	        {key: "AGENT_NAME", label: "상담사명", width: 100, align: "center", sortable: true},
	    	        //{key: "RPARTY", label: "종료주체", width: 90, align: "center", sortable: true}	    	                  	
	            ],
	            body: {
	                onClick: function () {
	                    this.self.select(this.dindex, {selectedClear: true});
	                    }
	            }
	        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.row_date;
            });
        } else {
            list = _list;
        }
        return list;
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
    	this.target.exportExcel("callTrace_상세_" +dateString+ ".xls");
    	//this.target.exportExcelXlsx("callTrace_상세_" +dateString);
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
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>날짜</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>인입시간</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>종료시간</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>CONNID</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>콜타입</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>이벤트</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>이벤트명</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>THISDN</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>OTHERDN</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>THIRDDN</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>인입경로</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>고객번호</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>연결스킬명</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>상담사사번</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>상담사명</th>";
		//detailHeadStr += "<th align='center' colspan=1 rowspan=1>종료주체</th>";
		detailHeadStr += "</tr>";
	        
		$("#gridExcel-detail-thead").append(detailHeadStr);
	    excelTable.push(detailHeadStr);
	        
	    var detailbodyStr="";
	    
	    data.forEach(function(m){	     	
		    detailbodyStr += "<tr>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(fmtDay(m.ROW_DATE)) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(fmtTime(m.STARTTIME)) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(fmtTime(m.ENDTIME)) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.CONNID) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.CALLTYPE) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.EVENT) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.DES) + "</td>";
		    
		    if(m.THISDN != null)
    		{
		    	/*
        		var gil = m.THISDN.length;
        		var val = "";
        		if(gil > 5)
        		{
            		var thisdn = m.THISDN;
        			
        			if(thisdn != "" && thisdn != null) {
        				var len = thisdn.length;
            			// 자리수 체크
            	        if(len == 11) { // 010****1234
            	        	val = thisdn.substr(0, 3) + "****" + thisdn.substr(7, 4);
            	        } else if(len == 10) { // 02****1234
            	        	val = thisdn.substr(0, 2) + "****" + thisdn.substr(6, 4);
            	        } else if(len == 9) { // 02***1234
            	        	val = thisdn.substr(0, 2) + "***" + thisdn.substr(5, 4);
            	        } else {
            	        	val = thisdn;
            	        }
        			}
            		detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(val) + "</td>";
        		}
        		else
        		{
        		*/
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.THISDN) + "</td>";
        		//}        		
    		}
		    else
		    {
		    	detailbodyStr += "<td colspan=1 rowspan=1></td>";
		    }
		    
		    if(m.OTHERDN != null)
    		{
		    	/*
        		var gil = m.OTHERDN.length;
        		var val = "";
        		if(gil > 5)
        		{
        			var otherdn = m.OTHERDN;
        			
        			if(otherdn != "" && otherdn != null) {
        				var len = otherdn.length;
            			// 자리수 체크
            	        if(len == 11) { // 010****1234
            	        	val = otherdn.substr(0, 3) + "****" + otherdn.substr(7, 4);
            	        } else if(len == 10) { // 02****1234
            	        	val = otherdn.substr(0, 2) + "****" + otherdn.substr(6, 4);
            	        } else if(len == 9) { // 02***1234
            	        	val = otherdn.substr(0, 2) + "***" + otherdn.substr(5, 4);
            	        } else {
            	        	val = otherdn;
            	        }
        			}
            		detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(val) + "</td>";
        		}
        		else
        		{
        		*/
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.OTHERDN) + "</td>";
        		//}        		
    		}
		    else
		    {
		    	detailbodyStr += "<td colspan=1 rowspan=1></td>";
		    }

		    if(m.THIRDDN != null)
    		{
		    	/*
        		var gil = m.THIRDDN.length;
        		var val = "";
        		if(gil > 5)
        		{
        			var thirddn = m.THIRDDN;
        			
        			if(thirddn != "" && thirddn != null) {
        				var len = thirddn.length;
            			// 자리수 체크
            	        if(len == 11) { // 010****1234
            	        	val = thirddn.substr(0, 3) + "****" + thirddn.substr(7, 4);
            	        } else if(len == 10) { // 02****1234
            	        	val = thirddn.substr(0, 2) + "****" + thirddn.substr(6, 4);
            	        } else if(len == 9) { // 02***1234
            	        	val = thirddn.substr(0, 2) + "***" + thirddn.substr(5, 4);
            	        } else {
            	        	val = thirddn;
            	        }
        			}
            		detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(val) + "</td>";
        		}
        		else
        		{
        		*/
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.THIRDDN) + "</td>";
        		//}        		
    		}
		    else
		    {
		    	detailbodyStr += "<td colspan=1 rowspan=1></td>";
		    }

		    detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.THISQUEUE) + "</td>";
		    
		    if(m.ANI != null)
    		{
		    	/*
		    	var gil = m.ANI.length;
        		var val = "";
        		if(gil > 5)
        		{
        			var ani = m.ANI;
        			
        			if(ani != "" && ani != null) {
        				var len = ani.length;
            			// 자리수 체크
            	        if(len == 11) { // 010****1234
            	        	val = ani.substr(0, 3) + "****" + ani.substr(7, 4);
            	        } else if(len == 10) { // 02****1234
            	        	val = ani.substr(0, 2) + "****" + ani.substr(6, 4);
            	        } else if(len == 9) { // 02***1234
            	        	val = ani.substr(0, 2) + "***" + ani.substr(5, 4);
            	        } else {
            	        	val = ani;
            	        }
        			}
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(val) + "</td>";
        		}
        		else
        		{*/
        		
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.ANI) + "</td>";
        		//}		    	
    		}		    
		    else
		    {
		    	detailbodyStr += "<td colspan=1 rowspan=1></td>";
		    }
		    
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.GROUP_NAME) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.AGENT_ID) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.AGENT_NAME) + "</td>";
		    //detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.RPARTY) + "</td>";
		    detailbodyStr += "</tr>";
		});
	            
	    $("#gridExcel-detail-tbody").append(detailbodyStr); 
	    excelTable.push(detailbodyStr); 
    }
});