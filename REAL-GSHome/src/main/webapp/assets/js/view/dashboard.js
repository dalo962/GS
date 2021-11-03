var fnObj = {};

/**
 * 2017-07-18 추가 JavaScript에서 Map을 사용하기 위해 객체 생성을 선언한다.
 * 
 */
Map = function(){
	 this.map = new Object();
};

/**
 * 2017-07-18 추가 JavaScript에서 Map을 사용하기 위해 함수를 선언한다.
 * var map = new Map();
 * map.put("id", "test");
 * map.get("id");
 */
Map.prototype = {   
	    put : function(key, value){   
	        this.map[key] = value;
	    },   
	    get : function(key){   
	        return this.map[key];
	    },
	    containsKey : function(key){    
	     return key in this.map;
	    },
	    containsValue : function(value){    
	     for(var prop in this.map){
	      if(this.map[prop] == value) return true;
	     }
	     return false;
	    },
	    isEmpty : function(key){    
	     return (this.size() == 0);
	    },
	    clear : function(){   
	     for(var prop in this.map){
	      delete this.map[prop];
	     }
	    },
	    remove : function(key){    
	     delete this.map[key];
	    },
	    keys : function(){   
	        var keys = new Array();   
	        for(var prop in this.map){   
	            keys.push(prop);
	        }   
	        return keys;
	    },
	    values : function(){   
	     var values = new Array();   
	        for(var prop in this.map){   
	         values.push(this.map[prop]);
	        }   
	        return values;
	    },
	    size : function(){
	      var count = 0;
	      for (var prop in this.map) {
	        count++;
	      }
	      return count;
	    }
	};
	

fnObj.refIds = {}; //winker 서버 refId 관리 객체

fnObj.StatIDComps = "509↑510↑512↑518"; //회사 통계항목 statId String

fnObj.MapCompID = new Map() ;
fnObj.MapCompStatID = new Map() ;


fnObj.StatIDSkills = "501↑510↑512↑518"; //스킬 통계항목 statId String

fnObj.MapSkillID = new Map() ;
fnObj.MapSkillStatID = new Map() ;

fnObj.StatIDDNISs = "501↑510↑505"; //스킬 통계항목 statId String

fnObj.MapDNISID = new Map() ;
fnObj.MapDNISStatID = new Map() ;

fnObj.gridInitialized= false ;

rres = [];
var label = [];
var series= [    
  ];

fnObj.chartskillDbid = "";



