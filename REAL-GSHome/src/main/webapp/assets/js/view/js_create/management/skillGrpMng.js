var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var compSkId = $("[data-ax5select='selSkCompany']").ax5select("getValue")[0].value;
    	var compGrpId = $("[data-ax5select='selGrpCompany']").ax5select("getValue")[0].value;
    	if(compSkId == '' || compSkId == null || compGrpId == '' || compGrpId == null){
    		alert("소속을 선택하세요.");
    		return;
    	}
    	
        axboot.ajax({
            type: "POST",
            url: "/api/mng/skillGrpMng/selectSkillList",
            cache : false,
            data: JSON.stringify(caller.searchViewSk.getData()),
            callback: function (res) {
            	caller.gridViewSkill.setData(res);
            }
        });
        
        axboot.ajax({
            type: "POST",
            url: "/api/mng/skillGrpMng/selectSkillGrpList",
            cache : false,
            data: JSON.stringify(caller.searchViewGrp.getData()),
            callback: function (res) {
            	caller.gridViewSkillGrp.initView();
            	caller.gridViewSkillGrp.setData(res);
            }
        });

        return false;
    },
    PAGE_SAVE: function (caller, act, data) {
    	var gridList = caller.gridViewSkillGrp.getData();    	
    	var chkSave = true;
    	
    	var skillSkList = caller.gridViewSkill.getData();
    	var skillGrpList = caller.gridViewSkillGrp.getData();
    	
    	if(skillSkList.length == 0 || skillGrpList == 0)
    	{
    		alert("조회 후 저장하시기 바랍니다.");
    		return;
    	} 
    	
    	var old_list = [];
    	gridList.forEach(function (m){
    		if(!m.__created__)
    		{
    			if(m.orgLevel == 1)
    			{
    				old_list.push(m.skillGrpName);
    			}
    		}
    	});
    	
    	var jchk = 0;
    	var unde = 0;
    	var jungbok = 0;
    	var reqExp = /자율근무/;
    	
    	gridList.forEach(function (n){
    		if(n.newGr)
    		{
    			if(n.skillGrpName == undefined)
    			{
    				unde = unde + 1;
    			}
    	
    			if(reqExp.test(n.skillGrpName) == true)
	    	    {
	        		jchk = jchk + 1;
	    	    }
    			
    			old_list.forEach(function (o){
    				if(n.skillGrpName == o)
    				{
    					jungbok = jungbok + 1;
    				}    				
    			})
    			
    		}
    		
    		if(n.orgLevel == '2'){
        		if(typeof n.skillLevel == "undefined"){
        			chkSave = false;
        		}
    		}
    		
    		if(!chkSave)
    		{
    			alert("스킬 레벨을 선택하세요.");
        		return;
    		}    		
    	});
    	
    	if(unde > 0)
		{
			alert("스킬그룹명을 입력하세요.");
    		return;
		}  
    	
    	if(jchk > 0)
		{
			alert("스킬그룹명 중 자율근무는 추가할 수 없습니다.");
    		return;
		}  
    	    	
    	if(jungbok > 0)
		{
			alert("기존에 생성된 스킬그룹명과 동일한 스킬그룹명은 생성할 수 없습니다.");
    		return;
		}    	
    	
    	axDialog.confirm({
        	  title:"확인",
              msg: "저장하시겠습니까?" // 여기까지 추가한 소스
           }, function () {
        	   	if (this.key == "ok") 
        	   	{	
        	   		axboot.ajax({
        	   			type: "POST",
        	   			url: "/api/mng/skillGrpMng/saveSkillGrp",
        	   			cache : false,
        	   			data: JSON.stringify(caller.gridViewSkillGrp.getData()),
        	   			callback: function (res){
        	   				axToast.push("저장 되었습니다.");
        	   				ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
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
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridViewSkill.exportExcel();
    	caller.gridViewSkillGrp.exportExcel();
    },
    PAGE_SK_EXCEL: function (caller, act, data){
    	caller.gridViewSkill.exportExcel();
    },
    PAGE_SKG_EXCEL: function (caller, act, data){
    	caller.gridViewSkillGrp.exportExcel();
    },
    ITEM_ADD: function (caller, act, data) {
    	var skillSkList = caller.gridViewSkill.getData("selected");
    	var skillGrpList = caller.gridViewSkillGrp.getData("selected");
    	var i = 0;
    	
    	if(skillSkList.length == 0)
    	{
    		alert("매체 또는 스킬을 선택하세요.");
    		return;
    	}
    	
    	if(skillGrpList.length == 0)
    	{
    		alert("스킬 그룹을 선택하세요.");
    		return;
    	} 
    	else 
    	{
    		var addYn = false;
    		var crechk = 0;
    		skillGrpList.forEach(function(n)
    		{
    			if(n.orgLevel == '1')
    			{
    				addYn = true;
    			}
    			
    			if(n.__created__)
    			{
    				crechk = crechk + 1;
    			}
    		});
    		if(!addYn)
    		{
				alert("스킬 추가는 스킬 그룹을 선택해 주시기 바랍니다.");
				return;
    		}
    		
    		if(crechk > 0)
    		{
    			alert("추가된 그룹은 저장 후 스킬을 추가해 주시기 바랍니다.");
    			return;
    		}
    	}
    	
    	skillSkList.forEach(function(n){
    		if(n.orgLevel == '2'){
    			if(n.skillDbid != null && n.skillDbid != '')
    			{
        			skillGrpList.forEach(function(m){
        				if(m.orgLevel == '1')
        				{
        					var skillGrpChk = caller.gridViewSkillGrp.getData();
        					var addChk = true;
        					skillGrpChk.forEach(function(x)
        					{
        						if(x.skillName == n.skillName && x.hidden != true && x.pid == m.id)
        						{
        							addChk = false;
        						}
        					});
        					if(addChk)
        					{
        		        		i++;
            					var sIndex = m.__children__.length + i;
            					var data = [];
            					data.pid = m.id;
            					if(typeof m.skgNm == undefined)
            					{
            						data.skillGrpName = m.skillGrpName;
            					}
            					else
            					{
            						data.skillGrpName = m.skgNm;
            					}
            					
            					data.id  = n.id;
            					data.skillName = n.skillName; 
            					data.skillDbid = n.skillDbid;
            					data.skillLevel = 1;
            					caller.gridViewSkillGrp.addRow(sIndex, data, "sk");
        					}
        				}
        			});
        		}
    			else 
    			{
        			alert(n.skillName + "의 Dbid가 존재하지 않습니다. 관리자에게 문의하세요.");
        			return;
        		}
        	}
    	});    	
    },
    ITEM_DEL: function (caller, act, data) {
    	var skillGrpList = caller.gridViewSkillGrp.getData("selected");
    	
    	if(skillGrpList.length == 0)
    	{
    		alert("스킬 그룹의 스킬을 선택하세요.");
    		return;
    	}
    	
    	skillGrpList.forEach(function(n){
    		if(n.orgLevel == '2')
    		{
                caller.gridViewSkillGrp.delRow(n.__origin_index__);
    		}
    	});
    },
    ITEM_CLICK: function (caller, act, data){
    	axboot.modal.open({
            modalType: "SKGMAIN_INFO_MODAL",
            //param: param,
            sendData: function () {
                return {
                    "grpid": data.id, 
                    "skgname": data.skillGrpName
                };
            },
            callback: function (data) {            	
                //this.close();
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            }
        });
    	
    }
});
var CODE = {};
var info = {};
var sLevelList= [];

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {	
    var _this = this;
	 
    $("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});
    
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
			    url: "/api/mng/searchCondition/company",
			    cache : false,
			    data: JSON.stringify($.extend({}, info)),
			    callback: function (res) {
			        var resultSet = [];
			        res.list.forEach(function (n) {
			        	resultSet.push({
			                value: n.id, text: n.name
			            });
			        });
			        $("[data-ax5select='selSkCompany']").ax5select({
				        theme: 'primary',
				        onStateChanged: function () {
				        	_this.searchViewSk.chnSkSearch();
				        },
				        options: resultSet,
			        });
			        $("[data-ax5select='selGrpCompany']").ax5select({
				        theme: 'primary',
				        onStateChanged: function () {
				        	_this.searchViewGrp.chnGrpSearch();
				        	_this.searchViewGrp.skGrpSearch();
				        },
				        options: resultSet,
			        });
			        _this.searchViewSk.chnSkSearch();
			        _this.searchViewSk.skillSkSearch();
			        _this.searchViewGrp.chnGrpSearch();
			        _this.searchViewGrp.skillGrpSearch();
			        
			        _this.searchViewGrp.skGrpSearch();
			    }
			});			
	    }
    });
	
    axboot.ajax({
        type: "GET",
        url: ["commonCodes"],
        cache : false,
        data: {groupCd: "SKILL_LEVEL", useYn: "Y"},
        callback: function (res) {
            res.list.forEach(function (n) {
            	sLevelList.push({
            		code:n.code, codeNm: n.name
                });
            });
        }
    });

	_this.pageButtonView.initView();
	_this.searchViewSk.initView();
	_this.searchViewGrp.initView();
	_this.gridViewSkill.initView();
	_this.gridViewSkillGrp.initView();
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
        
        axboot.buttonClick(this, "data-grid-view-01-btn", {
            "grpAdd": function () {
            	fnObj.gridViewSkillGrp.addRow(null,null,"sg");
            },
            "grpDel": function () {
            	fnObj.gridViewSkillGrp.removeRow();
            },
            "skillAdd": function () {
            	 ACTIONS.dispatch(ACTIONS.ITEM_ADD);
            },
            "skillDel": function () {
           	 	ACTIONS.dispatch(ACTIONS.ITEM_DEL);
            },
            "sk_excel": function () {
            	ACTIONS.dispatch(ACTIONS.PAGE_SK_EXCEL);
            },
            "skg_excel": function () {
        	   ACTIONS.dispatch(ACTIONS.PAGE_SKG_EXCEL);
            }
        });
    }
});

