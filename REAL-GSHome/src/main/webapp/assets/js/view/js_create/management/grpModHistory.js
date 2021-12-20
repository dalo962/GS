var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
    	if(compId == '' || compId == null ){
    		alert("소속을 선택하세요.");
    		return;
    	}
    	
    	var sDate = $("#startDate").val();
        var eDate = $("#endDate").val();     
                
        if(sDate != "" && sDate != null && eDate != "" && eDate != null)
        {
        	var reqExp = /^\d{4}-\d{2}-\d{2}$/;

            if(reqExp.test(sDate) == false || reqExp.test(eDate) == false)
            {
            	alert("날짜형식이 올바르지 않습니다.")
            	return;
            }

            if(sDate.substring(5,7) < "01" || sDate.substring(5,7) > "12" || eDate.substring(5,7) < "01" || eDate.substring(5,7) > "12")
        	{
        		alert("날짜형식이 올바르지 않습니다.");
            	return;
        	}
        	
        	if(sDate.substring(8,10) < "01" || sDate.substring(8,10) > "31" || eDate.substring(8,10) < "01" || eDate.substring(8,10) > "31")
	        {
	        	alert("날짜형식이 올바르지 않습니다.");
	           	return;
	        }
        	
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
        if(sDate == "" && eDate != "")
		{
			alert("시작일을 입력해 주시기 바랍니다.");
			return;
		}       
        if(sDate != "" && eDate == "")
		{
			alert("종료일을 입력해 주시기 바랍니다.");
			return;
		}
        
        sDate = sDate.split('-');
        eDate = eDate.split('-');
        
        var sdt = new Date(sDate[0], sDate[1], sDate[2]);
        var edt = new Date(eDate[0], eDate[1], eDate[2]);
        
        var diff = edt - sdt;
        var day = 1000 * 60 * 60 * 24;
        var month = day * 30;
        
        if(parseInt(diff/month) > 12)
        {
        	alert("조회기준일이 365일을 넘을 수 없습니다!");
        	return;
        } 
    	    
        axboot.ajax({
            type: "POST",
            url: "/api/mng/grpModHis/selectHisList",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
            	caller.gridView01.setData(res);
            }
        });

        return false;
    },
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridView01.exportExcel();
    }
});
var CODE = {};
var info = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {	
	$("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});
	
	ax5.ui.grid.formatter["fmtDay"] = function () {
	    var val = (this.value || "").toString().replace(/\D/g, "");
	    var regExpPattern = /^([0-9]{4})\-?([0-9]{2})?\-?([0-9]{2})?/,
	        returnValue = val.replace(regExpPattern, function (a, b) {
	        var nval = [arguments[1]];
	        if (arguments[2]) nval.push(arguments[2]);
	        if (arguments[3]) nval.push(arguments[3]);
	        return nval.join("-");
	    });
	    return returnValue;
	};
	
	ax5.ui.grid.formatter["fmtTime"] = function () {
	    var val = (this.value || "").replace(/\D/g, "");
	    var regExpPattern = /^([0-9]{2})\-?([0-9]{2})?\-?([0-9]{2})?/,
	        returnValue = val.replace(regExpPattern, function (a, b) {
	        var nval = [arguments[1]];
	        if (arguments[2]) nval.push(arguments[2]);
	        if (arguments[3]) nval.push(arguments[3]);
	        return nval.join(":");
	    });
	    return returnValue;
	};

    var _this = this;

	axboot.ajax({
    	type: "POST",
	    url: "/api/statLstMng/userAuthLst",
	    cache : false,
	    data: "",
	    callback: function (res) {
	    	res.forEach(function (n){
	    		info.grpcd = n.grp_auth_cd;
	    		info.comcd = n.company_cd;
	    	});
	    	
			axboot.ajax({
			    type: "POST",
			    //url: "/api/mng/searchCondition/company",
			    url: "/api/mng/searchCondition/companyHO",
			    cache : false,
			    data: JSON.stringify($.extend({}, info)),
			    callback: function (res) {
			        var resultSet = [];
			        res.list.forEach(function (n) {
			        	resultSet.push({
			                value: n.id, text: n.name
			            });
			        });
			        $("[data-ax5select='selCompany']").ax5select({
				        theme: 'primary',
				        onStateChanged: function () {
				        	_this.searchView.menuSearch();
				        	_this.searchView.grpSearch();
				        	_this.searchView.partSearch();
				        },
				        options: resultSet,
			        });
			       	_this.searchView.menuSearch();
			       	_this.searchView.grpSearch();
			       	_this.searchView.partSearch();
			    }
			});	    	
		}
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
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_EXCEL);
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
    	console.log("searchView initView");
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.sDate = $("#startDate");
        this.eDate = $("#endDate");    
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
                            .close();
                    }
                },
                ok:{label:"Close", theme:"default"}
            }
        });
  
		date_set();        
    },
    menuSearch: function(){
    	var resultSet = [];
    	var compName = $("[data-ax5select='selCompany']").ax5select("getValue")[0].text;
    	
    	if(info.grpcd == "S0001" || info.grpcd == "S0002")
    	{
    		resultSet.push({ value: "", 					text: "전체" });    		    	
    		resultSet.push({ value: "상담사 스킬 관리(기본)", 	text: "상담사 스킬 관리(기본)" });
    		resultSet.push({ value: "상담사 스킬 관리(그룹)",  	text: "상담사 스킬 관리(그룹)" });
    		resultSet.push({ value: "상담사 스킬 일괄등록",  		text: "상담사 스킬 일괄등록" });
    		resultSet.push({ value: "스킬 그룹 관리", 			text: "스킬 그룹 관리" });
    		resultSet.push({ value: "스킬그룹 CTI 매핑",		text: "스킬그룹 CTI 매핑" });
    		resultSet.push({ value: "상담사팀 CTI 매핑",		text: "상담사팀 CTI 매핑" });
    	}
    	else
    	{
    		resultSet.push({ value: "", 					text: "전체" });    		    	
    		resultSet.push({ value: "상담사 스킬 관리(기본)", 	text: "상담사 스킬 관리(기본)" });
    		resultSet.push({ value: "상담사 스킬 관리(그룹)",  	text: "상담사 스킬 관리(그룹)" });
    		resultSet.push({ value: "상담사 스킬 일괄등록",  		text: "상담사 스킬 일괄등록" });
    		resultSet.push({ value: "스킬 그룹 관리", 			text: "스킬 그룹 관리" });
    	}
    	
        $("[data-ax5select='selMenu']").ax5select({
	        theme: 'primary',
	        options: resultSet,
        });
    },
    getData: function () {
        var data = {}; 
        
        var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        var deptNm = $("[data-ax5select='deptSelect']").ax5select("getValue")[0].text;
        var teamNm = $("[data-ax5select='teamSelect']").ax5select("getValue")[0].text;
        var teamNm2 = $("#txtTeamName").val();        
        var agId = $("#selText").val();
        
        var agEmId = $("#selEmText").val();
        var agNm = $("#selAnmText").val();
        var grpNm = $("[data-ax5select='selSkillGrp']").ax5select("getValue")[0].text;        
        var grpNm2 = $("#selSkillGrpName").val();
        var menuGb = $("[data-ax5select='selMenu']").ax5select("getValue")[0].value;
        
        var strDate = this.sDate.val().replace(/\-/g, '');
        var endDate = this.eDate.val().replace(/\-/g, '');
             
        data.compId = compId;
        data.deptNm = deptNm;
        data.teamNm = teamNm;
        data.teamNm2 = teamNm2;
        data.agId = agId;
        
        data.agEmId = agEmId;
        data.agNm = agNm;        
        data.grpNm = grpNm;
        data.grpNm2 = grpNm2;
        data.menuGb = menuGb;
                
        data.strDate = String(strDate);
        data.endDate = String(endDate);
        
        data.grpcd = info.grpcd;
        
        return $.extend({}, data)
    },
    grpSearch: function(){
        var data = {};
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/grpModHis/selectHisGrpList",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
            	var resultSet = [{value:"", text:"전체"}];
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.grpNm, text: n.grpNm,
                    });
                });
                $("[data-ax5select='selSkillGrp']").ax5select({
        	        theme: 'primary',
    		        onStateChanged: function () {
    		        },
        	        options: resultSet,
                });
                $('[data-ax5select="selSkillGrp"]').ax5select("setValue", "");                
            }
        });
    },
    partSearch: function(){
        var data = {}; 
        data.grpcd = info.grpcd;
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/skpart",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
            	var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002" || data.grpcd == "S0003"){
                    resultSet.push({value:"", text:"전체"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name,
                    });
                });
                $("[data-ax5select='deptSelect']").ax5select({
        	        theme: 'primary',
    		        onChange: function () {
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
        var data = {}; 
        data.grpcd = info.grpcd;
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        data.partId = $("[data-ax5select='deptSelect']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/skteam",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
            	var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002" || data.grpcd == "S0003"){
                    resultSet.push({value:"", text:"전체"});                	
                }        	
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name,
                    });
                });
                $("[data-ax5select='teamSelect']").ax5select({
        	        theme: 'primary',
        	        onChange: function () {
    		        },
        	        options: resultSet,
                });
               $("[data-ax5select='teamSelect']").ax5select("setValue", "");
            }
        });
    }
});

