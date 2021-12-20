var fnObj = {};
var excelTable = [];

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var callText = $("#callText").val();
    	var agidText = $("#agidText").val();
    	var connidText = $("#connidText").val();
    	
    	var thisdnText = $("#thisdntx").val();
    	var dnisText = $("#dnistx").val();
    	
    	
    	var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();   
       
        var starttime = $("[data-ax5select='startTime']").ax5select("getValue");
        var endtime = $("[data-ax5select='endTime']").ax5select("getValue");
        
        starttime = starttime[0].value.substring(0,2)+starttime[0].value.substring(3,5);
        endtime = endtime[0].value.substring(0,2)+endtime[0].value.substring(3,5);
           
        if(starttime > endtime)
        {
        	alert("시작시간이 종료시간을 넘을 수 없습니다!");
        	return;
        }
        
        /*
        if((callText == "" || callText == null) && (connidText == "" || connidText == null) && (agidText == "" || agidText == null) && (thisdnText == "" || thisdnText == null) && (dnisText == "" || dnisText == null) && (endtime - starttime > 70))
        {
        	alert("30분 단위로 조회가 가능합니다.");
        	return;
        }
        else if(callText != "" || connidText != "")
        {

        }
        else if((agidText != ""|| thisdnText != "" || dnisText != "") && (endtime - starttime > 100))
        {
        	alert("1시간 단위로 조회가 가능합니다.");
        	return;
        }
        */
        
        if(startDate != "" && startDate != null && endDate != "" && endDate != null)
        {
        	var reqExp = /^\d{4}-\d{2}-\d{2}$/;

            if(reqExp.test(startDate) == false || reqExp.test(endDate) == false)
            {
            	alert("날짜형식이 올바르지 않습니다.")
            	return;
            }
            
            if(startDate.substring(5,7) < "01" || startDate.substring(5,7) > "12" || endDate.substring(5,7) < "01" || endDate.substring(5,7) > "12")
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if(startDate.substring(8,10) < "01" || startDate.substring(8,10) > "31" || endDate.substring(8,10) < "01" || endDate.substring(8,10) > "31")
	        {
	        	alert("날짜형식이 올바르지 않습니다.");
	           	return;
	        }
        	
        	if((startDate.substring(5,7) == "04" || startDate.substring(5,7) == "06" || startDate.substring(5,7) == "09" || startDate.substring(5,7) == "11") && startDate.substring(8,10) > 30)
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if((endDate.substring(5,7) == "04" || endDate.substring(5,7) == "06" || endDate.substring(5,7) == "09" || endDate.substring(5,7) == "11") && endDate.substring(8,10) > 30)
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if(startDate.substring(5,7) == "02")
	        {
	        	var isleap = (startDate.substring(0,4) % 4 == 0 && (startDate.substring(0,4) % 100 != 0 || startDate.substring(0,4) % 400 == 0));
	        	if(startDate.substring(8,10) > 29 || (startDate.substring(8,10) == 29 && !isleap))
	        	{
	        		alert("날짜형식이 올바르지 않습니다.");
	               	return;
	        	}
	        }
	        	
	        if(endDate.substring(5,7) == "02")
	        {
	        	var isleap = (endDate.substring(0,4) % 4 == 0 && (endDate.substring(0,4) % 100 != 0 || endDate.substring(0,4) % 400 == 0));
	        	if(endDate.substring(8,10) > 29 || (endDate.substring(8,10) == 29 && !isleap))
	        	{
	        		alert("날짜형식이 올바르지 않습니다.");
	               	return;
	        	}
	        } 
        }
        if(startDate > endDate)
		{
			alert("시작일이 종료일보다 클 수 없습니다.");
			return;
		}   
        if(startDate == "" && endDate == "")
		{
			alert("기간을 입력해 주시기 바랍니다.");
			return;
		} 
        if(startDate == "" && endDate != "")
		{
			alert("시작일을 입력해 주시기 바랍니다.");
			return;
		}       
        if(startDate != "" && endDate == "")
		{
			alert("종료일을 입력해 주시기 바랍니다.");
			return;
		}      
        
        startDate = startDate.split('-');
        endDate = endDate.split('-');
        
        var sdt = new Date(startDate[0], startDate[1], startDate[2]);
        var edt = new Date(endDate[0], endDate[1], endDate[2]);
        
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
        if(parseInt(diff/day) > 0)
        {
        	alert("조회기준일이 1일을 넘을 수 없습니다!");
        	return;
        }

        if(callText.indexOf("'") != -1 || callText.indexOf("\"") != -1 || callText.indexOf("(") != -1 || callText.indexOf(")") != -1 || callText.indexOf("--") != -1 || callText.indexOf("#") != -1 || callText.indexOf("=") != -1 || callText.indexOf(",") != -1)
        {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        } 
        
        if(connidText.indexOf("'") != -1 || connidText.indexOf("\"") != -1 || connidText.indexOf("(") != -1 || connidText.indexOf(")") != -1 || connidText.indexOf("--") != -1 || connidText.indexOf("#") != -1 || connidText.indexOf("=") != -1 || connidText.indexOf(",") != -1)
        {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        } 
        
        if(agidText.indexOf("'") != -1 || agidText.indexOf("\"") != -1 || agidText.indexOf("(") != -1 || agidText.indexOf(")") != -1 || agidText.indexOf("--") != -1 || agidText.indexOf("#") != -1 || agidText.indexOf("=") != -1 || agidText.indexOf(",") != -1)
        {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        }
        
    	axboot.ajax({
            type: "POST",
            url: "/gr/api/hist/callTr/callTrSearch",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
                caller.gridView01.setData(res);
                fnObj.excelgrid.initView();
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });

        return false;
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
		var fileName = "Call Trace_" + dateString + ".xls";
		
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
    ITEM_CLICK: function (caller, act, data){
    	 axboot.modal.open({
             modalType: "CALLTRACE_INFO_MODAL",
             //param: param,
             sendData: function () {
                 return {
                     "connid": data.CONNID
                 };
             },
             callback: function (data) {
                 this.close();
             }
         });

    },
    /*
    ITEM_CLICK_IVR: function (caller, act, data){
    	var saveList = caller.gridView01.getData("selected");    	
    	
    	if(saveList.length == 0)
    	{
    		alert("목록을 선택해 주시기 바랍니다.");
        	return;
    	}

    	var data = saveList[0];
    	data.connId = data.CONNID;
    	
    	axboot.ajax({
	    	type: "GET",
		    url: "/api/callTr/sessionidget",
		    cache : false,
		    data: {connid : data.CONNID},
		    callback: function (res) {
		    	if(res.length > 0)
		    	{
		    		data.sesId = res[0].SID;
		    		
		    		axboot.modal.open({
		                modalType: "IVR_TRACE_MODAL",
		                //param: param,
		                sendData: function () {
		                    return {"data":$.extend({}, data)};
		                },
		                callback: function (data) {
		                    this.close();
		                }
		            });
		    	}
		    }
    	});
   }
   */
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
var info = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    $("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});
    
    axboot
    .call({
    	type: "POST",
	    url: "/api/statLstMng/userAuthLst",
	    data: "",
	    callback: function (res) {
	    	res.forEach(function (n){
	    		info.grpcd = n.grp_auth_cd;
	    		info.comcd = n.company_cd;
	    		info.cencd = n.center_cd;
	    		info.teamcd = n.team_cd;
	    		info.chncd = n.chn_cd;
	    	}); 
	    	
	    	axboot.ajax({
	    	    type: "POST",
	    	    //url: "/api/mng/searchCondition/company",
	    	    url: "/api/mng/searchCondition/companyRE",
	    	    cache : false,
	    	    data: JSON.stringify($.extend({}, info)),
	    	    callback: function (res) {
	    		    var resultSet = [];
	                //resultSet = [{value:"", text:"전체"}];

    		        res.list.forEach(function (n) {
    		        	resultSet.push({
    		               	value: n.id, text: n.name,
    		            });	    	        	
    		        });
    		        $("[data-ax5select='comSelect']").ax5select({
    			        theme: 'primary',
    			        onStateChanged: function () {
    			        	_this.searchView.partSearch();
    			        },
    			        options: resultSet,
    		        });
    		        _this.searchView.partSearch();
    		    	}
    		   });
	    }
    })
    .done(function () {
        _this.pageButtonView.initView();
        _this.searchView.initView();
        _this.gridView01.initView();
        _this.excelgrid.initView();
        
    });

};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            }
        });
    }
});


