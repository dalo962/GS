var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
    	if(compId == '' || compId == null ){
    		alert("소속을 선택하세요.");
    		return;
    	}

    	axboot.ajax({
            type: "POST",
            url: "/api/mng/skillLvlSummary/selectSummaryList",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
            	if(res.list.length > 0)
            	{
            		caller.searchView.skillSearch();
            		caller.gridView01.initView(res);
            		caller.gridView01.setData(res);
            	}
            }
        });

        return false;
    },
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridView01.exportExcel();
    },
    ITEM_CLICK: function (caller, act, data){
    	var loginCheck = $("#loginCheck").is(":checked");
		
	    if(loginCheck == true) loginCheck = 'Y';
    	else loginCheck = 'N';   
	    
    	axboot.modal.open({
            modalType: "SKSUMMARY_INFO_MODAL",
            //param: param,
            sendData: function () {
                return {
                    "gpId": data.GPID,
                    "loginCheck" : loginCheck
                };
            },
            callback: function (data) {
                this.close();
            }
        });
    }
});
var CODE = {};
var info = {};
var defaultDisp = [];

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
		    cache : false,
		    data: "",
		    callback: function (res) {
		    	res.forEach(function (n){
		    		info.grpcd = n.grp_auth_cd;
		    		info.comcd = n.company_cd;
		    	});
		    	
		    	/* 소속 리스트조회 후 셋팅하는 부분 */ 
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
					        onChange: function () {
					        	_this.searchView.skillSearch();
					        	_this.searchView.skillGrpSearch();
					        },
					        options: resultSet,
				        });
				        _this.searchView.skillSearch();
				        _this.searchView.skillGrpSearch();
				        ok();
				    }
				});	    	
				
			}
		});
    }).then(function(ok){
		_this.pageButtonView.initView();
		_this.searchView.initView();
		_this.gridView01.initView([]);
    });
};


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_EXCEL);
            }
        });
    }
});


fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
    	this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter");     
    },
    getData: function () {
        var data = {}; 
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        data.gpName = $("#selGrpName").val();
        
        var list = $('[data-ax5select="selSkillGrp"]').ax5select("getValue");
    	var sklist = "";
    	if(list != "")
    	{	    	
	    	for(var i=0; i < list.length; i++)
	    	{
	    		sklist += list[i].value + ";";
	    	}
	    	sklist = sklist.substring(0,sklist.length-1);
    	}	
    	data.gpId = sklist;
    	
	    if(defaultDisp.length > 0)
	    {
	    	var skid = "";
	    	defaultDisp.forEach(function (n){
	    		skid += n.id + ";";
	    	});
	    	
	    	skid = skid.substring(0,skid.length-1);
	    }
	    data.skId = skid;
	    
	    
	    var loginCheck = $("#loginCheck").is(":checked");
    		
	    if(loginCheck == true) loginCheck = 'Y';
    	else loginCheck = 'N';   
	    	    
	    data.loginCheck = loginCheck;    	
	    
        return $.extend({}, data)
    },
    skillSearch: function(){
        var data = {}; 
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/skillLvlSummary/selectSkList",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
            	defaultDisp = [];
                res.list.forEach(function (n) {
                	defaultDisp.push({
                        id: n.id, name:n.skillName
                    });
                });               
            }
        });
    },
    skillGrpSearch: function(){
        var data = {}; 
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
  	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/skillGrp",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [{value:"", text:"전체", sel:"1"}];
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='selSkillGrp']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        options: resultSet,
        	        onChange: function()
        	        {
        	        	if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="selSkillGrp"]').ax5select("setValue",[0],true);
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
        	        				$('[data-ax5select="selSkillGrp"]').ax5select("setValue",[0],false);
        	        	    	
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
  	        	        			$('[data-ax5select="selSkillGrp"]').ax5select("setValue",[0],false);
  	        	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="selSkillGrp"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}       	        	
        	        }  
                });
                $('[data-ax5select="selSkillGrp"]').ax5select("setValue",resultSet[0].value);
            }
        });
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function (list) {
        var _this = this;        
        var Columns = [];
		 
        if(list == [] && list.length == 0)
        {
			Columns.push({key: "COMPNM", label: '소속', width: 120, align: "center", sortable:true});
			Columns.push({key: "GPNAME", label: '스킬그룹', width: 120, align: "center", sortable:true});
			Columns.push({key: "CNT", label: '인원', width: 100, align: "center", sortable:true, formatter:function()
	          				{
								var rtnValue = "";
								if(this.item.MODIFY_GP != undefined)
								{
									if(this.item.MODIFY_GP > 0)
									{
										rtnValue = "<div>" + '<B style="font-weight:bold;color:#FF0000;">'+ "<u>" + this.value + "</u></B></div>"
									}
									else
									{
										rtnValue = "<div><B><u>" + this.value + "</u></B></div>"
									}
								}
								else
								{
									rtnValue = "<div><B><u>" + this.value + "</u></B></div>"
								}
	  		
	      						return rtnValue;
	          				}});
        }
        else
        {
        	Columns.push({key: "COMPNM", label: '소속', width: 120, align: "center", sortable:true});
			Columns.push({key: "GPNAME", label: '스킬그룹', width: 120, align: "center", sortable:true});
			Columns.push({key: "CNT", label: '인원', width: 100, align: "center", sortable:true, formatter:function()
  				{
							var rtnValue = "";
							if(this.item.MODIFY_GP != undefined)
							{
								if(this.item.MODIFY_GP > 0)
								{
									rtnValue = "<div>" + '<B style="font-weight:bold;color:#FF0000;">'+ "<u>" + this.value + "</u></B></div>"
								}
								else
								{
									rtnValue = "<div><B><u>" + this.value + "</u></B></div>"
								}
							}
							else
							{
								rtnValue = "<div><B><u>" + this.value + "</u></B></div>"
							}
			
								return rtnValue;
							}});
			
			defaultDisp.forEach(function (n) {
				Columns.push({key:n.id, label:n.name, width:120, align:"center"});
			});
        }
                
        this.target = axboot.gridBuilder({
        	showRowSelector: false,
            frozenColumnIndex: 0,
            multipleSelect: false,
            showLineNumber:true,
        	target: $('[data-ax5grid="grid-view-01"]'),            
            columns: Columns,
            body: {
                onDBLClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                    if (this.column.key == "CNT") 
                    {                    
                    	var data = this.list[this.dindex];
                    	ACTIONS.dispatch(ACTIONS.ITEM_CLICK, $.extend({}, data));                    	
                    }                    
                }
            }
        });
    },
    getData: function (_type) {
        var _list = this.target.getList(_type);
        return _list;
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
    	this.target.exportExcel("스킬_그룹_요약.xls");
    }
});