var htext = "";
/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
    	console.log("gridView01 initView");
        var _this = this;

        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-01"]'),
            showLineNumber: true,
            showRowSelector: false,
            multipleSelect: false,
            frozenColumnIndex: 0,
            //virtualScrollX: true,
            //virtualScrollY: true,
            header: {
                align: "center",
                columnHeight: 28
            },
            columns: [
                {key: "workDate", label: '작업일', width: 150, align: "center"},
                {key: "menuGb", label: '화면구분', width: 170, align: "center"},
                {key: "workGb", label: '작업구분', width: 80, align: "center", formatter: function(){
                	var rtnValue = "";
            		if(this.value == "I"){
            			rtnValue = "등록";
            		} else if(this.value == "C"){
            			rtnValue = "추가";
            		} else if(this.value == "U"){
            			rtnValue = "변경";
            		} else if(this.value == "D"){
            			rtnValue = "삭제";
            		}
                	return rtnValue;
            	}},
            	{key: "workGroup", label: '작업스킬그룹', width: 150, align: "center"},
                {key: "workAgId", label: '시스템사번', width: 80, align: "center"},
                {key: "workAgEmId", label: '인사사번', width: 80, align: "center"},
                {key: "workAgNm", label: '상담사명', width: 80, align: "center"},
                {key: "workInfo", label: '작업내용', width: 380, align: "left", multiLine:true},                
                {key: "workName", label: '작업자', width: 150, align: "center"},
                {key: "workRemark", label: '변경사유', width: 260, align: "left", multiLine:true}
            ],
            body: {
                align: "center",
                columnHeight:45,
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                    htext = this.item.workRemark;     
                }
            }
        });
        $(function(){
        	  $("#grid").mouseenter(function(){
        	    $("#grid").attr('title',htext);
        	  });
        	  $("#grid").mouseleave(function(){
        	    $("#grid").attr('title',htext);
        	  });
        	});
        /*
        $("#grid").hover(
				function () {
	                  $(this).attr('title',htext);
	            }, 					
	            function () {
	                  $(this).attr('title',htext);
	            }
        	);
        */
    },
    getData: function (_type) {
    	console.log("gridView01 getData");
        var _list = this.target.getList(_type);
        return _list;
    },
    exportExcel: function () {
    	this.target.exportExcel("스킬_변경_이력.xls");
    }    
});