//== view 시작
/**
 * searchView
 */
// 왼쪽 그리드 세팅
fnObj.searchViewSk = axboot.viewExtend(axboot.searchView, {
    initView: function () {
    	this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter");  
    },
    getData: function () {
        var data = {}; 
        
        // 왼쪽 그리드 소속,매체,스킬
        var compSkId = $("[data-ax5select='selSkCompany']").ax5select("getValue")[0].value;
        
		var tmpChnSkId = $("[data-ax5select='selSkChannel']").ax5select("getValue");
		var chnSkId = "";		
		if(tmpChnSkId != "")
		{	    	
			for(var i=0; i < tmpChnSkId.length; i++)
			{
				chnSkId += tmpChnSkId[i].value + ";";
			}
			chnSkId = chnSkId.substring(0,chnSkId.length-1);
		} 
		
		var tmpSkillSkId = $("[data-ax5select='selSkSkill']").ax5select("getValue");
		var skillSkId = "";
		if(tmpSkillSkId != "")
		{	    	
			for(var i=0; i < tmpSkillSkId.length; i++)
			{
				skillSkId += tmpSkillSkId[i].value + ";";
			}
			skillSkId = skillSkId.substring(0,skillSkId.length-1);
		} 
		
		data.compSkId = compSkId;
        data.chnSkId = chnSkId;
        data.skillSkId = skillSkId;
        data.skillName = $("#selSkillName").val();
        
        return $.extend({}, data)
    },
    chnSkSearch: function(){
        var data = {}; 
        data.grpcd = info.grpcd;
        data.compId = $("[data-ax5select='selSkCompany']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/channel",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002" || data.grpcd == "S0003"){
                    resultSet.push({value:"", text:"전체", sel:"1"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='selSkChannel']").ax5select({
        	        theme: 'primary',
					multiple: true,
        	        options: resultSet,
    		        onStateChanged: function () {
    		        	fnObj.searchViewSk.skillSkSearch();
    		        },
					onChange: function(){
						if( this.item.selected.length  == 0 )
						{
					    	$('[data-ax5select="selSkChannel"]').ax5select("setValue",[0],true);
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
									$('[data-ax5select="selSkChannel"]').ax5select("setValue",[0],false);
						    	
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
					    			$('[data-ax5select="selSkChannel"]').ax5select("setValue",[0],false);
					    			this.item.options[0].sel = "0" ;
								} 
								else
								{
									this.item.options[0].sel = "1" ;
					    			for(var i = 1; i < this.item.options.length; i++)
					    			{
					    				$('[data-ax5select="selSkChannel"]').ax5select("setValue",[this.item.options[i].value],false);
					    			}
								}
								$('[data-ax5select-option-group]').click();
							}
						}       	        	
					} 
                });
                $("[data-ax5select='selSkChannel']").ax5select("setValue",[""]);  
                fnObj.searchViewSk.skillSkSearch();
            }
        });
    },    
    skillSkSearch: function(){
        var data = {}; 
        data.grpcd = info.grpcd;
        data.compId = $("[data-ax5select='selSkCompany']").ax5select("getValue")[0].value;
		var tmpChnId = $("[data-ax5select='selSkChannel']").ax5select("getValue");
		var chnId = "";
		if(tmpChnId != "")
		{	    	
			for(var i=0; i < tmpChnId.length; i++)
			{
				chnId += tmpChnId[i].value + ";";
			}
			chnId = chnId.substring(0,chnId.length-1);
		} 
		data.chnId = chnId;
	    data.skId = "";
	    data.filter = "Y";
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/skill",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002" || data.grpcd == "S0003"){
                    resultSet.push({value:"", text:"전체", sel:"1"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='selSkSkill']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        options: resultSet,
          	        onChange: function()
          	        {
						if( this.item.selected.length  == 0 )
						{
					    	$('[data-ax5select="selSkSkill"]').ax5select("setValue",[0],true);
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
									$('[data-ax5select="selSkSkill"]').ax5select("setValue",[0],false);
						    	
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
					    			$('[data-ax5select="selSkSkill"]').ax5select("setValue",[0],false);
					    			this.item.options[0].sel = "0" ;
								} 
								else
								{
									this.item.options[0].sel = "1" ;
					    			for(var i = 1; i < this.item.options.length; i++)
					    			{
					    				$('[data-ax5select="selSkSkill"]').ax5select("setValue",[this.item.options[i].value],false);
					    			}
								}
								$('[data-ax5select-option-group]').click();
							}
						}       
          	        }
                });
	            $("[data-ax5select='selSkSkill']").ax5select("setValue",[""]);  
            }
        });
    }
});

