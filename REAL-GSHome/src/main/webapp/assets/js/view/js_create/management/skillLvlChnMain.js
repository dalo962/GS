var fnObj = {};
var refid = '';
var regGb = '';

var skmenu = 1;

var personTarget = document.getElementById("personCnt");

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
       	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
       	if(compId == '' || compId == null ){
       		alert("소속을 선택하세요.");
       		return;
       	}
       	
        axboot.ajax({
        	type: "POST",
            url: "/api/mng/skillLvlChnMain/selectSkill",
            cache : false,
            data: JSON.stringify(caller.searchViewSkill.getData()),
            callback: function (res) {
               	caller.gridViewSkill.setData(res);
            }
        });
            
        axboot.ajax({
        	type: "POST",
            url: "/api/mng/skillLvlChnMain/selectAgtSkill",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
              	if(res.list.length > 0)
               	{
               		var cnt = 0;
               		
               		for(var i=0; i < res.list.length; i++)
	               	{
	               		if(res.list[i].PID != undefined)
	               		{
	               			cnt++;
	               		}
	               	}
	               	personTarget.innerText = "(" + cnt + "명)";
	               	
	               	caller.gridViewAgt.initView();
                    caller.gridViewAgt.setData(res);               		
               	}
               	else
               	{
               		personTarget.innerText = "(0명)";
               		
               		caller.gridViewAgt.initView();
                   	caller.gridViewAgt.setData(res);
               	}
            }
        });
    },
    PAGE_SEARCH_AG: function (caller, act, data) {
       	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
       	if(compId == '' || compId == null ){
       		alert("소속을 선택하세요.");
       		return;
       	}
            
        axboot.ajax({
        	type: "POST",
            url: "/api/mng/skillLvlChnMain/selectAgtSkill",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
              	if(res.list.length > 0)
               	{
               		var cnt = 0;
               		
               		for(var i=0; i < res.list.length; i++)
	               	{
	               		if(res.list[i].PID != undefined)
	               		{
	               			cnt++;
	               		}
	               	}
	               	personTarget.innerText = "(" + cnt + "명)";
	               	
	               	caller.gridViewAgt.initView();
                    caller.gridViewAgt.setData(res);               		
               	}
               	else
               	{
               		personTarget.innerText = "(0명)";
               		
               		caller.gridViewAgt.initView();
                   	caller.gridViewAgt.setData(res);
               	}
            }
        });
    },
    PAGE_SEARCH_SK: function (caller, act, data) {
       	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
       	if(compId == '' || compId == null ){
       		alert("소속을 선택하세요.");
       		return;
       	}
       	
        axboot.ajax({
        	type: "POST",
            url: "/api/mng/skillLvlChnMain/selectSkill",
            cache : false,
            data: JSON.stringify(caller.searchViewSkill.getData()),
            callback: function (res) {
               	caller.gridViewSkill.setData(res);
            }
        });
    },
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridViewAgt.exportExcel();
    	caller.gridViewSkill.exportExcel();
    },
    PAGE_AGT_EXCEL: function (caller, act, data){
    	caller.gridViewAgt.exportExcel();
    },
    PAGE_SK_EXCEL: function (caller, act, data){
    	caller.gridViewSkill.exportExcel();
    },
    ITEM_ADD: function (caller, act, data) {
		if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{
	    	var skillList = caller.gridViewSkill.getData("selected");
	    	var agtList = caller.gridViewAgt.getData("selected");
	    	var skillLevel = $(":input:radio[name=chkLvl]:checked").val();
	    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
			
	    	if(agtList.length == 0)
	    	{
	    		alert("상담사를 선택하세요.");
	    		return;
	    	}
	    	else if(skillList.length == 0)
	    	{
	    		alert("스킬을 선택하세요.");
	    		return;
	    	}
	    	else 
	    	{
	    		var addYn = false;
	    		var proskill = 0;
	    		agtList.forEach(function(n)
	    		{
					if(n.__depth__ > 0)
					{
						addYn = true;
					}
					
					if(n.PROTECT_SKILL == "O")
					{
						proskill = proskill + 1;
					}
					
	    		});
	    		if(!addYn)
	    		{
	        		alert("상담사를 선택하세요.");
	        		return;
	    		}
	    		
	    		if(proskill > 0)
	    		{
	    			alert("자율근무 상담사는 스킬을 변경할 수 없습니다.");
	        		return;
	    		}
	    	}
	    	
	    	if(skillList.length == 0)
	    	{
	    		alert("적용할 스킬을 선택하세요.");
	    		return;
	    	} 
	    	else 
	    	{
	    		var addYn = false;
	    		skillList.forEach(function(n)
	    		{
					if(n.__depth__ > 0){
	    				addYn = true;
	    			}
	    		});
	    		if(!addYn)
	    		{
	        		alert("적용할 스킬을 선택하세요.");
	        		return;
	    		}
	    	}

	    	axDialog.confirm({
	    		title:"확인",
	            msg: "스킬을 등록/변경 하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	        	if (this.key == "ok") 
	        	{
			        axMask.open();
			        resCnt = 0;
			    	refCnt = 0;
		            reqCnt = 0;
		            revCnt = 0;
		            reqData = [];
		            revData = [];
		            hisUrl = "/api/mng/skillLvlChnMain/saveAgtSkill";
		            //마지막 스킬,상담원 
					skillList.forEach(function(n)
					{	    		
			    		if(n.orgLevel == '2')
			    		{
			    			if(typeof n.skillDbid != "undefined")
			    			{
			    				agtList.forEach(function(m)
			    				{
			        				if(m.__depth__ > 0)
			        				{
			        					var levelName = '';
			        					var accessChk = true;
			    	                	for(var i=0;i<sklLvl.length;i++)
			    	                	{
			    	                		if(sklLvl[i].code == skillLevel)
			    	                		{
			    	                			levelName = sklLvl[i].codeNm;
			    	                		}
			    	                	}
			    	                	agtList.forEach(function(x)
			    	                	{
			    	                		if((x.AGTDBID == m.AGTDBID) && (x[n.id] == skillLevel))
			    	                		{
			    	                			accessChk = false;
			    	                		}
			    	                	});
			    	                	if(accessChk && typeof m.AGTDBID != "undefined")
			    	                	{
			    	                		reqCnt++;
			    	                	}
			        				}
			        			});
			        		}
			        	}
			    	});
		
			    	skillList.forEach(function(n)
			    	{
			    		if(n.orgLevel == '2')
			    		{
			    			if(typeof n.skillDbid != "undefined")
			    			{
			    				agtList.forEach(function(m)
			    				{
			        				if(m.__depth__ > 0)
			        				{
			        					var levelName = '';
			        					var accessChk = true;
			    	                	for(var i=0;i<sklLvl.length;i++)
			    	                	{
			    	                		if(sklLvl[i].code == skillLevel)
			    	                		{
			    	                			levelName = sklLvl[i].codeNm;
			    	                		}
			    	                	}
			    	                	var oldskillLevel = "";
			    	                	
			    	                	agtList.forEach(function(x)
			    	                	{
			    	                		if((x.AGTDBID == m.AGTDBID) && (x[n.id] == skillLevel))
			    	                		{
			    	                			accessChk = false;
			    	                		}
			    	                		
			    	                		oldskillLevel = x[n.id];
			    	                	});
			    	                	
			    	                	if(oldskillLevel == "99")
			    	                	{
			    	                		oldskillLevel = "분배 제외"
			    	                	}
			    	                	
			    	                	if(accessChk && typeof m.AGTDBID != "undefined")
			    	                	{
				        					
				    	                	if(typeof m[n.id] == "undefined")
				    	                	{
				    	                		regGb = "등록";
				    	            			refid = ws.wAddSkill(m.AGTDBID, n.skillDbid, skillLevel);
				    	                	}
				    	                	else
				    	                	{
				    	                		regGb = "변경";
				    	                		refid = ws.wUpdateSkill(m.AGTDBID, n.skillDbid, skillLevel);
				    	                	}
				    	                	
				    	                	if(refid != -1 && refid != "undefined")
						            		{
				    	                		reqData[refid] = 
					    	                	{
					        						compId : compId,
					        						partName : m.PARTNAME,
		        	        						teamName : m.TEAMNAME,
		        	        						agtLogId : m.AGTLOGID,
		        	        						employeeid : m.AGTID,
						        					agtDbid : m.AGTDBID,
						        					agtName : m.AGTNAME, 
						        					skillId : n.id,
						        					skillDbid : n.skillDbid,  
						        					skillLevel : skillLevel, 
						        					oldskLvl : oldskillLevel,
						        					skillName : n.skillName, 
						        					levelName : levelName, 
						        					regGb : regGb,
						        					suss : "작업중"
					        					};							            		
						            		}
			    	                	}
			        				}
			    				});
				        	}
			    			else 
			    			{
				        		alert(n.skillName + "의 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
				        		return;
				        	}
				        }
				    });
	        	}
	        	if(reqCnt == 0)
	        	{
		            axMask.close();
		            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		    	}
	        });
		}
		else
		{
			alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
			return;
		}
    },
    ITEM_DEL: function (caller, act, data) {
		if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{	
			var skillList = caller.gridViewSkill.getData("selected");
    		var agtList = caller.gridViewAgt.getData("selected");
			
    		if(agtList.length == 0)
    		{
	    		alert("상담사를 선택하세요.");
	    		return;
	    	}
    		else if(skillList.length == 0)
    		{
	    		alert("스킬을 선택하세요.");
	    		return;
	    	}
    		
    		var proskill = 0;
    		agtList.forEach(function(n)
    		{
				if(n.PROTECT_SKILL == "O")
				{
					proskill = proskill + 1;
				}
				
    		});
    		
    		if(proskill > 0)
    		{
    			alert("자율근무 상담사는 스킬을 삭제할 수 없습니다.");
        		return;
    		}
    		
    		/*
    		var skdelchk = 0;
    		skillList.forEach(function(n)
    		{
    			agtList.forEach(function(m)
    			{
    				if(typeof m[n.id] == "undefined")
    				{
    					skdelchk = skdelchk + 1;
    				}
    			});
    		});
    		
    		if(skdelchk > 0)
    		{
    			alert("상담사의 스킬을 삭제할 수 없습니다.\n상담사의 스킬을 확인하시기 바랍니다.");
        		return;
    		}
    		*/
    		
	    	axDialog.confirm({
	    		title:"확인",
	            msg: "스킬이 삭제됩니다.\n분배제외를 원하시면 제외 레벨 선택 후\n등록하여주세요. 삭제하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	            if (this.key == "ok") 
	            {
			    	var skillList = caller.gridViewSkill.getData("selected");
			    	var agtList = caller.gridViewAgt.getData("selected");
			    	var skillLevel = $(":input:radio[name=chkLvl]:checked").val();
			    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
			    	
			    	if(agtList.length == 0)
			    	{
			    		alert("상담사를 선택하세요.");
			    		return;
			    	} 
			    	else 
			    	{
			    		var addYn = false;
			    		agtList.forEach(function(n)
			    		{
							if(n.__depth__ > 0)
							{
			    				addYn = true;
			    			}
			    		});
			    		if(!addYn)
			    		{
			        		alert("상담사를 선택하세요.");
			        		return;
			    		}
			    	}
			    	
			    	if(skillList.length == 0)
			    	{
			    		alert("적용할 스킬을 선택하세요.");
			    		return;
			    	} 
			    	else 
			    	{
			    		var addYn = false;
			    		skillList.forEach(function(n)
			    		{
							if(n.__depth__ > 0)
							{
			    				addYn = true;
			    			}
			    		});
			    		if(!addYn)
			    		{
			        		alert("적용할 스킬을 선택하세요.");
			        		return;
			    		}
			    	}
			    	
			    	axMask.open();
			    	resCnt = 0;
			    	refCnt = 0;
		            reqCnt = 0;
		            revCnt = 0;
		            reqData = [];
		            revData = [];
		            hisUrl = "/api/mng/skillLvlChnMain/saveAgtSkill";
		            skillList.forEach(function(n)
		            {
			    		if(n.orgLevel == '2')
			    		{
			    			if(typeof n.skillDbid != "undefined")
			    			{
			    				agtList.forEach(function(m)
			    				{
			        				if(m.__depth__ > 0)
			        				{
			        					var skillLevel = '';
			        					var levelName = '';
		            					var accessChk = true;
		            					
			        					if(typeof m[n.id] != "undefined")
			        					{
			        	                	for(var i=0;i<sklLvl.length;i++)
			        	                	{
			        	                		if(sklLvl[i].code == m[n.id])
			        	                		{
			        	                			levelName = sklLvl[i].codeNm;
			        	                		}
			        	                	}
			        	                	
			        	                	if(typeof m.AGTDBID != "undefined")
			        	                	{			        	                		
				        	                	if(typeof m[n.id] != "undefined")
				        	                	{
				        	                		reqCnt++;
				        	                	}
			        	                	}
				        				}
			        				}
			        			});
			        		}
			        	}
			    	});
	
			    	skillList.forEach(function(n)
			    	{
			    		if(n.orgLevel == '2')
			    		{
			    			if(typeof n.skillDbid != "undefined")
			    			{
			    				agtList.forEach(function(m)
			    				{
			        				if(m.__depth__ > 0)
			        				{
			        					var skillLevel = '';
			        					var levelName = '';
		            					var accessChk = true;
		            					
			        					if(typeof m[n.id] != "undefined")
			        					{
			        						for(var i=0;i<sklLvl.length;i++)
			        						{
			        	                		if(sklLvl[i].code == m[n.id])
			        	                		{
			        	                			levelName = sklLvl[i].codeNm;
			        	                		}
			        	                	}
			        	                	
			        	                	if(typeof m.AGTDBID != "undefined")
			        	                	{
				        	                	if(typeof m[n.id] != "undefined")
				        	                	{
			            	                		regGb = "삭제";
			            	                		var refid = ws.wDeleteSkill(m.AGTDBID, n.skillDbid);
			            	                		
			            	                		if(refid != -1 && refid != "undefined")
								            		{
								    	                reqData[refid] = 
								    	                {
								    	                	compId : compId,
								        					partName : m.PARTNAME,
					        	        					teamName : m.TEAMNAME,
					        	        					agtLogId : m.AGTLOGID,
					        	        					employeeid : m.AGTID,
									        				agtDbid : m.AGTDBID,
									        				agtName : m.AGTNAME, 
									        				skillId : n.id,
									        				skillDbid : n.skillDbid,  
									        				skillLevel : skillLevel, 
									        				skillName : n.skillName, 
									        				levelName : levelName, 
									        				regGb : regGb,
									        				suss : "작업중"
								        				};								    	                
								            		}
				        	                	}
			        	                	}
			        	                }
			        				}
			        			});
			        		}
			    			else 
			    			{
			        			alert(n.skillName + "의 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
			        			return;
			        		}
			        	}
			    	});
	            }
	            if(reqCnt == 0)
	        	{
		            axMask.close();
		            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		    	}
	        });
		}
		else
		{
			alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
			return;
		}
    },
    ITEM_CLICK: function (caller, act, data){
    	axboot.modal.open({
            modalType: "SKMAIN_INFO_MODAL",
            //param: param,
            sendData: function () {
                return {
                    "AGTLOGID": data.AGTLOGID,
                    "AGTNAME" : data.AGTNAME
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
var sklLvl = [];
var chnColumns = [];
var defaultDisp = [];
var webSocketTimer = null;

var ws = new winkWebSocket();

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {	
	var _this = this;
	
	/*$("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});*/
	
	$("#selTeamName").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH_AG);
		}
	});
	
	$("#selText").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH_AG);
		}
	});
	
	$("#selemText").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH_AG);
		}
	});
	
	$("#selSkGrpName").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH_AG);
		}
	});
	
	$("#txtSkillName").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH_SK);
		}
	});
	
    axboot.ajax({
        type: "GET",
        url: ["commonCodes"],
        cache : false,
        data: {groupCd: "SKILL_LEVEL", useYn: "Y"},
        callback: function (res) {
        	sklLvl.push({code:"", codeNm:""});
            res.list.forEach(function (n) {
            	sklLvl.push({
            		code:n.code, codeNm: n.name
                });
            });
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

    		/* 소속 리스트조회 후 셋팅하는 부분 */
	    	axboot.ajax({
	    	    type: "POST",
	    	    url: "/api/mng/searchCondition/company",
	    	    cache : false,
	    	    data: JSON.stringify($.extend({}, info)),
	    	    callback: function (res) {
	    	        var resultSet = [];
	    	        res.list.forEach(function (n) {
	    	        	resultSet.push({
	    	                value: n.id, text: n.name,
	    	            });
	    	        });
	    	        $("[data-ax5select='selCompany']").ax5select({
	    		        theme: 'primary',
	    		        onStateChanged: function () {
	    		        	_this.searchView.partSearch();
	    			        _this.searchViewSkill.chnSearch();
	    			        _this.searchView.skillGrpSearch();
	    		        },
	    		        options: resultSet,
	    	        });
	            	_this.searchView.partSearch();
	    	        _this.searchView.agentSearch("all");
	    	        _this.searchViewSkill.chnSearch();
	    	        _this.searchView.skillGrpSearch();
		        }
	    	});
	    }
    });
	
	_this.pageButtonView.initView();
	_this.searchView.initView();
	_this.searchViewSkill.initView();
	_this.gridViewSkill.initView();
	_this.gridViewAgt.initView();
	_this.searchView.skillLevel();
			
	setTimeout(function(){
		webSocketTimer = setInterval(function() {
			//console.log("스킬변경(Main) 타이머 동작중  / winkerErr : " + winkerErr);
			if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) {
				// console.log("sWebSocket.readyState :" + sWebSocket.readyState);
				clearTimeout(webSocketTimer);
			} else {
				if(typeof ws.wWinkerErr != "undefined" && ws.wWinkerErr != "" && ws.wWinkerErr != null){
					ws.wDisconnect();
					clearTimeout(webSocketTimer);
					alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
				}else{
					if(ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN)
					{
						ws.wDisconnect();
					}
					setTimeout(function(){
						ws.wConnect(top.sockInfo['CFG_HOSTP'], top.sockInfo['CFG_PORTP'], top.sockInfo['CFG_HOSTB'], top.sockInfo['CFG_PORTB'], WinkSkillEvent, '', true, top.sockInfo['CFG_WSS']);
					},500);
				}
			}
		}, 1000);
	},1000);
};

