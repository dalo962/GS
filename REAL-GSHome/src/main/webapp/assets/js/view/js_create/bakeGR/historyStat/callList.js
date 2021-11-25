var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) { 
    	var callText = $("#callText").val();
    	var agidText = $("#agidText").val();
    	var connidText = $("#connidText").val();
    	var ticketText = $("#ticketText").val();
    	
    	var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();   
       
        var starttime = $("[data-ax5select='startTime']").ax5select("getValue");
        var endtime = $("[data-ax5select='endTime']").ax5select("getValue");
        
        starttime = starttime[0].value.substring(0,2) + starttime[0].value.substring(3,5);
        endtime = endtime[0].value.substring(0,2) + endtime[0].value.substring(3,5);
           
        if(starttime > endtime) {
        	alert("시작시간이 종료시간을 넘을 수 없습니다!");
        	return;
        }
       
        if(startDate != "" && startDate != null && endDate != "" && endDate != null) {
        	var reqExp = /^\d{4}-\d{2}-\d{2}$/;

            if(reqExp.test(startDate) == false || reqExp.test(endDate) == false) {
            	alert("날짜형식이 올바르지 않습니다.");
            	return;
            }
            
            if(startDate.substring(5,7) < "01" || startDate.substring(5,7) > "12" || endDate.substring(5,7) < "01" || endDate.substring(5,7) > "12") {
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if(startDate.substring(8,10) < "01" || startDate.substring(8,10) > "31" || endDate.substring(8,10) < "01" || endDate.substring(8,10) > "31") {
	        	alert("날짜형식이 올바르지 않습니다.");
	           	return;
	        }
        	
        	if((startDate.substring(5,7) == "04" || startDate.substring(5,7) == "06" || startDate.substring(5,7) == "09" || startDate.substring(5,7) == "11") 
        			&& startDate.substring(8,10) > 30) {
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if((endDate.substring(5,7) == "04" || endDate.substring(5,7) == "06" || endDate.substring(5,7) == "09" || endDate.substring(5,7) == "11") 
        			&& endDate.substring(8,10) > 30) {
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if(startDate.substring(5,7) == "02") {
	        	var isleap = (startDate.substring(0,4) % 4 == 0 && (startDate.substring(0,4) % 100 != 0 || startDate.substring(0,4) % 400 == 0));
	        	if(startDate.substring(8,10) > 29 || (startDate.substring(8,10) == 29 && !isleap)) {
	        		alert("날짜형식이 올바르지 않습니다.");
	               	return;
	        	}
	        }
	        	
	        if(endDate.substring(5,7) == "02") {
	        	var isleap = (endDate.substring(0,4) % 4 == 0 && (endDate.substring(0,4) % 100 != 0 || endDate.substring(0,4) % 400 == 0));
	        	if(endDate.substring(8,10) > 29 || (endDate.substring(8,10) == 29 && !isleap)) {
	        		alert("날짜형식이 올바르지 않습니다.");
	               	return;
	        	}
	        } 
        }
        if(startDate > endDate) {
			alert("시작일이 종료일보다 클 수 없습니다.");
			return;
		}   
        if(startDate == "" && endDate == "") {
			alert("기간을 입력해 주시기 바랍니다.");
			return;
		} 
        if(startDate == "" && endDate != "") {
			alert("시작일을 입력해 주시기 바랍니다.");
			return;
		}       
        if(startDate != "" && endDate == "") {
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
        
        if(parseInt(diff / day) > 0) {
        	alert("조회기준일이 1일을 넘을 수 없습니다!");
        	return;
        }

        // 구분자 관련
        if(callText.indexOf("'") != -1 || callText.indexOf("\"") != -1 || callText.indexOf("(") != -1 
        		|| callText.indexOf(")") != -1 || callText.indexOf("--") != -1 || callText.indexOf("#") != -1 
        		|| callText.indexOf("=") != -1 || callText.indexOf(",") != -1) {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        } 
        
        if(connidText.indexOf("'") != -1 || connidText.indexOf("\"") != -1 || connidText.indexOf("(") != -1 
        		|| connidText.indexOf(")") != -1 || connidText.indexOf("--") != -1 || connidText.indexOf("#") != -1 
        		|| connidText.indexOf("=") != -1 || connidText.indexOf(",") != -1) {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        } 
        
        if(agidText.indexOf("'") != -1 || agidText.indexOf("\"") != -1 || agidText.indexOf("(") != -1 
        		|| agidText.indexOf(")") != -1 || agidText.indexOf("--") != -1 || agidText.indexOf("#") != -1 
        		|| agidText.indexOf("=") != -1 || agidText.indexOf(",") != -1) {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        }
        
        if(ticketText.indexOf("'") != -1 || ticketText.indexOf("\"") != -1 || ticketText.indexOf("(") != -1 
        		|| ticketText.indexOf(")") != -1 || ticketText.indexOf("--") != -1 || ticketText.indexOf("#") != -1 
        		|| ticketText.indexOf("=") != -1 || ticketText.indexOf(",") != -1) {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        }

    	axboot.ajax({
            type: "POST",
            cache: false,
            url: "/gr/api/hist/callList/callListSearch",
            data: JSON.stringify(caller.searchView.getData()),
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

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    $("input[type=text]").keypress(function(e){
		if(e.keyCode == 13) {
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
	    	    url: "/api/mng/searchCondition/company",
	    	    cache : false,
	    	    data: JSON.stringify($.extend({}, info)),
	    	    callback: function (res) {
	    		    var resultSet = [];
	                //resultSet = [{value:"", text:"전체"}];

    		        res.list.forEach(function (n) {
    		        	if(n.id != '2') {
    		        		resultSet.push({
    		                	value: n.id, text: n.name,
    		            	});
	    	        	}
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
        
    });
    
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
            }
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
    var dd = date.getDate().toString();
    
    if(MM.length == 1) {
    	MM = "0" + MM;
    }
    if(dd.length == 1) {
    	dd = "0" + dd;
    }
    
   	if($("#startDate").val().length != 10 || $("#endDate").val().length != 10) {
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
                    var dd = date.getDate().toString();
                    
                    if (MM.length == 1) {
                    	MM = "0" + MM;
                    }
                    if (dd.length == 1) {
                    	dd = "0" + dd;
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
    var dd = (date.getDate()).toString();
    
    if(MM.length == 1) {
    	MM = "0" + MM;
    }
    if(dd.length == 1) {
    	dd = "0"+dd;
    }
    
	var startDate = $("#startDate").val();
	var reqExp = /^\d{4}-\d{2}-\d{2}$/;
	
	if(reqExp.test(startDate) == false)  {
		var reqExp = /^\d{4}-\d{4}$/;
		if(reqExp.test(startDate) == true) {
			$("#startDate").val($("#startDate").val().substr(0,4) +"-"+ $("#startDate").val().substr(5,2) +"-"+ $("#startDate").val().substr(7,2));
		} else {
			var reqExp = /^\d{6}-\d{2}$/;
			if(reqExp.test(startDate) == true) {
				$("#startDate").val($("#startDate").val().substr(0,4) +"-"+ $("#startDate").val().substr(4,2) +"-"+ $("#startDate").val().substr(7,2));
			} else {
				var reqExp = /^\d{8}$/;
				if(reqExp.test(startDate) == true) {
					$("#startDate").val($("#startDate").val().substr(0,4) +"-"+ $("#startDate").val().substr(4,2) +"-"+ $("#startDate").val().substr(6,2));
				} else {
					$("#startDate").val(yyyy+"-"+MM+"-"+dd);
				}
			}
		}		
	} 
	
	if($("#startDate").val() > $("#endDate").val()) {
		$("#endDate").val($("#startDate").val());
	} 
	
	startDate = startDate.replace(/-/gi,'');
	
	startDate = startDate.substring(0,4) + '-' + startDate.substring(4,6) + '-' + startDate.substring(6,8);
	

	if(startDate.substring(5,7) < "01" || startDate.substring(5,7) > "12") {
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}
	
	
	if(startDate.substring(8,10) < "01" || startDate.substring(8,10) > "31") {
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}        	
	
	if((startDate.substring(5,7) == "04" || startDate.substring(5,7) == "06" || startDate.substring(5,7) == "09" || startDate.substring(5,7) == "11") 
			&& startDate.substring(8,10) > 30) {
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}
	
	if(startDate.substring(5,7) == "02") {
		var isleap = (startDate.substring(0,4) % 4 == 0 && (startDate.substring(0,4) % 100 != 0 || startDate.substring(0,4) % 400 == 0));
		if(startDate.substring(8,10) > 29 || (startDate.substring(8,10) == 29 && !isleap)) {
			alert("날짜형식이 올바르지 않습니다.");
        	return;
		}
	}
});
$("#endDate").on('focusout', function(){
	var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    var dd = (date.getDate()).toString();
    
    if(MM.length == 1) {
    	MM = "0"+MM;
    }
    if(dd.length == 1){
    	dd = "0"+dd;
    }
    
	var endDate = $("#endDate").val();
	var reqExp = /^\d{4}-\d{2}-\d{2}$/;
	
	if(reqExp.test(endDate) == false) {
		var reqExp = /^\d{4}-\d{4}$/;
		if(reqExp.test(endDate) == true) {
			$("#endDate").val($("#endDate").val().substr(0,4) +"-"+ $("#endDate").val().substr(5,2) +"-"+ $("#endDate").val().substr(7,2));
		} else {
			var reqExp = /^\d{6}-\d{2}$/;
			if(reqExp.test(endDate) == true) {
				$("#endDate").val($("#endDate").val().substr(0,4) +"-"+ $("#endDate").val().substr(4,2) +"-"+ $("#endDate").val().substr(7,2));
			} else {
				var reqExp = /^\d{8}$/;
				if(reqExp.test(endDate) == true) {
					$("#endDate").val($("#endDate").val().substr(0,4) +"-"+ $("#endDate").val().substr(4,2) +"-"+ $("#endDate").val().substr(6,2));
				} else {
					$("#endDate").val(yyyy+"-"+MM+"-"+dd);
				}
			}
		}
    }
	
	if($("#startDate").val() > $("#endDate").val()) {
		$("#startDate").val($("#endDate").val());
	} 
	
	endDate = endDate.replace(/-/gi,'');
	
	endDate = endDate.substring(0,4) + '-' + endDate.substring(4,6) + '-' + endDate.substring(6,8);
	

	if(endDate.substring(5,7) < "01" || endDate.substring(5,7) > "12") {
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}
	
	if(endDate.substring(8,10) < "01" || endDate.substring(8,10) > "31") {
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}    

	if((endDate.substring(5,7) == "04" || endDate.substring(5,7) == "06" || endDate.substring(5,7) == "09" || endDate.substring(5,7) == "11") 
			&& endDate.substring(8,10) > 30) {
		alert("날짜형식이 올바르지 않습니다.");
    	return;
	}
	
	if(endDate.substring(5,7) == "02") {
		var isleap = (endDate.substring(0,4) % 4 == 0 && (endDate.substring(0,4) % 100 != 0 || endDate.substring(0,4) % 400 == 0));
		if(endDate.substring(8,10) > 29 || (endDate.substring(8,10) == 29 && !isleap)) {
			alert("날짜형식이 올바르지 않습니다.");
        	return;
		}
	}
}); // date_set 종료

// searchView 
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


	    // IO Flag
	    $("[data-ax5select='iotype']").ax5select({
	    	theme: 'primary',
	    	onStateChanged: function () {
	    		//
	    	},
	    	options: [{value: "", text: "전체"}, {value: "I", text: "IN"}, {value: "O", text: "OUT"}]
	    });
	    
	    
		date_set();
    },
    getData: function () {
    	this.startTime = $("[data-ax5select='startTime']").ax5select("getValue");
    	this.endTime = $("[data-ax5select='endTime']").ax5select("getValue");
    	    	
    	var sti = this.startTime[0].value.substring(0,2) + this.startTime[0].value.substring(3,5);
    	var eti = this.endTime[0].value.substring(0,2) + this.endTime[0].value.substring(3,5);
    	
    	if(sti == "2400") {
    		sti = "2359";
    	}
    	if(eti == "2400") {
    		eti = "2359";
    	}
    	
        return {
        	comSelect: $("[data-ax5select='comSelect']").ax5select("getValue")[0].value,
        	deptSelect: $('[data-ax5select="deptSelect"]').ax5select("getValue")[0].value == ""
    				? $('[data-ax5select="deptSelect"]').ax5select("getValue")[0].value
	    			: $('[data-ax5select="deptSelect"]').ax5select("getValue")[0].text,
        	teamSelect: $('[data-ax5select="teamSelect"]').ax5select("getValue")[0].value == ""
					? $('[data-ax5select="teamSelect"]').ax5select("getValue")[0].value
	    			: $('[data-ax5select="teamSelect"]').ax5select("getValue")[0].text,
        	callText: $("#callText").val(),
        	agidText: $("#agidText").val(),
        	connidText: $("#connidText").val(),
        	ticketText: $("#ticketText").val(),
        	
        	iotype: $('[data-ax5select="iotype"]').ax5select("getValue")[0].value,
        	
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
    		        	/*
    		        	if( this.item.selected.length  == 0 ) {
        	            	$('[data-ax5select="deptSelect"]').ax5select("setValue",[0],true);
        	            	this.item.options[0].sel = "1" ;
        	            	$('[data-ax5select-option-group]').click();
        	        	} else if( this.item.selected.length  == 1 ) {
        	        		if ( this.item.selected[0].value == "" ) {
        	        			this.item.options[0].sel = "1" ;
        	        		} else {
        	        			if ( this.item.options[0].sel != "0" ) {
        	        				this.item.options[0].sel = "0" ;
        	        				$('[data-ax5select="deptSelect"]').ax5select("setValue",[0],false);
        	        	    	
        	        				$('[data-ax5select-option-group]').click();
        	        			} 
        	        		}
        	        	} else {
        	        		if ( this.item.selected[0].value == "" ) {
        	        			if ( this.item.options[0].sel == "1" ) {
	        	        			$('[data-ax5select="deptSelect"]').ax5select("setValue",[0],false);
	        	        			this.item.options[0].sel = "0" ;
        	        			} else {
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++) {
            	        				$('[data-ax5select="deptSelect"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}*/ 
    		        },     	       
                });
                $('[data-ax5select="deptSelect"]').ax5select("setValue",[""]);
                
                fnObj.searchView.teamSearch();
            }
        });
    },
    teamSearch: function(){
        var data = {}; 
        data.grpcd = info.grpcd;
        data.teamcd = info.teamcd;
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
});  // searchView 종료


/**
 * gridView01 :: 조회내역
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;
        var columns = [
        	{key: "EMPLOYEEID", label: "상담사ID", width: 100, align: "center", sortable: true},
        	{key: "DEPT_NAME", label: "그룹", width: 100, align: "center", sortable: true},
        	{key: "TEAM_NAME", label: "팀", width: 100, align: "center", sortable: true},
        	{key: "AGENT_NAME", label: "상담사명", width: 100, align: "center", sortable: true},
        	{key: "STIMETS", label: "상담일시", width: 200, align: "center", sortable: true},
        	{key: "TTALK", label: "통화시간", width: 80, align: "center", sortable: true, formatter: "hour"},
        	{key: "IOTYPE", label: "IN/OUT", width: 80, align: "center", sortable: true},
        	{key: "IBANI", label: "IB전화번호", width: 120, align: "center", sortable: true},
        	{key: "OBANI", label: "OB전화번호", width: 120, align: "center", sortable: true},
        	{key: "EXTENSION", label: "내선번호", width: 80, align: "center", sortable: true},
        	{key: "TICKET_NUM", label: "티켓번호", width: 150, align: "center", sortable: true},
        	{key: "CONNID", label: "CONNID", width: 150, align: "center", sortable: true},
        	{key: "record", label: "녹취", width: 100, align: "center",
        		formatter: function () {
        			// 청취 시 필요한 값 //
        			var conn_id = this.item.CONNID;
        			var extension = this.item.EXTENSION;
        			var ani = this.item.IOTYPE == "IN"
        				? this.item.IBANI
						: this.item.OBANI;
        			
        			// 버튼 옵션 ( class, disable ) //
        			var btn_option = "class='btn btn-default btn-xs'";
        			if(conn_id == '' || conn_id == null) {
        				btn_option += " disabled='disabled'";
        			}
        			
        			return "<button type='button' " + btn_option + " onclick=\""
        				+ "clickPlay('" + conn_id + "')\";>" 
        				+ "<i class='cqc-controller-play'>"
        				+ "</button>";
        		}
    		},
        ];
        
        this.target = axboot.gridBuilder({
        	showRowSelector: true,
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
        	"play": function () {
                console.log("녹취  play 버튼 클릭");
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
    exportExcel: function () {
    	var date = new Date();
    	var dateString = "";
    	dateString += date.getFullYear();
    	
    	if(date.getMonth() < 10) {
    		dateString += "0" + (date.getMonth() + 1);
    	} else {
    		dateString += (date.getMonth() + 1);
    	}
    	if(date.getDate() < 10) {
    		dateString += "0" + date.getDate();
    	} else {
    		dateString += date.getDate();
    	}  	
    	this.target.exportExcel("CallList_" + dateString + ".xls");
    }
});

// 녹취 플레이 버튼 클릭 시 connid를 받아 녹취 청취 화면을 open
// TODO 녹취 url 수정 필요
function clickPlay (connid) {
	console.log(connid);
	var url = "https://devrecm.gsts.kr/recseePlayer/?SEQNO=" + connid;
	var name = "recPopup";
	var specs = "width=500,height=200,menubar=no,status=no";
	var recPopup = window.open(url, name, specs);
}