var ACTIONS = axboot.actionExtend(fnObj, {
	//모니터링 대상 회사 목록 조회
	COMP_SEARCH: function (caller, act, data) {
    	axboot.ajax({
            type: "GET",
            url: "/api/rtsetting/monitorComp",
            data: {reportCd: reportCd},
            callback: function(res){
            	//console.log(res);
            	fnObj.grid01Index = {}; //그리드 인덱스 관리 객체
            	fnObj.ObjectIDComps = ""; //회사 DBId String
            	fnObj.ObjectIDCompsArr = null ; //회사 DBId String
            	
            	for(var index in res) {
            		var objectCd = res[index].objectCd; //스킬 DBId
            		fnObj.grid01Index[objectCd] = res[index].sort; //스킬 그리드 인덱스 입력
            		fnObj.ObjectIDComps += objectCd; //스킬 DBId String 추가
            		
            		fnObj.MapCompID.put(objectCd, objectCd) ;
            		//마지막이 아니면 ↑ 추가
            		if(res.length-1 != index) {
            			fnObj.ObjectIDComps += "↑";
            		}
            	}
            	fnObj.ObjectIDCompsArr = fnObj.ObjectIDComps.split("↑");
            	
            	var compStatIDArr = fnObj.StatIDComps.split("↑");
            	for(var i=0; i<compStatIDArr.length;i++){
            		fnObj.MapCompStatID.put(compStatIDArr[i], compStatIDArr[i]);
            	}
            	
                caller.gridView01.setData(res); //그리드 데이터 셋팅
                
                
                var refId = fnObj.winkerServer.requestComp(); //스킬 통계 요청
                
              //refId -1이면 통계 요청 실패
        		if(refId !== -1) {
        			fnObj.refIds.dashComp = refId;
        		} else {
        			console.log("winker server dashComp request fail");
        		}
            }
    		
        });
        return false;
    },
	//모니터링 대상 스킬 목록 조회
	SKILL_SEARCH: function (caller, act, data) {
    	axboot.ajax({
            type: "GET",
            url: "/api/rtsetting/monitorSkill",
            data: {reportCd: reportCd},
            callback: function(res){
            	fnObj.grid02Index = {}; //그리드 인덱스 관리 객체
            	fnObj.ObjectIDSkills = ""; //스킬 DBId String
            	fnObj.ObjectIDSkillsArr = null ; //스킬 DBId String
            	fnObj.chartskillDbid = "";
            	for(var index in res) {
            		var objectCd = res[index].objectCd; //스킬 DBId
            		fnObj.grid02Index[objectCd] = res[index].sort; //스킬 그리드 인덱스 입력
            		fnObj.ObjectIDSkills += objectCd; //스킬 DBId String 추가
            		
            		fnObj.MapSkillID.put(objectCd, objectCd) ;
            		
            		if(res[index].remark === "Y")
            			fnObj.chartskillDbid = objectCd;
            		
            		//마지막이 아니면 ↑ 추가
            		if(res.length-1 != index) {
            			fnObj.ObjectIDSkills += "↑";
            		}
            	}
            	fnObj.ObjectIDSkillsArr = fnObj.ObjectIDSkills.split("↑");
            	
            	var skillStatIDArr = fnObj.StatIDSkills.split("↑");
            	for(var i=0; i<skillStatIDArr.length;i++){
            		fnObj.MapSkillStatID.put(skillStatIDArr[i], skillStatIDArr[i]);
            	}
            	
                caller.gridView02.setData(res); //그리드 데이터 셋팅
                
                
                var refId = fnObj.winkerServer.requestSkill(); //스킬 통계 요청
                
              //refId -1이면 통계 요청 실패
        		if(refId !== -1) {
        			fnObj.refIds.dashSkill = refId;
        		} else {
        			console.log("winker server dashSkill request fail");
        		}
        		
        		if(fnObj.chartskillDbid !== ""){
	        		//차트
	                var date = new Date();
	                var yyyy = date.getFullYear().toString();
	                var MM = (date.getMonth() + 1).toString();
	                if(MM.length == 1) MM = "0"+MM;
	                var dd = (date.getDate()).toString();
	                if(dd.length == 1) dd = "0"+dd;
	                
	                var startDate = yyyy + "-" + MM + "-" + dd;
	               // var startDate = "2019-02-18";
	                
	                //fnObj.chartskillDbid = "1313";
	               // var selColumns = " , N_TALK_ACD_4 as SL, N_ENTER_ACD INCALLS " //서비스레벨은 20초
	                var selColumns = ", N_ENTER_ACD INCALLS , ROUND(DECODE((N_TALK_ACD_4 / DECODE(N_ENTER_ACD,0,NULL,N_ENTER_ACD))*100,null,0,(N_TALK_ACD_4 / DECODE(N_ENTER_ACD,0,NULL,N_ENTER_ACD))*100),2) as SL " //서비스레벨은 20초
	                
	                axboot.ajax({
	        			type: "GET",
	                    url: "/api/rtsetting/skillHistHour",
	                    data: {startDate:startDate, skillDbid:fnObj.chartskillDbid, selColumns:selColumns},
	                    callback: function (res) {
	                    	//caller.gridView05.setData(res);
	                    	label = [];
	                    	series = [];
	                    	var data1 = []; //인입호
	                    	var data2 = []; //sl레벨
	                    	res.forEach(function (n){
	                    		if(n.STARTTIME.substring(0,1) === "0")
	                    			label.push(n.STARTTIME.substring(1,2)+"시");
	                    		else
	                    			label.push(n.STARTTIME.substring(0,2)+"시");
	                    		data1.push(n.INCALLS);
	                    		data2.push(n.SL);
	                    	});
	                    	
	                    	series.push(data1);
	                    	series.push(data2);
	                       	
	                    	
	                        fnObj.initChartist.initChart();
	                        clearTimeout(delay2);
	                        delay2 = setInterval(function(){
	                        	ACTIONS.dispatch(ACTIONS.CHART_DATA_SEARCH);
	    	                }, 60000);
	                    }
	        		});
        		}
            }
    		
        });
        return false;
    },
  //모니터링 대상 dnis 목록 조회
	DNIS_SEARCH: function (caller, act, data) {
    	axboot.ajax({
            type: "GET",
            url: "/api/rtsetting/monitorDnis",
            data: {reportCd: reportCd},
            callback: function(res){
            	fnObj.grid03Index = {}; //그리드 인덱스 관리 객체
            	fnObj.ObjectIDDNISs = ""; //스킬 DBId String
            	fnObj.ObjectIDDNISsArr = null ; //스킬 DBId String
            	
            	for(var index in res) {
            		var objectCd = res[index].objectCd; //스킬 DBId
            		fnObj.grid03Index[objectCd] = res[index].sort; //스킬 그리드 인덱스 입력
            		fnObj.ObjectIDDNISs += objectCd; //스킬 DBId String 추가
            		
            		fnObj.MapDNISID.put(objectCd, objectCd) ;
            		//마지막이 아니면 ↑ 추가
            		if(res.length-1 != index) {
            			fnObj.ObjectIDDNISs += "↑";
            		}
            	}
            	fnObj.ObjectIDDNISsArr = fnObj.ObjectIDDNISs.split("↑");
            	
            	var dnisStatIDArr = fnObj.StatIDDNISs.split("↑");
            	for(var i=0; i<dnisStatIDArr.length;i++){
            		fnObj.MapDNISStatID.put(dnisStatIDArr[i], dnisStatIDArr[i]);
            	}
            	
                caller.gridView03.setData(res); //그리드 데이터 셋팅
                
                
                var refId = fnObj.winkerServer.requestDNIS(); //스킬 통계 요청
                
              //refId -1이면 통계 요청 실패
        		if(refId !== -1) {
        			fnObj.refIds.dashDnis = refId;
        		} else {
        			console.log("winker server dashDnis request fail");
        		}
        		
        		
            }
    		
        });
        return false;
    },
    CHART_DATA_SEARCH: function(caller, act, data){
    	//차트
        var date = new Date();
        var yyyy = date.getFullYear().toString();
        var MM = (date.getMonth() + 1).toString();
        if(MM.length == 1) MM = "0"+MM;
        var dd = (date.getDate()).toString();
        if(dd.length == 1) dd = "0"+dd;
        
        var startDate = yyyy + "-" + MM + "-" + dd;
        //var startDate = "2019-02-18";
        
        //fnObj.chartskillDbid = "1313";
       // var selColumns = " , N_TALK_ACD_4 as SL, N_ENTER_ACD INCALLS " //서비스레벨은 20초
        var selColumns = ", N_ENTER_ACD INCALLS , ROUND(DECODE((N_TALK_ACD_4 / DECODE(N_ENTER_ACD,0,NULL,N_ENTER_ACD))*100,null,0,(N_TALK_ACD_4 / DECODE(N_ENTER_ACD,0,NULL,N_ENTER_ACD))*100),2) as SL " //서비스레벨은 20초
        
        axboot.ajax({
			type: "GET",
            url: "/api/rtsetting/skillHistHour",
            data: {startDate:startDate, skillDbid:fnObj.chartskillDbid, selColumns:selColumns},
            callback: function (res) {
            	//caller.gridView05.setData(res);
            	label = [];
            	series = [];
            	var data1 = []; //인입호
            	var data2 = []; //sl레벨
            	res.forEach(function (n){
            		if(n.STARTTIME.substring(0,1) === "0")
            			label.push(n.STARTTIME.substring(1,2)+"시");
            		else
            			label.push(n.STARTTIME.substring(0,2)+"시");
            		data1.push(n.INCALLS);
            		data2.push(n.SL);
            	});
            	
            	series.push(data1);
            	series.push(data2);
               	
            	
                fnObj.initChartist.initChart();
            }
		});
    }

});


