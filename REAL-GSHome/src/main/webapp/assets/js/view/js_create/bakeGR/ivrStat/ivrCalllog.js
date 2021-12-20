/**
 * IVR 콜로그
 */

var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) { 
    	
    	var sDate = $("#startDate").val();
        var eDate = $("#endDate").val();

        var aniText = $("#aniText").val();
        
        var starttime = "";
        var endtime = "";
	     
        if(starttime > endtime)
        {
        	alert("시작시간이 종료시간을 넘을 수 없습니다!");
        	return;
        }
        
        // 날짜 형식관련
        if(sDate != "" && sDate != null && eDate != "" && eDate != null)
        {
        	
        		//  ( yyyy-mm-dd )
	        	var reqExp = /^\d{4}-\d{2}-\d{2}$/;
	
	            if(reqExp.test(sDate) == false || reqExp.test(eDate) == false)
	            {
	            	alert("날짜형식이 올바르지 않습니다.")
	            	return;
	            }
        	
        	
        	// days가 31일
            if(sDate.substring(5,7) < "01" || sDate.substring(5,7) > "12" || eDate.substring(5,7) < "01" || eDate.substring(5,7) > "12")
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
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
        
       
    	sdt = new Date(sDate[0], sDate[1], sDate[2]);
        edt = new Date(eDate[0], eDate[1], eDate[2]);
        
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
    	if(parseInt(diff/day) > 2)
    	{
    		alert("조회기준일이 3일을 넘을 수 없습니다!");
    		return;
    	}
        
        // 구분자 관련
        if(aniText.indexOf("'") != -1 || aniText.indexOf("\"") != -1 || aniText.indexOf("(") != -1 || aniText.indexOf(")") != -1 || aniText.indexOf("--") != -1 || aniText.indexOf("#") != -1 || aniText.indexOf("=") != -1 || aniText.indexOf(",") != -1)
        {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        }
    	
		// PAGE_SEARCH :: search api 호출
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrCalllog/calllogSearch",
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
    if(MM.length == 1) {
    	MM = "0" + MM;
    }
    var dd = date.getDate().toString();
    if(dd.length == 1) {
    	dd = "0" + dd;
    }
    
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
                    if (MM.length == 1) {
                    	MM = "0"+MM;
                    }
                    var dd = date.getDate().toString();
                    if (dd.length == 1) {
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
function date_change() {
	return;
}
$("#startDate").on('focusout', function() {
	var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) {
    	MM = "0" + MM;
    }
    var dd = (date.getDate()).toString();
    if(dd.length == 1) {
    	dd = "0"+dd;
    }
    
	var startDate = $("#startDate").val();
	
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
	
	if($("#startDate").val() > $("#endDate").val())
	{
		$("#endDate").val($("#startDate").val());
	} 
	
	startDate = startDate.replace(/-/gi,'');
	
	startDate = startDate.substring(0,4) + '-' + startDate.substring(4,6) + '-' + startDate.substring(6,8);
	

	if(startDate.substring(5,7) < "01" || startDate.substring(5,7) > "12")
	{
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}
	
	
	if(startDate.substring(8,10) < "01" || startDate.substring(8,10) > "31")
	{
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}        	
	
	if((startDate.substring(5,7) == "04" || startDate.substring(5,7) == "06" || startDate.substring(5,7) == "09" || startDate.substring(5,7) == "11") && startDate.substring(8,10) > 30)
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
    
	var endDate = $("#endDate").val();
	
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
	
	if($("#startDate").val() > $("#endDate").val())
	{
		$("#startDate").val($("#endDate").val());
	} 
	
	endDate = endDate.replace(/-/gi,'');
	
	endDate = endDate.substring(0,4) + '-' + endDate.substring(4,6) + '-' + endDate.substring(6,8);
	

	if(endDate.substring(5,7) < "01" || endDate.substring(5,7) > "12")
	{
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}
	
	if(endDate.substring(8,10) < "01" || endDate.substring(8,10) > "31")
	{
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}    

	if((endDate.substring(5,7) == "04" || endDate.substring(5,7) == "06" || endDate.substring(5,7) == "09" || endDate.substring(5,7) == "11") && endDate.substring(8,10) > 30)
	{
		alert("날짜형식이 올바르지 않습니다.");
    	return;
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
}); // date_set 종료

function time_set(){

	var opt_time = [];
	for (var i = 0; i < 25; i++) {
    	for (var j = 0; j < 2; j++) {
			var hour = "";
			var min = "";
			
			if(i < 10) {
				hour = "0" + i;
			} else {
				hour = i;
			}
			
			if(j == 0) {
				min = "00";
			} else {
				min = (j * 30);
			}
			
			if("" + hour + min != "2430") {	// 2430은 제외해야하기때문에!			
				opt_time.push({value: hour + ":" + min, text: hour + ":" + min});
			}
		}
	}
	
	// 현재 시간에 맞게 시작 시간과 종료 시간 설정 //
	var date = new Date();
	var shour = (date.getHours()).toString(); 
    var smin = (date.getMinutes()).toString();

    var ehour = (date.getHours()).toString();    
    var emin = (date.getMinutes()).toString();	   
	
    if(smin.length == 1) {
    	smin = "0" + smin;
    }
	if(emin.length == 1) {
		emin = "0" + emin;
	}
	
	if(shour == "24") {
		shour = "0";
	}
	
	if(smin >= "00" && smin < "30") {
		smin = "00";
		emin = "30";
	} else {
		smin = "30";
		ehour = (date.getHours() + 1).toString();   
		if(ehour == "25") {
			ehour = "1";
		}
		emin = "00";
	}
	
	if(shour.length == 1) {
		shour = "0"+shour;
	}
	if(ehour.length == 1) {
		ehour = "0"+ehour;
	}
	
	
	$("[data-ax5select='startTime']").ax5select({
	    theme: 'primary',
	    options: opt_time,
	    onChange: function () {
	    	var stime = $("[data-ax5select='startTime']").ax5select("getValue")[0].value;
	    	var etime = $("[data-ax5select='endTime']").ax5select("getValue")[0].value;
	    	
        	var starttime = stime.substring(0,2)+stime.substring(3,5);
        	var endtime = etime.substring(0,2)+etime.substring(3,5);
        	
        	if(starttime > endtime) {
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
	    	
        	var starttime = stime.substring(0,2) + stime.substring(3,5);
        	var endtime = etime.substring(0,2) + etime.substring(3,5);
        	
        	if(starttime > endtime) {
        		$("[data-ax5select='startTime']").ax5select("setValue",etime); 
        	}
        	
	    }
	});  
	$("[data-ax5select='endTime']").ax5select("setValue",ehour + ":" + emin); 
} // time_set() 종료

// searchView 
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
    	var _this = this;
    	
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        
        this.sDate = $("#startDate");
        this.eDate = $("#endDate");
        this.sTime = $("#startTime");
        this.eTime = $("#endTime");
        this.compCd = $("#comSel");
        this.did = $("#didSel");
        this.ani = $("#aniText");
        
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

    	var sti = this.sTime.ax5select("getValue")[0].value.replaceAll(':','');
    	var eti = this.eTime.ax5select("getValue")[0].value.replaceAll(':','');
    	
    	if(sti == "2400") {
    		sti = "2359";
    	}
    	if(eti == "2400") {
    		eti = "2359";
    	}
    	
        return {
        	comp_cd: function() {
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
        	ani : this.ani.val(),
        	startdate : this.sDate.val().replaceAll('-',''),
        	enddate : this.eDate.val().replaceAll('-',''),
        	starttime : sti+"00",
        	endtime : eti+"59"
        }
    }
}); // searchView 종료


/**
 * gridView01 :: 조회내역
 */
var weeks = ["일", "월", "화", "수", "목", "금", "토"];
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
            showRowSelector: false,
            frozenColumnIndex: 0,
            multipleSelect: true,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
            	{key: "END_DATE", label: "날짜", width: 100, align: "center", sortable: true,
                	formatter: function() {
                		var dt = "";
                		if(this.item.END_DATE != null)
                		{
                			dt = this.item.END_DATE.substr(0,4) + "-" + this.item.END_DATE.substr(4,2) + "-" + this.item.END_DATE.substr(6,2);
                		}
                		return dt;
                	}
            	},
            	{key: "weekday", label: "요일", width: 80, align: "center", sortable: true,
                	formatter: function() {
                		var date = new Date(this.item.END_DATE.substr(0,4) + "-" + this.item.END_DATE.substr(4,2) + "-" + this.item.END_DATE.substr(6,2));
                		return weeks[date.getDay()];
                	}
                },
            	{key: "IN_TIME", label: "인입시간", width: 150, align: "center", sortable: true,
                	formatter: function() {
                		if(this.item.IN_TIME != null)
                		{
                    		var dt = this.item.IN_TIME.split(' ')[0];
                    		var tm = this.item.IN_TIME.split(' ')[1];
                    		dt = dt.substr(0,4) + "-" + dt.substr(4,2) + "-" + dt.substr(6,2);
                			tm = tm.substr(0,2) + ":" + tm.substr(2,2) + ":" + tm.substr(4,2);
                		}
                		return dt + " " + tm;
                	}
            	},
            	{key: "END_TIME", label: "종료시간", width: 150, align: "center", sortable: true,
                	formatter: function() {
                		if(this.item.END_TIME != null)
                		{
                    		var dt = this.item.END_TIME.split(' ')[0];
                    		var tm = this.item.END_TIME.split(' ')[1];
                    		dt = dt.substr(0,4) + "-" + dt.substr(4,2) + "-" + dt.substr(6,2);
                			tm = tm.substr(0,2) + ":" + tm.substr(2,2) + ":" + tm.substr(4,2);
                		}
                		return dt + " " + tm;
                	}
            	},
            	{key: "COMP_CD", label: "센터", width: 200, align: "center", sortable: true,
            		formatter: function() {
            			switch(this.item.COMP_CD) {
            			case "RETAIL": return "GS리테일";
            			}
            		}
            	},
            	{key: "DID", label: "대표번호", width: 200, align: "center", sortable: true},
            	{key: "ARSID", label: "ARSID", width: 300, align: "center", sortable: true},
            	{key: "MACHINE_CD", label: "인입장비", width: 150, align: "center", sortable: true},
            	{key: "ANI", label: "고객번호", width: 150, align: "center", sortable: true},
            	{key: "LAST_CODE", label: "마지막메뉴", width: 150, align: "center", sortable: true}
            ],
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
    	this.target.exportExcel("IVR콜로그_" + dateString + ".xls");
    }
});