// 오른쪽 그리드 세팅
fnObj.searchViewGrp = axboot.viewExtend(axboot.searchView, {
    initView: function () {
    	this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter");  
    },
    getData: function () {
        var data = {}; 
        
		// 오른쪽 그리드 소속,매체,스킬, 스킬그룹
		var compGrpId = $("[data-ax5select='selGrpCompany']").ax5select("getValue")[0].value;
		
		var tmpChnGrpId = $("[data-ax5select='selGrpChannel']").ax5select("getValue");
		var chnGrpId = "";		
		if(tmpChnGrpId != "")
		{	    	
			for(var i=0; i < tmpChnGrpId.length; i++)
			{
				chnGrpId += tmpChnGrpId[i].value + ";";
			}
			chnGrpId = chnGrpId.substring(0,chnGrpId.length-1);
		} 
		
		var tmpSkillGrpId = $("[data-ax5select='selGrpSkill']").ax5select("getValue");
		var skillGrpId = "";
		if(tmpSkillGrpId != "")
		{	    	
			for(var i=0; i < tmpSkillGrpId.length; i++)
			{
				skillGrpId += tmpSkillGrpId[i].value + ";";
			}
			skillGrpId = skillGrpId.substring(0,skillGrpId.length-1);
		} 
		
		var tmpskGrpId = $("[data-ax5select='selSkillGrp']").ax5select("getValue");
		var skGrpId = "";
		if(tmpskGrpId != "")
		{	    	
			for(var i=0; i < tmpskGrpId.length; i++)
			{
				skGrpId += tmpskGrpId[i].value + ";";
			}
			skGrpId = skGrpId.substring(0,skGrpId.length-1);
		} 

        data.compGrpId = compGrpId;
        data.chnGrpId = chnGrpId;
        data.skillGrpId = skillGrpId;        
        data.skillGrpName = $("#selGrpSkillName").val();        
        data.skGrpId = skGrpId;
        data.skGrpName = $("#selGrpName").val();
        
        return $.extend({}, data)
    },    
    chnGrpSearch: function(){
        var data = {}; 
        data.grpcd = info.grpcd;
        data.compId = $("[data-ax5select='selGrpCompany']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/channel",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002" || data.grpcd == "S0003"){
                    resultSet.push({value:"", text:"전체", sel:"1"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='selGrpChannel']").ax5select({
        	        theme: 'primary',
					multiple: true,
        	        options: resultSet,
    		        onStateChanged: function () {
    		        	fnObj.searchViewGrp.skillGrpSearch();
    		        },
					onChange: function(){
						if( this.item.selected.length  == 0 )
						{
					    	$('[data-ax5select="selGrpChannel"]').ax5select("setValue",[0],true);
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
									$('[data-ax5select="selGrpChannel"]').ax5select("setValue",[0],false);
						    	
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
					    			$('[data-ax5select="selGrpChannel"]').ax5select("setValue",[0],false);
					    			this.item.options[0].sel = "0" ;
								} 
								else
								{
									this.item.options[0].sel = "1" ;
					    			for(var i = 1; i < this.item.options.length; i++)
					    			{
					    				$('[data-ax5select="selGrpChannel"]').ax5select("setValue",[this.item.options[i].value],false);
					    			}
								}
								$('[data-ax5select-option-group]').click();
							}
						}       	        	
					} 
                });
                $("[data-ax5select='selGrpChannel']").ax5select("setValue",[""]);  
                fnObj.searchViewGrp.skillGrpSearch();
            }
        });
    },    
    skillGrpSearch: function(){
        var data = {}; 
        data.grpcd = info.grpcd;
        data.compId = $("[data-ax5select='selGrpCompany']").ax5select("getValue")[0].value;
		var tmpChnId = $("[data-ax5select='selGrpChannel']").ax5select("getValue");
		var chnId = "";
		if(tmpChnId != "")
		{	    	
			for(var i=0; i < tmpChnId.length; i++)
			{
				chnId += tmpChnId[i].value + ";";
			}
			chnId = chnId.substring(0,chnId.length-1);
		} 
		data.chnId = chnId;
	    data.skId = "";
	    data.filter = "Y";
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/skill",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002" || data.grpcd == "S0003"){
                    resultSet.push({value:"", text:"전체", sel:"1"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='selGrpSkill']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        options: resultSet,
          	        onChange: function()
          	        {
						if( this.item.selected.length  == 0 )
						{
					    	$('[data-ax5select="selGrpSkill"]').ax5select("setValue",[0],true);
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
									$('[data-ax5select="selGrpSkill"]').ax5select("setValue",[0],false);
						    	
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
					    			$('[data-ax5select="selGrpSkill"]').ax5select("setValue",[0],false);
					    			this.item.options[0].sel = "0" ;
								} 
								else
								{
									this.item.options[0].sel = "1" ;
					    			for(var i = 1; i < this.item.options.length; i++)
					    			{
					    				$('[data-ax5select="selGrpSkill"]').ax5select("setValue",[this.item.options[i].value],false);
					    			}
								}
								$('[data-ax5select-option-group]').click();
							}
						}       
          	        }
                });
	            $("[data-ax5select='selGrpSkill']").ax5select("setValue",[""]);  
            }
        });
    },  
    skGrpSearch: function(){
        var data = {}; 
        data.compId = $("[data-ax5select='selGrpCompany']").ax5select("getValue")[0].value;
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
fnObj.gridViewSkill = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-skill"]'),
            showLineNumber: false,
            showRowSelector: true,
            multipleSelect: true,
            frozenColumnIndex: 0,
            //sortable: true,
            multipleSelect: true,
            virtualScrollX: true,
            virtualScrollY: true,
            page: {display: false},
            header: {
                align: "center",
                columnHeight: 28
            },
            columns: [
                {key: "chnName", label: '매체', width: 200, align: "left", treeControl: true},
                {key: "skillName", label: '스킬', width: 200, align: "center"}
            ],
            body: {
                align: "center",
                columnHeight: 28,
                onDataChanged: function () {
                	if (this.key == '__selected__') {
                        this.self.updateChildRows(this.dindex, {__selected__: this.item.__selected__});
                    }
                },
                onClick: function () {
                	//console.log("[onClick] index : " + this.dindex + " , value : " + this.value);
                }
            },
            tree: {
                use: true,
                indentWidth: 10,
                arrowWidth: 15,
                iconWidth: 18,
                icons: {
                    openedArrow: '▼',
                    collapsedArrow: '▶',
                    groupIcon: '',
                    collapsedGroupIcon: '',
                    itemIcon: ''
                },
                columnKeys: {
                    parentKey: "pid",
                    selfKey: "id"
                }
            }
        });
    },
    getData: function (_type) {
        var _list = this.target.getList(_type);
        return _list;
    },
    setValue: function (index, key, value) {
    	this.target.setValue(index, key, value);
    },
    exportExcel: function () {
    	this.target.exportExcel("스킬_그룹_관리(스킬).xls");
    },
});


