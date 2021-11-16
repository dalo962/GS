var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var interval = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
    	var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var starttime = "";
        var endtime = "";
        
        if(interval != "day" && interval != "month" && interval != "year")
        {
	        starttime = $("[data-ax5select='startTime']").ax5select("getValue");
	        endtime = $("[data-ax5select='endTime']").ax5select("getValue");
	        
	        starttime = starttime[0].value.substring(0,2)+starttime[0].value.substring(3,5);
	        endtime = endtime[0].value.substring(0,2)+endtime[0].value.substring(3,5);
	        
	        if(starttime > endtime)
	        {
	        	alert("시작시간이 종료시간을 넘을 수 없습니다!");
	        	return;
	        }
        }
        
        if(startDate != "" && startDate != null && endDate != "" && endDate != null)
        {
        	if(interval == "month")
        	{
        		var reqExp = /^\d{4}-\d{2}$/;
        		if(reqExp.test(startDate) == false || reqExp.test(endDate) == false)
                {
                	alert("날짜형식이 올바르지 않습니다.")
                	return;
                }
        	}
        	else if(interval == "year")
        	{
        		var reqExp = /^\d{4}$/;
        		if(reqExp.test(startDate) == false || reqExp.test(endDate) == false)
                {
                	alert("날짜형식이 올바르지 않습니다.")
                	return;
                }
        	}
        	else
        	{
        		var reqExp = /^\d{4}-\d{2}-\d{2}$/;
        		if(reqExp.test(startDate) == false || reqExp.test(endDate) == false)
                {
                	alert("날짜형식이 올바르지 않습니다.")
                	return;
                }
        	} 

        	if(interval != "year")
        	{
	        	if(startDate.substring(5,7) < "01" || startDate.substring(5,7) > "12" || endDate.substring(5,7) < "01" || endDate.substring(5,7) > "12")
	        	{
	        		alert("날짜형식이 올바르지 않습니다.");
	            	return;
	        	}
	        	
	        	if(interval != "month")
	        	{	
		        	if(startDate.substring(8,10) < "01" || startDate.substring(8,10) > "31" || endDate.substring(8,10) < "01" || endDate.substring(8,10) > "31")
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
	        	
	        	if((endDate.substring(5,7) == "04" || endDate.substring(5,7) == "06" || endDate.substring(5,7) == "09" || endDate.substring(5,7) == "11") && endDate.substring(8,10) > 30)
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
        
        startDate = startDate.split('-');
        endDate = endDate.split('-');
        
        var sdt = ""; 
        var edt = "";
        	
        if(interval == "month")
        {
        	sdt = new Date(startDate[0], startDate[1]);
            edt = new Date(endDate[0], endDate[1]);
        }
        else if(interval == "year")
        {
        	sdt = new Date(startDate[0]);
            edt = new Date(endDate[0]);
        }
        else
        {
        	sdt = new Date(startDate[0], startDate[1], startDate[2]);
            edt = new Date(endDate[0], endDate[1], endDate[2]);
        }
        
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
        if(interval == "5m" || interval == "15m" || interval == "30m")
        {
        	if(parseInt(diff/day) > 0)
            {
            	alert("조회기준일이 1일을 넘을 수 없습니다!");
            	return;
            }
        }
        else if(interval == "1h")
        {
        	if(parseInt(diff/day) > 6)
            {
            	alert("조회기준일이 7일을 넘을 수 없습니다!");
            	return;
            }
        }
        else if(interval == "day")
        {
        	if(parseInt(diff/day) > 30)
            {
            	alert("조회기준일이 31일을 넘을 수 없습니다!");
            	return;
            }
        }
    	
    	axboot.ajax({
            type: "GET",
            url: "/gr/api/hist/skWait/skWaitSearch",
            cache : false,
            data: $.extend({}, this.searchView.getData()),
            callback: function (res) {
            	fnObj.gridView01.initView(gridcom);
            	
            	if(res.length > 1)
            	{
            		last = res[res.length - 1];
            		            		
            		row = [];
            		var colnm = fnObj.gridView01.target.colGroup;
            		for(var i=0; i<res.length-1;i++){
            			var tmp = [];
	            		for(var j =0; j < colnm.length;j++){
	            			tmp[colnm[j].key] = res[i][colnm[j].key];
	            		}
	            		row.push(tmp);
            		}              		
            		caller.gridView01.setData(row);
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
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    },
    MODAL_OPEN: function (caller, act, data) {
    	inter = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
    	
        axboot.modal.open({
            modalType: "SKWAIT_FACTOR_MODAL",
            //param: param,
            sendData: function () {
                return {
                    "sendData": "major_factor",
                    "inter" : inter
                };
            },
            callback: function (data) {
            	if(data==1){
            		window.location.reload();
            	}            	
                this.close();
            }
        });
    },
    MODAL_ST_OPEN: function (caller, act, data) {
    	inter = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
    	
        axboot.modal.open({
            modalType: "SKWAIT_FACTOR_MODAL",
            //param: param,
            sendData: function () {
                return {
                    "sendData": "stat_factor",
                    "inter" : inter                    
                };
            },
            callback: function (data) {
            	if(data==1){
            		window.location.reload();
            	}            	
                this.close();
            }
        });
    },

    DATA_SETTING: function (caller, act,data){
    	$('[data-ax5select="interval"]').ax5select("setValue", "day");
    	
    	$('[data-ax5select="comSelect"]').ax5select("setValue", info.comcd);
    	
    	select = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
    	
    	if(select == "5m" || select == "15m" || select == "1h")
    	{
    		$("#cb_sat").attr('disabled', false);
    		$("#cb_hol").attr('disabled', false);
    		$("#cb_hdt").attr('disabled', false);
    		$("#ti_div").show();
    	}
    	else if(select == "day")
    	{
    		$("#cb_sat").attr('disabled', false);
    		$("#cb_hol").attr('disabled', false);
    		$("#cb_hdt").attr('disabled', false);
    		$("#ti_div").hide();
    	}
    	else if(select == "month" || select == "year")
    	{
    		$("#cb_sat").attr('disabled', true);
	    	$("#cb_hol").attr('disabled', true);
	    	$("#cb_hdt").attr('disabled', true);
	    	
	    	$("#cb_sat").attr('checked', false);
	    	$("#cb_hol").attr('checked', false);
	    	$("#cb_hdt").attr('checked', false);
	    	$("#ti_div").hide();
    	}       		
    		
    	axboot.ajax({
             type: "GET", 
             url: "/api/statLstMng/getStatGrid",     
             cache : false,
             data: {stat_gubun:"SKILL", dispname:"skWait"},
             callback: function (res) {
             	var timedel = [];
             	res.forEach(function (n, index){
             		if(select == "5m" || select == "15m" || select == "1h")
             		{
             			if(n.interval == "0" || n.interval == "1" || n.interval == "2") 
                 		{
                 			timedel.push(res[index]);
                 		}	
             		}
             		else if(select == "day")
             		{
             			if(n.interval == "0" || n.interval == "2" || n.interval == "3") 
                 		{
                 			timedel.push(res[index]);
                 		}
             		}
             		else if(select == "month")
             		{
             			if(n.interval == "0" || n.interval == "3") 
                 		{
             				timedel.push(res[index]);
                 		}
             		}
             	});
             	fnObj.gridView01.initView(timedel);
            }
        });    	
    	date_set();
    	time_set();	 
    }
});

var CODE = {};
var rowCenlist = [];
var info = {};
var gridcom = []; 

var row = [];
var last = [];

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    axboot.promise()
    .then(function (ok, fail, data){
    	axboot.ajax({
	    	type: "POST",
		    url: "/api/statLstMng/userAuthLst",
		    cache : false,
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
	    	    	 url: "/api/mng/searchCondition/company",
	    	    	 cache : false,
	    	    	 data: JSON.stringify($.extend({}, info)),
	    	    	 callback: function (res) {
	    	    		/*
	    	    		var resultSet = [];
	    	    		res.list.forEach(function (n) {
	    	    			 resultSet.push({
	    	    				 value: n.id, text: n.name,
	    	    			});
	    	    		});
						*/
	    	    		_this.searchView.skillSearch();
	    	    		ok();
	    	    	 }
		    	});
		    }
        });
    })
    .then(function (ok, fail, data){
    	 axboot.ajax({
             type: "GET", 
             url: "/api/statLstMng/getStatGrid",
             cache : false,
             data: {stat_gubun:"SKILL", dispname:"skWait"},
             callback: function (res) {	                          	
            	rowCenlist = res;                
                ok();
            }
        });
    }).then(function(ok){
    	_this.pageButtonView.initView();
        _this.searchView.initView();
        _this.gridView01.initView(rowCenlist);
        
        ACTIONS.dispatch(ACTIONS.DATA_SETTING);
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
            },
            "fn1": function () {
            	ACTIONS.dispatch(ACTIONS.MODAL_OPEN);
            },
            "fn2": function () {
            	ACTIONS.dispatch(ACTIONS.MODAL_ST_OPEN);
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
    var dd = (date.getDate() - 1).toString();
    if(dd == "0" || dd == "00")
    {    	
    	MM = MM - 1;
    	var len = MM.toString().length;
    	if(len == 1) MM = "0" + MM;
    	if(MM == "0" || MM == "00")
    	{
    		yyyy = yyyy - 1;
    		MM = "12";
    		dd = "31";
    	}
    	else if(MM == "01" || MM == "03" || MM == "05" || MM == "07" || MM == "08" || MM == "10" || MM == "12")
    	{
    		dd = "31";
    	}
    	else if(MM == "02")
    	{
    		if((yyyy%4 == 0 && yyyy%100 != 0) || yyyy%400 == 0) // 윤달계산
    		{
    			dd = "29";
    		}
    		else
    		{
    			dd = "28";
    		}    		
    	}
    	else if(MM == "04" || MM == "06" || MM == "09" || MM == "11")
    	{
    		dd = "30";
    	}
    }
    else
    {
    	if(dd.length == 1) dd = "0"+dd;
    }
    //$("#startDate").val(yyyy+"-"+MM+"-"+dd);
    //$("#endDate").val(yyyy+"-"+MM+"-"+dd);
    //$("#startDate").val("");
    //$("#endDate").val("");
    if($("[data-ax5select='interval']").ax5select("getValue")[0].value == 'month')
    {
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
                        months: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
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
    else if($("[data-ax5select='interval']").ax5select("getValue")[0].value == 'year')
    {
    	if($("#startDate").val().length != 4 || $("#endDate").val().length != 4)
    	{
    		$("#startDate").val(yyyy);
        	$("#endDate").val(yyyy); 
    	}	

    	$('[data-ax5picker="date"]').ax5picker({
            direction: "auto", 
            content: {
                type: 'date',
                config: {
                	selectMode: "year", 
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
                        marker[ax5.util.date(new Date(), {'return': 'yyyy', 'add': {d: 0}})] = true;
 
                        return marker;
                    })()
                }
            },            
            btns: {
                today: {
                    label: "Today", onClick: function () {
                    	var date = new Date();
                        var yyyy = date.getFullYear().toString();
	                        this.self
	                            //.setContentValue(this.item.id, 0, ax5.util.date(yyyy, {"return": "yyyy"}))
	                            //.setContentValue(this.item.id, 1, ax5.util.date(yyyy, {"return": "yyyy"}))
	                            .close()
                        ;
		                $("#startDate").val(yyyy);
			            $("#endDate").val(yyyy); 
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
    }
}

$("#startDate").on('focusout', function(){
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


function time_set(){
	var select = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
	var opt_time = [];
	
	if(select == "5m")
	{
		for (var i = 0; i < 24; i++) 
		{
        	for (var j = 0; j < 12; j++) 
        	{
				var hour = "";
				var min = "";
				if(i<10) hour="0"+i;
				else hour=i;
				if(j==0) min="00";
				else 
					if(j < 2) min = "0" + (j*5)  
					else min = (j*5);
				opt_time.push({value: hour+":"+min, text: hour+":"+min});
			}
		} 
	}
	else if(select == "15m")
	{
		for (var i = 0; i < 24; i++) 
		{
        	for (var j = 0; j < 4; j++) 
        	{
				var hour = "";
				var min = "";
				if(i<10) hour="0"+i;
				else hour=i;
				if(j==0) min="00";
				else 
					min = (j*15);
				opt_time.push({value: hour+":"+min, text: hour+":"+min});
			}
		}
	}
	else if(select == "30m")
	{
		for (var i = 0; i < 24; i++) 
		{
        	for (var j = 0; j < 2; j++) 
        	{
				var hour = "";
				var min = "";
				if(i<10) hour="0"+i;
				else hour=i;
				if(j==0) min="00";
				else 
					min = (j*30);
				opt_time.push({value: hour+":"+min, text: hour+":"+min});
			}
		}
	}
	else
	{
		for (var i = 0; i < 24; i++) 
		{
	    	var hour = "";
	    	var min = "00";
	    	if(i<10) hour="0"+i;
			else hour=i;
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
		data:{comSelect:info.comcd, codeSelect: select + "_" + info.comcd},
		callback:function(res)
		{
			var com_stime = "";
			var com_etime = "";
			
			if(res.length != 0)
			{
				com_stime = res[0].data1;
				com_etime = res[0].data2;
			}
			else
			{
				com_stime = "00:00";
				
				if(select == "5m") { com_etime = "23:55"; } 
				else if(select == "15m") {com_etime = "23:45"; } 
				else if(select == "30m") { com_etime = "23:30"; } 
				else { com_etime = "23:00"; } 
			}
				
			$("[data-ax5select='startTime']").ax5select("setValue",com_stime);
			$("[data-ax5select='endTime']").ax5select("setValue",com_etime);
		}
	});
}

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
	        	select = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
	        	
	        	if(select == "5m" || select == "15m" || select == "1h")
	        	{
	        		$("#cb_sat").attr('disabled', false);
    	    		$("#cb_hol").attr('disabled', false);
    	    		$("#cb_hdt").attr('disabled', false);
    	    		$("#ti_div").show();
	        	}
	        	else if(select == "day")
	        	{
	        		$("#cb_sat").attr('disabled', false);
    	    		$("#cb_hol").attr('disabled', false);
    	    		$("#cb_hdt").attr('disabled', false);
    	    		$("#ti_div").hide();
	        	}
	        	else if(select == "month" || select == "year")
	        	{
	        		$("#cb_sat").attr('disabled', true);
	    	    	$("#cb_hol").attr('disabled', true);
	    	    	$("#cb_hdt").attr('disabled', true);
	    	    	
	    	    	$("#cb_sat").attr('checked', false);
	    	    	$("#cb_hol").attr('checked', false);
	    	    	$("#cb_hdt").attr('checked', false);
	    	    	$("#ti_div").hide();
	        	}       		
	        		
	        	axboot.ajax({
	                 type: "GET", 
	                 url: "/api/statLstMng/getStatGrid",     
	                 cache : false,
	                 data: {stat_gubun:"SKILL", dispname:"skWait"},
	                 callback: function (res) {
	                 	var timedel = [];
	                 	res.forEach(function (n, index){
	                 		if(select == "5m" || select == "15m" || select == "1h")
	                 		{
	                 			if(n.interval == "0" || n.interval == "1" || n.interval == "2") 
		                 		{
		                 			timedel.push(res[index]);
		                 		}	
	                 		}
	                 		else if(select == "day")
	                 		{
	                 			if(n.interval == "0" || n.interval == "2" || n.interval == "3") 
		                 		{
		                 			timedel.push(res[index]);
		                 		}
	                 		}
	                 		else if(select == "month")
	                 		{
	                 			if(n.interval == "0" || n.interval == "3") 
		                 		{
	                 				timedel.push(res[index]);
		                 		}
	                 		}
	                 	});
	                 	fnObj.gridView01.initView(timedel);
	                }
	            });	        
	        	
	        	date_set();
	        	time_set();
	        }		
    });
		date_set();
		time_set();
    },
    getData: function () {
    	this.startTime = $("[data-ax5select='startTime']").ax5select("getValue");
    	this.endTime = $("[data-ax5select='endTime']").ax5select("getValue");
    	var chk = $(":input:radio[name=checksk]:checked").val();
    	if(chk == "undefined" || chk == "")
    	{
    		chk = null;
    	}  
    	
    	var list = $('[data-ax5select="skSelect"]').ax5select("getValue");
    	var aglist = "";
    	if(list != "")
    	{	    	
	    	for(var i=0; i < list.length; i++)
	    	{
	    		aglist += list[i].value + ";";
	    	}
	    	aglist = aglist.substring(0,aglist.length-1);
    	}
    	
        return {
        	skSelect: aglist,     
        	interval: $("[data-ax5select='interval']").ax5select("getValue")[0].value,    
        	startDate: this.startDate.val(),
        	endDate: this.endDate.val(),
        	startTime: this.startTime[0].value.substring(0,2)+this.startTime[0].value.substring(3,5),
        	endTime: this.endTime[0].value.substring(0,2)+this.endTime[0].value.substring(3,5),
        	hdt: function(){
        		var hol = $("#cb_hdt").is(":checked");
        		if(hol == true) return 'Y';
        		else return 'N';   			 
        	},
        	hol: function(){
        		var hol = $("#cb_hol").is(":checked");
        		if(hol == true) return 'Y';
        		else return 'N';   			 
        	},
        	sat: function(){
        		var sat = $("#cb_sat").is(":checked");
        		if(sat == true) return 'Y';
        		else return 'N';
        	},
        	check: chk
        }
    },
    skillSearch: function(){
    	//console.log("compId : " + $("[data-ax5select='comSelect']").ax5select("getValue")[0].value);
    	//console.log("chnId : " + $("[data-ax5select='chanSelect']").ax5select("getValue")[0].value);
        var data = {}; 
        //data.compId = $("[data-ax5select='comSelect']").ax5select("getValue")[0].value;
        //data.chnId = $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value;
        data.compId = 2; //리테일
        data.chnId = "";    	
        data.skId = "";
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/skill",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [{value:"", text:"전체", sel:"1"}];
            	//var resultSet = [{value:"", text:"전체", sel:"0"}];
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='skSelect']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        //reset:'<i class=\'fa fa-trash\'><img src="/assets/images/icon_delete.png" width="14" height="12" border="0"><i>',
        	        options: resultSet,
        	        onChange: function()
        	        {
        	        	if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="skSelect"]').ax5select("setValue",[0],true);
        	            	this.item.options[0].sel = "1" ;
        	        		/*
        	        		$('[data-ax5select="skSelect"]').ax5select("setValue",[0],false);
        	            	
        	            	for(var i = 1; i < this.item.options.length; i++)
    	        			{
    	        				$('[data-ax5select="skSelect"]').ax5select("setValue",[this.item.options[i].value],true);
    	        			}        	            	
        	            	this.item.options[0].sel = "0" ;
        	            	*/
        	            	$('[data-ax5select-option-group]').click();
        	        	} 
        	        	else if( this.item.selected.length  == 1 )
        	        	{
        	        		if ( this.item.selected[0].value == "" )
        	        		{
        	        			this.item.options[0].sel = "1" ;
        	        		} 
        	        		else
        	        		{
        	        			if ( this.item.options[0].sel != "0" )
        	        			{
        	        				this.item.options[0].sel = "0" ;
        	        				$('[data-ax5select="skSelect"]').ax5select("setValue",[0],false);
        	        	    	
        	        				$('[data-ax5select-option-group]').click();
        	        			} 
        	        		}
        	        	} 
        	        	else
        	        	{
        	        		if ( this.item.selected[0].value == "" )
        	        		{
        	        			if ( this.item.options[0].sel == "1" )
        	        			{
	        	        			$('[data-ax5select="skSelect"]').ax5select("setValue",[0],false);
	        	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="skSelect"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}       	        	
					}        	        	        	        
                });
                $('[data-ax5select="skSelect"]').ax5select("setValue",[""]);
                /*
                if(resultSet.length == 1)
                {
                	$('[data-ax5select="skSelect"]').ax5select("setValue",[""]);
                }
                else
                {
                	for(var i = 1; i < resultSet.length; i++)
                	{
                		$('[data-ax5select="skSelect"]').ax5select("setValue",resultSet[i].value,true);
                	}
                	$('[data-ax5select="skSelect"]').ax5select("setValue",resultSet[0].value,false);
                }
                */
            }
        });
    }
});