//== view 시작
/**
 * searchView
 */
function date_set(){
    var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) MM = "0"+MM;
    var dd = (date.getDate()).toString();
    if(dd.length == 1) dd = "0"+dd;
    
    $("#startDate").val(yyyy+"-"+MM+"-"+dd);
    $("#endDate").val(yyyy+"-"+MM+"-"+dd);
}

$("#startDate").on('focusout', function(){
	var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) MM = "0"+MM;
    var dd = (date.getDate()).toString();
    if(dd.length == 1) dd = "0"+dd;
    
	var interval = "day";
	var startDate = $("#startDate").val();
	
	if(interval == "month")
	{
		var reqExp = /^\d{4}-\d{2}$/;
		if(reqExp.test(startDate) == false)
        {
			var reqExp = /^\d{6}$/;
			if(reqExp.test(startDate) == true)
			{
				$("#startDate").val($("#startDate").val().substr(0,4) +"-"+ $("#startDate").val().substr(4,2));
			}
			else
			{
				$("#startDate").val(yyyy+"-"+MM);
			}
        }
	}
	else if(interval == "year")
	{
		var reqExp = /^\d{4}$/;
		if(reqExp.test(startDate) == false)
        {
			var reqExp = /^\d{4}$/;
			if(reqExp.test(startDate) == true)
			{
				$("#startDate").val($("#startDate").val().substr(0,4));
			}
			else
			{
				$("#startDate").val(yyyy);
			}
        }
	}
	else 
	{
		var reqExp = /^\d{4}-\d{2}-\d{2}$/;
		if(reqExp.test(startDate) == false)
        {
			var reqExp = /^\d{4}-\d{4}$/;
			if(reqExp.test(startDate) == true)
			{
				$("#startDate").val($("#startDate").val().substr(0,4) +"-"+ $("#startDate").val().substr(5,2) +"-"+ $("#startDate").val().substr(7,2));
			}
			else
			{
				var reqExp = /^\d{6}-\d{2}$/;
				if(reqExp.test(startDate) == true)
				{
					$("#startDate").val($("#startDate").val().substr(0,4) +"-"+ $("#startDate").val().substr(4,2) +"-"+ $("#startDate").val().substr(7,2));
				}
				else
				{
					var reqExp = /^\d{8}$/;
					if(reqExp.test(startDate) == true)
					{
						$("#startDate").val($("#startDate").val().substr(0,4) +"-"+ $("#startDate").val().substr(4,2) +"-"+ $("#startDate").val().substr(6,2));
					}
					else
					{
						$("#startDate").val(yyyy+"-"+MM+"-"+dd);
					}
				}
			}		
        }
	} 
	
	if($("#startDate").val() > $("#endDate").val())
	{
		$("#endDate").val($("#startDate").val());
	} 
	
	startDate = startDate.replace(/-/gi,'');
	if(interval == "month")
	{
		startDate = startDate.substring(0,4) + '-' + startDate.substring(4,6);
	}
	else if(interval == "year")
	{
		startDate = startDate.substring(0,4);
	}
	else
	{
		startDate = startDate.substring(0,4) + '-' + startDate.substring(4,6) + '-' + startDate.substring(6,8);
	}
	
	if(interval != "year")
	{
		if(startDate.substring(5,7) < "01" || startDate.substring(5,7) > "12")
		{
			alert("날짜형식이 올바르지 않습니다.");
	    	return;
		}
		
		if(interval != "month")
		{
	    	if(startDate.substring(8,10) < "01" || startDate.substring(8,10) > "31")
	    	{
	    		alert("날짜형식이 올바르지 않습니다.");
	        	return;
	    	}        	
		}
		
		if((startDate.substring(5,7) == "04" || startDate.substring(5,7) == "06" || startDate.substring(5,7) == "09" || startDate.substring(5,7) == "11") && startDate.substring(8,10) > 30)
		{
			alert("날짜형식이 올바르지 않습니다.");
	    	return;
		}
		
		if(interval != "month")
		{
	    	if(startDate.substring(5,7) == "02")
	    	{
	    		var isleap = (startDate.substring(0,4) % 4 == 0 && (startDate.substring(0,4) % 100 != 0 || startDate.substring(0,4) % 400 == 0));
	    		if(startDate.substring(8,10) > 29 || (startDate.substring(8,10) == 29 && !isleap))
	    		{
	    			alert("날짜형식이 올바르지 않습니다.");
	            	return;
	    		}
	    	}
		}
	}
});