var CODE = {};
var rowCenlist = [];
var info = {};
var gridcom = []; 
var reportCd = "";
var bCompSetting = false;
var bSkillSetting = false;
var bDnisSetting = false;
var delay2 = null;
// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
	var _this = this;
	console.log(top.wsInfo);
    
    axboot.ajax({
        method: "GET",
        url: "/api/rtsetting/report",
        callback: function (res) {
        	reportCd = res;

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
        		    		info.dispyn = n.disp_use_yn;
        		    		info.email = n.email;
        		    	});
        		    	//ok();
		    	

    	                wsConn(top.sockInfo['STAT_HOSTP'], top.sockInfo['STAT_PORTP'], top.sockInfo['STAT_HOSTB'], top.sockInfo['STAT_PORTB'], top.sockInfo['STAT_WSS']) ;

    	                _this.gridView01.initView();
    	            	_this.gridView02.initView();
    	            	_this.gridView03.initView();

    	            	//_this.initChartist.initChart();
    	            	/*
    	                delay = setInterval(function(){
    	                    //console.log("타이머실행");
    	                    var ready = wsReadyStateCheck();
    	                    if(ready == 1 && bCompSetting && bSkillSetting &&bDnisSetting){
    	                            //console.log("wWebSocket.readyState :" + wWebSocket.readyState);
    	                            ACTIONS.dispatch(ACTIONS.COMP_SEARCH);
    	                            ACTIONS.dispatch(ACTIONS.SKILL_SEARCH);
    	                    		ACTIONS.dispatch(ACTIONS.DNIS_SEARCH);
    	                    		
    	                            clearTimeout(delay);
    	                    }else{
    		                	if(ready != 1){
        		                	wsDisConn();
        		                	setTimeout(function(){
        		                		wsConn(top.sockInfo['STAT_HOSTP'], top.sockInfo['STAT_PORTP'], top.sockInfo['STAT_HOSTB'], top.sockInfo['STAT_PORTB'], top.sockInfo['STAT_WSS']) ;
            		                	
            		                	var winkerErr = wsErrorCheck(); //Security Error 방생..또는 웹소캣 exception 발생 
            		        			
            		        			if(winkerErr != null){
            		        				alert("화면을 새로고침 하세요.");
            		        				clearTimeout(delay);
            		        			}
        		                	},500);
        		                	
        		        			
    		                	}
    	                    	//clearTimeout(delay);
    	                    }
    	                }, 2000);
    	                */
    	            	delay();
        		    }
            	})
            })	
            .then(function(ok){

           });
        }
    });
	
	
};

