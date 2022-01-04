var fnObj = {};

var dcode = [];
var wcode = [];
var wtcode = [];

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var selText = $("#selText").val();
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
        
        startDate = startDate.split('-');
        endDate = endDate.split('-');
        
        var sdt = new Date(startDate[0], startDate[1], startDate[2]);
        var edt = new Date(endDate[0], endDate[1], endDate[2]);
                
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
        /*if(parseInt(diff/day) > 32)
        {
        	alert("조회기준일이 31일을 넘을 수 없습니다!");
        	return;
        }*/
        
        if(selText.indexOf("'") != -1 || selText.indexOf("\"") != -1 || selText.indexOf("(") != -1 || selText.indexOf(")") != -1 || selText.indexOf("--") != -1 || selText.indexOf("#") != -1 || selText.indexOf("=") != -1 || selText.indexOf(",") != -1)
        {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        }    
        
    	axboot.ajax({
            type: "GET",
            url: "/gr/api/hist/agInfo/agInfoSearch",
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
    PAGE_SAVE: function (caller, act, data) {
    	var saveList = [].concat(caller.gridView01.getData());
    	
    	var reqExp = /^[0-9]*$/;
    	var join = 0;
    	var leave = 0;
    	var joinlen = 0;
    	var leavelen = 0;
    	saveList.forEach(function (n){
    		if(n.join_date != null && n.join_date != "" && n.join_date != undefined)
    		{
    			var jo = n.join_date.replace(/-/gi, "");
    			
    			if(reqExp.test(jo) == false)
    			{
    				join = join + 1;
    			}
    			
    			if(jo.length > 8)
    			{
    				joinlen = joinlen + 1;
    			}    			
    		}
    		
    		if(n.leave_date != null && n.leave_date != "" && n.join_date != undefined)
    		{
    			var le = n.leave_date.replace(/-/gi, "");
    			
    			if(reqExp.test(le) == false)
    			{
    				leave = leave + 1;
    			}
    			
    			if(le.length > 8)
    			{
    				leavelen = leavelen + 1;
    			}
    		}
    	});
    	
    	if(join > 0)
    	{
    		alert("입사날짜는 숫자만 입력하시기 바랍니다.");
    		return;
    	}
    	if(joinlen > 0)
    	{
    		alert("입사날짜는 숫자 8자리로 입력하시기 바랍니다.");
    		return;
    	}
    	if(leave > 0)
    	{
    		alert("퇴사날짜는 숫자만 입력하시기 바랍니다.");
    		return;
    	}
    	if(leavelen > 0)
    	{
    		alert("퇴사날짜는 숫자 8자리로 입력하시기 바랍니다.");
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
		            url: "/gr/api/hist/agInfo/agInfoUpdate",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	axToast.push("저장 되었습니다.");
		            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            	
		            	 fnObj.searchView.initView();
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
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    },
    EXCEL_DOWNLOAD: function (caller, act, data) {
    	window.open('/assets/js/common/agent_template.xlsx');
    },
});

var CODE = {};
var idlst = [];
var info = {};
var gridcom = [];

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
    
    $("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});
    
    axboot.promise()
    .then(function (ok, fail, data){
    	axboot.ajax({
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
		    	        $('[data-ax5select="comSelect"]').ax5select("setValue", info.comcd);
		    	        _this.searchView.partSearch();
		    	        _this.searchView.skillSearch();
	    	    	    	
				    	// 직책			
						axboot.ajax({
							type:"GET",
							url:"/gr/api/hist/agInfo/infoDepCodeSel",
							cache : false,
							data: "",
							callback:function(res)
							{
								dcode.push({value: "", text: "선택"});
								res.forEach(function (n) {
				                	dcode.push({
				                        value: n.name, text: n.name,
				                    });
				                });
							
								// 근무시간
								axboot.ajax({
									type:"GET",
									url:"/gr/api/hist/agInfo/infoWorkTimeCodeSel",
									cache : false,
									data: "",
									callback:function(res)
									{
										wtcode.push({value: "", text: "선택"});
										res.forEach(function (n) {
											wtcode.push({
						                        value: n.name, text: n.name,
						                    });
						                });
									
										// 업무
										axboot.ajax({
											type:"GET",
											url:"/gr/api/hist/agInfo/infoWorkCodeSel",
											cache : false,
											data: "",
											callback:function(res)
											{
												wcode.push({value: "", text: "선택"});
												res.forEach(function (n) {
													wcode.push({
								                        value: n.name, text: n.name,
								                    });
								                });
												
												ok();
											}
										});
									}
								});
							}
						});
		    	    }
		    	});
		    }
	    });
    })
    .then(function (ok, fail, data) {
        _this.pageButtonView.initView();
        _this.searchView.initView();
        _this.gridView01.initView();

        fnObj.initsearch();
    });

};