$("#endDate").on('focusout', function(){
	var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) MM = "0"+MM;
    var dd = (date.getDate()).toString();
    if(dd.length == 1) dd = "0"+dd;
    
	var interval = "day";
	var endDate = $("#endDate").val();
	
	if(interval == "month")
	{
		var reqExp = /^\d{4}-\d{2}$/;
		if(reqExp.test(endDate) == false)
        {
			var reqExp = /^\d{6}$/;
			if(reqExp.test(endDate) == true)
			{
				$("#endDate").val($("#endDate").val().substr(0,4) +"-"+ $("#endDate").val().substr(4,2));
			}
			else
			{
				$("#endDate").val(yyyy+"-"+MM);
			}
        }
	}
	else if(interval == "year")
	{
		var reqExp = /^\d{4}$/;
		if(reqExp.test(endDate) == false)
        {
			var reqExp = /^\d{4}$/;
			if(reqExp.test(endDate) == true)
			{
				$("#endDate").val($("#endDate").val().substr(0,4));
			}
			else
			{
				$("#endDate").val(yyyy);
			}
        }
	}
	else 
	{
		var reqExp = /^\d{4}-\d{2}-\d{2}$/;
		if(reqExp.test(endDate) == false)
        {
			var reqExp = /^\d{4}-\d{4}$/;
			if(reqExp.test(endDate) == true)
			{
				$("#endDate").val($("#endDate").val().substr(0,4) +"-"+ $("#endDate").val().substr(5,2) +"-"+ $("#endDate").val().substr(7,2));
			}
			else
			{
				var reqExp = /^\d{6}-\d{2}$/;
				if(reqExp.test(endDate) == true)
				{
					$("#endDate").val($("#endDate").val().substr(0,4) +"-"+ $("#endDate").val().substr(4,2) +"-"+ $("#endDate").val().substr(7,2));
				}
				else
				{
					var reqExp = /^\d{8}$/;
					if(reqExp.test(endDate) == true)
					{
						$("#endDate").val($("#endDate").val().substr(0,4) +"-"+ $("#endDate").val().substr(4,2) +"-"+ $("#endDate").val().substr(6,2));
					}
					else
					{
						$("#endDate").val(yyyy+"-"+MM+"-"+dd);
					}
				}
			}
        }
	} 
	
	if($("#startDate").val() > $("#endDate").val())
	{
		$("#startDate").val($("#endDate").val());
	} 
	
	endDate = endDate.replace(/-/gi,'');
	if(interval == "month")
	{
		endDate = endDate.substring(0,4) + '-' + endDate.substring(4,6);
	}
	else if(interval == "year")
	{
		endDate = endDate.substring(0,4);
	}
	else
	{
		endDate = endDate.substring(0,4) + '-' + endDate.substring(4,6) + '-' + endDate.substring(6,8);
	}
	
	if(interval != "year")
	{
		if(endDate.substring(5,7) < "01" || endDate.substring(5,7) > "12")
		{
			alert("날짜형식이 올바르지 않습니다.");
	    	return;
		}
		
		if(interval != "month")
		{
	    	if(endDate.substring(8,10) < "01" || endDate.substring(8,10) > "31")
	    	{
	    		alert("날짜형식이 올바르지 않습니다.");
	        	return;
	    	}        	
		}
	
		if((endDate.substring(5,7) == "04" || endDate.substring(5,7) == "06" || endDate.substring(5,7) == "09" || endDate.substring(5,7) == "11") && endDate.substring(8,10) > 30)
		{
			alert("날짜형식이 올바르지 않습니다.");
	    	return;
		}
		
		if(interval != "month")
		{
	    	if(endDate.substring(5,7) == "02")
	    	{
	    		var isleap = (endDate.substring(0,4) % 4 == 0 && (endDate.substring(0,4) % 100 != 0 || endDate.substring(0,4) % 400 == 0));
	    		if(endDate.substring(8,10) > 29 || (endDate.substring(8,10) == 29 && !isleap))
	    		{
	    			alert("날짜형식이 올바르지 않습니다.");
	            	return;
	    		}
	    	}
		}
	}
});

ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];

