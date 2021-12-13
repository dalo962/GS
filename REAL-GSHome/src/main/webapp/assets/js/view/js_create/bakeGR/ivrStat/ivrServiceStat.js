/**
 * IVR 서비스 통계
 */

var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) { 

    	var interval = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
    	
    	var sDate = $("#startDate").val();
        var eDate = $("#endDate").val();
                
        var starttime = "";
        var endtime = "";
        
        if(interval != "day" && interval != "month")
        {
        	// interval 이 "시간" 또는 "분" 일 때 ( 일 월 년 제외 )
	        starttime = $("[data-ax5select='startTime']").ax5select("getValue");
	        endtime = $("[data-ax5select='endTime']").ax5select("getValue");
	        
	        // 선택된 시간을 가져와서 : 제외
	        starttime = starttime[0].value.substring(0,2) + starttime[0].value.substring(3,5);
	        endtime = endtime[0].value.substring(0,2)+endtime[0].value.substring(3,5);
	        
	        if(starttime > endtime)
	        {
	        	alert("시작시간이 종료시간을 넘을 수 없습니다!");
	        	return;
	        }
        }
        
        // 날짜 형식관련
        if(sDate != "" && sDate != null && eDate != "" && eDate != null)
        {
        	if(interval == "month")
        	{
        		// "월" 별 인 경우 ( yyyy-mm )
        		var reqExp = /^\d{4}-\d{2}$/;
        		if(reqExp.test(sDate) == false || reqExp.test(eDate) == false)
                {
                	alert("날짜형식이 올바르지 않습니다.");
                	return;
                }
        	}
        	else
        	{
        		// "일" 또는 "시간, 분" 인 경우 ( yyyy-mm-dd )
	        	var reqExp = /^\d{4}-\d{2}-\d{2}$/;
	
	            if(reqExp.test(sDate) == false || reqExp.test(eDate) == false)
	            {
	            	alert("날짜형식이 올바르지 않습니다.")
	            	return;
	            }
        	}
        	
        	// days가 31일
            if(sDate.substring(5,7) < "01" || sDate.substring(5,7) > "12" || eDate.substring(5,7) < "01" || eDate.substring(5,7) > "12")
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
            if(interval != "month")
        	{
	        	if(sDate.substring(8,10) < "01" || sDate.substring(8,10) > "31" || eDate.substring(8,10) < "01" || eDate.substring(8,10) > "31")
		        {
		        	alert("날짜형식이 올바르지 않습니다.");
		           	return;
		        }
        	}
        	
            // days가 30일
        	if((sDate.substring(5,7) == "04" || sDate.substring(5,7) == "06" || sDate.substring(5,7) == "09" || sDate.substring(5,7) == "11") && sDate.substring(8,10) > 30)
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	if((eDate.substring(5,7) == "04" || eDate.substring(5,7) == "06" || eDate.substring(5,7) == "09" || eDate.substring(5,7) == "11") && eDate.substring(8,10) > 30)
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if(interval != "month")
        	{
        		// 윤달계산
	        	if(sDate.substring(5,7) == "02")
		        {
		        	var isleap = (sDate.substring(0,4) % 4 == 0 && (sDate.substring(0,4) % 100 != 0 || sDate.substring(0,4) % 400 == 0));
		        	if(sDate.substring(8,10) > 29 || (sDate.substring(8,10) == 29 && !isleap))
		        	{
		        		alert("날짜형식이 올바르지 않습니다.");
		               	return;
		        	}
		        }
		        	
		        if(eDate.substring(5,7) == "02")
		        {
		        	var isleap = (eDate.substring(0,4) % 4 == 0 && (eDate.substring(0,4) % 100 != 0 || eDate.substring(0,4) % 400 == 0));
		        	if(eDate.substring(8,10) > 29 || (eDate.substring(8,10) == 29 && !isleap))
		        	{
		        		alert("날짜형식이 올바르지 않습니다.");
		               	return;
		        	}
		        } 
        	}
        } // 날짜 형식 종료
        
        // 
        if(sDate > eDate)
		{
			alert("시작일이 종료일보다 클 수 없습니다.");
			return;
		}     
        if(sDate == "" && eDate == "")
		{
			alert("기간을 입력해 주시기 바랍니다.");
			return;
		}
        
        sDate = sDate.split('-');
        eDate = eDate.split('-');
        
        var sdt = "";
        var edt = "";
        
        if(interval == "month")
        {
        	sdt = new Date(sDate[0], sDate[1]);
            edt = new Date(eDate[0], eDate[1]);
        }
        else
        {
        	sdt = new Date(sDate[0], sDate[1], sDate[2]);
            edt = new Date(eDate[0], eDate[1], eDate[2]);
        }
        
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
        // 조회기준 별 최대 일수
        if(interval == "5m" || interval == "15m" || interval == "30m" || interval == "1h")
        {
        	if(parseInt(diff/day) > 7)
            {
            	alert("조회기준일이 7일을 넘을 수 없습니다!");
            	return;
            }
        }
        else if(interval == "day")
        {
        	if(parseInt(diff/day) > 31)
            {
            	alert("조회기준일이 31일을 넘을 수 없습니다!");
            	return;
            }
        }
        else if(interval == "month")
        {
        	if(parseInt(diff/month) > 12)
        	{
        		alert("조회기준일이 365일을 넘을 수 없습니다!");
        		return;
        	}
        } // 조회기준 별 최대 일수 종료
        
		// PAGE_SEARCH :: search api 호출
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrServiceStat/serviceStatListSearch",
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
    EXCEL_EXPORT: function (caller, act, data) {
		// EXCEL_EXPORT :: 엑셀로 내보내기(엑셀버튼)
    	caller.gridView01.exportExcel();
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

/**
 * searchView
 */
function date_set() {
	// searchView의 startDate와 endDate를 Setting하는 function
    var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) MM = "0"+MM;
    var dd = date.getDate().toString();
    if(dd.length == 1) dd = "0"+dd;
   
    // date picker setting
    if($("[data-ax5select='interval']").ax5select("getValue")[0].value == 'month')
    {
    	// 월 선택시 date picker
    	if($("#startDate").val().length != 7 || $("#endDate").val().length != 7)
    	{
    		$("#startDate").val(yyyy+"-"+MM);
    		$("#endDate").val(yyyy+"-"+MM); 
    	}
    	
    	$('[data-ax5picker="date"]').ax5picker({
            direction: "auto", 
            content: {
                type: 'date',
                config: {
                	selectMode: "month", 
                	control:{
        				yearTmpl: "%s년",
        				dayTmpl: "%s"
        			},                
                	lang: {
                        yearTmpl: "%s년",
                        months: [
                        	'01월', '02월', '03월', '04월', '05월', '06월', 
                        	'07월', '08월', '09월', '10월', '11월', '12월'
                        ],
                        dayTmpl: "%s"
                    },
                    marker: (function () {
                        var marker = {};
                        marker[ax5.util.date(new Date(), {'return': 'yyyy-MM', 'add': {d: 0}})] = true;
 
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
	                        this.self
	                            .setContentValue(this.item.id, 0, ax5.util.date(yyyy+MM, {"return": "yyyy-MM"}))
	                            .setContentValue(this.item.id, 1, ax5.util.date(yyyy+MM, {"return": "yyyy-MM"}))
	                            .close()
                        ;
                    }
                },
                ok:{label:"Close", theme:"default"}
            }
        });  
    }
    else
    {
    	if($("#startDate").val().length != 10 || $("#endDate").val().length != 10)
    	{
    		$("#startDate").val(yyyy+"-"+MM+"-"+dd);
        	$("#endDate").val(yyyy+"-"+MM+"-"+dd);
    	}	
    	
    	$('[data-ax5picker="date"]').ax5picker({
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
                        months: [
                        	'01월', '02월', '03월', '04월', '05월', '06월', 
                        	'07월', '08월', '09월', '10월', '11월', '12월'
                    	],
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
                    label: "Today", 
                    onClick: function () {
                    	var date = new Date();
                        var yyyy = date.getFullYear().toString();
                        var MM = (date.getMonth() + 1).toString();
                        if(MM.length == 1) {
                        	MM = "0"+MM;
                        }
                        var dd = date.getDate().toString();
                        if(dd.length == 1){
                        	dd = "0"+dd;
                        }
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
    }
}
function date_change() {
	return;
}
$("#startDate").on('focusout', function() {
	var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) MM = "0"+MM;
    var dd = (date.getDate()).toString();
    if(dd.length == 1) dd = "0"+dd;
    
	var interval = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
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
	else
	{
		startDate = startDate.substring(0,4) + '-' + startDate.substring(4,6) + '-' + startDate.substring(6,8);
	}
	
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
});
$("#endDate").on('focusout', function(){
	var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) {
    	MM = "0"+MM;
    }
    var dd = (date.getDate()).toString();
    if(dd.length == 1){
    	dd = "0"+dd;
    }
    
	var interval = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
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
	else
	{
		endDate = endDate.substring(0,4) + '-' + endDate.substring(4,6) + '-' + endDate.substring(6,8);
	}
	
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
}); // date_set 종료

function time_set(){
	// searchView의 startTime과 endTime를 Setting하는 function ( 일 월 년 제외 )
	var select = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
	var opt_time = [];
	
	if(select == "5m") {
		// 5분 간격
		for (var i = 0; i < 24; i++) {
        	for (var j = 0; j < 12; j++) {
				var hour = "";
				var min = "";
				
				if(i<10) {
					hour="0"+i;
				} else{
					hour=i;
				}
				if(j==0) {
					min="00";
				} else {
					if(j < 2) {
						min = "0" + (j*5)  
					} else {
						min = (j*5);
					}
				}
				opt_time.push({value: hour+":"+min, text: hour+":"+min});
			}
		} 
	} else if(select == "15m") {
		// 15분 간격
		for (var i = 0; i < 24; i++) {
        	for (var j = 0; j < 4; j++) {
				var hour = "";
				var min = "";
				
				if(i<10) {
					hour="0"+i;
				} else {
					hour=i;
				}
				if(j==0) {
					min="00";
				} else {
					min = (j*15);
				}
				opt_time.push({value: hour+":"+min, text: hour+":"+min});
			}
		}
	} else if(select == "30m") {
		// 30분 간격
		for (var i = 0; i < 24; i++) {
        	for (var j = 0; j < 2; j++) {
				var hour = "";
				var min = "";
				
				if(i<10) {
					hour="0"+i;
				} else {
					hour=i;
				}
				if(j==0) {
					min="00";
				} else {
					min = (j*30);
				}
				opt_time.push({value: hour+":"+min, text: hour+":"+min});
			}
		}
	} else {	
		// 1시간 간격
		for (var i = 0; i < 24; i++) {
	    	var hour = "";
	    	var min = "00";
	    	
	    	if(i<10) {
	    		hour="0"+i;
	    	} else {
	    		hour=i;
	    	}
	    	opt_time.push({value: hour+":"+min, text: hour+":"+min});
		}
	}

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

	axboot.ajax({
		type:"GET",
		url:"/api/statLstMng/historytimeget",
		cache : false,
		data:{comSelect:75, codeSelect: select + "_75"},
		callback:function(res)
		{
			var com_stime = "";
			var com_etime = "";

			if(res.length != 0) {
				com_stime = res[0].data1;
				com_etime = res[0].data2;
			} else {
				com_stime = "00:00";
				
				if(select == "5m") {
					com_etime = "23:55"; 
				} else if(select == "15m") {
					com_etime = "23:45"; 
				} else if(select == "30m") {
					com_etime = "23:30"; 
				} else {
					com_etime = "23:00"; 
				} 
			}
			
			$("[data-ax5select='startTime']").ax5select("setValue",com_stime);
			$("[data-ax5select='endTime']").ax5select("setValue",com_etime);
		}
	});
} // time_set() 종료

// searchView 
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        
        this.sDate = $("#startDate");
        this.eDate = $("#endDate");
        this.interval = $("#interval"); 
        this.sTime = $("#startTime");
        this.eTime = $("#endTime");
        this.compCd = $("#comSel");
        this.did = $("#didSel");
        
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
                        months: [
                        	'01월', '02월', '03월', '04월', '05월', '06월', 
                        	'07월', '08월', '09월', '10월', '11월', '12월'
                    	],
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
                            .close();
                    }
                },
                ok:{label:"Close", theme:"default"}
            }
        });
		
		// interval(간격)
		var inter = [];
		inter.push({value: "5m", text: "5분별" });
		inter.push({value: "15m", text: "15분별" });
		inter.push({value: "1h", text: "1시간별" });
		inter.push({value: "day", text: "일별" });
		inter.push({value: "month", text: "월별" });
		$("[data-ax5select='interval']").ax5select({
	        theme: 'primary',
	        options: inter,
	        onChange: function () {
	        	// 간격 select가 변경된 경우!
	        	select = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
	        	
	        	if(select == "day" || select == "month")
	        	{
	        		$("#ti_div").hide();
	        	}
	        	else
	        	{
	        		$("#ti_div").show();
	        	}
	        	fnObj.gridView01.initView();
	        	
	        	date_set();
	        	time_set();
	        }
        });
		$("[data-ax5select='interval']").ax5select("setValue","day");
		$("#ti_div").hide();
	    
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
		    		}
		    	});
		    	
