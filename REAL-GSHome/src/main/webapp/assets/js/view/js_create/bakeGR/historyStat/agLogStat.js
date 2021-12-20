var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var check = $(":input:radio[name=checkag]:checked").val();
    	var deptSelect = $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value;
    	var list = $('[data-ax5select="agentSelect"]').ax5select("getValue")[0].value;
    	
    	var selText = $("#selText").val();
    	var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();   
                
        /*if(deptSelect == "" && list =="" && (selText == "" || selText == null))
        {
        	alert("부서 전체조회시 상담사조건을 입력/선택하시기 바랍니다.");
        	return;
        }*/
        
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
			alert("날짜를 입력해 주시기 바랍니다.");
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
        
        if(selText != "")
        {
	        if(check == "undefined" || check == "")
	        {
	        	alert("상담사 이름 또는 ID를 선택해 주시기 바랍니다.")
            	return;
	        }
        }
        
        startDate = startDate.split('-');
        endDate = endDate.split('-');
        
        var sdt = new Date(startDate[0], startDate[1], startDate[2]);
        var edt = new Date(endDate[0], endDate[1], endDate[2]);
                
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
        if(parseInt(diff/day) > 32)
        {
        	alert("조회기준일이 31일을 넘을 수 없습니다!");
        	return;
        }
        
        if(selText.indexOf("'") != -1 || selText.indexOf("\"") != -1 || selText.indexOf("(") != -1 || selText.indexOf(")") != -1 || selText.indexOf("--") != -1 || selText.indexOf("#") != -1 || selText.indexOf("=") != -1 || selText.indexOf(",") != -1)
        {
        	alert("구분자는 ;으로 입력해 주시기 바랍니다.");
        	return;
        }    
        
    	axboot.ajax({
            type: "GET",
            url: "/gr/api/hist/agLog/agLogSearch",
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
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    }
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
	    	    }
	    	});
	    }
    })
    .done(function () {
        _this.pageButtonView.initView();
        _this.searchView.initView();
        _this.gridView01.initView();

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

function date_change(){
	fnObj.searchView.agentSearch();
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
	                        fnObj.searchView.agentSearch();
                    }
                },
                ok:{label:"Close", theme:"default"}
            }
        });
		
		date_set();
    },
    getData: function () {    
    	var chk = $(":input:radio[name=checkag]:checked").val();
    	if(chk == "undefined" || chk == "")
    	{
    		chk = null;
    	}   
    	
    	var list = $('[data-ax5select="agentSelect"]').ax5select("getValue");
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
        	comSelect: $("[data-ax5select='comSelect']").ax5select("getValue")[0].value,
        	deptSelect: $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value,
        	teamSelect: $("[data-ax5select='teamSelect']").ax5select("getValue")[0].value,
        	startDate: this.startDate.val(),
        	endDate: this.endDate.val(),
        	check: chk,
        	selText: $("#selText").val(),
        	agentSelect: aglist
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
    		        	fnObj.searchView.agentSearch();
    		        },
        	        options: resultSet,
                });
                $("[data-ax5select='teamSelect']").ax5select("setValue", "");

                fnObj.searchView.agentSearch();
            }
        });
    }, 
    agentSearch: function(){
    	var data = {}; 
    	data.interval = "";
    	data.create_at = $("#startDate").val();
        data.delete_at = $("#endDate").val(); 
        data.compId = $("[data-ax5select='comSelect']").ax5select("getValue")[0].value;
        data.partId = $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value;
        data.teamId = $("[data-ax5select='teamSelect']").ax5select("getValue")[0].value;
        data.agname = "";
        data.agid = "";
        data.agsname = "";
    	//console.log("compId : " + data.compId + " / partId : " + data.partId +" / teamId : " + data.teamId);
    	
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/agent",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [{value:"", text:"전체", sel:"1"}];
                res.list.forEach(function (n) {
                	resultSet.push({
                		value: n.agid, text: n.agname, sel:"0"
                    });
                });
                
                if(data.teamId == "")
                {
                	resultSet = [{value:"", text:"전체", sel:"1"}];
                }
                
                $("[data-ax5select='agentSelect']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        //reset:'<i class=\'fa fa-trash\'><img src="/assets/images/icon_delete.png" width="14" height="12" border="0"><i>',
        	        options: resultSet,
        	        onChange: function()
        	        {
        	        	if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="agentSelect"]').ax5select("setValue",[0],true);
        	            	this.item.options[0].sel = "1" ;
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
        	        				$('[data-ax5select="agentSelect"]').ax5select("setValue",[0],false);
        	        	    	
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
	        	        			$('[data-ax5select="agentSelect"]').ax5select("setValue",[0],false);
	        	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="agentSelect"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}       	        	
					}        	        	        	        
                });
                $('[data-ax5select="agentSelect"]').ax5select("setValue",[""]);
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
	            	{key: "ROW_DATE", label: "날짜", width: 150, align: "center", sortable: true},
	            	{key: "COMPANY_NAME", label: "센터", width: 200, align: "center", sortable: true},
	            	{key: "DEPT_NAME", label: "브랜드", width: 200, align: "center", sortable: true},
	            	{key: "TEAM_NAME", label: "팀", width: 200, align: "center", sortable: true},
	            	{key: "AGENT_NAME", label: "상담사명", width: 150, align: "center", sortable: true},
	                {key: "AGENT_ID", label: "상담사사번", width: 150, align: "center", sortable: true},
	                {key: "LOGINDT", label: "로그인시각", width: 230, align: "center", sortable: true},
	                {key: "LOGOUTDT", label: "로그아웃시각", width: 230, align: "center", sortable: true},
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
                return this.ipt_date;
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
    	this.target.exportExcel("상담사 로그인 현황_" +dateString+ ".xls");
    }
});