//처음 조회시에만 태운다
fnObj.initsearch = function(){
	axboot.ajax({
        type: "GET",
        url: "/gr/api/hist/agInfo/agInfoSearch",
        cache : false,
        data: $.extend({}, this.initsearchView.getData()),
        callback: function (res) {
            fnObj.gridView01.setData(res);
        },
        options: {
            onError: function (err) {
                console.log(err);
            }
        }
    });
}

fnObj.initsearchView = axboot.viewExtend(axboot.searchView, {
    getData: function () {    	
        return {
        	comSelect: 75, //개발
        	//comSelect: 260, //운영
        	deptSelect: "",
        	teamSelect: "",
        	selText: "",
        	startDate: "",
        	endDate: "",
        	depSelect: "",
        	skSelect: "",
        	workynSelect: ""
        }
    }
});

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "save": function () {
            	ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
            "sample": function() {
            	ACTIONS.dispatch(ACTIONS.EXCEL_DOWNLOAD);
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
   
    //$("#startDate").val(yyyy+"-"+MM+"-"+dd);
    //$("#endDate").val(yyyy+"-"+MM+"-"+dd);
    $("#startDate").val("");
    $("#endDate").val("");
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
	
	if(startDate == "") return;
	
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
	
	if(endDate == "") return;
	
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
	            clear: {
	                label: "Clear", onClick: function () {
	                        this.self
	                            .setContentValue(this.item.id, 0, "")
	                            .setContentValue(this.item.id, 1, "")
	                            .close()
	                    ;
	                }
	            },
                ok:{label:"Close", theme:"default"}
            }
        });
		
		/*
		var dep = [];
		dep.push({value: "", text: "전체" });
		
		axboot.ajax({
			type:"GET",
			url:"/gr/api/hist/agInfo/agInfoDepSel",
			cache : false,
			data: "",
			callback:function(res)
			{
				res.forEach(function (n) {
                	dep.push({
                        value: n.dep_nm, text: n.dep_nm,
                    });
                });
				
				$("[data-ax5select='depSelect']").ax5select({
			        theme: 'primary',
			        options: dep,
			        onChange: function () {
			        	
			        }
				});
			}
		});
		*/
		
		// 직책
		var dep = [];
		dep.push({value: "", text: "전체" });
		
		axboot.ajax({
			type:"GET",
			url:"/gr/api/hist/agInfo/infoDepCodeSel",
			cache : false,
			data: "",
			callback:function(res)
			{
				res.forEach(function (n) {
                	dep.push({
                        value: n.name, text: n.name,
                    });
                });
				
				$("[data-ax5select='depSelect']").ax5select({
			        theme: 'primary',
			        options: dep,
			        onChange: function () {
			        	
			        }
				});
			}
		});
		
		/*
		var skp = [];
		skp.push({value: "", text: "전체" });
		
		axboot.ajax({
			type:"GET",
			url:"/gr/api/hist/agInfo/skInfoDepSel",
			cache : false,
			data: "",
			callback:function(res)
			{
				res.forEach(function (n) {
					skp.push({
                        value: n.skill_name, text: n.skill_name,
                    });
                });
				
				$("[data-ax5select='skSelect']").ax5select({
			        theme: 'primary',
			        options: skp,
			        onChange: function () {
			        	
			        }
				});
			}
		});
		*/
		var join = [];
		join.push({value: "", text: "전체" });
		join.push({value: "1", text: "재직" });
		join.push({value: "0", text: "퇴사" });
		$("[data-ax5select='workynSelect']").ax5select({
	        theme: 'primary',
	        options: join,
	        onChange: function () {
	        	
	        }
		});
		
		date_set();
    },
    getData: function () {  
    	return {
        	comSelect: $("[data-ax5select='comSelect']").ax5select("getValue")[0].value,
        	deptSelect: $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value,
        	teamSelect: $("[data-ax5select='teamSelect']").ax5select("getValue")[0].value,
        	selText: $("#selText").val(),
        	startDate: this.startDate.val(),
        	endDate: this.endDate.val(),
        	depSelect: $("[data-ax5select='depSelect']").ax5select("getValue")[0].value,
        	skSelect: $("[data-ax5select='skSelect']").ax5select("getValue")[0].text,
        	workynSelect: $("[data-ax5select='workynSelect']").ax5select("getValue")[0].value,
        }
    },
    partSearch: function(){
    	//console.log("compId : " + $("[data-ax5select='comSelect']").ax5select("getValue")[0].value);
        var data = {}; 
        data.grpcd = info.grpcd;
        data.cencd = info.cencd
        data.compId = $("[data-ax5select='comSelect']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/part",
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
                $("[data-ax5select='deptSelect']").ax5select({
        	        theme: 'primary',
    		        onStateChanged: function () {
    		        	fnObj.searchView.teamSearch();
    		        },
        	        options: resultSet,
                });
                $("[data-ax5select='deptSelect']").ax5select("setValue", "");

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
    		        },
        	        options: resultSet,
                });
                $("[data-ax5select='teamSelect']").ax5select("setValue", "");
            }
        });
    },
    skillSearch: function(){
    	//console.log("compId : " + $("[data-ax5select='comSelect']").ax5select("getValue")[0].value);
    	//console.log("chnId : " + $("[data-ax5select='chanSelect']").ax5select("getValue")[0].value);
        var data = {}; 
        //data.compId = $("[data-ax5select='comSelect']").ax5select("getValue")[0].value;
        //data.chnId = $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value;
        data.compId = 75; //개발
        //data.compId = 260; //운영
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
        	        multiple: false,
        	        //reset:'<i class=\'fa fa-trash\'><img src="/assets/images/icon_delete.png" width="14" height="12" border="0"><i>',
        	        options: resultSet,
        	        onChange: function()
        	        {
        	        	      	        	
					}        	        	        	        
                });
                $('[data-ax5select="skSelect"]').ax5select("setValue",[""]);
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
	        	showRowSelector: false,
	            frozenColumnIndex: 0,
	            multipleSelect: false,
	            showLineNumber:true,
	            target: $('[data-ax5grid="grid-view-01"]'),
	            columns: [
	            	{key: "agent_id", label: '<span style="font-weight:bold;color:#FF0000">' + "사번" + '</span>', width: 80, align: "center", sortable: true},
	            	{key: "company_name", label: '<span style="font-weight:bold;color:#FF0000">' + "센터" + '</span>', width: 80, align: "center", sortable: true},
	            	{key: "dept_name", label: '<span style="font-weight:bold;color:#FF0000;">' + "브랜드"+ '</span>', width: 80, align: "center", sortable: true},
	            	{key: "team_name", label: '<span style="font-weight:bold;color:#FF0000;">' + "팀" + '</span>', width: 80, align: "center", sortable: true},
	            	{key: "dep_nm", label: "직책", width: 80, align: "center", sortable: true, 
	            		editor:{
	            			type: "select",
	            			config: {
	            				columnKeys: {
	            					optionValue: "value", optionText: "text"
	            				},
	            				options: dcode
	            			}
	            		}, formatter: function() {
	            			if(this.item.dep_nm != undefined  && this.item.dep_nm != "" && this.item.dep_nm != null)
	            			{
	            				return this.item.dep_nm;
	            			}
	            			else
	            			{
	            				return "선택";
	            			}
	            		}
	            	},
	                {key: "agent_name", label: '<span style="font-weight:bold;color:#FF0000;">' + "상담사명" + '</span>', width: 80, align: "center", sortable: true},
	                {key: "join_date", label: "입사일", width: 90, align: "center", sortable: true, 
	                	editor: {
	                	direction: "auto",
	                	type: "date",
	                	disabled : function () {
	                		return false;
	                	},
	                	config: {
	                		selectMode: "day",
	                		control: {
	                			yearTmpl: "%년",
	                			dayTmpl: "%s"
	                			},
	                		lang: {
	                			yearTmpl: "%년",
	                			months: ['01월','02월','03월','04월','05월','06월','07월','08월','09월','10월','11월','12월'],
	                			dayTmpl: "%s"
	                			}	                		
	                		}
	                	}, formatter: function() {
		            		if(this.item.join_date == undefined || this.item.join_date == "" || this.item.join_date == null) {
	                			return '<span style="color: black; font-size:12px;">YYYY-MM-DD</span>';
		            		}
		            		else
		            		{
		            			return this.item.join_date;
		            		}
	            		}
	                },
	                {key: "work_time", label: "근무시간", width: 90, align: "center", sortable: true, 
	            		editor:{
	            			type: "select",
	            			config: {
	            				columnKeys: {
	            					optionValue: "value", optionText: "text"
	            				},
	            				options: wtcode
	            			}
	            		}, formatter: function() {
	            			if(this.item.work_time != undefined  && this.item.work_time != "" && this.item.work_time != null)
	            			{
	            				return this.item.work_time;
	            			}
	            			else
	            			{
	            				return "선택";
	            			}
	            		}
	                },
	                {key: "work", label: "업무", width: 140, align: "center", sortable: true,
	            		editor:{
	            			type: "select",
	            			config: {
	            				columnKeys: {
	            					optionValue: "value", optionText: "text"
	            				},
	            				options: wcode
	            			}
	            		}, formatter: function() {
	            			if(this.item.work != undefined  && this.item.work != "" && this.item.work != null)
	            			{
	            				return this.item.work;
	            			}
	            			else
	            			{
	            				return "선택";
	            			}
	            		}
	                },
	                {key: "skill_name", label: '<span style="font-weight:bold;color:#FF0000;">' + "상담스킬그룹" + '</span>', width: 380, align: "center", sortable: true, multiLine:true},
	                {key: "age", label: "연령대", width: 80, align: "center", sortable: true, editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "", text: "선택"},
                        		{value: "20age", text: "20대"},
                        		{value: "30age", text: "30대"},
                        		{value: "40age", text: "40대"},
                        		{value: "50age", text: "50대"},
                        		{value: "60age", text: "60대"}
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.age) {
                    		case "20age":
	                			return "20대";
	                			break;                    		
	                		case "30age":
	                			return "30대";
	                			break;
	                		case "40age" :
	                			return "40대";
	                			break;
	                		case "50age" :
	                			return "50대";
	                			break;
	                		case "60age" :
	                			return "60대";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
	                {key: "mey_yn", label: "혼인여부", width: 80, align: "center", sortable: true, editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "", text: "선택"},
                        		{value: "0", text: "미혼"},
                        		{value: "1", text: "기혼"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.mey_yn) {
	                		case "0":
	                			return "미혼";
	                			break;
	                		case "1" :
	                			return "기혼";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
	                {key: "gender", label: "성별", width: 80, align: "center", sortable: true, editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "", text: "선택"},
                        		{value: "1", text: "남자"},
                        		{value: "2", text: "여자"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.gender) {
                    		case "1":
	                			return "남자";
	                			break;
	                		case "2" :
	                			return "여자";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
	                {key: "work_yn", label: '<span style="font-weight:bold;color:#FF0000;">' + "재직구분" + '</span>', width: 80, align: "center", sortable: true, 
                    	/*
                    	editor: {	                
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                        		{value: "0", text: "퇴사"},
                        		{value: "1", text: "재직"},
                        	]
                    	}
                    },*/ formatter: function() {
                    	switch(this.item.work_yn) {
	                		case "0":
	                			return "퇴사";
	                			break;
	                		case "1" :
	                			return "재직";
	                			break;
	                		default :
	                			return "";
	                			break;
                    	}
                    }},
	                {key: "leave_date", label: "퇴사일", width: 95, align: "center", sortable: true, 
	                	editor: {
		                	direction: "auto",
		                	type: "date",
		                	disabled : function () {
		                		return false;
		                	},
		                	config: {
		                		selectMode: "day",
		                		control: {
		                			yearTmpl: "%년",
		                			dayTmpl: "%s"
		                		},
		                		lang: {
		                			yearTmpl: "%년",
		                			months: ['01월','02월','03월','04월','05월','06월','07월','08월','09월','10월','11월','12월'],
		                			dayTmpl: "%s"
		                		}             		
		                	}
		                }, formatter: function() {
		            		if(this.item.join_date == undefined || this.item.join_date == "" || this.item.join_date == null) {
	                			return '<span style="color: black; font-size:12px;">YYYY-MM-DD</span>';
		            		}
		            		else
		            		{
		            			return this.item.join_date;
		            		}
	            		},
	                }
	            ],
	            body: {
	            	columnHeight:65,
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
                return this.ipt_date;
            });
        } else {
            list = _list;
        }
        return list;
    },    
    setValue: function (index, key, value) {
    	this.target.setValue(index, key, value);
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
    	this.target.exportExcel("상담사 정보 관리_" +dateString+ ".xls");
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
    //var cellName = ["agent_id", "dep_nm", "join_date", "work_time", "work", "skill_name", "age", "mey_yn", "gender", "work_yn" ,"leave_date"];
    var cellName = ["agent_id", "dep_nm", "join_date", "work_time", "work", "age", "mey_yn", "gender", "leave_date"];
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
        	if(index == 1)
        	{
        		var chk = 0;
        		dcode.forEach(function (n) {
					if(item == n.value)
					{
						item = n.value;
						chk = 1;
					}
                });
        		
        		if(chk == 0)
        		{
        			item = null;
        		}        		
        	}        	
        	else if(index == 2)
        	{
        		if(item != null && item != '') {
        			item = toDateFormat(item);
        		}
        	}        	
        	else if(index == 3)
        	{
        		var chk = 0;
        		wtcode.forEach(function (n) {
					if(item == n.value)
					{
						item = n.value;
						chk = 1;
					}
                });
        		
        		if(chk == 0)
        		{
        			item = null;
        		} 
        	}        	
        	else if(index == 4)
        	{
        		var chk = 0;
        		wcode.forEach(function (n) {
					if(item == n.value)
					{
						item = n.value;
						chk = 1;
					}
                });
        		
        		if(chk == 0)
        		{
        			item = null;
        		} 
        	}        	
        	else if(index == 5)
        	{
        		if(item == "20대") { item = "20age"}
				else if(item == "30대") { item = "30age" }
				else if(item == "40대") { item = "40age" }
				else if(item == "50대") { item = "50age" }
				else if(item == "60대") { item = "60age" }
				else { gitem = null}
        	}
        	else if(index == 6)
        	{
        		if(item == "미혼") { item = "0"}
				else if(item == "기혼") { item = "1" }
				else { item = null}
			}
        	else if(index == 7)
        	{
        		if(item == "남자") { item = "1"}
				else if(item == "여자") { item = "2" }
				else { item = null}
        	}
        	else if(index == 8)
        	{
        		if(item != null && item != '') {
        			item = toDateFormat(item);
        		}
        	}
        	/*
        	else if(index == 9)
        	{
        		if(item == "재직") { item = "1"}
				else if(item == "퇴사") { item = "0" }
				else { item = null}
        	}
        	*/
            obj[ cellName[index] ] = item;
        });
 
        csvCell[index] = obj;
    });
    return csvCell;
}