fnObj.pageResize = function () {

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
        
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"skillAdd": function () {
        		ACTIONS.dispatch(ACTIONS.ITEM_ADD);
        	},
        	"skillDel": function () {
          	 	ACTIONS.dispatch(ACTIONS.ITEM_DEL);
          	},
          	"agt_excel": function () {
          		ACTIONS.dispatch(ACTIONS.PAGE_AGT_EXCEL);
          	},
          	"sk_excel": function () {
          		ACTIONS.dispatch(ACTIONS.PAGE_SK_EXCEL);
          	},
          	"agt_select": function () {
          		ACTIONS.dispatch(ACTIONS.PAGE_SEARCH_AG);
          	},
          	"sk_select": function () {
          		ACTIONS.dispatch(ACTIONS.PAGE_SEARCH_SK);
          	}
        });
    }
});


fnObj.pageVisible = function(state) {
	//console.log("스킬변경(Main) fnObj.pageVisible");
	if (typeof state != "undefined") {
		if (state == "on") {
			setTimeout(function(){
				clearTimeout(webSocketTimer);
				webSocketTimer = setInterval(function() {
					//console.log("스킬변경(Main) 타이머 동작중  / winkerErr : " + winkerErr);
					if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) {
						// console.log("sWebSocket.readyState :" + sWebSocket.readyState);
						clearTimeout(webSocketTimer);
					} else {
						if(typeof ws.wWinkerErr != "undefined" && ws.wWinkerErr != "" && ws.wWinkerErr != null){
							ws.wDisconnect();
							clearTimeout(webSocketTimer);
							alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
						}else{
							if(ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN)
							{
								ws.wDisconnect();
							}
							setTimeout(function(){
								ws.wConnect(top.sockInfo['CFG_HOSTP'], top.sockInfo['CFG_PORTP'], top.sockInfo['CFG_HOSTB'], top.sockInfo['CFG_PORTB'], WinkSkillEvent, '', true, top.sockInfo['CFG_WSS']);
							},500);
						}
					}
				}, 1000);
			},1000);
		} else {
			//console.log("스킬변경(Main) 타이머 종료");
			if(webSocketTimer != null)
			{
				clearTimeout(webSocketTimer);				
			}
			ws.wDisconnect();
		}
	} else {
		if(webSocketTimer != null)
		{
			clearTimeout(webSocketTimer);				
		}
		ws.wDisconnect();
	}
};