fnObj.pageResize = function () {

};

var delay = function(){
    //console.log("타이머실행");
    var ready = wsReadyStateCheck();
    if(ready == 1 && bCompSetting && bSkillSetting &&bDnisSetting){                		                        
        ACTIONS.dispatch(ACTIONS.COMP_SEARCH);
        ACTIONS.dispatch(ACTIONS.SKILL_SEARCH);
		ACTIONS.dispatch(ACTIONS.DNIS_SEARCH);
        
    	return;
    }else{
    	if(ready != 1){
        	wsDisConn();
        	setTimeout(function(){
        		wsConn(top.sockInfo['STAT_HOSTP'], top.sockInfo['STAT_PORTP'], top.sockInfo['STAT_HOSTB'], top.sockInfo['STAT_PORTB'], top.sockInfo['STAT_WSS']) ;
            	
            	var winkerErr = wsErrorCheck(); //Security Error 방생..또는 웹소캣 exception 발생 
    			
    			if(winkerErr != null){
    				alert("화면을 새로고침 하세요.");
    				//clearTimeout(delay);
    				return;
    			}else{
    				setTimeout(delay,1000);
    			}
        	},1000);
        	
    	}else{
    		if(!bCompSetting || !bSkillSetting || !bDnisSetting)
    			setTimeout(delay,800);
    	}
    } 
};
fnObj.winkerServer = axboot.viewExtend({
	initView: function() {
		
	}, 
	requestComp: function(){
		if(fnObj.ObjectIDComps == "") {
			return;
		}else{
			return wsOpenSkillStat({//top.wsOpenSkillStat({
				type:17, // 부서/스킬(채널)/회사: 17 , 팀: 5, 상담사: 3 
				objectDBId: fnObj.ObjectIDComps,
				statId: fnObj.StatIDComps,
				skillDBIdMap: fnObj.MapCompID,
				skillStatIdMap: fnObj.MapCompStatID,
				callback: fnObj.callback01
				//callback: function (eventId, eventMsg, objectDBId, objectType, statId, statVal) {
				//	fnObj.gridView01.setValue(fnObj.grid01Index[objectDBId],statId,statVal);
				//}
			});
		}
	},
	//스킬 통계 요청
	requestSkill: function(){
		if(fnObj.ObjectIDSkills == "") {
			return;
		}else{
			return wsOpenSkillStat({//top.wsOpenSkillStat({
				type:17, // 부서/스킬(채널)/회사: 17 , 팀: 5, 상담사: 3 
				objectDBId: fnObj.ObjectIDSkills,
				statId: fnObj.StatIDSkills,
				skillDBIdMap: fnObj.MapSkillID,
				skillStatIdMap: fnObj.MapSkillStatID,
				callback: fnObj.callback02
				//callback: function (eventId, eventMsg, objectDBId, objectType, statId, statVal) {
				//	fnObj.gridView01.setValue(fnObj.grid01Index[objectDBId],statId,statVal);
				//}
			});
		}
		

		
		fnObj.initChartist.initChart();
	},
	requestDNIS: function(){
		if(fnObj.ObjectIDDNISs == "") {
			return;
		}else{
			return wsOpenSkillStat({//wsOpenGroupStat({//top.wsOpenGroupStat({
				type:17, // 부서/스킬(채널)/회사: 17 , 팀: 5, 상담사: 3 
				objectDBId: fnObj.ObjectIDDNISs,
				statId: fnObj.StatIDDNISs,
				dnisDBIdMap: fnObj.MapSkillID,
				dnisStatIdMap: fnObj.MapDNISStatID,
				callback: fnObj.callback03
				//callback: function (eventId, eventMsg, objectDBId, objectType, statId, statVal) {
				//	fnObj.gridView01.setValue(fnObj.grid01Index[objectDBId],statId,statVal);
				//}
			});
		}
	}
});