// 날짜 형식 지정 //
function toDateFormat(date_string) {
	var year, month, day;
	var regex = /^([1-2]\d{3})([0][1-9]|1[0-2])(\d{2})$/g; // 날짜 정규식 (YYYYMMDD) => 숫자 8자리
	var matcher = regex.exec(date_string);
	
	if(matcher) { // matcher에 들어온 값이 있다면 ( YYYYMMDD 형식 텍스트 )
		year = matcher[1];
		month = matcher[2];
		day = matcher[3];
		
		var _d31 = ["01", "03", "05", "07", "08", "10", "12"];
		var _d30 = ["04", "06", "09", "11"];
		
		// day 오류 검사
		if((_d31.find(function(m) { if(m == month) return m == month }) && day > "31")	// 최대 일이 31일 인것들
				|| (_d30.find(function(m) { if(m == month) return m == month }) && day > "30")) {	// 최대 일이 30일 인것들
			return '';
		} else if(month == "02") { // 2월 윤달 계산
			var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
			if(day > 29 || (day == 29 && !isleap)) {
				return '';
			}
		}
	} else { // matcher에 들어온 값이 없는 경우( 엑셀 date 형식 또는 잘못된 형식 )
		var date = new Date(date_string);
		if(isNaN(date.getFullYear()) || date.getFullYear() > 2999) { // 올바르지 않은 날짜 ( 201111년 등 )
			return '';
		} else {
			year = date.getFullYear();
			month = ax5.util.setDigit(date.getMonth() + 1, 2);
			day = ax5.util.setDigit(date.getDate(), 2);
		}
	}
	return year + '-' + month + '-' + day;
}

