

var wsReqs = {};
var refids = {};

/*
var strHostP = "";
var intoPortP = "";
var strHostB = "";
var intPortB = "";
*/
var wWink = null;

/*
var loadScript = function(url){
	var script = document.createElement("script");
	script.scr = url;
	script.setAttribute('type','text/javascript');
	script.setAttribute('src',url);
	document.body.appendChild(script);
	
	wWink = new winkWebSocket() ;
}
*/

var wsConn = function (strHostP, intoPortP, strHostB, intPortB, strWss) {
	if ( wWink == null ) wWink = new winkWebSocket();
	
	var bResult = wWink.wConnect(strHostP, intoPortP, strHostB, intPortB, winkEvent, addLogText, '',strWss) ;
	if(bResult)
		console.log("[" +strHostP+ ":" + intoPortP + "] 접속 성공");
	else
		console.log("[" +strHostP+ ":" + intoPortP + "] 접속 실패");
	//setTimeout("",1000);
}

var wsDisConn = function () {
	if ( wWink !== null ){
		wWink.wDisconnect();
	}
	
	wWink = null;
	
	//setTimeout("",1000);
}

var winkEvent = function (eventId, eventMsg, objectDBId, objectType, statId, statVal) {

	if(eventId == 101 || eventId == 100) {
		return;
	}
	
	if(typeof refids[objectDBId] === 'function') {
		refids[objectDBId](eventId, eventMsg, objectDBId, objectType, statId, statVal);
		delete refids[objectDBId];
	} else {
		
		for(var key in wsReqs) {
   			if(wsReqs[key].objectDBId.match(objectDBId) && wsReqs[key].statId.match(statId)) {
   			
   				if(typeof wsReqs[key].callback === 'function') {
   					wsReqs[key].callback(eventId, eventMsg, objectDBId, objectType, statId, statVal);	
   				}
   			}
   		}
	}
	/*
	switch(eventMsg)
	{
		case WMessageType.EventServerConnected :
			//document.getElementById("textConStatusP").value = "연결" ;
			console.log("웹소켓에 연결되었습니다.");
			break ;
		case WMessageType.EventServerDisconnected :
			//document.getElementById("textConStatusP").value = "끊김" ;
			console.log("웹소켓 연결이 종료되었습니다.");
			break ;
		case WMessageType.EventAgentLogout :
			console.log("로그아웃 요청 성공");
			break ;
		case WMessageType.EventListenDN :
			console.log("감청 요청 성공");
			break ;
		case WMessageType.EventError :
	        //axToast.push("웹소켓 요청 에러가 발생하였습니다.");
	        cosole.log("웹소켓 요청 에러:" + eventMsg);
			break ;
		default:
			//console.log("WinkEvent < ", WMessage[eventId] + "(" + eventId + ") " + eventMsg, false);
			break;
			
	}
	*/
}

var wsOpenSkillStat = function (options) {
	//console.log("wsOpenSkillStat options objectDBId: " + options.objectDBId);
	//console.log("wsOpenSkillStat options statId: " + options.statId);
	if ( wWink == null ) return -1;
	
	var refId = wWink.wOpenStatDNGroupExt(options.objectDBId, options.statId) ;
	wsReqs[refId] = options;	
	//console.log(refId);
	return refId;
}

var wsCloseSkillStat = function (refId) {
	if ( wWink == null ) return;
	//console.log("wsCloseSkillStat: refId ["+ refId + "]");
	//console.log("wsCloseSkillStat: objectDBId ["+ wsReqs[refId].objectDBId + "]");
	if(typeof wsReqs[refId] !== "undefined"){
		wWink.wCloseStatDNGroupExt(wsReqs[refId].objectDBId, wsReqs[refId].statId) ;
		delete wsReqs[refId];
	}else{
		//return 0;
	}
}

var wsOpenAgentGroupStat = function (options) {
	if ( wWink == null ) return -1;
	
	var refId = wWink.wOpenStatAgentGroupExt(options.objectDBId, options.statId) ;
	wsReqs[refId] = options;
	return refId;
}

var wsCloseAgentGroupStat = function (refId) {
	if ( wWink == null ) return;
	
	if(typeof wsReqs[refId] !== "undefined"){
		wWink.wCloseStatAgentGroupExt(wsReqs[refId].objectDBId, wsReqs[refId].statId) ;
		delete wsReqs[refId];
	}else{
		//return 0;
	}
}

var wsOpenAgentStat = function (options) {
	if ( wWink == null ) return -1;
	
	var refId = wWink.wOpenStatAgentExt(options.objectDBId, options.statId) ;
	wsReqs[refId] = options;
	return refId;
}

var wsCloseAgentStat = function (refId) {
	if ( wWink == null ) return;
	
	if(typeof wsReqs[refId] !== "undefined"){
		wWink.wCloseStatAgentExt(wsReqs[refId].objectDBId, wsReqs[refId].statId) ;
		delete wsReqs[refId];
	}else{
		//return 0;
	}
}

var wsOpenGroupStat = function (options) {
	if ( wWink == null ) return -1;
	
	var refId = wWink.wOpenStatExt(options.objectDBId, options.statId) ;
	wsReqs[refId] = options;
	return refId;
}

var wsCloseGroupStat = function (refId) {
	if ( wWink == null ) return;
	
	if(typeof wsReqs[refId] !== "undefined"){
		wWink.wCloseStatExt(wsReqs[refId].objectDBId, wsReqs[refId].statId) ;
		delete wsReqs[refId];
	}else{
		//return 0;
	}
}

var requestCenter = function (callback) {
	var refid = wWink.wGetOrgCenterList();
	refids[refid] = callback;
}

var requestOrgListForSKill = function (parentDBID, callback) {
	var refid = wWink.wGetOrgListForSkill(parentDBID);
	refids[refid] = callback;
}

var requestOrgListForAgent = function (parentDBID, callback) {
	var refid = wWink.wGetOrgListForAgent(parentDBID);
	refids[refid] = callback;
}

var requestAgentList = function (parentDBID, callback) {
	var refid = wWink.wGetOrgAgentList(parentDBID);
	refids[refid] = callback;
}

function addLogText(strText)
{
	//console.log(strText);
}

/**
 * 특정 내선을 로그아웃 시킨다.
 *
 * @param strRequestDN	{required} 로그아웃을 요청하는 사람 dn
 * @param strLogoutDN	{required} 로그아웃을 시킬 대상 dn
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
var requestLogoutDN = function(strRequestDN, strLogoutDN)
{
	var refid = -1;
	
	if(wWink != null)
		refid = wWink.wLogoutDN(strRequestDN, strLogoutDN) ;
	
	return refid;
	
};

/**
 * 특정 내선을 Listen한다.
 *
 * @param strRequestDN	{required} Listen을 요청하는 사람 dn
 * @param strListenDN	{required} Listen을 할 대상 dn
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
var requestListenDN = function(strRequestDN, strListenDN, callback)
{
	var refid = -1;
	
	if(wWink != null)
		refid = wWink.wListenDN(strRequestDN, strListenDN) ;
	
	return refid;
};

var wsReadyStateCheck = function () {
	var readystate = -1;
	if(wWink != null)
		readystate = wWink.wReadyState() ;
	
	return readystate;
}

var wsErrorCheck = function () {
	var err = null;
	if(wWink != null)
		err = wWink.wWinkerErr;
	
	return err;
}

//loadScript('/assets/js/winker/winker_api.js');
//wsConn(strHostP, intoPortP, strHostB, intPortB);