//회사 그리드 세팅 sort시 DBID INDEX 다시 세팅
fnObj.callback01= function (eventId, eventMsg, objectDBId, objectType, statId, statVal) {

	if(typeof fnObj.gridView01.target.getList()[fnObj.grid01Index[objectDBId]] !== "undefined"){
		if(objectDBId != fnObj.gridView01.target.getList()[fnObj.grid01Index[objectDBId]]["objectCd"])
		{
			fnObj.ObjectIDComps = "";
	    	var new_group_arr = fnObj.gridView01.getData();
	    	new_group_arr.forEach(function(n){
	    		fnObj.grid01Index[n.objectCd] = n.__index;
	    		fnObj.ObjectIDComps += n.objectCd+"↑";
	    	});
	    	fnObj.ObjectIDComps=fnObj.ObjectIDComps.substring(0,(fnObj.ObjectIDComps.length-1));
	    	
	    	fnObj.ObjectIDCompsArr = fnObj.ObjectIDComps.split("↑") ;
		}	
	}
	fnObj.gridView01.setValue(fnObj.grid01Index[objectDBId],statId,statVal);
}

//스킬 그리드 세팅 sort시 DBID INDEX 다시 세팅
fnObj.callback02= function (eventId, eventMsg, objectDBId, objectType, statId, statVal) {
	
	if(typeof fnObj.gridView02.target.getList()[fnObj.grid02Index[objectDBId]] !== "undefined"){
		if(objectDBId != fnObj.gridView02.target.getList()[fnObj.grid02Index[objectDBId]]["objectCd"])
		{
			fnObj.ObjectIDSkills = "";
	    	var new_group_arr = fnObj.gridView02.getData();
	    	new_group_arr.forEach(function(n){
	    		fnObj.grid02Index[n.objectCd] = n.__index;
	    		fnObj.ObjectIDSkills += n.objectCd+"↑";
	    	});
	    	fnObj.ObjectIDSkills=fnObj.ObjectIDSkills.substring(0,(fnObj.ObjectIDSkills.length-1));
	    	
	    	fnObj.ObjectIDSkillsArr = fnObj.ObjectIDSkills.split("↑") ;
		}	
	}
	fnObj.gridView02.setValue(fnObj.grid02Index[objectDBId],statId,statVal);
}

//dnis 그리드 세팅 sort시 DBID INDEX 다시 세팅
fnObj.callback03= function (eventId, eventMsg, objectDBId, objectType, statId, statVal) {
	if(typeof fnObj.gridView03.target.getList()[fnObj.grid03Index[objectDBId]] !== "undefined"){
		if(objectDBId != fnObj.gridView03.target.getList()[fnObj.grid03Index[objectDBId]]["objectCd"])
		{
			fnObj.ObjectIDDNISs = "";
	    	var new_group_arr = fnObj.gridView03.getData();
	    	new_group_arr.forEach(function(n){
	    		fnObj.grid03Index[n.objectCd] = n.__index;
	    		fnObj.ObjectIDDNISs += n.objectCd+"↑";
	    	});
	    	fnObj.ObjectIDDNISs=fnObj.ObjectIDDNISs.substring(0,(fnObj.ObjectIDDNISs.length-1));
	    	
	    	fnObj.ObjectIDDNISsArr = fnObj.ObjectIDDNISs.split("↑") ;
		}	
	}
	fnObj.gridView03.setValue(fnObj.grid03Index[objectDBId],statId,statVal);
}

fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
//console.log("gridView01.initView");    	
    	var _this = this;
        var columns = [];
        //var footSum = [];
        //var sumColums = [];
        columns.push({key: "objectNm", label: "전국", width: 200, align: "center"});
        columns.push({key: "509", label: "응답호", width: 110, align: "center", formatter:"cnt"}); // statID: 509
        columns.push({key: "510", label: "응답률", width: 110, align: "center", formatter:"ptg"});//statID: 510
        columns.push({key: "512", label: "SL", width: 110, align: "center", formatter:"ptg"});//statID: 512?
        columns.push({key: "518", label: "근무", width: 110, align: "center", formatter:"cnt"});//statID: 518
        
        axboot.promise()
        .then(function (ok) {
	    	
	    	_this.target = axboot.gridBuilder({
	            frozenColumnIndex: 0,
	            target: $('[data-ax5grid="grid-view-01"]'),
	            columns: columns,
	            page: {display: false},
	            //footSum: footSum,
	            body: {
	                onClick: function () {
	                    this.self.select(this.dindex, {selectedClear: true});
	                }
	            }
	        });


	        
	        //ok();
	    	bCompSetting = true;
	    })
	    .then(function (ok) {
	    	//ACTIONS.dispatch(ACTIONS.COMP_SEARCH);
	    })
	    .catch(function () {
	
	    });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);
        
        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
            	//return this.bizCd;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true}, "last");
    },
    setValue: function (index, key, value) {
    	this.target.setValueMin(index, key, value);
    }
});

fnObj.gridView02 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
//console.log("gridView01.initView");    	
    	var _this = this;
        var columns = [];
        //var footSum = [];
        //var sumColums = [];
        columns.push({key: "objectNm", label: "주요스킬", width: 200, align: "center"}); //스킬명
        columns.push({key: "501", label: "인입호", width: 110, align: "center", formatter:"cnt"}); //statID: 501?
        columns.push({key: "510", label: "응답률", width: 110, align: "center", formatter:"ptg"}); //statID: 510
        columns.push({key: "512", label: "SL", width: 110, align: "center", formatter:"ptg"}); //statID: 512?
        columns.push({key: "518", label: "근무", width: 110, align: "center", formatter:"cnt"}); //statID: 518
        
        
        
        axboot.promise()
        .then(function (ok) {
	    	
	    	_this.target = axboot.gridBuilder({
	            frozenColumnIndex: 0,
	            target: $('[data-ax5grid="grid-view-02"]'),
	            columns: columns,
	            page: {display: false},
	            //footSum: footSum,
	            body: {
	                onClick: function () {
	                    this.self.select(this.dindex, {selectedClear: true});
	                    
	                    this.self.list.forEach(function(n, index){
	                    	if(typeof n.__selected__ != "undefined"){
	                    		if(n.__selected__ == true)
	                    			fnObj.chartskillDbid = n.objectCd;
	                    	}
	                    });
	                    	    	                    
	                    ACTIONS.dispatch(ACTIONS.CHART_DATA_SEARCH);
	                }
	            }
	        });


	        
	        //ok();
	    	bSkillSetting = true;
	    })
	    .then(function (ok) {
	    	
	    	
	    	//ACTIONS.dispatch(ACTIONS.SKILL_SEARCH);
	    })
	    .catch(function () {
	
	    });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);
        
        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
            	//return this.bizCd;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true}, "last");
    },
    setValue: function (index, key, value) {
    	this.target.setValueMin(index, key, value);
    }
    
});

fnObj.gridView03 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
//console.log("gridView01.initView");    	
    	var _this = this;
        var columns = [];
        //var footSum = [];
        //var sumColums = [];
        columns.push({key: "objectNm", label: "대표번호", width: 200, align: "center"});
        columns.push({key: "501", label: "인입호", width: 110, align: "center", formatter:"cnt"});
        columns.push({key: "510", label: "응답률", width: 110, align: "center", formatter:"ptg"});
        columns.push({key: "505", label: "포기호", width: 110, align: "center", formatter:"cnt"});
        
        
        axboot.promise()
        .then(function (ok) {
	    	
	    	_this.target = axboot.gridBuilder({
	            frozenColumnIndex: 0,
	            target: $('[data-ax5grid="grid-view-03"]'),
	            columns: columns,
	            page: {display: false},
	            //footSum: footSum,
	            body: {
	                onClick: function () {
	                    this.self.select(this.dindex, {selectedClear: true});
	                }
	            }
	        });


	    	bDnisSetting = true;
	        //ok();
	    })
	    .then(function (ok) {	    		    	
	    	//ACTIONS.dispatch(ACTIONS.DNIS_SEARCH);
	    })
	    .catch(function () {
	
	    });
    },
    addRow: function () {
        this.target.addRow({__created__: true}, "last");
    },
    setValue: function (index, key, value) {
    	this.target.setValueMin(index, key, value);
    }
});