//== view 시작
/**
 * searchView
 */
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
    },
    getData: function () {
        var data = {}; 

        var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;

    	var tmpPartId = $("[data-ax5select='selPart']").ax5select("getValue");
    	var partId = "";
    	if(tmpPartId != "")
    	{	    	
	    	for(var i=0; i < tmpPartId.length; i++)
	    	{
	    		partId += tmpPartId[i].value + ";";
	    	}
	    	partId = partId.substring(0,partId.length-1);
    	} 

    	var tmpTeamId = $("[data-ax5select='selTeam']").ax5select("getValue");
    	var teamId = "";
    	if(tmpTeamId != "")
    	{	    	
	    	for(var i=0; i < tmpTeamId.length; i++)
	    	{
	    		teamId += tmpTeamId[i].value + ";";
	    	}
	    	teamId = teamId.substring(0,teamId.length-1);
    	} 	
    	
    	var tmpAgtlist = $('[data-ax5select="agentSelect"]').ax5select("getValue");
    	var agtlist = "";
    	if(tmpAgtlist != "")
    	{	    	
	    	for(var i=0; i < tmpAgtlist.length; i++)
	    	{
	    		agtlist += tmpAgtlist[i].value + ";";
	    	}
	    	agtlist = agtlist.substring(0,agtlist.length-1);
    	}    	
    	    	
    	var tmpDispList = $('[data-ax5select="selDispSkill"]').ax5select("getValue");
    	var dispList = "";

    	if(tmpDispList.length > 0 && tmpDispList[0].value != "")
    	{
	    	for(var i=0; i < tmpDispList.length; i++)
	    	{
	    		dispList += tmpDispList[i].value + ",";
	    	}
	    	dispList = dispList.substring(0,dispList.length-1);
    	}else{
	    	for(var i=0; i < defaultDisp.length; i++)
	    	{
	    		dispList += defaultDisp[i].skillId + ",";
	    	}
	    	dispList = dispList.substring(0,dispList.length-1);
    	}
    	
    	var tmpSkillLevel = $('[data-ax5select="selSkillLevel"]').ax5select("getValue");
    	var skillLevel = "";
    	if(tmpSkillLevel != "")
    	{	    	
	    	for(var i=0; i < tmpSkillLevel.length; i++)
	    	{
	    		skillLevel += tmpSkillLevel[i].value + ",";
	    	}
	    	skillLevel = skillLevel.substring(0,skillLevel.length-1);
    	}    	
    	
    	var tmpSkGrplist = $('[data-ax5select="selSkillGrp"]').ax5select("getValue");
    	var skGrplist = "";
    	if(tmpSkGrplist != "")
    	{	    	
	    	for(var i=0; i < tmpSkGrplist.length; i++)
	    	{
	    		skGrplist += tmpSkGrplist[i].value + ",";
	    	}
	    	skGrplist = skGrplist.substring(0,skGrplist.length-1);
    	}   
    	
    	var loginCheck = $("#loginCheck").is(":checked");
		
	    if(loginCheck == true) loginCheck = 'Y';
    	else loginCheck = 'N';   

        data.compId = compId;
        data.partId = partId;
        data.teamId = teamId;
        data.teamName = $("#selTeamName").val();
        
        data.agtList = agtlist;
        data.agtSelText = $("#selText").val();
        data.employeeid = $("#selemText").val();
        
        data.skillLevel = skillLevel;
        data.dispSkillId = dispList;
        data.skGrpId = skGrplist;
        data.skGrpName = $("#selSkGrpName").val();
        
        data.loginCheck = loginCheck;
        
        return $.extend({}, data)
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
                    resultSet.push({value:"", text:"전체", sel:"1"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name, sel:"0"
                    });
                });
                $("[data-ax5select='selPart']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        options: resultSet,
    		        onStateChanged: function () {
    		        	fnObj.searchView.teamSearch();
    		        },
					onChange: function()
					{
        	        	if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="selPart"]').ax5select("setValue",[0],true);
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
        	        				$('[data-ax5select="selPart"]').ax5select("setValue",[0],false);
        	        	    	
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
  	        	        			$('[data-ax5select="selPart"]').ax5select("setValue",[0],false);
  	        	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="selPart"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}       	        	
        	        }
                });
                $("[data-ax5select='selPart']").ax5select("setValue",resultSet[0].value);
                fnObj.searchView.teamSearch();
            }
        });
    },    
    teamSearch: function(){
        var data = {}; 
        data.grpcd = info.grpcd;
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
    	var tmpPartId = $("[data-ax5select='selPart']").ax5select("getValue");
    	var partId = "";
    	if(tmpPartId != "")
    	{	    	
	    	for(var i=0; i < tmpPartId.length; i++)
	    	{
	    		partId += tmpPartId[i].value + ";";
	    	}
	    	partId = partId.substring(0,partId.length-1);
    	}
    	data.partId = partId;
        data.skId = "";
        data.filter = "Y";
        
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/skteam",
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
                $("[data-ax5select='selTeam']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        options: resultSet,
    		        onStateChanged: function () {
    		        	fnObj.searchView.agentSearch("sel");
    		        },
					onChange: function()
					{
        	        	if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="selTeam"]').ax5select("setValue",[0],true);
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
        	        				$('[data-ax5select="selTeam"]').ax5select("setValue",[0],false);
        	        	    	
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
  	        	        			$('[data-ax5select="selTeam"]').ax5select("setValue",[0],false);
  	        	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="selTeam"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}       	        	
        	        }
                });
                $("[data-ax5select='selTeam']").ax5select("setValue",resultSet[0].value);
            }
        });
    },  
    agentSearch: function(_function){
    	var data = {};  
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
    	var tmpPartId = $("[data-ax5select='selPart']").ax5select("getValue");
    	var tmpTeamId = $("[data-ax5select='selTeam']").ax5select("getValue");
        if(_function != "all")
        {
        	if(tmpTeamId != "" && tmpTeamId[0].value != "")
        	{
	        	var partId = "";
	        	if(tmpPartId != "")
	        	{	    	
	    	    	for(var i=0; i < tmpPartId.length; i++)
	    	    	{
	    	    		partId += tmpPartId[i].value + ";";
	    	    	}
	    	    	partId = partId.substring(0,partId.length-1);
	        	}
	        	
	        	var teamId = "";
	        	if(tmpTeamId != "")
	        	{	    	
	    	    	for(var i=0; i < tmpTeamId.length; i++)
	    	    	{
	    	    		teamId += tmpTeamId[i].value + ";";
	    	    	}
	    	    	teamId = teamId.substring(0,teamId.length-1);
	        	}
	
	        	data.partId = partId;
	        	data.teamId = teamId;

	    	    axboot.ajax({
	                type: "POST",
	                url: "/api/mng/searchCondition/agentCfg",
	                cache : false,
	                data: JSON.stringify($.extend({}, data)),
	                callback: function (res) {
	                    var resultSet = [{value:"", text:"전체", sel:"1"}];
	                    res.list.forEach(function (n) {
	                    	resultSet.push({
	                            value: n.id, text: n.name, sel:"0"
	                        });
	                    });
	                    
	                    $("[data-ax5select='agentSelect']").ax5select({
	            	        theme: 'primary',
	            	        multiple: true,
	            	        options: resultSet,
	            	        onChange: function()
	            	        {
	            	        	//var agtSelText = $("#selText").val(); 
	            	        	//if(agtSelText.length > 0)
	            	        	//{
	            	        	//	$("#selText").val('');
	            	        	//}
	            	        	
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
	                    $('[data-ax5select="agentSelect"]').ax5select("setValue",resultSet[0].value);
	                }
	            });
        	}
        	else
        	{
	           	 var resultSet = [{value:"", text:"전체", sel:"1"}];
	        	 $("[data-ax5select='agentSelect']").ax5select({
	     	        theme: 'primary',
	    	        multiple: true,
	    	        options: resultSet,
	    	        onChange: function()
        	        {
	    	        	$('[data-ax5select="agentSelect"]').ax5select("setValue",resultSet[0].value);
        	        }
	        	 });
	             $('[data-ax5select="agentSelect"]').ax5select("setValue",resultSet[0].value);
        	}
        }
        else
        {
        	 var resultSet = [{value:"", text:"전체", sel:"1"}];
        	 $("[data-ax5select='agentSelect']").ax5select({
     	        theme: 'primary',
    	        multiple: true,
    	        options: resultSet,
    	        onChange: function()
    	        {
    	        	$('[data-ax5select="agentSelect"]').ax5select("setValue",resultSet[0].value);
    	        }
        	 });
             $('[data-ax5select="agentSelect"]').ax5select("setValue",resultSet[0].value);
        }
    },
    skillLevel: function(_function){
        $("[data-ax5select='selSkillLevel']").ax5select({
	        theme: 'primary',
	        multiple: true,
	        options: 
	        [
	        	{value: "", text: "전체", sel:"1"},
	        	{value: "1", text: "1", sel:"0"},
	        	{value: "2", text: "2", sel:"0"},
	        	{value: "3", text: "3", sel:"0"},
	        	{value: "9", text: "9", sel:"0"},
	        	{value: "99", text: "분배 제외", sel:"0"}
	        ],
	        onChange: function()
	        {
	        	if( this.item.selected.length  == 0 )
	        	{
	            	$('[data-ax5select="selSkillLevel"]').ax5select("setValue",[0],true);
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
	        				$('[data-ax5select="selSkillLevel"]').ax5select("setValue",[0],false);
	        	    	
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
      	        			$('[data-ax5select="selSkillLevel"]').ax5select("setValue",[0],false);
      	        			this.item.options[0].sel = "0" ;
	        			} 
	        			else
	        			{
	        				this.item.options[0].sel = "1" ;
    	        			for(var i = 1; i < this.item.options.length; i++)
    	        			{
    	        				$('[data-ax5select="selSkillLevel"]').ax5select("setValue",[this.item.options[i].value],false);
    	        			}
	        			}
	        			$('[data-ax5select-option-group]').click();
	        		}
	        	}    	        	
			}     
        });
    	$('[data-ax5select="selSkillLevel"]').ax5select("setValue",[0]); 
    },
    dispSklSearch: function(){
        var data = {}; 
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
  		var tmpChnId = $("[data-ax5select='selChannel']").ax5select("getValue");
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
  		
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/skillLvlChnMain/selectDispSkill",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                defaultDisp = [];
                var resultSet = [{value:"", text:"전체", sel:"1"}];
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.skillId, text: n.skillName, sel:"0"
                    });
                	
                	defaultDisp.push({
                		chnId:n.chnId,
                		chnName:n.chnName,
    	        		skillId: n.skillId, 
    	        		skillName: n.skillName
    	            });                	
                });
                
                $("[data-ax5select='selDispSkill']").ax5select({
        	        theme: 'primary',
        	        multiple: true,
        	        options: resultSet,
        	        onChange: function()
        	        {
        	        	if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="selDispSkill"]').ax5select("setValue",[0],true);
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
        	        				$('[data-ax5select="selDispSkill"]').ax5select("setValue",[0],false);
        	        	    	
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
              	        			$('[data-ax5select="selDispSkill"]').ax5select("setValue",[0],false);
              	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="selDispSkill"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}      	        	
        			}        	        	        	        
                });
                $('[data-ax5select="selDispSkill"]').ax5select("setValue",resultSet[0].value);
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
        	        	//var skillSelText = $("#txtSkillName").val(); 
    	        		//if(skillSelText.length > 0)
    	        		//{
    	        		//	$("#selSkGrpName").val('');
    	        		//}
    	        		
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
* searchView
*/
fnObj.searchViewSkill = axboot.viewExtend(axboot.searchView, {
  initView: function () {
      this.target = $(document["searchViewSkill"]);
      this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
  },
  getData: function () {
  		var data = {}; 
      
  		var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
  		var tmpChnId = $("[data-ax5select='selChannel']").ax5select("getValue");
		var chnId = "";
		if(tmpChnId != "")
		{	    	
			for(var i=0; i < tmpChnId.length; i++)
			{
				chnId += tmpChnId[i].value + ";";
			}
			chnId = chnId.substring(0,chnId.length-1);
		} 
		
		var tmpSkillId = $("[data-ax5select='selSkill']").ax5select("getValue");
		var skillId = "";
		if(tmpSkillId != "")
		{	    	
			for(var i=0; i < tmpSkillId.length; i++)
			{
				skillId += tmpSkillId[i].value + ";";
			}
			skillId = skillId.substring(0,skillId.length-1);
		} 
  	
		data.compId = compId;
		data.chnId = chnId;
		data.skillId = skillId;
		data.skillSelText = $("#txtSkillName").val();
		
		return $.extend({}, data)
  },
  chnSearch: function(){
      var data = {}; 
      data.grpcd = info.grpcd;
      data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
      
      axboot.ajax({
          type: "POST",
          url: "/api/mng/searchCondition/skchannel",
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
              $("[data-ax5select='selChannel']").ax5select({
            	  	theme: 'primary',
					multiple: true,
					options: resultSet,
					onStateChanged: function () {
						fnObj.searchViewSkill.skillSearch();
						fnObj.searchView.dispSklSearch();
					},
					onChange: function()
					{
						if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="selChannel"]').ax5select("setValue",[0],true);
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
        	        				$('[data-ax5select="selChannel"]').ax5select("setValue",[0],false);
        	        	    	
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
              	        			$('[data-ax5select="selChannel"]').ax5select("setValue",[0],false);
              	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="selChannel"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}      	        	
					}    
              });
              $('[data-ax5select="selChannel"]').ax5select("setValue",resultSet[0].value);
              fnObj.searchViewSkill.skillSearch();
              fnObj.searchView.dispSklSearch();
          }
      });
  },    
  skillSearch: function(){
      var data = {}; 
      data.grpcd = info.grpcd;
      data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
      var tmpChnId = $("[data-ax5select='selChannel']").ax5select("getValue");
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
              $("[data-ax5select='selSkill']").ax5select({
      	        	theme: 'primary',
      	        	multiple: true,
      	        	options: resultSet,
      	        	onChange: function()
      	        	{
      	        		//var skillSelText = $("#txtSkillName").val(); 
      	        		//if(skillSelText.length > 0)
      	        		//{
      	        		//	$("#txtSkillName").val('');
      	        		//}
      	        		
      	        		if( this.item.selected.length  == 0 )
        	        	{
        	            	$('[data-ax5select="selSkill"]').ax5select("setValue",[0],true);
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
        	        				$('[data-ax5select="selSkill"]').ax5select("setValue",[0],false);
        	        	    	
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
              	        			$('[data-ax5select="selSkill"]').ax5select("setValue",[0],false);
              	        			this.item.options[0].sel = "0" ;
        	        			} 
        	        			else
        	        			{
        	        				this.item.options[0].sel = "1" ;
            	        			for(var i = 1; i < this.item.options.length; i++)
            	        			{
            	        				$('[data-ax5select="selSkill"]').ax5select("setValue",[this.item.options[i].value],false);
            	        			}
        	        			}
        	        			$('[data-ax5select-option-group]').click();
        	        		}
        	        	}       
      	        	}
              });
              $("[data-ax5select='selSkill']").ax5select("setValue",resultSet[0].value);
          }
      });
  	}
});