function handleFile(e) {
    var files = e.target.files;
    var i,f;
    
    var suss = 0;
    var fail = 0;

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
 				if(item == 'Sheet1')
 				{
 					var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[item],{FS:":",RS:"|"} );
	                 					
 					console.log(getCsvToJson(csv));
 					for(var i =0; i < getCsvToJson(csv).length; i++)
 					{
 						if(getCsvToJson(csv)[i].agent_id != null && getCsvToJson(csv)[i].agent_id != "" && getCsvToJson(csv)[i].agent_id != undefined)
 						{
	 						var list = fnObj.gridView01.getData();
	 						
	 						list.forEach(function (n) {
	 							if(getCsvToJson(csv)[i].agent_id == n.agent_id)
	 							{
	 								n.dep_nm = getCsvToJson(csv)[i].dep_nm;
	 								n.join_date = getCsvToJson(csv)[i].join_date;
	 								n.work_time = getCsvToJson(csv)[i].work_time;
	 								n.work = getCsvToJson(csv)[i].work;
	 								//n.skill_name = getCsvToJson(csv)[i].skill_name;
	 								n.age = getCsvToJson(csv)[i].age;
	 								n.mey_yn = getCsvToJson(csv)[i].mey_yn;
	 								n.gender = getCsvToJson(csv)[i].gender;
	 								//n.work_yn = getCsvToJson(csv)[i].work_yn;
	 								n.leave_date = getCsvToJson(csv)[i].leave_date;
	 								
	 								n.__modified__ = true;
	 								
	 								suss++;
	 							}
	 						});
	 						
	 						fnObj.gridView01.setData(list);	 						
 						}
 						else
 						{
 							fail++;
 						}
 						//fnObj.gridView01.addRowExcel(getCsvToJson(csv)[i].ani, getCsvToJson(csv)[i].flag);
 					}
 					
 					fail = getCsvToJson(csv).length - suss;
					alert("[엑셀업로드] " + getCsvToJson(csv).length + "명 중 " + suss + "명 성공 " + fail + "명 실패");
 				}
 			});//end. forEach 			 			
        }; //end onload
 
        if(rABS) reader.readAsArrayBuffer(f); //reader.readAsBinaryString(f);
        else reader.readAsBinaryString(f); //reader.readAsArrayBuffer(f);
 
    }//end. for
}
 
var input_dom_element;
$(function() {
    input_dom_element = document.getElementById('excel');
    if(input_dom_element.addEventListener) {
        input_dom_element.addEventListener('change', handleFile, false);
    }
});