fnObj.initChartist = axboot.viewExtend({
	
	initView: function () {
		
	},

	initChart : function(){    
		new Chartist.Line('#ct-chart', 
		 {
			  labels: label,
			  series: series 
		 },
		 {	
			 
		 
			fullWidth: false,
			chartPadding:{
				right:40,
				//top: 20
			},
			
			//low:0,
			showArea: true,
			 /*
			series:{
				'series-1':{lineSmooth: Chartist.Interpolation.simple(), showArea: true, fullWidth: false},
				'serise-2':{lineSmooth: Chartist.Interpolation.simple(), showArea: false, fullWidth: false}
			}, 
			*/
			plugins:[
				Chartist.plugins.legend({
					legendNames: ['인입호','SL(20초)(%)'],
					//position: 'bottom'
				}),
				Chartist.plugins.ctPointLabels({
					textAnchor: 'middle'
				}),
			]
			 
		});
	}
});

//frame.js에서 tabview click이나 open때 호출. 해당 화면의 status를 받아 처리한다.
//on인경우 : 웹소캣null이면 접속 / null 아니면 그대로.....
//""인 경우 : 웹소캣null이면 그대로 / null 아니면 close
fnObj.pageVisible = function (menustatus) {
	if(menustatus === "on"){
		if(wWink == null){ //back에 있다가 활성화 시킨 상태 else는 ... 활성화된 현재 화면 또 click
			//clearTimeout(delay);
			clearTimeout(delay2);
			setTimeout(function(){
				wsConn(top.sockInfo['STAT_HOSTP'], top.sockInfo['STAT_PORTP'], top.sockInfo['STAT_HOSTB'], top.sockInfo['STAT_PORTB'], top.sockInfo['STAT_WSS']) ;
				
				var winkerErr = wsErrorCheck(); //Security Error 방생..또는 웹소캣 exception 발생 
				
				if(winkerErr != null){
					alert("화면을 새로고침 하세요.");
					return;
				}
				/*
				delay = setInterval(function(){
	              var ready = wsReadyStateCheck();
	              if(ready == 1){                		                
	                  ACTIONS.dispatch(ACTIONS.COMP_SEARCH);
	                  ACTIONS.dispatch(ACTIONS.SKILL_SEARCH);
	          		  ACTIONS.dispatch(ACTIONS.DNIS_SEARCH);
	                  clearTimeout(delay);
	              }else{
	              	wsDisConn();
	            	setTimeout(function(){
	            		wsConn(top.sockInfo['STAT_HOSTP'], top.sockInfo['STAT_PORTP'], top.sockInfo['STAT_HOSTB'], top.sockInfo['STAT_PORTB'], top.sockInfo['STAT_WSS']);
		            	
		    			var winkerErr = wsErrorCheck(); //Security Error 방생..또는 웹소캣 exception 발생 
		    			
		    			if(winkerErr != null){
		    				alert("화면을 새로고침 하세요.");
		    				clearTimeout(delay);
		    			}
	            	},500);
	            	
	              }
	          }, 2000);
				*/
				delay();
			},500);
			
		}
	}else{
		clearTimeout(delay2);
		wsDisConn();
		//clearTimeout(delay);
	}
};

$(window).on("beforeunload",function(){
	clearTimeout(delay2);
	//if(wWink != null){	
		for(var key in fnObj.refIds) {
			if(key ==="dashDnis"){
				if(typeof fnObj.refIds[key] !== "undefined"){
					wsCloseGroupStat(fnObj.refIds[key]);
				}
			}else{
				if(typeof fnObj.refIds[key] !== "undefined"){
					wsCloseSkillStat(fnObj.refIds[key]);
				}
			}
		    		
		}
		
		wsDisConn();
	
});