ax5.info.months = ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],

fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter"); 
        this.startDate = $("#startDate");
        this.endDate = $("#endDate");        
		this.target.find('[data-ax5picker="date"]').ax5picker({
            direction: "auto", 
            content: {
                type: 'date',
                config: {
                	selectMode: "day", 
                	control:{
        				yearTmpl: "%s년",
        				dayTmpl: "%s"
        			},                
                	lang: {
                        yearTmpl: "%s년",
                        months: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
                        dayTmpl: "%s"
                    },
                    marker: (function () {
                        var marker = {};
                        marker[ax5.util.date(new Date(), {'return': 'yyyy-MM-dd', 'add': {d: 0}})] = true;
 
                        return marker;
                    })()
                }
            },            
            btns: {
                today: {
                    label: "Today", onClick: function () {
                    	var date = new Date();
                        var yyyy = date.getFullYear().toString();
                        var MM = (date.getMonth() + 1).toString();
                        if(MM.length == 1) MM = "0"+MM;
                        var dd = date.getDate().toString();
                        if(dd.length == 1) dd = "0"+dd;
	                        this.self
	                            .setContentValue(this.item.id, 0, ax5.util.date(yyyy+MM+dd, {"return": "yyyy-MM-dd"}))
	                            .setContentValue(this.item.id, 1, ax5.util.date(yyyy+MM+dd, {"return": "yyyy-MM-dd"}))
	                            .close()
                        ;
                    }
                },
                ok:{label:"Close", theme:"default"}
            }
        });
	
		var opt_time = [];
		for (var i = 0; i < 25; i++) 
		{
        	for (var j = 0; j < 2; j++) 
        	{
				var hour = "";
				var min = "";
				if(i<10) hour="0"+i;
				else hour=i;
				if(j==0) 
				{
					min="00";
				}
				else
				{
					min = (j*30);
				}
				
				if(hour + min != 54) //숫자로 인식하여 더해버림
				{					
					opt_time.push({value: hour+":"+min, text: hour+":"+min});
				}
			}
		}
		
		var date = new Date();
		var shour = (date.getHours()).toString(); 
	    var smin = (date.getMinutes()).toString();

	    var ehour = (date.getHours()).toString();    
	    var emin = (date.getMinutes()).toString();	   
		
	    if(smin.length == 1) smin = "0"+smin;
		if(emin.length == 1) emin = "0"+emin;
		
		if(shour == "24") shour = "0";
		
		if(smin >= "00" && smin < "30")
		{
			smin = "00";
			emin = "30";
		}
		else
		{
			smin = "30";
			ehour = (date.getHours() + 1).toString();   
			if(ehour == "25") ehour = "1";
			emin = "00";
		}
		
		if(shour.length == 1) shour = "0"+shour;
		if(ehour.length == 1) ehour = "0"+ehour;
		
		
		$("[data-ax5select='startTime']").ax5select({
		    theme: 'primary',
		    options: opt_time,
		    onChange: function () {
		    	var stime = $("[data-ax5select='startTime']").ax5select("getValue")[0].value;
		    	var etime = $("[data-ax5select='endTime']").ax5select("getValue")[0].value;
		    	
	        	var starttime = stime.substring(0,2)+stime.substring(3,5);
	        	var endtime = etime.substring(0,2)+etime.substring(3,5);
	        	
	        	if(starttime > endtime)
	        	{
	        		$("[data-ax5select='endTime']").ax5select("setValue",stime); 
	        	}
		    }
		});
		$("[data-ax5select='startTime']").ax5select("setValue",shour + ":" + smin);
		$("[data-ax5select='endTime']").ax5select({
		    theme: 'primary',
		    options: opt_time,
		    onChange: function () {
		    	var stime = $("[data-ax5select='startTime']").ax5select("getValue")[0].value;
		    	var etime = $("[data-ax5select='endTime']").ax5select("getValue")[0].value;
		    	
	        	var starttime = stime.substring(0,2)+stime.substring(3,5);
	        	var endtime = etime.substring(0,2)+etime.substring(3,5);
	        	
	        	if(starttime > endtime)
	        	{
	        		$("[data-ax5select='startTime']").ax5select("setValue",etime); 
	        	}
	        	
		    }
		});  
		$("[data-ax5select='endTime']").ax5select("setValue",ehour + ":" + emin); 
    	
		date_set();
    },
    getData: function () {
    	this.startTime = $("[data-ax5select='startTime']").ax5select("getValue");
    	this.endTime = $("[data-ax5select='endTime']").ax5select("getValue");
    	    	
    	var sti = this.startTime[0].value.substring(0,2)+this.startTime[0].value.substring(3,5);
    	if(sti == "2400")
    	{
    		sti = "2359";
    	}
    	var eti = this.endTime[0].value.substring(0,2)+this.endTime[0].value.substring(3,5);
    	if(eti == "2400")
    	{
    		eti = "2359";
    	}
    	
        return {
        	comSelect: $("[data-ax5select='comSelect']").ax5select("getValue")[0].value,
        	deptSelect: $('[data-ax5select="deptSelect"]').ax5select("getValue")[0].value,
        	teamSelect: $('[data-ax5select="teamSelect"]').ax5select("getValue")[0].value,
        	callText: $("#callText").val(),
        	agidText: $("#agidText").val(),
        	connidText: $("#connidText").val(),
        	
        	startDate: this.startDate.val(),
        	endDate: this.endDate.val(),
        	startTime: sti,
        	endTime: eti,
        	
        	grpcd : info.grpcd,
        }
    },
    partSearch: function(){
        var data = {}; 
        var multi = false;
        
        data.compId = $("[data-ax5select='comSelect']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/part",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
            	var resultSet = [];
            	resultSet = [{value:"", text:"전체", sel:"1"}];
            	
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='deptSelect']").ax5select({
        	        theme: 'primary',
        	        multiple: multi,
        	        options: resultSet,
    		        onStateChanged: function () {
    	                fnObj.searchView.teamSearch();
    		        },        	       
                });
                $('[data-ax5select="deptSelect"]').ax5select("setValue",[""]);
                
                fnObj.searchView.teamSearch();
            }
        });
    },
    teamSearch: function(){
    	//console.log("compId : " + $("[data-ax5select='selCompany']").ax5select("getValue")[0].value);
    	//console.log("partId : " + $("[data-ax5select='selPart']").ax5select("getValue")[0].value);
        var data = {}; 
        data.grpcd = info.grpcd;
        data.teamcd = info.teamcd
        data.compId = $("[data-ax5select='comSelect']").ax5select("getValue")[0].value;
        data.partId = $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value;

        axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/team",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
            	var resultSet = [];
            	resultSet = [{value:"", text:"전체"}];
            	
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name,
                    });
                });
                $("[data-ax5select='teamSelect']").ax5select({
        	        theme: 'primary',
        	        onStateChanged: function () {
    		        	//fnObj.searchView.agentSearch();
    		        },
        	        options: resultSet,
                });
                $("[data-ax5select='teamSelect']").ax5select("setValue", info.teamcd);
            }
        });
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
	            multipleSelect: false,
	            header: {
			 		selector: false,
			 	},	            
	            showLineNumber:true,
	            target: $('[data-ax5grid="grid-view-01"]'),
	            columns: [
	            	{key: "ROW_DATE", label: "날짜", width: 130, align: "center", sortable: true},
	            	{key: "STARTTIME", label: "인입시간", width: 130, align: "center", sortable: true, 
	            		//formatter: function(){	            	
        				//var stime = "";
        				//stime = this.item.STARTTIME.substr(0,2) + " : " + this.item.STARTTIME.substr(2,2) + " : " + this.item.STARTTIME.substr(4,2)
        				
        				//return stime;
	            		//}
	            	},
	            	{key: "ENDTIME", label: "종료시간", width: 130, align: "center", sortable: true, 
	            		//formatter: function(){	            	
	        			//	var etime = "";
	        			//	etime = this.item.ENDTIME.substr(0,2) + " : " + this.item.ENDTIME.substr(2,2) + " : " + this.item.ENDTIME.substr(4,2)
	        				
	        			//	return etime;
	            		//}
	            	},
	            	{key: "CONNIDFST", label: "최초CONNID", width: 170, align: "center", sortable: true},
	    	        {key: "CONNID", label: "최종CONNID", width: 170, align: "center", sortable: true}	,  
	        		{key: "CALLTYPE", label: "호유형", width: 130, align: "center", sortable: true},
	        		{key: "ANI", label: "고객/내선번호", width: 130, align: "center", sortable: true,
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
	        		},
	                {key: "DNIS", label: "대표번호", width: 130, align: "center", sortable: true,
		    	        	formatter:function(){
		                		if(this.value != null)
		                		{
		                			var dnis = this.value;
		    	        			
		                			if(dnis != "" && dnis != null) {
		                				var len = dnis.length;
		                    			// 자리수 체크
		                    	        if(len == 11) { // 010****1234
		                    	        	return dnis.substr(0, 3) + "****" + dnis.substr(7, 4);
		                    	        } else if(len == 10) { // 02****1234
		                    	        	return dnis.substr(0, 2) + "****" + dnis.substr(6, 4);
		                    	        } else if(len == 9) { // 02***1234
		                    	        	return dnis.substr(0, 2) + "***" + dnis.substr(5, 4);
		                    	        } else {
		                    	        	//return "****";
		                    	        	return dnis;
		                    	        }
		                			}
		                		}
		                		return null;
		                	}
	        		},	
	        		{key: "COM_NAME", label: "센터", width: 130, align: "center", sortable: true},
	            	{key: "DEPT_NAME", label: "브랜드", width: 130, align: "center", sortable: true},
	            	{key: "TEAM_NAME", label: "팀", width: 130, align: "center", sortable: true},
	            	{key: "AGENT_ID", label: "최종상담사사번", width: 130, align: "center", sortable: true},
	            	{key: "AGENT_NAME", label: "최종상담사명", width: 130, align: "center", sortable: true},
	            	{key: "LASTDN", label: "최종상담사내선", width: 130, align: "center", sortable: true},
	            	//{key: "RPARTY", label: "종료주체", width: 130, align: "center", sortable: true}	            	  	        
	            ],
	            body: {
	                onDBLClick: function () {
	                    this.self.select(this.dindex, {selectedClear: true});
	                    ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.list[this.dindex]);
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
    	this.target.exportExcel("callTrace_" +dateString+ ".xls");
    	//this.target.exportExcelXlsx("callTrace_" +dateString);
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
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>최초CONNID</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>최종CONNID</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>호유형</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>고객/내선번호</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>대표번호</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>센터</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>브랜드</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>팀</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>최종상담사사번</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>최종상담사명</th>";
		detailHeadStr += "<th align='center' colspan=1 rowspan=1>최종상담사내선</th>";
		//detailHeadStr += "<th align='center' colspan=1 rowspan=1>종료주체</th>";
		detailHeadStr += "</tr>";
	        
		$("#gridExcel-detail-thead").append(detailHeadStr);
	    excelTable.push(detailHeadStr);
	        
	    var detailbodyStr="";
	    
	    data.forEach(function(m){	     	
		    detailbodyStr += "<tr>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.ROW_DATE) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.STARTTIME) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.ENDTIME) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.CONNIDFST) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.CONNID) + "</td>";		    
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.CALLTYPE) + "</td>";
		    
		    if(m.ANI != null)
    		{
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
        		{
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.ANI) + "</td>";
        		}
    		}
		    else
		    {
		    	detailbodyStr += "<td colspan=1 rowspan=1></td>";
		    }
		    
		    
		    if(m.DNIS != null)
    		{
		    	var gil = m.DNIS.length;
        		var val = "";
        		if(gil > 5)
        		{
        			var dnis = m.DNIS;
        			
        			if(dnis != "" && dnis != null) {
        				var len = dnis.length;
            			// 자리수 체크
            	        if(len == 11) { // 010****1234
            	        	val = dnis.substr(0, 3) + "****" + dnis.substr(7, 4);
            	        } else if(len == 10) { // 02****1234
            	        	val = dnis.substr(0, 2) + "****" + dnis.substr(6, 4);
            	        } else if(len == 9) { // 02***1234
            	        	val = dnis.substr(0, 2) + "***" + dnis.substr(5, 4);
            	        } else {
            	        	val = dnis;
            	        }
        			}
        						                		
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(val) + "</td>";
        		}
        		else
        		{
        			detailbodyStr += "<td colspan=1 rowspan=1>" + "'" + nullChk(m.DNIS) + "</td>";
        		}
    		}
		    else
		    {
		    	detailbodyStr += "<td colspan=1 rowspan=1></td>";
		    }

		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.COM_NAME) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.DEPT_NAME) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.TEAM_NAME) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.AGENT_ID) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.AGENT_NAME) + "</td>";
		    detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.LASTDN) + "</td>";
		    //detailbodyStr += "<td colspan=1 rowspan=1>" + nullChk(m.RPARTY) + "</td>";
		    detailbodyStr += "</tr>";
		});
	            
	    $("#gridExcel-detail-tbody").append(detailbodyStr); 
	    excelTable.push(detailbodyStr); 
    }
});