/**
 * gridView
 */
fnObj.gridViewAgt = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;
        
        fnObj.gridViewAgt.setChnColumns();
        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-agt"]'),
            showLineNumber: false,
            showRowSelector: true,
            multipleSelect: true,
            frozenColumnIndex: 6,
            asidePanelWidth:100,
            virtualScrollX: true,
            virtualScrollY: true,
            page: {display: false},
            header: {
                align: "center",
                columnHeight: 28
            },
            columns: chnColumns,
            body: {
                align: "center",
                columnHeight: 28,
                onDBLClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                    if (this.column.key == "AGTNAME") 
                    {                    
                    	var data = this.list[this.dindex];
                    	if(data.__depth__ != '0')
                    	{
                    		ACTIONS.dispatch(ACTIONS.ITEM_CLICK, $.extend({}, data));
                    	}
                    }                    
                },
		        onDataChanged: function () {
                	if (this.key == '__selected__') 
                	{
                		this.self.updateChildRows(this.dindex, {__selected__: this.item.__selected__});
		            }
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
                    parentKey: "PID",
                    selfKey: "ID"
                }
            }
        });
    },
    getData: function (_type) {
        var _list = this.target.getList(_type);
        return _list;
    },
    setChnColumns: function () {
    	var list = $("[data-ax5select='selDispSkill']").ax5select("getValue");
    	if(list.length > 0 && list[0].value != "")
    	{
            chnColumns = [];
    		chnColumns.push({key: "PARTNAME", label: "센터", width: 150, align: "left", treeControl: true});
    		chnColumns.push({key: "TEAMNAME", label: "팀", width: 180, align: "center"});
    		chnColumns.push({key: "AGTLOGID", label: "시스템사번", width: 100, align: "center"});
    		chnColumns.push({key: "AGTNAME", label: "상담사", width: 80, align: "center", formatter:function(){
    			if(this.value != undefined)
    			{
    				return "<div><u>" + this.value + "</u></div>"
    			}
    		}});
    		chnColumns.push({key: "PROTECT_SKILL", label: "자율", width: 80, align: "center"}); 
    		chnColumns.push({key: "STATE", label: "상태", width: 80, align: "center", 
    			formatter:function()
    			{ 
    				if(this.item.AGTID != undefined)
    				{
    					if(this.item.STATE != undefined)
    					{
    						if(this.item.STATE != 0 && this.item.STATE != 10)
    						{
    							return "로그인";
    						}
    						else
    						{
    							return "로그아웃";
    						}    						
    					}
    					else
    					{
    						return "로그아웃";
    					}
    				}
    				else
    				{
    					return null;
    				}
    			}
    		});
    		
    		for(var i=0; i < list.length; i++)
	    	{
            	var chnName = "";
            	defaultDisp.forEach(function(m){
            		if(list[i].value == m.skillId){
            			chnName = m.chnName;
            		}
            	});
            	var colChk = false;
            	if(chnColumns.length>4){
            		chnColumns.forEach(function(m){
                		if (m.label == chnName) {
                			colChk = true;
                			m.columns.push({
    	    	        		key: list[i].value, 
    	    	        		label: list[i].text, 
    	    	        		width: 100,
    	    	        		align: "center", 
    	    	        		formatter: function(){
    	    	                	for(var i=0;i<sklLvl.length;i++)
    	    	                	{
    	    	                		if(sklLvl[i].code == this.value)
    	    	                		{
    	    	    	        			return "<div style = \"background-color:#FFC1C1;\">" + sklLvl[i].codeNm + "</div>";
    	    	                		}
    	    	                	}
    	    	                }
                    		});
                		}
                	});
            	}
            	if(!colChk){
            		chnColumns.push({
    	        		key: undefined, 
    	        		label: chnName, 
    	        		width: 100,
    	        		align: "center", 
    	        		columns:[{
	    	        		key: list[i].value, 
	    	        		label: list[i].text, 
	    	        		width: 100,
	    	        		align: "center", 
	    	        		formatter: function(){
	    	                	for(var i=0;i<sklLvl.length;i++)
	    	                	{
	    	                		if(sklLvl[i].code == this.value)
	    	                		{
	    	    	        			return "<div style = \"background-color:#FFC1C1;\">" + sklLvl[i].codeNm + "</div>";
	    	                		}
	    	                	}
	    	                }
                		}]
            		})
            	} 
            }    		
    		chnColumns.push({key: undefined, label: '작업자', width: 150, align: "center", columns:[
            	{key: "UPTEMPID", label: '성명', width: 150, align: "center"},
            	{key: "UPTDATE", label: '시간', width: 150, align: "center"}
            ]});
    	}else{
            chnColumns = [];
    		chnColumns.push({key: "PARTNAME", label: "센터", width: 150, align: "left", treeControl: true});
    		chnColumns.push({key: "TEAMNAME", label: "팀", width: 180, align: "center"});
    		chnColumns.push({key: "AGTLOGID", label: "시스템사번", width: 100, align: "center"});    		
    		chnColumns.push({key: "AGTNAME", label: "상담사", width: 80, align: "center", formatter:function(){
    			if(this.value != undefined)
    			{
    				return "<div><u>" + this.value + "</u></div>"
    			}
    		}});
    		chnColumns.push({key: "PROTECT_SKILL", label: "자율", width: 80, align: "center"});
    		chnColumns.push({key: "STATE", label: "상태", width: 80, align: "center", 
    			formatter:function()
    			{
    				if(this.item.AGTID != undefined)
    				{
    					if(this.item.STATE != undefined)
    					{
    						if(this.item.STATE != 0 && this.item.STATE != 10)
    						{
    							return "로그인";
    						}
    						else
    						{
    							return "로그아웃";
    						}    						
    					}
    					else
    					{
    						return "로그아웃";
    					}
    				}
    				else
    				{
    					return null;
    				}
    			}
    		});
    		     		
    		defaultDisp.forEach(function (n) {
            	var colChk = false;
            	if(chnColumns.length>4){
            		chnColumns.forEach(function(m){
                		if (m.label == n.chnName) {
                			colChk = true;
                			m.columns.push({
    	    	        		key: n.skillId, 
    	    	        		label: n.skillName, 
    	    	        		width: 100,
    	    	        		align: "center", 
    	    	        		formatter: function(){
    	    	                	for(var i=0;i<sklLvl.length;i++)
    	    	                	{
    	    	                		if(sklLvl[i].code == this.value)
    	    	                		{
    	    	    	        			return "<div style = \"background-color:#FFC1C1;\">" + sklLvl[i].codeNm + "</div>";
    	    	                		}
    	    	                	}
    	    	                }
                    		});
                		}
                	});
            	}
            	if(!colChk){
            		chnColumns.push({
    	        		key: undefined, 
    	        		label: n.chnName, 
    	        		width: 100,
    	        		align: "center", 
    	        		columns:[{
	    	        		key: n.skillId, 
	    	        		label: n.skillName, 
	    	        		width: 100,
	    	        		align: "center", 
	    	        		formatter: function(){
	    	                	for(var i=0;i<sklLvl.length;i++)
	    	                	{
	    	                		if(sklLvl[i].code == this.value)
	    	                		{
	    	    	        			return "<div style = \"background-color:#FFC1C1;\">" + sklLvl[i].codeNm + "</div>";
	    	                		}
	    	                	}
	    	                }
                		}]
            		})
            	}
            });           
    		chnColumns.push({key: undefined, label: '작업자', width: 150, align: "center", columns:[
            	{key: "UPTEMPID", label: '성명', width: 150, align: "center"},
            	{key: "UPTDATE", label: '시간', width: 150, align: "center"}
            ]});
    	}
    },
    exportExcel: function () {
    	this.target.exportExcel("상담사_스킬_관리(기본)_상담사.xls");
    }
});



fnObj.gridViewSkill = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-skill"]'),
            showLineNumber: false,
            showRowSelector: true,
            multipleSelect: true,
            frozenColumnIndex: 0,
            asidePanelWidth:100,
            virtualScrollX: true,
            virtualScrollY: true,
            page: {display: false},
            header: {
                align: "center",
                columnHeight: 28
            },
            columns: [
                {key: "chnName", label: '매체', width: 200, align: "left", treeControl: true},
                {key: "skillName", label: '스킬', width: 200, align: "left"}
            ],
            body: {
                align: "center",
                columnHeight: 28,
                onDataChanged: function () {
                	if (this.key == '__selected__') 
                	{
                		this.self.updateChildRows(this.dindex, {__selected__: this.item.__selected__});
                    }
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
    	this.target.exportExcel("상담사_스킬_관리(기본)_스킬.xls");
    }
});


$(window).unload(function(){
	ws.wDisconnect() ;
	setTimeout("",1000);
});