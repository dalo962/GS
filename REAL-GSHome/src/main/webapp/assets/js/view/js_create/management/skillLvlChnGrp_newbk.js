var fnObj = {};
var refid = '';
var regGb = '';

var skmenu = 2;

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
            url: "/api/mng/skillLvlChnGrp/selectSkillGrp",
            cache : false,
            data: JSON.stringify(caller.searchViewSkill.getData()),
            callback: function (res) {
            	caller.gridViewSkillGrp.setData(res);
            }
        });
        
        axboot.ajax({
            type: "POST",
            url: "/api/mng/skillLvlChnGrp/selectAgtSkill",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
            	caller.gridViewAgtGrp.initView();
            	caller.gridViewAgtGrp.setData(res);
            	
            	if(res.list.length > 0)
               	{
               		personTarget.innerText = "(" + res.list.length + "명)";
               	}
               	else
               	{
               		personTarget.innerText = "(0명)";
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
            url: "/api/mng/skillLvlChnGrp/selectAgtSkill",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
            	caller.gridViewAgtGrp.initView();
            	caller.gridViewAgtGrp.setData(res);
            	
            	if(res.list.length > 0)
               	{
               		personTarget.innerText = "(" + res.list.length + "명)";
               	}
               	else
               	{
               		personTarget.innerText = "(0명)";
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
            url: "/api/mng/skillLvlChnGrp/selectSkillGrp",
            cache : false,
            data: JSON.stringify(caller.searchViewSkill.getData()),
            callback: function (res) {
            	caller.gridViewSkillGrp.setData(res);
            }
        });        
    },
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridViewAgtGrp.exportExcel();
    	caller.gridViewSkillGrp.exportExcel();
    },
    PAGE_AGT_EXCEL: function (caller, act, data){
    	caller.gridViewAgtGrp.exportExcel();
    },
    PAGE_SK_EXCEL: function (caller, act, data){
    	caller.gridViewSkillGrp.exportExcel();
    },
    GRP_ADD: function (caller, act, data){
    	if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{
	    	var agList = [].concat(caller.gridViewAgtGrp.getData("selected"));
	    	var skList = [].concat(caller.gridViewSkillGrp.getData("selected"));
	    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    	var remark = $("#selTextRemark").val();
	    	var data = [];
	    	
	    	if(agList.length == 0)
	    	{
	    		alert("[대표그룹등록]\n상담사를 선택하세요.");
	    		return;
	    	}
	    	else if(skList.length == 0)
	    	{
	    		alert("[대표그룹등록]\n스킬그룹을 선택하세요.");
	    		return;
	    	}
	    		    	
	    	var prochk = 0;
	    	agList.forEach(function (n){
	    		if(n.PROTECT_SKILL == "O")
	    		{
	    			prochk = prochk + 1;
	    		}	    		
	    	})

	    	if(prochk > 0)
	    	{
	    		alert("[대표그룹등록]\n자율부여가 된 상담사는 대표그룹등록 할 수 없습니다.");
	    		return;
	    	}
	    	
	    	var skchk = 0;
	    	skList.forEach(function (n) {
	    		if(n.orgLevel == 1)
	    		{
	    			skchk = skchk + 1;
	    		}
	    	});  
	    	
	    	if(skchk > 1)
	    	{
	    		alert("[대표그룹등록]\n스킬그룹은 1개만 선택하세요.");
	    		return;
	    	}
	    	
	    	/*	 
	    	if(remark.length == 0)
	    	{
	    		alert("[대표그룹등록]\n변경 사유를 입력하시기 바랍니다.");
	    		return;
	    	}
	    	*/
	    	
	    	if(remark.length > 100)
	    	{
	    		alert("[대표그룹등록]\n변경 사유는 100자 이내로 입력하시기 바랍니다.");
	    		return;
	    	}
	    	  	
	    	agList.forEach(function (n) {
	    		skList.forEach(function (m) {
	    			n.grpid = m.id;
	    			n.agtDbid = n.AGTDBID;
	    			n.applyGrp = n.APPLY_GROUP;
	    			
	    			data.grpid = m.id
	    		});    		
	    	});
	    	
	    	axDialog.confirm({
	    		title:"확인",
	            msg: "[대표그룹등록]\n등록 하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	            if (this.key == "ok") {
	            	axboot.ajax({
			            type: "POST",
			            cache: false,
			            url: "/api/mng/skillLvlChnGrp/skillGrpAddCheck",
			            data: JSON.stringify($.extend({}, data)),
			            callback: function (res) {
			            	if(res.list.length > 0)
			            	{
			            		data = res.list;
			            		
			            		axMask.open();
			            		revCnt = agList.length;
			            		resCnt = 0;
			            		refCnt = 0;
					            reqData = [];
					            revData = [];
					            hisUrl = "/api/mng/skillLvlChnGrp/saveAgtSkill";  	                	
					            
					            agList.forEach(function(n){
					            	
					            	regGb = '대표그룹등록';

					            	var sklastindex = defaultDisp.length - 1;
					            	var del_dbid = "";
					            	
					            	// 1.갖고 있는 스킬 다 지워버림					            						            	
					            	defaultDisp.forEach(function(m, index)
					            	{
					            		if(n.AGTDBID != undefined)// && n[m.skillId] != undefined)
					            		{			
					            			if(n[m.skillId] != undefined)
				            				{
				            					del_dbid += m.skillDbid + ",";
				            				}
					            			
					            			if(sklastindex == index)
					            			{
					            				del_dbid = del_dbid.substring(0,del_dbid.length-1);
						            			
					            				//refid = ws.wDeleteSkill(n.AGTDBID, m.skillDbid);
						            			refid = ws.wDeleteSkillMulti(n.AGTDBID, del_dbid);
						            			
						            			if(refid == -1 && refid == "undefined")
							            		{
							            			alert("[대표그룹등록]\n스킬 삭제 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
					            			{
					            				alert("[대표그룹등록]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
						    		});
					            	
					            	var aglastindex = data.length - 1;
					            	var add_dbid = "";
					            	var add_level = "";
					            	
					            	// 2.해당스킬그룹의 스킬로 다 넣음
					            	data.forEach(function(d, index)
					            	{
					            		if(n.AGTDBID != undefined && d.skillDbid != undefined && d.skillLevel != undefined)
					            		{
					            			add_dbid += d.skillDbid + ",";
				            				add_level += d.skillLevel + ",";
					            			
					            			if(aglastindex == index)
					            			{
					            				add_dbid = add_dbid.substring(0,add_dbid.length-1);
						            			add_level = add_level.substring(0,add_level.length-1);		
						            			
					            				//refid = ws.wAddSkill(n.AGTDBID, d.skillDbid, d.skillLevel);
						            			refid = ws.wAddSkillMulti(n.AGTDBID, add_dbid, add_level);
					            			
						            			if(refid != -1 && refid != "undefined")
							            		{
						            				reqData[refid] = 
									               	{
									            		compId : compId,
							        					partName : n.AGTGRPNAME,
				        	        					teamName : n.AGTTEAMNAME,
				        	        					agtLogId : n.AGTLOGID,
				        	        					employeeid : n.AGTID,
								        				agtDbid : n.AGTDBID,
								        				agtName : n.AGTNAME,
								        				defaultGrp : n.DEFAULT_GROUP_NM,
								        				applyGrp : n.APPLY_GROUP_NM,
								        				skillId : d.id,
								        				skillDbid : d.skillDbid,  
								        				skillLevel : d.skillLevel, 
								        				grpname : d.name,
								        				grpid : d.id,							        				
								        				workRemark : remark,
								        				regGb : regGb,
							        					suss : "작업중"
									               	};
							    	            }
							            		else
							            		{
							            			alert("[대표그룹등록]\n스킬 추가 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
						            		{
					            				alert("[대표그룹등록]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
						            		}
					            			else if(d.skillDbid == undefined)
					            			{
					            				alert("[대표그룹등록]\n스킬 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}			
					            			else if(d.skillLevel == undefined)
					            			{
					            				alert("[대표그룹등록]\n스킬 레벨이 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
					            	});
					            	
					            	if(refid != -1 && refid != "undefined")
				            		{
					            		//resCnt++;					            		
				    	            	//revData.push(reqData[refid]);
				            		}
					            	else
					            	{
					            		//refCnt++;
					            	}
					            });							            					           
					            $("#selTextRemark").val("");					            
			            	}
			            	else
			            	{
			            		alert("[대표그룹등록]\n해당 스킬그룹에 스킬이 없습니다.\n스킬을 등록해 주시기 바랍니다.");
			            		return;
			            	}
			            },
			            options: {
			                onError: function (err) 
			                {
			                    alert("[대표그룹등록]\n스킬그룹 조회 작업에 실패하였습니다.");
			                    return;
			                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
			                }
			            }
			        });
	            }
	        });  
		}
    	else
    	{
			alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
			return;
		}
    },
    GRP_MOD: function (caller, act, data){
    	if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{
	    	var agList = [].concat(caller.gridViewAgtGrp.getData("selected"));
	    	var skList = [].concat(caller.gridViewSkillGrp.getData("selected"));
	    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    	var remark = $("#selTextRemark").val();
	    	var data = [];
	    	
	    	if(agList.length == 0)
	    	{
	    		alert("[스킬변경]\n상담사를 선택하세요.");
	    		return;
	    	}
	    	else if(skList.length == 0)
	    	{
	    		alert("[스킬변경]\n스킬그룹을 선택하세요.");
	    		return;
	    	}
	    	
	    	var dgchk = 0;
	    	var prochk = 0;
	    	agList.forEach(function (n){
	    		if(n.DEFAULT_GROUP == "" || n.DEFAULT_GROUP == undefined)
	    		{
	    			dgchk = dgchk + 1;
	    		}
	    		
	    		if(n.PROTECT_SKILL == "O")
	    		{
	    			prochk = prochk + 1;
	    		}	    		
	    	})
	    	
	    	if(dgchk > 0)
	    	{
	    		alert("[스킬변경]\n상담사의 대표그룹 등록 후 변경하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	if(prochk > 0)
	    	{
	    		alert("[스킬변경]\n자율부여가 된 상담사는 스킬 변경할 수 없습니다.");
	    		return;
	    	}
	    	
	    	var skchk = 0;
	    	skList.forEach(function (n) {
	    		if(n.orgLevel == 1)
	    		{
	    			skchk = skchk + 1;
	    		}
	    	});  
	    	
	    	if(skchk > 1)
	    	{
	    		alert("[스킬변경]\n스킬그룹은 1개만 선택하세요.");
	    		return;
	    	}
	    	    	
	    	/*
	    	if(remark.length == 0)
	    	{
	    		alert("[스킬변경]\n변경 사유를 입력하시기 바랍니다.");
	    		return;
	    	}
	    	*/
	    	
	    	if(remark.length > 100)
	    	{
	    		alert("[스킬변경]\n변경 사유는 100자 이내로 입력하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	agList.forEach(function (n) {
	    		skList.forEach(function (m) {
	    			n.grpid = m.id;
	    			n.agtDbid = n.AGTDBID;
	    			
	    			data.grpid = m.id;
	    		});    		
	    	});
	    	
	    	axDialog.confirm({
	    		title:"확인",
	            msg: "[스킬변경]\n변경 하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	            if (this.key == "ok") {
	            	axboot.ajax({
			            type: "POST",
			            cache: false,
			            url: "/api/mng/skillLvlChnGrp/skillGrpAddCheck",
			            data: JSON.stringify($.extend({}, data)),
			            callback: function (res) {
			            	if(res.list.length > 0)
			            	{
			            		data = res.list;
			            		
			            		axMask.open();
			            		revCnt = agList.length;
			            		resCnt = 0;
			            		refCnt = 0;
					            reqData = [];
					            revData = [];
					            hisUrl = "/api/mng/skillLvlChnGrp/saveAgtSkill";
					            
					            agList.forEach(function(n){
					            	
					            	regGb = '스킬변경';
							        
					            	var sklastindex = defaultDisp.length - 1;
					            	var del_dbid = "";
					            	
					            	// 1.갖고 있는 스킬 다 지워버림
					            	defaultDisp.forEach(function(m, index)
					            	{
					            		if(n.AGTDBID != undefined)// && n[m.skillId] != undefined)
					            		{
					            			if(n[m.skillId] != undefined)
				            				{
				            					del_dbid += m.skillDbid + ",";
				            				}
					            			
					            			if(sklastindex == index)
					            			{						            			
						            			del_dbid = del_dbid.substring(0,del_dbid.length-1);
		            							
						            			//refid = ws.wDeleteSkill(n.AGTDBID, m.skillDbid);
		            							refid = ws.wDeleteSkillMulti(n.AGTDBID, del_dbid);		            							
		            							
						            			if(refid == -1 && refid == "undefined")
							            		{
							            			alert("[스킬변경]\n스킬 삭제 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
					            			{
					            				alert("[스킬변경]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
						    		});
					            	
					            	var aglastindex = data.length - 1;
				            		var add_dbid = "";
					            	var add_level = "";
					            	
					            	// 2.해당스킬그룹의 스킬로 다 넣음
					            	data.forEach(function(d, index)
					            	{
					            		if(n.AGTDBID != undefined && d.skillDbid != undefined && d.skillLevel != undefined)
					            		{	
					            			add_dbid += d.skillDbid + ",";
				            				add_level += d.skillLevel + ",";
					            			
					            			if(aglastindex == index)
					            			{
					            				add_dbid = add_dbid.substring(0,add_dbid.length-1);
						            			add_level = add_level.substring(0,add_level.length-1);		
						            			
						            			//refid = ws.wAddSkill(n.AGTDBID, d.skillDbid, d.skillLevel);
						            			refid = ws.wAddSkillMulti(n.AGTDBID, add_dbid, add_level);						            				
						            			
						            			if(refid != -1 && refid != "undefined")
							            		{
							            			reqData[refid] = 
									               	{
									            		compId : compId,
							        					partName : n.AGTGRPNAME,
				        	        					teamName : n.AGTTEAMNAME,
				        	        					agtLogId : n.AGTLOGID,
				        	        					employeeid : n.AGTID,
								        				agtDbid : n.AGTDBID,
								        				agtName : n.AGTNAME,
								        				defaultGrp : n.DEFAULT_GROUP_NM,
								        				applyGrp : n.APPLY_GROUP_NM,
								        				skillId : d.id,
								        				skillDbid : d.skillDbid,  
								        				skillLevel : d.skillLevel, 
								        				grpname : d.name,
								        				grpid : d.id,							        				
								        				workRemark : remark,
								        				regGb : regGb,
							        					suss : "작업중"
									               	};
							    	            }
							            		else
							            		{
							            			alert("[스킬변경]\n스킬 추가 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
						            		{
					            				alert("[스킬변경]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
						            		}
					            			else if(d.skillDbid == undefined)
					            			{
					            				alert("[스킬변경]\n스킬 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}			
					            			else if(d.skillLevel == undefined)
					            			{
					            				alert("[스킬변경]\n스킬 레벨이 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
					            	});
					            	
					            	if(refid != -1 && refid != "undefined")
				            		{
					            		//resCnt++;					            		
				    	            	//revData.push(reqData[refid]);
				            		}
					            	else
					            	{
					            		//refCnt++;
					            	}
					            });		
					            $("#selTextRemark").val("");
			            	}
			            	else
			            	{
			            		alert("[스킬변경]\n해당 스킬그룹에 스킬이 없습니다.\n스킬을 등록해 주시기 바랍니다.");
			            		return;
			            	}
			            },
			            options: {
			                onError: function (err) 
			                {
			                    alert("[스킬변경]\n스킬그룹 조회 작업에 실패하였습니다.");
			                    return;
			                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
			                }
			            }
			        });
	            }
	        });
		}
    	else
    	{
			alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
			return;
		}
    },
    GRP_DEL: function (caller, act, data){
    	if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{
	    	var agList = [].concat(caller.gridViewAgtGrp.getData("selected"));
	    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    	var remark = $("#selTextRemark").val();
	    	var data = [];
	    	
	    	if(agList.length == 0)
	    	{
	    		alert("[스킬원복]\n상담사를 선택하세요.");
	    		return;
	    	}
	    	
	    	var dgchk = 0;
	    	var prochk = 0;
	    	agList.forEach(function (n){
	    		if(n.DEFAULT_GROUP == "" || n.DEFAULT_GROUP == undefined)
	    		{
	    			dgchk = dgchk + 1;
	    		}
	    		
	    		if(n.PROTECT_SKILL == "O")
	    		{
	    			prochk = prochk + 1;
	    		}	    		
	    	})
	    	
	    	if(dgchk > 0)
	    	{
	    		alert("[스킬원복]\n상담사의 대표그룹 등록 후 변경하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	if(prochk > 0)
	    	{
	    		alert("[스킬원복]\n자율부여가 된 상담사는 스킬 원복할 수 없습니다.");
	    		return;
	    	}
	    	
	    	/*
	    	if(remark.length == 0)
	    	{
	    		alert("[스킬원복]\n변경 사유를 입력하시기 바랍니다.");
	    		return;
	    	}
	    	*/
	    	
	    	if(remark.length > 100)
	    	{
	    		alert("[스킬원복]\n변경 사유는 100자 이내로 입력하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	/*agList.forEach(function (n) {
	    		n.agtDbid = n.AGTDBID;	
	    		n.defaultGrp = n.DEFAULT_GROUP;
	    		
	    		data.grpid = n.DEFAULT_GROUP;
	    	});*/	    	
	    	
	    	axDialog.confirm({
	    		title:"확인",
	            msg: "[스킬원복]\n원복 하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	            if (this.key == "ok") {
	            	axboot.ajax({
			            type: "POST",
			            cache: false,
			            url: "/api/mng/skillLvlChnGrp/skillGrpAddCheck",
			            data: JSON.stringify($.extend({}, data)),
			            callback: function (res) {
			            	if(res.list.length > 0)
			            	{			
			            		axMask.open();
			            		revCnt = agList.length;
			            		resCnt = 0;
			            		refCnt = 0;
					            reqData = [];
					            revData = [];
					            hisUrl = "/api/mng/skillLvlChnGrp/saveAgtSkill";
					            
					            agList.forEach(function(n){
					            	data = [];
					            						            	
					            	res.list.forEach(function(r){
				            			if(n.DEFAULT_GROUP == r.id)
				            			{
				            				data.push(r);
				            			}
				            		});	
					            	
					            	regGb = '스킬원복';
							        
					            	var sklastindex = defaultDisp.length - 1;
					            	var del_dbid = "";
					            	
					            	// 1.갖고 있는 스킬 다 지워버림
					            	defaultDisp.forEach(function(m, index)
					            	{
					            		if(n.AGTDBID != undefined)// && n[m.skillId] != undefined)
					            		{
					            			if(n[m.skillId] != undefined)
				            				{
				            					del_dbid += m.skillDbid + ",";
				            				}
					            			
					            			if(sklastindex == index)
					            			{
					            				del_dbid = del_dbid.substring(0,del_dbid.length-1);
					            				
						            			//refid = ws.wDeleteSkill(n.AGTDBID, m.skillDbid);
					            				refid = ws.wDeleteSkillMulti(n.AGTDBID, del_dbid);
						            			
						            			if(refid == -1 && refid == "undefined")
							            		{
							            			alert("[스킬원복]\n스킬 삭제 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
					            			{
					            				alert("[스킬원복]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
						    		});
					            	
					            	var aglastindex = data.length - 1;
					            	var add_dbid = "";
					            	var add_level = "";
					            	
					            	// 2.해당스킬그룹의 스킬로 다 넣음
					            	data.forEach(function(d, index)
					            	{
					            		if(n.AGTDBID != undefined && d.skillDbid != undefined && d.skillLevel != undefined)
					            		{	
					            			add_dbid += d.skillDbid + ",";
				            				add_level += d.skillLevel + ",";
					            			
					            			if(aglastindex == index)
					            			{
					            				add_dbid = add_dbid.substring(0,add_dbid.length-1);
						            			add_level = add_level.substring(0,add_level.length-1);	
						            			
						            			//refid = ws.wAddSkill(n.AGTDBID, d.skillDbid, d.skillLevel);
						            			refid = ws.wAddSkillMulti(n.AGTDBID, add_dbid, add_level);	
						            			
						            			if(refid != -1 && refid != "undefined")
							            		{
							            			reqData[refid] = 
									               	{
									            		compId : compId,
							        					partName : n.AGTGRPNAME,
				        	        					teamName : n.AGTTEAMNAME,
				        	        					agtLogId : n.AGTLOGID,
				        	        					employeeid : n.AGTID,
								        				agtDbid : n.AGTDBID,
								        				agtName : n.AGTNAME,
								        				defaultGrp : n.DEFAULT_GROUP_NM,
								        				applyGrp : n.APPLY_GROUP_NM,
								        				skillId : d.id,
								        				skillDbid : d.skillDbid,  
								        				skillLevel : d.skillLevel, 
								        				grpname : d.name,
								        				grpid : d.id,							        				
								        				workRemark : remark,
								        				regGb : regGb,
							        					suss : "작업중"
									               	};
							    	            }
							            		else
							            		{
							            			alert("[스킬원복]\n스킬 추가 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
						            		{
					            				alert("[스킬원복]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
						            		}
					            			else if(d.skillDbid == undefined)
					            			{
					            				alert("[스킬원복]\n스킬 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}			
					            			else if(d.skillLevel == undefined)
					            			{
					            				alert("[스킬원복]\n스킬 레벨이 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
					            	});
					            	
					            	if(refid != -1 && refid != "undefined")
				            		{
					            		//resCnt++;					            		
				    	            	//revData.push(reqData[refid]);
				            		}
					            	else
					            	{
					            		//refCnt++;
					            	}
					            });		
					            $("#selTextRemark").val("");
			            	}
			            	else
			            	{
			            		alert("[스킬원복]\n해당 스킬그룹에 스킬이 없습니다.\n스킬을 등록해 주시기 바랍니다.");
			            		return;
			            	}
			            },
			            options: {
			                onError: function (err) 
			                {
			                    alert("[스킬원복]\n스킬그룹 조회 작업에 실패하였습니다.");
			                    return;
			                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
			                }
			            }
			        });
	            }
	        });
		}
    	else
    	{
			alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
			return;
		}
    },    
    PRO_ADD: function (caller, act, data){
    	if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{    
	    	var agList = [].concat(caller.gridViewAgtGrp.getData("selected"));
	    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    	var remark = $("#selTextRemark").val();
	    	var data = [];
	    	
	    	if(agList.length == 0)
	    	{
	    		alert("[자율부여]\n상담사를 선택하세요.");
	    		return;
	    	}
	    	
	    	var dgchk = 0;
	    	var prochk = 0;
	    	agList.forEach(function (n){
	    		if(n.DEFAULT_GROUP == "" || n.DEFAULT_GROUP == undefined)
	    		{
	    			dgchk = dgchk + 1;
	    		}
	    		
	    		if(n.PROTECT_SKILL == "O")
	    		{
	    			prochk = prochk + 1;
	    		}	    		
	    	})
	    	
	    	if(dgchk > 0)
	    	{
	    		alert("[자율부여]\n상담사의 대표그룹 등록 후 변경하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	if(prochk > 0)
	    	{
	    		alert("[자율부여]\n자율부여가 된 상담사는 자율 부여할 수 없습니다.");
	    		return;
	    	}
	    	
	    	/*
	    	if(remark.length == 0)
	    	{
	    		alert("[자율부여]\n변경 사유를 입력하시기 바랍니다.");
	    		return;
	    	}
	    	*/
	    	
	    	if(remark.length > 100)
	    	{
	    		alert("[자율부여]\n변경 사유는 100자 이내로 입력하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	agList.forEach(function (n) {
	    		n.agtDbid = n.AGTDBID;	
	    		
	    		data.grpname = "자율근무";
	    	});
	    	
	    	axDialog.confirm({
	    		title:"확인",
	            msg: "[자율부여]\n자율부여 하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	            if (this.key == "ok") {
	            	axboot.ajax({
			            type: "POST",
			            cache: false,
			            url: "/api/mng/skillLvlChnGrp/skillGrpAddCheck",
			            data: JSON.stringify($.extend({}, data)),
			            callback: function (res) {
			            	if(res.list.length > 0)
			            	{
			            		data = res.list;
			            		
			            		axMask.open();
			            		revCnt = agList.length;
			            		resCnt = 0;
			            		refCnt = 0;
					            reqData = [];
					            revData = [];
					            hisUrl = "/api/mng/skillLvlChnGrp/saveAgtSkill";
					            
					            agList.forEach(function(n){
					            	
					            	regGb = '자율부여';
							        
					            	var sklastindex = defaultDisp.length - 1;
					            	var del_dbid = "";
					            	
					            	// 1.갖고 있는 스킬 다 지워버림
					            	defaultDisp.forEach(function(m, index)
					            	{
					            		if(n.AGTDBID != undefined)// && n[m.skillId] != undefined)
					            		{
					            			if(n[m.skillId] != undefined)
				            				{
				            					del_dbid += m.skillDbid + ",";
				            				}
					            			
					            			if(sklastindex == index)
					            			{
					            				del_dbid = del_dbid.substring(0,del_dbid.length-1);
					            				
						            			//refid = ws.wDeleteSkill(n.AGTDBID, m.skillDbid);
					            				refid = ws.wDeleteSkillMulti(n.AGTDBID, del_dbid);
						            			
						            			if(refid == -1 && refid == "undefined")
							            		{
							            			alert("[자율부여]\n스킬 삭제 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
					            			{
					            				alert("[자율부여]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
						    		});
					            	
					            	var aglastindex = data.length - 1;
					            	var add_dbid = "";
					            	var add_level = "";
					            	
					            	// 2.해당스킬그룹의 스킬로 다 넣음
					            	data.forEach(function(d, index)
					            	{
					            		if(n.AGTDBID != undefined && d.skillDbid != undefined && d.skillLevel != undefined)
					            		{	
					            			add_dbid += d.skillDbid + ",";
					            			add_level += d.skillLevel + ",";
					            			
					            			if(aglastindex == index)
					            			{
					            				add_dbid = add_dbid.substring(0,add_dbid.length-1);
						            			add_level = add_level.substring(0,add_level.length-1);	
						            			
						            			//refid = ws.wAddSkill(n.AGTDBID, d.skillDbid, d.skillLevel);	
						            			refid = ws.wAddSkillMulti(n.AGTDBID, add_dbid, add_level);
						            			
						            			if(refid != -1 && refid != "undefined")
							            		{
							            			reqData[refid] = 
									               	{
									            		compId : compId,
							        					partName : n.AGTGRPNAME,
				        	        					teamName : n.AGTTEAMNAME,
				        	        					agtLogId : n.AGTLOGID,
				        	        					employeeid : n.AGTID,
								        				agtDbid : n.AGTDBID,
								        				agtName : n.AGTNAME,
								        				defaultGrp : n.DEFAULT_GROUP_NM,
								        				applyGrp : n.APPLY_GROUP_NM,
								        				skillId : d.id,
								        				skillDbid : d.skillDbid,  
								        				skillLevel : d.skillLevel, 
								        				grpname : d.name,
								        				grpid : d.id,							        				
								        				workRemark : remark,
								        				regGb : regGb,
							        					suss : "작업중"
									               	};
							    	            }
							            		else
							            		{
							            			alert("[자율부여]\n스킬 추가 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
						            		{
					            				alert("[자율부여]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
						            		}
					            			else if(d.skillDbid == undefined)
					            			{
					            				alert("[자율부여]\n스킬 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}			
					            			else if(d.skillLevel == undefined)
					            			{
					            				alert("[자율부여]\n스킬 레벨이 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
					            	});
					            	
					            	if(refid != -1 && refid != "undefined")
					            	{
						            	//resCnt++;					            		
					    	           	//revData.push(reqData[refid]);
					            	}
						            else
						            {
						            	//refCnt++;
						            }
					            });		
					            $("#selTextRemark").val("");
			            	}
			            	else
			            	{
			            		alert("[자율부여]\n해당 스킬그룹에 스킬이 없습니다.\n스킬을 등록해 주시기 바랍니다.");
			            		return;
			            	}
			            },
			            options: {
			                onError: function (err) 
			                {
			                    alert("[자율부여]\n스킬그룹 조회 작업에 실패하였습니다.");
			                    return;
			                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
			                }
			            }
			        });
	            }
	        });
		}
    	else
    	{
			alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
			return;
		}
    },
    PRO_DEL: function (caller, act, data){
    	if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{    
	    	var agList = [].concat(caller.gridViewAgtGrp.getData("selected"));
	    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    	var remark = $("#selTextRemark").val();
	    	var data = [];
	    	
	    	if(agList.length == 0)
	    	{
	    		alert("[자율원복]\n상담사를 선택하세요.");
	    		return;
	    	}	    	
	    	
	    	var dgchk = 0;
	    	var prochk = 0;
	    	agList.forEach(function (n){
	    		if(n.DEFAULT_GROUP == "" || n.DEFAULT_GROUP == undefined)
	    		{
	    			dgchk = dgchk + 1;
	    		}
	    		
	    		if(n.PROTECT_SKILL == "X")
	    		{
	    			prochk = prochk + 1;
	    		}	    		
	    	})
	    	
	    	if(dgchk > 0)
	    	{
	    		alert("[자율원복]\n상담사의 대표그룹 등록 후 변경하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	if(prochk > 0)
	    	{
	    		alert("[자율원복]\n자율부여가 되지 않은 상담사는 자율 원복할 수 없습니다.");
	    		return;
	    	}
	    	
	    	/*
	    	if(remark.length == 0)
	    	{
	    		alert("[자율원복]\n변경 사유를 입력하시기 바랍니다.");
	    		return;
	    	}
	    	*/
	    	
	    	if(remark.length > 100)
	    	{
	    		alert("[자율원복]\n변경 사유는 100자 이내로 입력하시기 바랍니다.");
	    		return;
	    	}
	    	
	    	/*agList.forEach(function (n) {
	    		n.agtDbid = n.AGTDBID;	
	    		n.defaultGrp = n.DEFAULT_GROUP;
	    		
	    		data.grpid = n.DEFAULT_GROUP;
	    	});*/
	    	
	    	axDialog.confirm({
	    		title:"확인",
	            msg: "[자율원복]\n원복 하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	            if (this.key == "ok") {
	            	axboot.ajax({
			            type: "POST",
			            cache: false,
			            url: "/api/mng/skillLvlChnGrp/skillGrpAddCheck",
			            data: JSON.stringify($.extend({}, data)),
			            callback: function (res) {
			            	if(res.list.length > 0)
			            	{
			            		axMask.open();
			            		revCnt = agList.length;
			            		resCnt = 0;
			            		refCnt = 0;
					            reqData = [];
					            revData = [];
					            hisUrl = "/api/mng/skillLvlChnGrp/saveAgtSkill";
					            
					            agList.forEach(function(n){
					            	data = [];
					            	
					            	res.list.forEach(function(r){
				            			if(n.DEFAULT_GROUP == r.id)
				            			{
				            				data.push(r);
				            			}
				            		});	
					            	
					            	regGb = '자율원복';

					            	var sklastindex = defaultDisp.length - 1;
					            	var del_dbid = "";
					            	
					            	// 1.갖고 있는 스킬 다 지워버림
					            	defaultDisp.forEach(function(m, index)
					            	{
					            		if(n.AGTDBID != undefined)// && n[m.skillId] != undefined)
					            		{
					            			if(n[m.skillId] != undefined)
				            				{
				            					del_dbid += m.skillDbid + ",";
				            				}
					            			
					            			if(sklastindex == index)
					            			{
					            				del_dbid = del_dbid.substring(0,del_dbid.length-1);
					            				
						            			//refid = ws.wDeleteSkill(n.AGTDBID, m.skillDbid);
					            				refid = ws.wDeleteSkillMulti(n.AGTDBID, del_dbid);
						            			
						            			if(refid == -1 && refid == "undefined")
							            		{
							            			alert("[자율원복]\n스킬 삭제 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
					            			{
					            				alert("[자율원복]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
						    		});
					            	
					            	var aglastindex = data.length - 1;
					            	var add_dbid = "";
					            	var add_level = "";
					            	
					            	// 2.해당스킬그룹의 스킬로 다 넣음
					            	data.forEach(function(d, index)
					            	{
					            		if(n.AGTDBID != undefined && d.skillDbid != undefined && d.skillLevel != undefined)
					            		{
					            			add_dbid += d.skillDbid + ",";
					            			add_level += d.skillLevel + ",";	
					            			
					            			if(aglastindex == index)
					            			{
					            				add_dbid = add_dbid.substring(0,add_dbid.length-1);
						            			add_level = add_level.substring(0,add_level.length-1);		
						            		
						            			//refid = ws.wAddSkill(n.AGTDBID, d.skillDbid, d.skillLevel);	
						            			refid = ws.wAddSkillMulti(n.AGTDBID, add_dbid, add_level);
						            			
						            			if(refid != -1 && refid != "undefined")
							            		{
							            			reqData[refid] = 
									               	{
									            		compId : compId,
							        					partName : n.AGTGRPNAME,
				        	        					teamName : n.AGTTEAMNAME,
				        	        					agtLogId : n.AGTLOGID,
				        	        					employeeid : n.AGTID,
								        				agtDbid : n.AGTDBID,
								        				agtName : n.AGTNAME,
								        				defaultGrp : n.DEFAULT_GROUP_NM,
								        				applyGrp : n.APPLY_GROUP_NM,
								        				skillId : d.id,
								        				skillDbid : d.skillDbid,  
								        				skillLevel : d.skillLevel, 
								        				grpname : d.name,
								        				grpid : d.id,							        				
								        				workRemark : remark,
								        				regGb : regGb,
							        					suss : "작업중"
									               	};
							    	            }
							            		else
							            		{
							            			alert("[자율원복]\n스킬 추가 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.AGTDBID == undefined)
						            		{
					            				alert("[자율원복]\n상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
						            		}
					            			else if(d.skillDbid == undefined)
					            			{
					            				alert("[자율원복]\n스킬 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}			
					            			else if(d.skillLevel == undefined)
					            			{
					            				alert("[자율원복]\n스킬 레벨이 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
					            	});
					            	
					            	if(refid != -1 && refid != "undefined")
					            	{
						            	//resCnt++;					            		
					    	           	//revData.push(reqData[refid]);
					            	}
						            else
						            {
						            	//refCnt++;
						            }
					            });		
						        $("#selTextRemark").val("");
			            	}
			            	else
			            	{
			            		alert("[자율원복]\n해당 스킬그룹에 스킬이 없습니다.\n스킬을 등록해 주시기 바랍니다.");
			            		return;
			            	}
			            },
			            options: {
			                onError: function (err) 
			                {
			                    alert("[자율원복]\n스킬그룹 조회 작업에 실패하였습니다.");
			                    return;
			                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
			                }
			            }
			        });
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
	
	$("#selDefaultGrpText").keypress(function(e){
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
				        	_this.searchViewSkill.skillGrpSearch();
				        	_this.searchView.defaultGrpSearch();
					       	_this.searchView.applyGrpSearch();
					       	_this.searchView.dispSklSearch();
				        },
				        options: resultSet,
			        });
			       	_this.searchView.partSearch();
			       	_this.searchViewSkill.skillGrpSearch();
			       	_this.searchView.defaultGrpSearch();
			       	_this.searchView.applyGrpSearch();
			       	_this.searchView.dispSklSearch();
			    }
			});
	    }
    });
	
	_this.pageButtonView.initView();
	_this.searchView.initView();
	_this.searchViewSkill.initView();
	_this.gridViewSkillGrp.initView();
	_this.gridViewAgtGrp.initView();

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


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_EXCEL);
            },
            "save": function () {
        		ACTIONS.dispatch(ACTIONS.GRP_ADD);
        	}
        });
        
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"skGrpDel": function () {
          	 	ACTIONS.dispatch(ACTIONS.GRP_DEL);
          	},
        	"skGrpMod": function () {
          	 	ACTIONS.dispatch(ACTIONS.GRP_MOD);
          	},
        	"skProAdd": function () {
          	 	ACTIONS.dispatch(ACTIONS.PRO_ADD);
          	},
        	"skProDel": function () {
          	 	ACTIONS.dispatch(ACTIONS.PRO_DEL);
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
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        
        var protect = [];
		protect.push({value: "", text: "전체" });
		protect.push({value: "O", text: "O" });
		protect.push({value: "X", text: "X" });

		$("[data-ax5select='selProtect']").ax5select({
	        theme: 'primary',
	        options: protect,
	        onChange: function () {
	        	
	        }
        });
		
		$("[data-ax5select='selModifyGrp']").ax5select({
	        theme: 'primary',
	        options: protect,
	        onChange: function () {
	        	
	        }
        });	
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
    	
    	var protect = $("[data-ax5select='selProtect']").ax5select("getValue")[0].value;    
 	    	
    	var tmpdefaultGrp = $("[data-ax5select='selDefaultGrp']").ax5select("getValue");
    	var defaultGrp = "";
    	if(tmpdefaultGrp != "")
    	{	    	
	    	for(var i=0; i < tmpdefaultGrp.length; i++)
	    	{
	    		defaultGrp += tmpdefaultGrp[i].value + ";";
	    	}
	    	defaultGrp = defaultGrp.substring(0,defaultGrp.length-1);
    	} 
    	
    	var tmpapplyGrp = $("[data-ax5select='selApplyGrp']").ax5select("getValue");
    	var applyGrp = "";
    	if(tmpapplyGrp != "")
    	{	    	
	    	for(var i=0; i < tmpapplyGrp.length; i++)
	    	{
	    		applyGrp += tmpapplyGrp[i].value + ";";
	    	}
	    	applyGrp = applyGrp.substring(0,applyGrp.length-1);
    	} 
    	
    	var modifyGrp = $("[data-ax5select='selModifyGrp']").ax5select("getValue")[0].value;
    	
    	var dispList = "";
    	for(var i=0; i < defaultDisp.length; i++)
    	{
    		dispList += defaultDisp[i].skillId + ",";
    	}
    	dispList = dispList.substring(0,dispList.length-1);
    	
    	var loginCheck = $("#loginCheck").is(":checked");
		
	    if(loginCheck == true) loginCheck = 'Y';
    	else loginCheck = 'N';  
    	
        data.compId = compId;
        data.partId = partId;
        data.teamId = teamId;
        data.teamName = $("#selTeamName").val();

        data.protect = protect;
        data.agtSelText = $("#selText").val();
        data.employeeid = $("#selemText").val();
        
    	data.defaultGrp = defaultGrp;
    	data.applyGrp = applyGrp;
    	data.modifyGrp = modifyGrp;
    	
    	data.dispSkillId = dispList;
    	
    	data.loginCheck = loginCheck;
    	
    	data.defaultGrpName = $("#selDefaultGrpText").val();
    	
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
    defaultGrpSearch: function(){
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
	            	if(n.name != "자율근무")
	            	{
	            		resultSet.push({
	            			value: n.id, text: n.name, sel:"0"
	            		});
	            	}
	            });
	            $("[data-ax5select='selDefaultGrp']").ax5select({
	            	theme: 'primary',
	            	options: resultSet,
	            	multiple: true,
	            	onChange: function()
	            	{
	            		if( this.item.selected.length  == 0 )
	    	        	{
	    	            	$('[data-ax5select="selDefaultGrp"]').ax5select("setValue",[0],true);
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
	    	        				$('[data-ax5select="selDefaultGrp"]').ax5select("setValue",[0],false);
	    	        	    	
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
	          	        			$('[data-ax5select="selDefaultGrp"]').ax5select("setValue",[0],false);
	          	        			this.item.options[0].sel = "0" ;
	    	        			} 
	    	        			else
	    	        			{
	    	        				this.item.options[0].sel = "1" ;
	        	        			for(var i = 1; i < this.item.options.length; i++)
	        	        			{
	        	        				$('[data-ax5select="selDefaultGrp"]').ax5select("setValue",[this.item.options[i].value],false);
	        	        			}
	    	        			}
	    	        			$('[data-ax5select-option-group]').click();
	    	        		}
	    	        	}      	        	
					}  
	            });
	            $('[data-ax5select="selDefaultGrp"]').ax5select("setValue",resultSet[0].value);
	        }
	  	});
    },  
    applyGrpSearch: function(){
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
	            $("[data-ax5select='selApplyGrp']").ax5select({
	            	theme: 'primary',
	            	options: resultSet,
	            	multiple: true,
	            	onChange: function()
	            	{
	            		if( this.item.selected.length  == 0 )
	    	        	{
	    	            	$('[data-ax5select="selApplyGrp"]').ax5select("setValue",[0],true);
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
	    	        				$('[data-ax5select="selApplyGrp"]').ax5select("setValue",[0],false);
	    	        	    	
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
	          	        			$('[data-ax5select="selApplyGrp"]').ax5select("setValue",[0],false);
	          	        			this.item.options[0].sel = "0" ;
	    	        			} 
	    	        			else
	    	        			{
	    	        				this.item.options[0].sel = "1" ;
	        	        			for(var i = 1; i < this.item.options.length; i++)
	        	        			{
	        	        				$('[data-ax5select="selApplyGrp"]').ax5select("setValue",[this.item.options[i].value],false);
	        	        			}
	    	        			}
	    	        			$('[data-ax5select-option-group]').click();
	    	        		}
	    	        	}
	  				}  
	            });
	            $('[data-ax5select="selApplyGrp"]').ax5select("setValue",resultSet[0].value);
	        }
	  	});
    },
    dispSklSearch: function(){
        var data = {}; 
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/skillLvlChnGrp/selectDispSkill",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                defaultDisp = [];
                
                res.list.forEach(function (n) {                	
                	defaultDisp.push({
                		chnId:n.chnId,
                		chnName:n.chnName,
    	        		skillId: n.skillId, 
    	        		skillName: n.skillName,
    	        		skillDbid: n.skillDbid
    	            });
                });           
            }
	    });
    }
});


//== view 시작
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

		var tmpSkillGrpId = $("[data-ax5select='selSkillGrp']").ax5select("getValue");
		var skillGrpId = "";
		if(tmpSkillGrpId != "")
		{	    	
			for(var i=0; i < tmpSkillGrpId.length; i++)
			{
				skillGrpId += tmpSkillGrpId[i].value + ";";
			}
			skillGrpId = skillGrpId.substring(0,skillGrpId.length-1);
		} 
      
		data.compId = compId;
		data.skillGrpId = skillGrpId;
		data.skillGrpName = $("#txtSkillName").val();
				
		return $.extend({}, data)
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
            	if(n.name != "자율근무")
            	{
            		resultSet.push({
            			value: n.id, text: n.name, sel:"0"
            		});
            	}
              });
              $("[data-ax5select='selSkillGrp']").ax5select({
      	        theme: 'primary',
      	        multiple: true,
      	        options: resultSet,
      	        onChange: function()
      	        {
      	        	var skillSelText = $("#txtSkillName").val(); 
  	        		if(skillSelText.length > 0)
  	        		{
  	        			$("#txtSkillName").val('');
  	        		}
  	        		
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
fnObj.gridViewAgtGrp = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        fnObj.gridViewAgtGrp.setChnColumns();
        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-agtGrp"]'),
            showLineNumber: false,
            showRowSelector: true,
            multipleSelect: true,
            frozenColumnIndex: 8,
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
                	//if (this.key == '__selected__') {
                	//	this.self.updateChildRows(this.dindex, {__selected__: this.item.__selected__});
		            // }
		        }      
            },
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
            chnColumns.push({key: "AGTGRPNAME", label: "센터", width: 100, align: "center", sortable: true});
            chnColumns.push({key: "AGTTEAMNAME", label: "팀", width: 180, align: "center", sortable: true});
            chnColumns.push({key: "AGTLOGID", label: "시스템사번", width: 100, align: "center", sortable: true});
            chnColumns.push({key: "AGTNAME", label: "상담사", width: 70, align: "center", sortable: true, formatter:function(){
    			if(this.value != undefined)
    			{
    				return "<div><u>" + this.value + "</u></div>"
    			}
    		}});
            
            chnColumns.push({key: "DEFAULT_GROUP_NM", label: "대표그룹", width: 100, align: "center", sortable: true, formatter: function(){
            	if(this.value != undefined)
            	{
	        		return "<div style = \"background-color:#FFD700;\"><b>" + this.value + "</b></div>";
            	}            	
            }});
            chnColumns.push({key: "APPLY_GROUP_NM", label: "현재그룹", width: 100, align: "center", sortable: true});
            chnColumns.push({key: "PROTECT_SKILL", label: "자율", width: 80, align: "center", sortable: true});            
            
            chnColumns.push({key: "STATE", label: "상태", width: 70, align: "center", sortable: true, 
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
            	if(chnColumns.length>3){
            		chnColumns.forEach(function(m){
                		if (m.label == chnName) {
                			colChk = true;
                			m.columns.push({
    	    	        		key: list[i].value, 
    	    	        		label: list[i].text, 
    	    	        		width: 100,
    	    	        		align: "center", 
    	    	        		formatter: function(){
    	    	                	for(var i=0;i<sklLvl.length;i++){
    	    	                		if(sklLvl[i].code == this.value){
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
	    	                	for(var i=0;i<sklLvl.length;i++){
	    	                		if(sklLvl[i].code == this.value){
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
            chnColumns.push({key: "AGTGRPNAME", label: "센터", width: 100, align: "center", sortable: true});
            chnColumns.push({key: "AGTTEAMNAME", label: "팀", width: 180, align: "center", sortable: true});
            chnColumns.push({key: "AGTLOGID", label: "시스템사번", width: 100, align: "center", sortable: true});
            chnColumns.push({key: "AGTNAME", label: "상담사", width: 70, align: "center", sortable: true, formatter:function(){
    			if(this.value != undefined)
    			{
    				return "<div><u>" + this.value + "</u></div>"
    			}
    		}});
            
            chnColumns.push({key: "DEFAULT_GROUP_NM", label: "대표그룹", width: 100, align: "center", sortable: true, formatter: function(){
            	if(this.value != undefined)
            	{
	        		return "<div style = \"background-color:#FFD700;\"><b>" + this.value + "</b></div>";
            	}            	
            }});
            chnColumns.push({key: "APPLY_GROUP_NM", label: "현재그룹", width: 100, align: "center", sortable: true});
            chnColumns.push({key: "PROTECT_SKILL", label: "자율", width: 80, align: "center", sortable: true});  
            
            chnColumns.push({key: "STATE", label: "상태", width: 70, align: "center", sortable: true, 
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
            	if(chnColumns.length>3){
            		chnColumns.forEach(function(m){
                		if (m.label == n.chnName) {
                			colChk = true;
                			m.columns.push({
    	    	        		key: n.skillId, 
    	    	        		label: n.skillName, 
    	    	        		width: 100,
    	    	        		align: "center", 
    	    	        		formatter: function(){
    	    	                	for(var i=0;i<sklLvl.length;i++){
    	    	                		if(sklLvl[i].code == this.value){
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
	    	                	for(var i=0;i<sklLvl.length;i++){
	    	                		if(sklLvl[i].code == this.value){
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
    	this.target.exportExcel("상담사_스킬_관리(그룹)_상담사.xls");
    }
});


/**
 * gridView
 */
fnObj.gridViewSkillGrp = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;
        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-skill"]'),
            showLineNumber: false,
            showRowSelector: true,
            multipleSelect: false,
            frozenColumnIndex: 0,
            virtualScrollX: true,
            asidePanelWidth:100,
            virtualScrollY: true,
            page: {display: false},
            header: {
                align: "center",
                columnHeight: 28,
                selector: false,
            },
            columns: [
            	// 그냥 키로 생성만 안해주면 화면에 안보이고 데이터는 가지고 있는다.
            	{key: "skillGrpName", label: "적용 대상 스킬그룹", width: 200, align: "center", treeControl: true, collapse: true},
                //{key: "skillName", label: "스킬", width: 150, align: "center"},
                //{key: "skillLevel", label: "스킬 레벨", width: 80, align: "center", formatter: function(){
                //	for(var i=0;i<sklLvl.length;i++){
                //		if(sklLvl[i].code == this.value){
                //			return sklLvl[i].codeNm;
                //		}
                //	}}
	            //}
            ],
            body: {
                align: "center",
                columnHeight: 28,
                onDataChanged: function () {
                	if(this.item.orgLevel == 2)
                	{
                		if(this.item.__selected__)
                		{
                			this.item.__selected__ = false;
                		}
                		else
                		{
                			this.item.__selected__ = true;
                		}                		                		
                	}
                	
                	//if (this.key == '__selected__') {
                	//	this.self.updateChildRows(this.dindex, {__selected__: this.item.__selected__});
                    //}
                },
                onClick: function () {
                	//console.log("[onClick] index : " + this.dindex + " , value : " + this.value);
                }
            }/*,
            tree: {
                use: true,
                indentWidth: 10,
                arrowWidth: 15,
                iconWidth: 18,
                icons: {
                    openedArrow: '▼',
                    collapsedArrow: '',
                    groupIcon: '',
                    collapsedGroupIcon: '',
                    itemIcon: ''
                },
                columnKeys: {
                    parentKey: "pid",
                    selfKey: "id",
                    collapse:"skillGrpName",
                }
            }*/          
        });
    },
    getData: function (_type) {
        var _list = this.target.getList(_type);
        return _list;
    },
    exportExcel: function () {
    	this.target.exportExcel("상담사_스킬_관리(그룹)_스킬그룹.xls");
    }
});

$(window).unload(function(){
	ws.wDisconnect() ;
	setTimeout("",1000);
});