/**
 * gridView
 */
fnObj.gridViewSkillGrp = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;
        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-skillGrp"]'),
            showLineNumber: false,
            showRowSelector: true,
            multipleSelect: true,
            frozenColumnIndex: 0,
            multipleSelect: true,
            virtualScrollX: true,
            virtualScrollY: true,
            page: {display: false},
            header: {
                align: "center",
                columnHeight: 28
            },
            columns: [
            	// 그냥 키로 생성만 안해주면 화면에 안보이고 데이터는 가지고 있는다.            	
            	{key: "skillGrpName", label: "스킬그룹", width: 200, align: "left", treeControl: true, editor: 
            	{type:"text", disabled: function (){     
            		var rtnValue = false;
            		if(this.item.skillGrpName == "자율근무")
            		{
            			rtnValue = true;
            		}
            		else if(this.item.orgLevel == '2')
            		{
            			rtnValue = true;
            		}
            		else
            		{
            			rtnValue = false;
            		}
            			return rtnValue;
                }}},
                {key: "skillName", label: "스킬", width: 200, align: "left", formatter: function(){                	                	
                	var skname = this.value;
                	if(this.value != undefined)
                	{
                		if(this.value == "목록")
                		{
                			skname = "<div><b><u>" + this.value + "</u></b></div>"
                		}
                	}
                	return skname;
                }},
                {key: "skillLevel", label: "스킬 레벨", width: 140, align: "center", editor: {                
	                type:"select", config:{
	                	columnKeys: {
	                		optionValue:"code", optionText:"codeNm"
	                	}, 
	                	options: sLevelList	                	                
	                },
	                disabled: function (){
	                	var rtnValue = false;
	                	if(this.item.orgLevel == '1'){
	                		rtnValue = true;
	                	}else{
	                		rtnValue = false;	                	
	                	}
	                   	return rtnValue;
	                   	}
                	}, formatter: function(){                	
                		var skLvlList = sLevelList;
	                	for(var i=0;i<skLvlList.length;i++){
	                		if(skLvlList[i].code == this.value){
	                			return skLvlList[i].codeNm;
	                		}
	                	}
	                }	
	            },
                {key: "updated_at", label: "최종작업자명", width: 200, align: "center"},
                {key: "updated_by", label: "최종작업일자", width: 200, align: "center"},
            ],
            body: {
                align: "center",
                columnHeight: 28,
                onDBLClick: function () {
                	console.log("[onClick] index : " + this.dindex + " , value : " + this.value + " , item : " + this.item.toString());
                	
                	this.self.select(this.dindex, {selectedClear: true});
                    if (this.column.key == "skillName") 
                    {                    
                    	var data = this.list[this.dindex];
                    	if(data.__depth__ == '0')
                    	{
                    		ACTIONS.dispatch(ACTIONS.ITEM_CLICK, $.extend({}, data));
                    	}
                    } 
                },
                onDataChanged: function () {
                	if (this.key == '__selected__') {
                        this.self.updateChildRows(this.dindex, {__selected__: this.item.__selected__});
		            }else if (this.key == 'skillGrpName') {
		            	this.self.updateChildRows(this.dindex, {skillGrpName: this.item.skillGrpName});
		            }
                },
                //onClick: function () {
                //	console.log("[onClick] index : " + this.dindex + " , value : " + this.value + " , item : " + this.item.toString());                	
                //},
                
            },
            tree: {
                use: true,
                indentWidth: 10,
                arrowWidth: 15,
                iconWidth: 18,
                icons: {
                    openedArrow: '▼',
                    collapsedArrow: '▶',
                    groupIcon: '',
                    collapsedGroupIcon: '',
                    itemIcon: ''
                },
                columnKeys: {
                    parentKey: "pid",
                    selfKey: "id"
                }
            }
        });
    },
    getData: function (_type) {
        var _list = this.target.getList(_type);
        return _list;
    },
    exportExcel: function () {
    	this.target.exportExcel("스킬_그룹_관리(스킬그룹).xls");
    },
    addRow: function ( sIndex, data, flag) {
    	var compId = $("[data-ax5select='selGrpCompany']").ax5select("getValue")[0].value;
    	if(sIndex == null || sIndex == ''){
            this.target.addRow({__created__: true, pid: compId, compId: compId, orgLevel:"1", id:"tmp" + this.target.list.length, newGr:true }, "last");
    	}else {
            this.target.addRow({__created__: true, pid: data.pid, id: data.id, skillGrpName: data.skillGrpName, skillName: data.skillName, compId: compId, orgLevel:"2", skillDbid: data.skillDbid, skillLevel:data.skillLevel, newGr:false}, sIndex);
    	}
    	
    	if(flag == "sg")
    	{ this.target.focus("END"); }
    },
    removeRow: function(){
    	var skillGrpList = fnObj.gridViewSkillGrp.getData("selected");
    	
    	if(skillGrpList.length == 0)
    	{
    		alert("스킬 그룹을 선택하세요.");
    		return;
    	}
    	
    	var reqExp = /자율근무/;
    	var jchk = 0;
    	skillGrpList.forEach(function(n){
    		if(n.orgLevel == '1')
    		{
    			if(reqExp.test(n.skillGrpName) == true)
	    		{
	    			jchk = jchk + 1;	    		
	    		}
    		}
    	});
    	
    	if(jchk > 0)
    	{
    		alert("자율근무 그룹은 삭제할 수 없습니다.");
    		return;
    	}
    	
    	skillGrpList.forEach(function(n){
	    	if(n.orgLevel == '1')
	    	{
	    		fnObj.gridViewSkillGrp.delRow(n.__origin_index__);	    		
	    	}	    	
    	});
    },
    repaint: function () {
    	this.target.body.repaint.call(this, true);
    }
});