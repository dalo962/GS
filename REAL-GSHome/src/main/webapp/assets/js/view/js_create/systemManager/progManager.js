var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var proSelect = $("[data-ax5select='proSelect']").ax5select("getValue")[0].value;
    	var state = $("[data-ax5select='state']").ax5select("getValue")[0].value;
    	var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        
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
        
        var sdt  = startDate.split('-');
        var edt = endDate.split('-');
        
        sdt = new Date(sdt[0], sdt[1], sdt[2]);
        edt = new Date(edt[0], edt[1], edt[2]);
        
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
        if(parseInt(diff/day) > 365)
        {
        	alert("조회기준일이 1년을 넘을 수 없습니다!");
            return;
        }
        
    	axboot.ajax({
            type: "GET",
            url: "/api/progMng/progMngSearch",
            cache : false,
            data: {startDate:startDate, endDate:endDate, statgubun:proSelect, exp:state},
            callback: function (res) {
                caller.gridView02.setData(res);
                ACTIONS.dispatch(ACTIONS.PEND_SEL);
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });

        return false;
    },
    PEND_SEL: function (caller, act, data) {    	
    	axboot.ajax({
            type: "POST",
            url: "/api/progMng/pensel",
            cache : false,
            data: "",
            callback: function (res) {
                caller.gridView01.setData(res);
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });
		
    },
    PAGE_EXE: function (caller, act, data) {
    	var data2 = caller.gridView02.getData();
    	
    	var saveList = [].concat(caller.gridView02.getData("selected"));
    	
    	if(saveList.length == 0)
    	{
    		alert("목록을 선택하시기 바랍니다."); 
    		return;
    	}
    	
    	var chk = 0;
    	var chkos = 0;
    	var chkag = 0;
    	var chkdg = 0;
    	var chkbcs = 0;
    	saveList.forEach(function (n){
    		if(n.targettable.indexOf("MIG") != -1)
    		{
    			chk++;
    		}
    		if(n.targettable.indexOf("WINK2->WINK1") != -1)
    		{
    			chkos++;
    		}
    		if(n.targettable.indexOf("AX_A_STRUCT") != -1)
    		{
    			chkag++;
    		}
    	});
    	
    	if(chk > 0)
    	{
    		alert("집계테이블 MIG는 선택 예약할 수 없습니다."); 
    		return;
    	}    	
    	
    	if(chkos > 0)
    	{
    		alert("WINK2->WINK1는 선택 예약할 수 없습니다."); 
    		return;
    	}
    	
    	if(chkag > 0)
    	{
    		alert("상담사목록은 선택 예약할 수 없습니다."); 
    		return;
    	}
    	
    	if(data2.length == 0)
    	{
    		alert("결과목록을 조회하시기 바랍니다.");
    		return;
    	}
    	
    	if (!confirm("선택예약 하시겠습니까?")) return; 	
        axboot.ajax({
            type: "POST",
            url: "/api/progMng/proPend",
            cache : false,
            data: JSON.stringify(saveList),
            callback: function (res) {
            	if(res.message == "Fail")
            	{
            		alert("해당 시간대의 예약이 있습니다."); 
            	}
            	else if(res.message == "system")
            	{
            		alert("system 계정으로 예약할 수 없습니다."); 
            	}
            	else
            	{
            		axToast.push("해당 선택/입력 받은 시간의 집계가 예약 되었습니다.");
            		ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            	}             
            },
            options: {
                onError: function (err) {
                    alert("실행 작업에 실패하였습니다");
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                }
            }
        });
    	return;
    },
    PAGE_ADD: function (caller, act, data) {
    	var targettime1 = $("#selText1").val();
    	var targettime2 = $("#selText2").val();
    	var statgubun = $("[data-ax5select='gubun']").ax5select("getValue")[0].value;
    	
    	if(targettime1 == null || targettime1 == "")
    	{
    		alert("실행 첫시간을 입력해 주시기 바랍니다.");
    		return;
    	}
    	
    	if(targettime2 == null || targettime2 == "")
    	{
    		alert("실행 끝시간을 입력해 주시기 바랍니다.");
    		return;
    	}
    	
    	if(targettime1 > targettime2)
    	{
    		alert("실행 첫시간이 끝시간보다 클 수 없습니다.");
    		return;
    	}
    	
    	var reqExp = /^[0-9]*$/;
    	if(reqExp.test(targettime1) == false || reqExp.test(targettime2) == false)
        {
    		alert("시간은 형식에 맞춰 숫자만 입력하세요.");
    		return;
        }
    	else
    	{
    		if(statgubun == "10(5MIN)")
    		{
    			if(targettime1.length != 12 || targettime2.length != 12)
    			{
    				alert("5분 주기는 시간형식이 년월일시간분(12자리)까지만 입력하세요.");
    	    		return;
    			}
    			else 
    			{
    				if(targettime1.substr(10,2) != "00" && targettime1.substr(10,2) != "05" && targettime1.substr(10,2) != "10" && targettime1.substr(10,2) != "15" && targettime1.substr(10,2) != "20" && targettime1.substr(10,2) != "25" && targettime1.substr(10,2) != "30" && targettime1.substr(10,2) != "35" && targettime1.substr(10,2) != "40" && targettime1.substr(10,2) != "45" && targettime1.substr(10,2) != "50" && targettime1.substr(10,2) != "55")
    				{
    					alert("5분 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
    				}
    				else if(targettime2.substr(10,2) != "00" && targettime2.substr(10,2) != "05" && targettime2.substr(10,2) != "10" && targettime2.substr(10,2) != "15" && targettime2.substr(10,2) != "20" && targettime2.substr(10,2) != "25" && targettime2.substr(10,2) != "30" && targettime2.substr(10,2) != "35" && targettime2.substr(10,2) != "40" && targettime2.substr(10,2) != "45" && targettime2.substr(10,2) != "50" && targettime2.substr(10,2) != "55")
    				{
    					alert("5분 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
    				}  
    				else if(targettime1.substr(4,4) != targettime2.substr(4,4))
    				{
    					alert("하루 단위로 입력하시기 바랍니다.");
        	    		return;
    				}
    			}
    		}
    		else if(statgubun == "20(15MIN)")
    		{
    			if(targettime1.length != 12 || targettime2.length != 12)
    			{
    				alert("15분 주기는 시간형식이 년월일시간분(12자리)까지만 입력하세요.");
    	    		return;
    			}
    			else
    			{
    				if(targettime1.substr(10,2) != "00" && targettime1.substr(10,2) != "15" && targettime1.substr(10,2) != "30" && targettime1.substr(10,2) != "45")
    				{
    					alert("15분 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
    				}
    				else if(targettime2.substr(10,2) != "00" && targettime2.substr(10,2) != "15" && targettime2.substr(10,2) != "30" && targettime2.substr(10,2) != "45")
    				{
    					alert("15분 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
    				} 
    				else if(targettime1.substr(4,4) != targettime2.substr(4,4))
    				{
    					alert("하루 단위로 입력하시기 바랍니다.");
        	    		return;
    				}
    			}    			
    		}
    		else if(statgubun == "30(1HOUR)")
    		{
    			if(targettime1.length != 10 || targettime2.length != 10)
    			{
    				alert("1시간 주기는 시간형식이 년월일시간(10자리)까지만 입력하세요.");
    	    		return;
    			}
    			else
    			{
    				if(targettime1.substr(8,2) != "00" && targettime1.substr(8,2) != "01" && targettime1.substr(8,2) != "02" && targettime1.substr(8,2) != "03" && targettime1.substr(8,2) != "04" && targettime1.substr(8,2) != "05" && targettime1.substr(8,2) != "06" && targettime1.substr(8,2) != "07" && targettime1.substr(8,2) != "08" && targettime1.substr(8,2) != "09" && targettime1.substr(8,2) != "10" && targettime1.substr(8,2) != "11" && 
    				   targettime1.substr(8,2) != "12" && targettime1.substr(8,2) != "13" && targettime1.substr(8,2) != "14" && targettime1.substr(8,2) != "15" && targettime1.substr(8,2) != "16" && targettime1.substr(8,2) != "17" && targettime1.substr(8,2) != "18" && targettime1.substr(8,2) != "19" && targettime1.substr(8,2) != "20" && targettime1.substr(8,2) != "21" && targettime1.substr(8,2) != "22" && targettime1.substr(8,2) != "23")
    				{
    					alert("1시간 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
    				}
    				else if(targettime1.substr(8,2) != "00" && targettime1.substr(8,2) != "01" && targettime1.substr(8,2) != "02" && targettime1.substr(8,2) != "03" && targettime1.substr(8,2) != "04" && targettime1.substr(8,2) != "05" && targettime1.substr(8,2) != "06" && targettime1.substr(8,2) != "07" && targettime1.substr(8,2) != "08" && targettime1.substr(8,2) != "09" && targettime1.substr(8,2) != "10" && targettime1.substr(8,2) != "11" && 
    	    				targettime1.substr(8,2) != "12" && targettime1.substr(8,2) != "13" && targettime1.substr(8,2) != "14" && targettime1.substr(8,2) != "15" && targettime1.substr(8,2) != "16" && targettime1.substr(8,2) != "17" && targettime1.substr(8,2) != "18" && targettime1.substr(8,2) != "19" && targettime1.substr(8,2) != "20" && targettime1.substr(8,2) != "21" && targettime1.substr(8,2) != "22" && targettime1.substr(8,2) != "23")
    				{
    					alert("1시간 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
    				} 
    				else if(targettime1.substr(4,4) != targettime2.substr(4,4))
    				{
    					alert("하루 단위로 입력하시기 바랍니다.");
        	    		return;
    				}
    			}
    		}
    		else if(statgubun == "31(1DAY)" || statgubun == "40(1DAY)")
    		{
    			if(targettime1.length != 8 || targettime2.length != 8)
    			{
    				alert("1일 주기는 시간형식이 년월일(8자리)까지만 입력하세요.");
    	    		return;
    			}
    			else 
    			{
    				if(targettime1.substr(6,2) > "31" || targettime1.substr(6,2) <= "00")
        			{
        				alert("1일 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
        			}
    				else if(targettime2.substr(6,2) > "31" || targettime2.substr(6,2) <= "00")
        			{
        				alert("1일 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
        			}
    			}
    		}
    		else if(statgubun == "50(1MONTH)")
    		{
    			if(targettime1.length != 6 || targettime2.length != 6)
    			{
    				alert("1월 주기는 시간형식이 년월(6자리)까지만 입력하세요.");
    	    		return;
    			}
    			else
    			{
    				if(targettime1.substr(4,2) > "12" || targettime1.substr(4,2) <= "00")
        			{
        				alert("1월 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
        			}
    				else if(targettime2.substr(4,2) > "12" || targettime2.substr(4,2) <= "00")
        			{
        				alert("1월 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
        			}
    			}
    		}
    		else if(statgubun == "WINK2->WINK1")
    		{
    			if(targettime1.length != 14 || targettime2.length != 14)
    			{
    				alert("시간형식이 년월일시간분초(14자리)까지만 입력하세요.");
    	    		return;
    			}
    		}
    		else if(statgubun == "AX_A_STRUCT")
    		{
    			if(targettime1.length != 8 || targettime2.length != 8)
    			{
    				alert("1일 주기는 시간형식이 년월일(8자리)까지만 입력하세요.");
    	    		return;
    			}
    			else 
    			{
    				if(targettime1.substr(6,2) > "31" || targettime1.substr(6,2) <= "00")
        			{
        				alert("1일 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
        			}
    				else if(targettime2.substr(6,2) > "31" || targettime2.substr(6,2) <= "00")
        			{
        				alert("1일 주기 입력 시간형식이 맞지 않습니다.");
        	    		return;
        			}
    				else if(targettime1 != targettime2)
    				{
    					alert("시작시간과 종료시간에 같은 값을 입력하여야 합니다.");
        	    		return;
    				}
    			}
    		}
    	}
    	
    	
    	if (!confirm("직업입력예약 하시겠습니까?")) return; 	
        axboot.ajax({
            type: "GET",
            url: "/api/progMng/proPend2",
            cache : false,
            data: {targettime1:targettime1, targettime2:targettime2, statgubun:statgubun},
            callback: function (res) {
            	if(res == "-1")
            	{
            		alert("해당 시간대의 예약이 있습니다."); 
            	}
            	else if(res == "-2")
            	{
            		alert("system 계정으로 예약할 수 없습니다."); 
            	}
            	else
            	{
            		axToast.push("해당 선택/입력 받은 시간의 집계가 예약 되었습니다.");
            		ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            	}             
            },
            options: {
                onError: function (err) {
                    alert("실행 작업에 실패하였습니다");
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                }
            }
        });
    	return;
    },
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView02.exportExcel();
    },   
});

var CODE = {};
var prolist = [];
var pres = [];

var test = {};
test.menu_id = "86";
/*fnObj.refrash = function(){
	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
	
	setTimeout("fnObj.refrash()",5000) // ms
}*/

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    axboot.promise()
    .then(function (ok, fail, data){
    	 axboot.ajax({
             type: "POST", 
             url: "/api/progMng/procLst",       
             cache : false,
             callback: function (res) {	                          	
            	prolist.push({value: "", text: "전체" });
            	pres = res;
                res.forEach(function (n) {
                	prolist.push({text: n.statgubun, value: n.statgubun});  
                });  
                ok();
            }
        });
    })
    .then(function(ok){
    	_this.pageButtonView.initView();
        _this.searchView.initView();
        _this.gridView01.initView();
        _this.gridView02.initView();
        //fnObj.refrash();
        ACTIONS.dispatch(ACTIONS.PEND_SEL);
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
    var dd = date.getDate().toString();
    if(dd.length == 1) dd = "0"+dd;
   
    $("#startDate").val(yyyy+"-"+MM+"-"+dd);
    $("#endDate").val(yyyy+"-"+MM+"-"+dd);
    //$("#startDate").val("");
    //$("#endDate").val("");
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
		$("[data-ax5select='proSelect']").ax5select({
	        theme: 'primary',
	        options: prolist,
        });
		
		var gubun = [];
		gubun.push({text:"전체" ,value:"ALL"});
		gubun.push({text:"작업중" ,value:"ONGOING"});
		gubun.push({text:"성공" ,value:"SUCCESS"});
		gubun.push({text:"실패" ,value:"FAIL"});
		$("[data-ax5select='state']").ax5select({
	        theme: 'primary',
	        options: gubun,
	        onChange: function () {
	        	
	        }
		});
		
		var gubun = [];
		gubun.push({text:"5분" ,value:"10(5MIN)"});
		gubun.push({text:"15분" ,value:"20(15MIN)"});
		gubun.push({text:"1시간" ,value:"30(1HOUR)"});
		gubun.push({text:"1일" ,value:"31(1DAY)"});
		gubun.push({text:"1월" ,value:"50(1MONTH)"});
		//gubun.push({text:"1일상세" ,value:"40(1DAY)"});		
		gubun.push({text:"상담사목록" ,value:"AX_A_STRUCT"});
		gubun.push({text:"WINK2->WINK1" ,value:"WINK2->WINK1"});
		$("[data-ax5select='gubun']").ax5select({
	        theme: 'primary',
	        options: gubun,
	        onChange: function () 
	        {

	        }
        });
		
		date_set();
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
        	showRowSelector: false,
            frozenColumnIndex: 0,
            multipleSelect: true,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [                   
            	{key: "agg_time", label: "집계날짜", width: 200, align: "center", sortable: true},
                {key: "agg_gubun", label: "주기", width: 120, align: "center", sortable: true},
                {key: "created_at", label: "예약날짜",width: 200, align: "center"},
                {key: "created_by", label: "예약자",width: 170, align: "center"},
                {key: "updated_at", label: "완료날짜",width: 200, align: "center"},
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                    }
            }
        });
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"start": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_EXE);
            },
            "addtime": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_ADD);
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.prog_name;
            });
        } else {
            list = _list;
        }
        return list;
    }
});

fnObj.gridView02 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
        	showRowSelector: true,
            frozenColumnIndex: 0,
            multipleSelect: true,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-02"]'),
            columns: [                                     
                {key: "starttime", label: "실행시작날짜", width: 200, align: "center", sortable: true},
                {key: "endtime", label: "실행종료날짜", width: 200, align: "center", sortable: true},
                {key: "targettime", label: "집계날짜", width: 200, align: "center", sortable: true},
                {key: "statgubun", label: "주기", width: 150, align: "center", sortable: true},
                {key: "targettable", label: "집계테이블", width: 200, align: "center", sortable: true},
                {key: "exp", label: "상태", width: 100, align: "center", sortable: true, formatter: function() {
                	switch(this.item.exp) {
            		case "ONGOING":
            			return "작업중";
            			break;
            		case "SUCCESS":
            			return "성공";
            			break;
            		case "Success(":
            			return "성공";
            			break;            			
            		case "FAIL [ER":
            			return "실패";
            			break;
            		default :
            			return "실패";
            			break;
                	}}
                },
                {key: "exp_msg", label: "결과메세지", width: 520, align: "center", sortable: true},                
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
                return this.t_name;
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
    	this.target.exportExcel("실행결과_목록.xls");
    }
});