//    		    resultSet.push({value: "RETAIL", text: "GS리테일"});
		    }
	    });
		
		// 대표번호 설정
    	$("[data-ax5select='didSel']").ax5select({
	        theme: 'primary',
	        onChange: function () {
	        	fnObj.gridView01.initView();
	        	
	        	date_set();
	        	time_set();
	        }
        });
    	
		axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrDnis/DnisSearchY",
            data: "",
            callback: function (res) {
        		var didlist = [{value: "ALL", text: "전체"}];
            	res.forEach(function (r) {
            		var value = r.dnis;
            		didlist.push({value: value, text: value});
            	});
            	$("[data-ax5select='didSel']").ax5select("setOptions", didlist);
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });
		
		date_set();
		time_set();
    },
    getData: function () {
    	var d = this.did;
    	var cc = this.compCd;
        return {
        	comp_cd: function() {
        		console.log(cc.ax5select("getValue")[0].value);
        		if(cc.ax5select("getValue").length != 0) {
        			return cc.ax5select("getValue")[0].value;
        		} else {
        			return "";
        		}
        	},
        	did : function() {
        		if(d.ax5select("getValue").length != 0) {
        			return d.ax5select("getValue")[0].value;
        		} else {
        			return "";
        		}
        	},
        	startdate : this.sDate.val(),
        	enddate : this.eDate.val(),
        	interval: this.interval.ax5select("getValue")[0].value,
        	starttime : this.sTime.ax5select("getValue")[0].value.replaceAll(':',''),
        	endtime : this.eTime.ax5select("getValue")[0].value.replaceAll(':','')
        }
    }
}); // searchView 종료