/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
	initView: function (_data) {
		var _this = this;
        var sumM = 0;
        var columns = [];
        var addColumns = {};
        var footSum = [];
        var sumColumns = [];        
        var check = $(":input:radio[name=checksk]:checked").val();
        var lastIndex = _data.length -1;
        gridcom = _data;
        
        addColumns.columns = [];
        addColumns.label = "-";
        	
        var interval = $("[data-ax5select='interval']").ax5select("getValue")[0].value;
        
        _data.forEach(function(n, index){
        	if(n.formatter == "major") 
        	{
        		sumM++;
        		columns.push({
	        			key: n.key,
	        			label: n.label,
	        			width: 120,
	        			align: "center",
	        			formatter: n.formatter,
	        			sortable : n.sortable
	        	});
        	}
        	else
        	{
        		if(n.sgroup != "-")
            	{        			
        			if(addColumns.columns.length == 0)
        			{
        				addColumns.key = undefined;
            			addColumns.label = n.sgroup;
            			addColumns.columns = [];
        			}
        			else if(addColumns.label != undefined)
        			{
        				if(addColumns.label != n.sgroup)
            			{
            				columns.push(addColumns);
            				addColumns = {};
            				addColumns.key = undefined;
                			addColumns.label = n.sgroup;
                			addColumns.columns = [];
            			}
        			}
        			
        			addColumns.columns.push({
                        key: n.key,
                        label: n.label,
                        width: 120,
                        align: "center",
                        formatter: n.formatter,
            			sortable : n.sortable
                    });         
            	}
        		else
        		{
        			if(addColumns.label != n.sgroup)
	        		{
	        			columns.push(addColumns);
	        			addColumns = {};
	        			addColumns.key = undefined;
	            		addColumns.label = n.sgroup;
	            		addColumns.columns = [];
	        		}         			
        			columns.push({
            			key: n.key,
            			label: n.label,
            			width: 120,
            			align: "center",
            			formatter: n.formatter,
            			sortable : n.sortable
            		});
        		}		
        	}
        	if(lastIndex == index)
        	{
        		if(addColumns.columns.length != 0)
        		{
        			columns.push(addColumns);
        		}
        	}        	
        });         
        
        if(sumM == 0){}
        else
        {
        	sumColumns.push({label: "합계", colspan:sumM, align: "center"});        
        } 
        
        _data.forEach(function(n, index){
        	if(n.formatter == "major"){}
        	else
        	{
	    		sumColumns.push({
	        		key: n.key,
	        		collector: function(){
	        			return last[n.key]
	        		},
	        		align: "center",
	        		formatter: n.formatter
	        	});
        	}
        });

        footSum.push(sumColumns);
        this.target = axboot.gridBuilder({
            showRowSelector: false,
            frozenColumnIndex: sumM,
            target: $('[data-ax5grid="grid-view-01"]'),
            multiSort: true,
            columns: columns,
            footSum: footSum,
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                },       
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.skill;
            });
        } else {
            list = _list;
        }
        return list;
    },
    exportExcel: function () {
    	var date = new Date();
    	var dateString = "";
    	var sdt = $("#startDate").val();
        var edt = $("#endDate").val(); 
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
    	this.target.exportExcel("스킬 대기 분포_" +sdt+"~"+edt+ ".xls");
    }
});