/**
 * gridView01 :: 조회내역
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;var select = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
        var columns = [];

        var weeks = ["일", "월", "화", "수", "목", "금", "토"];
        
        var row_date = {key: "ROW_DATE", label: "날짜", width: 150, align: "center", sortable: true};
        var weekday = {key: "weekday", label: "요일", width: 80, align: "center", sortable: true,
	        	formatter: function() {
	        		var date = new Date(this.item.ROW_DATE);
	        		return weeks[date.getDay()];
	        	}
	        };
        var starttime = {key: "STARTTIME", label: "시간", width: 150, align: "center", sortable: true};
        var comp_cd = {key: "COMP_CD", label: "센터", width: 150, align: "center", sortable: true,
        		formatter: function() {
        			switch(this.item.COMP_CD) {
        			case "RETAIL": return "GS리테일";
        			}
        		}
        	};
        var did = {key: "DID", label: "대표번호", width: 200, align: "center", sortable: true};
        var service = {key: "SERVICE", label: "서비스명", width: 200, align: "center", sortable: true};
        var n_incall = {key: "N_INCALL", label: "인입건수", width: 150, align: "center", sortable: true};
        var n_agentreq = {key: "N_AGENTREQ", label: "상담사요청건수", width: 150, align: "center", sortable: true};
        
        if(select == "day") {
        	columns = [row_date, weekday, comp_cd, did, service, n_incall, n_agentreq];
        } else if(select == "month") {
        	columns = [row_date, comp_cd, did, service, n_incall, n_agentreq];
        } else {
        	columns = [row_date, weekday, starttime, comp_cd, did, service, n_incall, n_agentreq];
        }

        this.target = axboot.gridBuilder({
            showRowSelector: false,
            frozenColumnIndex: 0,
            multipleSelect: true,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: columns,
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                }
            }
        });
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	// 버튼 있으면 여기에 추가!
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
    	console.log(this);
    	this.target.exportExcel("IVR서비스통계_" + dateString + ".xls");
    }
});
