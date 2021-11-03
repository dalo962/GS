/**
    * wss 를 지정하지 않으면 기본 ws로 처리된다. 페이지가 기본 https를 사용할 때는 반드시 wss로 처리해야한다.
	
	1. 통계 열기/닫기
	   wOpenStat, wOpenStatExt, wCloseStat, wCloseStatExt 이용하여 통계 처리할 때 Object에 대해서 dbid^type로 값을 넣으면 됩니다.
	   type은 숫자로 지정하며 ACDQ/VDN은 2, 상담사Person은 3, AgentGroup은 5 입니다.
	2. 조직 정보 요청
	  2.0 조직 정보 요청 유형
		- 상담원에 대한 통계를 조회하기 위해 상담원 소속 조직관련 정보를 요청하는 경우
		- 스킬/업무에 대한 통계를 조회하기 위해 스킬/업무에 대한 조직관련 정보를 요청하는 경우
		- VDN/ACDQ에 대해서 목록 요청하는 경우
	  2.1. 업무 센터 목록 요청
		   - wGetOrgCenterList 를 호출하면 업무 센터 목록이 전달됩니다.
		   - 상담원과 스킬/업무 구분없이 동일하게 사용
	  2.2. 상담원 조직 정보 요청
		   - wGetOrgListForAgent 함수를 호출하여 상담원 조직 정보를 요청합니다.
		   - Parameter로 센터DBID를 넣으면 그 하부조직 정보가 나오고, 그 하부 조직 DBID를 넣으면 또 그 하부 조직 정보가 나옵니다.
		   - 결과로 받은 목록중에 type=5 가 나오면 그건 AgentGroup이고 그것에 대해서 속한 상담원 목록을 요청할 때 wGetOrgListForAgent를 호출합니다.
	  2.3. 상담원 목록 요청
		   - wGetOrgAgentList 호출하여 AgentGroup에 대해서 속한 상담원 목록을 요청합니다.
		   - 결과로 받은 상담원 목록에 대해서 통계를 요청합니다.
	  2.4 업무/스킬 조직 정보 요청
		   - wGetOrgListForAgent함수를 호출하여 상담원 업무/스킬 정보를 요청합니다.
		   - Parameter로 센터DBID를 넣으면 그 하부조직 정보가 나오고, 그 하부 조직 DBID를 넣으면 또 그 하부 조직 정보가 나옵니다.
		   - 결과로 받은 목록중에 type=5 가 나오면 그게 실제 업무/스킬이고 그것에 대해서 통계를 요청하면 됩니다.
	  2.5 ACDQ/VDN 처리를 위한 Switch 요청
		  - wGetSwitchList 호출하여 Switch 목록을 받습니다.
		  * 업무 센터 목록은 Switch와 별개로 상담사의 위치에 따라 구분될 수 있으며 Switch 갯수와는 다를 수 있습니다.
			ACDQ/VDN은 switch 단위로만 조회가 가능합니다.
	  2.6. VDN 목록 요청
		   - wGetVDNList 호출하여 VDN 목록을 받습니다.
		   - Switch를 지정하면 해당 switch의 VDN 목록만 받습니다.
	  2.7. ACDQ 목록 요청
		   - wGetACDQList호출하여 ACDQ 목록을 받습니다.
		   - Switch를 지정하면 해당 switch의 ACDQ 목록만 받습니다.
*/

var sWebSocket = null ;		// 현재 Primary 인 WebSocket
var sUriC = null ; 			// 현재 연결 시도중인 URI 주소
var sUriP = null ;
var sUriB = null ;

var sLoginID    = null ;		// Winker 서버에 로그인할 경우 로그인할 때 사용할 ID
var sLoginPass	= null ;		// Winker 서버에 로그인할 경우 로그인할 때 사용할 ID에 대한 Password
var sLoginVer	= "1.1.100" ;	// Winker 서버에 접속하는 client의 기본 버전이다. 1.1.100 고정.
var sLoginMode	= WLoginMode[WLoginModeType.LoginModeWink] ;//"LoginModeWink" ; //		// Winker 서버에 접속하는 client의 접속 모드이다. Wink/WinkAdmin 두개가 존재한다. 상담사는 Wink/관리자는 WinkAdmin이나 기본 Wink로 고정.
var sLoginCenter= null ;

var sSerial		= 10000 ;			// 시작은 10000 이고 99999를 넘으면 다시 10000으로 reset

var sCallbackEventFunction = null ;
var sCallbackLogFunction = null ;

var sEventData = null ;
var sStoredBuffer = null ;		// 데이터를 받을 때 full data를 받지 못했으면 임시로 저장하는 buffer이다.

var sReconnectFlag = false ;	
var sReOpenStatFlag = false ;	// 2020 콜통계 개선 추가. 연결이 되었다가 close된 후에 다시 연결이 되었을 때 reopen을 할지 말지 지정하는 flag

// console이 지원되지 않아도 에러가 나지 않도록 하기 위함이다.
var sConsole = window.console || { log: function() {} };
var sConsoleFlag = false ;

// AP 페이지가 기본 https를 사용할 때는 반드시 wss로 처리해야한다.
// ws:// or wss://	
var sProtocolType = "ws://" ;   		

// timer 처리를 clear 하기 위해 id를 저장한다.
var sTimerID = null ;			// 서버 연결 단절시 재연결을 위한 timer id
var sTimerIDHeartbeat = null ;	// heartbeat를 주기적으로 전송하기 위한 timer id. 연결이 되었을 때만 전송한다.

// EventServerConnected를 보냈을 경우만 EventServerDisconnected를 보내도록 하기 위한 flag
var sServerConnected = false ;

var sReconnectInterval = 10000 ; 	// 연결되어 있는 상태에서 비정상 연결 종료시 재연결 시도 간격 ms.
var sHeartbeatInterval = 60000 ; 	// 연결되어 있는 상태에서 Heartbeat 전송 간격 ms.

var sStatMap = null ;				// 2020 콜통계 개선 추가. 이미 통계 요청된 내용은 재연결이 되면 자동으로 다시 open 요청하도록 하기 위한 임시 저장 map

var winkerErr = null;				// 웹소켓 접속 에러 발생시 에러 메세지.

// WebSocket이 지원되지 않는 Browser인지 확인해서 알림을 띠운다.
if (!window.WebSocket) {
	alert("FATAL Error: WebSocket not natively supported. This program will not work!");
}

/**
 * 로그 기록을 하고 필요할 경우 callback을 호출해준다.
 *
 * @param strFunction  	{required} 로그 기록을 요청한 함수명
 * @param strMessage   	{required} 기록할 로그 내용
 * @param consoleFlag	{optional} Web Browser console 로그 기록 여부
 *
 * @return 	요청 접수 결과. true/false.
 */
sLog = function(strFunction, strMessage, consoleFlag) {
	var text = ((new Date).format("yyyy-MM-dd hh:mm:ss.SSS ")) + ("[" + strFunction + "]") + " " + strMessage + "\n" ;
	
	// 함수 호출시 console 로그 기록 요청이 지정되어 있지 않다면 global 옵션을 따라가고
	// 함수 호출시 직접 지정되어 있다면 지정된 옵션을 따라간다.
	if ( typeof consoleFlag == "undefined" )
	{
		if (sConsoleFlag == true)  sConsole.log(text) ;
		
	} else
	if ( getBoolean(consoleFlag) == true ) sConsole.log(text) ;

	// console이 아닌 다른 곳에 로그 기록을 하고자 할 때 callback 함수를 호출해서 저장한다.
	if ( typeof sCallbackLogFunction === "function" ) {
		sCallbackLogFunction(text) ;
	}

	text = null ;
};			

/**
 * CTI 처리에 필요한 정보를 입력받아서 초기화 한다. 이 함수 호출 뒤 sConnectExt() 함수를 호출하여 서버 연결을 시도해야 서버 연결이 된다.
 * 
 * @param strHostP   	{required} Winker Primary 서버의 Host명
 * @param intPortP   	{required} Winker Primary 서버의 Port 번호
 * @param strHostB   	{required} Winker Backup 서버의 Host명
 * @param intPortB   	{required} Winker Backup 서버의 Port 번호
 * @param strID			{optional} 상담원이 로그인할 ID
 * @param strPassword	{optional} 상담원이 로그인할 ID 비번
 * @param strMode		{optional} 상담원이 로그인 Mode
 * @param strCenter		{optional} 상담원이 로그인 센터명
 * @param callback		{optional} Winker Event를 받을 CallBack 함수
 * @param consoleFlag   {optional} Console 로그 기록 여부
 * @param wssFlag   	{optional} WSS 사용 여부. wss 를 사용하기 위해서는 server도 wss 로 동작중이어야 하고, server에서 사용한 root 인증서가 client에서도 등록이 되어 있어야 한다.
 *								   만약 인터넷 연결이 안되었을 경우에는 인터넷 옵션에서 인증서의 해지여부 확인을 비활성하 해야 한다.
 *
 * @return 	요청 접수 결과. true/false.
 */
sInitialize = function(strHostP, intPortP, strHostB, intPortB, strID, strPassword, strMode, strCenter, eventCallback, logCallback, consoleFlag, wssFlag)
{
	sCallbackEventFunction = eventCallback ;
	sCallbackLogFunction = logCallback ;
	
	sLoginID		= strID ;
	sLoginPass		= strPassword ;
	
	if ( isValidStr(strMode ) ) sLoginMode = strMode ;
	else						sLoginMode = WLoginMode[WLoginModeType.LoginModeWink] ;
	
	sLoginCenter 	= strCenter ;
	
	sConsoleFlag	= getBoolean(consoleFlag) ;
	
	if ( getBoolean(wssFlag) == true ) sProtocolType = "wss://" ;
	else							   sProtocolType = "ws://" ;
	
	if ( isValidStr(strHostP) == true && isValidInt(intPortP) && parseInt(intPortP) > 0 ) 	sUriP = sProtocolType + strHostP + ":" + intPortP + "/" ;
	else																					sUriP = null ;

	if ( isValidStr(strHostB) == true && isValidInt(intPortB) && parseInt(intPortB) > 0 )
	{
		if ( strHostP != strHostB || intPortP != intPortB )		sUriB = sProtocolType + strHostB + ":" + intPortB + "/" ;
		else {
			sLog("wInitialize","Backup Server connection parameter is same to primary server....");
			sUriB = null ;
		}
	} else
	{
		sLog("wInitialize","Backup Server connection parameter is invalid....");
		sUriB = null ;
	}

	if ( sUriP == null && sUriB == null )
	{
		sLog("wInitialize","Server connection parameter is invalid....");

		return false ;
	}

	return true ;
};

/**
 * CTI 처리에 필요한 정보를 입력받아서 서버 연결을 시도한다. 이 함수내에서 sConnectExt() 함수를 호출하여 직접 호출해서 서버 연결을 시도한다.
 *
 * @param strHostP   	{required} Winker Primary 서버의 Host명
 * @param intPortP   	{required} Winker Primary 서버의 Port 번호
 * @param strHostB   	{required} Winker Backup 서버의 Host명
 * @param intPortB   	{required} Winker Backup 서버의 Port 번호
 * @param callback		{optional} Winker Event를 받을 CallBack 함수
 * @param consoleFlag   {optional} Console 로그 기록 여부
 * @param wssFlag   	{optional} WSS 사용 여부. wss 를 사용하기 위해서는 server도 wss 로 동작중이어야 하고, server에서 사용한 root 인증서가 client에서도 등록이 되어 있어야 한다.
 *								   만약 인터넷 연결이 안되었을 경우에는 인터넷 옵션에서 인증서의 해지여부 확인을 비활성하 해야 한다.
 *
 * @return		요청 접수 결과. true/false.
 */
sConnect = function(strHostP, intPortP, strHostB, intPortB, eventCallback, logCallback, consoleFlag, wssFlag)
{
	winkerErr = null;
	sCallbackEventFunction = eventCallback ;
	sCallbackLogFunction = logCallback ;
	
	if ( typeof consoleFlag != "undefined" ) sConsoleFlag	= getBoolean(consoleFlag) ;
	
	if ( getBoolean(wssFlag) == true ) sProtocolType = "wss://" ;
	else							   sProtocolType = "ws://" ;
	
	if ( isValidStr(strHostP) == true && isValidInt(intPortP) && parseInt(intPortP) > 0 ) 	sUriP = sProtocolType + strHostP + ":" + intPortP + "/" ;
	else																					sUriP = null ;

	if ( isValidStr(strHostB) == true && isValidInt(intPortB) && parseInt(intPortB) > 0 )
	{
		if ( strHostP != strHostB || intPortP != intPortB )		sUriB = sProtocolType + strHostB + ":" + intPortB + "/" ;
		else {
			sLog("wConnect","Backup Server connection parameter is same to primary server....");
			sUriB = null ;
		}
	} else
	{
		sLog("wConnect","Backup Server connection parameter is invalid....");
		sUriB = null ;
	}

	if ( sUriP == null && sUriB == null )
	{
		sLog("wConnect","Server connection parameter is invalid....");

		return false ;
	}

	if ( sUriP != null || sUriB != null )
	{
		sConnectExt(true) ;
	} else
	{
		sLog("wConnect","Server connection parameter is invalid....");

		return false ;
	}

	return true ;
} ;

/**
 * 서버 연결을 시도한다. Primary 연결은 즉시 시도하고 실패시 Backup 서버는 1초 후에 연결을 시도한다. 서버의 연결이 끊어졌을 경우 timer에 의해 자동호출된다.
 * 1) primary 즉시 연결시도하고 연결 실패시 timer에 의해 1초후 backup 연결 시도.
 * 2) primary/backup 둘 다 연결 실패시 EventServerDisconnected 발생시키고 재연결 시도 안함
 * 3) primary/backup 둘 중 하나 연결되면 재연결 시도 멈춤
 *
 * @param connectFlag  	{optional} timer에 의하지 않고 직접 연결 호출 되는 경우인지 flag. timer에 의하지 않는 경우 반드시 true로 설정한다. 
 *                                 timer에 의해 호출이 되는데 tReconnectFlag=false이면 더이상 반복 재시도 하지 않는다.
 * @return
 */
sConnectExt = function(connectFlag)
{
	sLog("sConnectExt","Starts...." + connectFlag) ;

	if ( typeof connectFlag == "undefined" && sReconnectFlag == false )
	{
		sLog("sConnectExt","Disconnect flag is set, no more retry....") ;
		
		return ;
	}
		
	// 서버 연결을 시도한다.
	if ( sWebSocket != null )
	{
		sLog("sConnectExt","Server is already connected....") ;
		
		return ;
	}
	
	if ( sUriC != sUriP || sUriB == null )
	{
		sLog("sConnectExt","Connectiong primary...." + sUriP);
		
		sUriC = sUriP ;
	} else{
		sLog("sConnectExt","Connectiong backup...." + sUriB);
		
		sUriC = sUriB ;
	}
	try{
		wWebSocket = new WebSocket(sUriC);
		if(sWebSocket != null  && typeof sWebSocket != "undefined"){
			sWebSocket.binaryType = "arraybuffer";
			
			/**
			 * Primary 서버 연결이 되었을 때 호출되는 CallBack 함수이다.
			 *
			 * @return
			 */
			sWebSocket.onopen = function()
			{
				sReconnectFlag = true ;
				sLog("WebSocket.onopen","Opened...." + sUriC);
				
				// 먼저 서버 연결 메시지를 보낸다.
				sServerConnected = true ;
				sCallback(WMessageType.EventServerConnected, "EventID=<"+ WMessageType.EventServerConnected +"/>;EventName=<" + WMessage[WMessageType.EventServerConnected] + "/>") ;
				
				// 자동 로그인을 한다.
				sLogin() ;
				
				// 혹시라도 실행중일지 모르니 clear 하고
				if ( isValidInt(sTimerIDHeartbeat) && sTimerIDHeartbeat > 0 )
				{
					clearTimeout(sTimerIDHeartbeat) ;
					sTimerIDHeartbeat = 0 ;
				}
				
				// 새로 timer 시작
				sTimerIDHeartbeat = setInterval("sHeartbeatSend()", sHeartbeatInterval);
			};

			/**
			 * Primary 서버에서 메시지를 받는 CallBack 함수이다.
			 *
			 * @param msg   	{required} Winker 서버에서 받은 메시지
			 * @return
			 */
			sWebSocket.onmessage = function(msg)
			{
				//var decoder = new TextDecoder("utf-8"); 		// TextDecoder 가 IE/Edge에서는 지원 안됨.
				//var decodedString = decoder.decode(msg.data);
				var decodedString = arr2Str(new Uint8Array(msg.data)) ;
				
				sLog("WebSocket.onmessage <<", "Message [" + decodedString + "]");

				if ( decodedString.charAt(decodedString.length-1 ) == LST_DIM || decodedString.charAt(decodedString.length-1 ) == DATA_ETX ) // 끝에 도달한거다.
				{
					// 이미 저장된게 있다면 그 뒤에 추가로 붙여 준다. 아니면 이걸 그대로 wEventHandler에 전달한다.
					if ( sStoredBuffer != null )
					{
						var tempBuffer = new ArrayBuffer(sStoredBuffer.length + msg.data.length) ;
						var tempIntArr = new Uint8Array(tempBuffer) ;
						
						tempIntArr.set(sStoredBuffer) ;
						tempIntArr.set(msg.data, sStoredBuffer.length) ;
						
						decodedString = arr2Str(tempIntArr) ;
					} else
					{
						sEventHandler(decodedString, sWebSocket) ;
					}
				} else
				{
					// 이미 저장된게 있다면 그 뒤에 추가로 붙여 준다. 아니면 새로 저장한다.
					if ( sStoredBuffer != null )
					{
						var tempBuffer = new ArrayBuffer(sStoredBuffer.length + msg.data.length) ;
						var tempIntArr = new Uint8Array(tempBuffer) ;
						
						tempIntArr.set(sStoredBuffer) ;
						tempIntArr.set(msg.data, sStoredBuffer.length) ;
						
						tempIntArr = null ;
					} else
					{
						sStoredBuffer = new ArrayBuffer(msg.data.length) ;
						var tempIntArr = new Uint8Array(sStoredBuffer) ;
						
						tempIntArr.set(msg.data) ;
						
						tempIntArr = null ;
					}
				}

				decodedString = null ;
			};

			/**
			 * Primary 서버와 연결이 끊어졌을 때 호출되는 CallBack 함수이다.
			 *
			 * @return
			 */
			sWebSocket.onclose = function()
			{
				sLog("WebSocket.onclose", "Closed....");

				// heartbeat timer를 clear 먼저 하고
				if ( isValidInt(sTimerIDHeartbeat) && sTimerIDHeartbeat > 0 )
				{
					clearTimeout(sTimerIDHeartbeat) ;
					sTimerIDHeartbeat = 0 ;
				}
				
				// 접속이 되었었다면.
				if ( sReconnectFlag == true )
				{
					sLog("WebSocket.onclose", "Setting timer to reconnect in 10s...");
					
					// 서버 재 연결 timer 해제 먼저 처리
					if ( sTimerID > 0 ) 
					{
						clearTimeout(sTimerID) ;
						sTimerID = 0 ;
					}
					
					sTimerID = setTimeout("sConnectExt()", sReconnectInterval);

					// EventServerConnected 보낸 경우만 EventServerDisconnected를 보낸다.
					if ( sServerConnected == true )
					{
						// 먼저 서버 연결 종료 메시지를 보낸다.
						sCallback(WMessageType.EventServerDisconnected, "EventID=<"+ WMessageType.EventServerDisconnected +"/>;EventName=<" + WMessage[WMessageType.EventServerDisconnected] + "/>") ;
							
						sServerConnected = false ;
					}
				}
				
				sWebSocket = null;
			};
		}
	}
	catch (e){
		winkerErr = e.message;
		console.log("웹소켓 접속요청 중 에러 발생 : " + winkerErr);
	}
} ;


/**
 * 서버 연결을 종료한다.
 *
 * @return		요청 접수 결과. true/false.
 */
sDisconnect = function() {
	winkerErr = null;
	sReconnectFlag = false ;
	
	// 서버 재 연결 timer 해제 처리
	if ( sTimerID > 0 ) 
	{
		clearTimeout(sTimerID) ;
		sTimerID = 0 ;
	}

	var text = "*CLOSE?*" + sLoginMode + "v" + sLoginVer + "#" ;
	sSend(text) ;
	
	//if ( sWebSocket != null && sWebSocket.readyState == WebSocket.OPEN )
	if ( sWebSocket != null && sWebSocket.readyState != WebSocket.CLOSED ) 
	{
		sWebSocket.close();
	}
	sWebSocket = null;
	
	return true ;
};

/**
 * 서버로 요청을 전송한다.
 *
 * @param strRequest   	{required} 서버로 전송할 상세 요청 내용
 *
 * @return		요청 접수 결과. true/false.
 */
sSend = function(strRequest)
{
	// 연결이 되어 있는 경우에만 전송
	if ( sWebSocket != null && sWebSocket.readyState == WebSocket.OPEN ) {
		sLog("sSend >>","Request  [" + strRequest + "]");

		// String을 bytebuffer로 바꿔서 전송
		sWebSocket.send(getBytes(strRequest));
	} else {
		sLog("sSend","connection is not opened  [" + strRequest + "]");
		
		return false ;
	}

	return true ;
};

/**
 * 서버로 요청을 전송한다. STX/ETX를 추가해서 전송한다.
 *
 * @param strRequest   	{required} 서버로 전송할 상세 요청 내용
 *
 * @return		요청 접수 결과. true/false.
 */
sSendExt = function(strRequest)
{
	// 전문 시작/종료 구분자
	strRequest = DATA_STX + strRequest + DATA_ETX ;

	// 연결이 되어 있는 경우에만 전송
	if ( sWebSocket != null && sWebSocket.readyState == WebSocket.OPEN ) {
		sLog("sSendExt >","Request  [" + strRequest + "]");

		// String을 bytebuffer로 바꿔서 전송
		sWebSocket.send(getBytes(strRequest));
	} else {
		sLog("sSendExt","connection is not opened  [" + strRequest + "]");
		
		return false ;
	}

	return true ;
};

/**
 * 서버로 heartbeat를 전송한다.
 *
 * @return		요청 접수 결과. true/false.
 */
sHeartbeatSend = function()
{
	var text = "*" + sGetRefID() + MSG_DIM + sLoginMode + ":" + sLoginVer + "#" ;
	
	return sSend(text) ;
};

/**
 * 서버에 데이터 전송시 사용할 RefID를 만든다.
 *
 * @return		숫자로만 이루어진 생성한 RefID String. yyyyMMddhhmmss + 99999가 최대값인 연번(10001~99999). 
 */
sGetRefID = function()
{
	if ( sSerial >= 99999 ) sSerial = 10000 ;
	
	return ((new Date).format("yyyyMMddhhmmss") + (++sSerial)) ;
};

/**
 * 서버에서 받은 이벤트를 처리하는 함수이다. 이 함수에서 기본 처리를 하고 다시 CallBack 함수를 호출한다.
 * 이 함수까지는 API 영역의 함수이며 tCallback 함수는 고객사별로 달라질 수 있다.
 *
 * @param msg   	{required} 서버에서 받은 메시지 내용
 *
 * @return
 */
sEventHandler = function(msg, webSocket)
{
	// 1) 데이터를 ; 를 구분자로 split 한다.
	// 2) *로 시작하는 *1444979038725#; 와 같은 heartbeat message는 그대로 재전송...
	// 3) char(1) 로 시작하는 것은 char(2) 까지 다시 자른 다음에 먼저 처리한다.
	//    반복해서 char(1) 이 있는지 다시 확인하고 없으면 최종 ;에 대해서 처리한다.
	var msgArr = msg.split(LST_DIM) ;
	
	for(var msgIdx in msgArr)
	{
		var msgText = msgArr[msgIdx] ;
		
		if ( msgText == "" ) continue ;
		
		if ( msgText.charAt(0) == '*' )
		{
			// 연결이 되어 있는 경우에만 전송
			if ( sWebSocket != null && sWebSocket.readyState == WebSocket.OPEN ) {
				sLog("sEventHandler","Resend heartBeat.... [" + msgText + "]");

				sWebSocket.send(getBytes(msgText));
			} else {
				sLog("sSend","connection is not opened  [" + msgText + "]");
				
				return false ;
			}
		}
		
		if ( msgText.charAt(0) == DATA_STX )
		{
			// 전문 종료 구분자로 다시 split 한다.
			var orgArr = msgText.split(DATA_ETX) ;
			
			for(var orgIdx in orgArr)
			{
				var orgText = orgArr[orgIdx] ;

				if ( orgText == "" ) continue ;
				
				if ( orgText.charAt(0) == DATA_STX )
				{
					orgText = orgText.substring(1,orgText.length) ;
					
					var dataArr = orgText.split(MSG_DIM) ;
					
					// 화면과 연동하기 위한 CallBack 함수를 호출한다.
					if ( dataArr.length == 4 )  sCallback(parseInt(dataArr[0]), orgText, dataArr[1], dataArr[2], dataArr[3]) ;
					else						sCallback(parseInt(dataArr[0]), orgText, dataArr[1], null, dataArr[2]) ;
				} else
				{
					sLog("sEventHandler","Invalid Packet Data with STX....[" + msgText + "]", true);
				}
			}
		} else
		{
			sLog("sEventHandler","Invalid Packet Data without STX....[" + msgText + "]", true);
		}
		
		msgText = null ;
	}

	msgArr = null ;
};

/**
 * CTI에서 발생하는 이벤트를 고객사 화면으로 던져주기 위한 CallBack 함수를 호출한다.
 * CallBack 함수는 wInitialize, wConnect에서 지정할 수도 있고, 여기서 직접 지정할 수도 있다.
 * 고객사별로 이 함수내의 CallBack 함수 처리 내용이 바뀔 수 있다.
 *
 * @param eventId  	 {required} CallBack 함수에 전달할 이벤트 ID
 * @param eventMsg   {required} CallBack 함수에 전달할 이벤트 내용
 * @param objectDBId {required} CallBack 함수에 전달할 통계값에 대한 objectDBId
 * @param objectType {required} CallBack 함수에 전달할 통계값에 대한 objectType
 * @param statId   	 {required} CallBack 함수에 전달할 통계값에 대한 StatID
 * @param statVal    {required} CallBack 함수에 전달할 통계값에 대한 StatVal
 *
 * @return
 */
sCallback = function(eventId, eventMsg, objectDBId, objectType, statId, statVal)
{
	if ( typeof sCallbackEventFunction === "function" ) {		
		sCallbackEventFunction(eventId, eventMsg, objectDBId, objectType, statId, statVal) ;
	}
};

/**
 * 서버에 로그인을 요청한다. Login 요청에 사용되는 Parameter는 wInitialize 함수에서 지정된 값이나 sLoginExt 함수를 통해서 지정된 값을 사용한다.
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sLogin = function()
{
	if ( isValidStr(sLoginID) == true ) return sLoginExt(sLoginID, sLoginPass, sLoginVer, sLoginMode, sLoginCenter) ;

	if ( ! sSend("*SkipInit!#") ) return -1 ;
};

/**
 * 서버에 로그인을 요청한다.
 * 
 * @param strID			{required} Winker 서버에 로그인할 ID
 * @param strPass		{required} Winker 서버에 로그인할 ID에 대한 비밀번호
 * @param strVer		{optional} Winker 서버에 로그인하는 client version
 * @param strMode		{optional} Winker 서버에 로그인하는 client mode
 * @param strCenter		{optional} Winker 서버에 로그인하는 센터명
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sLoginExt = function(strID, strPass, strVer, strMode, strCenter)
{
	sLoginID		= isValidStr(strID)?strID:sLoginID ;
	sLoginPass		= isValidStr(strPass)?strPass:sLoginPass ;
	sLoginVer		= isValidStr(strVer)?strVer:sLoginVer ;
	sLoginMode		= isValidStr(strMode)?strMode:sLoginMode ;
	sLoginCenter	= isValidStr(strCenter)?strCenter:sLoginCenter ;

	if ( isValidStr(sLoginID) == false ) return -1 ;
	if ( isValidStr(sLoginPass) == false ) return -1 ;
	
	var refid = sGetRefID() ;
	
	var textRequest = "00" + MSG_DIM + refid + MSG_DIM + sLoginMode + ":" + sLoginVer + ":" + sLoginID + "↑" + sLoginPass + "↑" + sLoginCenter;

	if ( ! sSendExt(textRequest) ) return -1 ;

	textRequest = null ;

	return refid ;
};

/**
 * 서버에 한명의 상담사의 스킬 추가를 요청한다.
 *
 * @param strPersonDBID	{required} 스킬을 추가할 상담사의 Person DBID 
 * @param strSkillDBID	{required} 상담사에게 추가하고자 하는 스킬의 DBID
 * @param strSkillLevel	{required} 상담사에게 추가하고자 하는 스킬의 level
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sAddSkill = function(strPersonDBID, strSkillDBID, strSkillLevel)
{
	sLog("wAddSkill","Add skill level....[" + strPersonDBID + "," + strSkillDBID + "," + strSkillLevel + "]");
	
	if ( isValidInt(strPersonDBID) == false ) return -1 ;
	if ( isValidInt(strSkillDBID) == false ) return -1 ;
	if ( isValidInt(strSkillLevel) == false ) return -1 ;

	var refid = sGetRefID() ;
	
	var textRequest = WMessageType.RequestAddSkill + MSG_DIM + refid + MSG_DIM + strPersonDBID + ":" + strSkillDBID +":" +  strSkillLevel;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sAddSkill","Add skill level request sent....");
	
	textRequest = null ;

	return refid ;
};

/**
 * 서버에 한명의 상담사의 스킬 추가를 요청한다.
 *
 * @param strPersonDBID	{required} 스킬을 추가할 상담사의 Person DBID 
 * @param strSkillDBID	{required} 상담사에게 추가하고자 하는 스킬의 DBID
 * @param strSkillLevel	{required} 상담사에게 추가하고자 하는 스킬의 level
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sUpdateSkill = function(strPersonDBID, strSkillDBID, strSkillLevel)
{
	sLog("sUpdateSkill","Update skill level....[" + strPersonDBID + "," + strSkillDBID + "," + strSkillLevel + "]");
	
	if ( isValidInt(strPersonDBID) == false ) return -1 ;
	if ( isValidInt(strSkillDBID) == false ) return -1 ;
	if ( isValidInt(strSkillLevel) == false ) return -1 ;

	var refid = sGetRefID() ;
	
	var textRequest = WMessageType.RequestUpdateSkill + MSG_DIM + refid + MSG_DIM + strPersonDBID + ":" + strSkillDBID +":" +  strSkillLevel;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sUpdateSkill","Update skill level request sent....");
	
	textRequest = null ;

	return refid ;
};

/**
 * 서버에 한명의 상담사의 스킬 추가를 요청한다.
 *
 * @param strPersonDBID	{required} 스킬을 추가할 상담사의 Person DBID 
 * @param strSkillDBID	{required} 상담사에게 추가하고자 하는 스킬의 DBID
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sDeleteSkill = function(strPersonDBID, strSkillDBID)
{
	sLog("sDeleteSkill","Delete skill level....[" + strPersonDBID + "," + strSkillDBID + "]");
	
	if ( isValidInt(strPersonDBID) == false ) return -1 ;
	if ( isValidInt(strSkillDBID) == false ) return -1 ;

	var refid = sGetRefID() ;
	
	var textRequest = WMessageType.RequestDeleteSkill + MSG_DIM + refid + MSG_DIM + strPersonDBID + ":" + strSkillDBID ;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sDeleteSkill","Delete skill level request sent....");
	
	textRequest = null ;

	return refid ;
};

/**
 * 특정 내선을 로그아웃 시킨다.
 *
 * @param strRequestDN	{required} 로그아웃을 요청하는 사람 dn
 * @param strLogoutDN	{required} 로그아웃을 시킬 대상 dn
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sLogoutDN = function(strRequestDN, strLogoutDN)
{
	sLog("sLogoutDN","LogoutRequest....[" + strRequestDN + "," + strLogoutDN + "]");
	
	//if ( isValidStr(strRequestDN) == false ) return -1 ;
	if ( isValidStr(strLogoutDN) == false ) return -1 ;

	var refid = sGetRefID() ;
	
	var textRequest = "";
	/*
	if(strRequestDN != '') textRequest = WMessageType.RequestAgentLogout + MSG_DIM + refid + MSG_DIM + strRequestDN + ":" + strLogoutDN ;
	else textRequest = WMessageType.RequestAgentLogout + MSG_DIM + refid + ":" + strLogoutDN ;
*/
	textRequest = WMessageType.RequestAgentLogout + MSG_DIM + refid + MSG_DIM + ":" + strLogoutDN ;
	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sLogoutDN","LogoutRequest sent....");
	
	textRequest = null ;

	return refid ;
};

/**
 * 특정 내선을 Listen한다.
 *
 * @param strRequestDN	{required} Listen을 요청하는 사람 dn
 * @param strListenDN	{required} Listen을 할 대상 dn
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sListenDN = function(strRequestDN, strListenDN)
{
	sLog("sListenDN","ListenRequest....[" + strRequestDN + "," + strListenDN + "]");
	
	if ( isValidStr(strRequestDN) == false ) return -1 ;
	if ( isValidStr(strListenDN) == false ) return -1 ;

	var refid = sGetRefID() ;
	
	var textRequest = WMessageType.RequestListenDN + MSG_DIM + refid + MSG_DIM + strRequestDN + ":" + strListenDN ;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sListenDN","ListenRequest sent....");
	
	textRequest = null ;

	return refid ;
};

/**
 * 2020 콜통계 개선 추가. 
 * 특정 내선을 Listen을 중지 요청한다. 실제로는 감청으로 통화중인 호를 끊기 요청하는 거다.
 * @param strRequestDN	{required} Listen 중지를 요청하는 사람 dn. 감청 권한 있는 전화번호.
 * @param strListenDN	{required} Listen 중지할 할 대상 dn. 통화중인 전화번호.
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sStopListenDN = function(strRequestDN)
{
	sLog("wStopListenDN","StopListenRequest....[" + strRequestDN  + "]");
	
	if ( isValidStr(strRequestDN) == false ) return -1 ;

	var refid = sGetRefID() ;
	
	var textRequest = WMessageType.RequestStopListenDN + MSG_DIM + refid + MSG_DIM + strRequestDN ;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sStopListenDN","StopListenRequest sent....");
	
	textRequest = null ;

	return refid ;
};


/**
 * 2020 콜통계 개선 추가. 
 * 특정 상담원을 특정 상담원그룹에 추가 요청한다.
 * @param strPersonDBID		{required} 상담원 그룹에 추가할 상담원 DBID. 여러 상담원을 추가하고자 할 경우에는 LST_DIM 로 구분자로 입력하면 된다.ex)101;102;103
 * @param intAgentGroupDBID	{required} 상담원을 추가할 상담원 그룹 DBID
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sRequestAddAgentToGroup = function(strPersonDBID, intAgentGroupDBID)
{
	sLog("sRequestAddAgentToGroup","AddAgentToGroupRequest....[" + strPersonDBID + "," + intAgentGroupDBID + "]");
	
	if ( typeof strPersonDBID == "undefined" || strPersonDBID == null) return -1 ;
	if ( isValidInt(intAgentGroupDBID) == false ) return -1 ;

	var refid = this.wGetRefID() ;
	
	var textRequest = WMessageType.RequestAddAgentToGroup + MSG_DIM + refid + MSG_DIM + strPersonDBID + ":" + intAgentGroupDBID ;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("wRequestAddAgentToGroup","AddAgentToGroupRequest sent....");
	
	textRequest = null ;

	return refid ;
};

/**
 * 2020 콜통계 개선 추가.
 * 특정 상담원을 특정 상담원그룹에서 삭제 요청한다.
 * @param strPersonDBID		{required} 상담원 그룹에서 삭제할 상담원 DBID. 여러 상담원을 삭제하고자 할 경우에는 LST_DIM 로 구분자로 입력하면 된다.ex)101;102;103
 * @param intAgentGroupDBID	{required} 상담원을 삭제할 상담원 그룹 DBID
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sRequestDeleteAgentFromGroup = function(strPersonDBID, intAgentGroupDBID)
{
	sLog("sRequestDeleteAgentFromGroup","DeleteAgentFromGroupRequest....[" + strPersonDBID + "," + intAgentGroupDBID + "]");
	
	if ( typeof strPersonDBID == "undefined" || strPersonDBID == null) return -1 ;
	if ( isValidInt(intAgentGroupDBID) == false ) return -1 ;

	var refid = sGetRefID() ;
	
	var textRequest = WMessageType.RequestDeleteAgentFromGroup + MSG_DIM + refid + MSG_DIM + strPersonDBID + ":" + intAgentGroupDBID ;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sRequestDeleteAgentFromGroup","DeleteAgentFromGroupRequest sent....");
	
	textRequest = null ;

	return refid ;
};


/**
 * CfgTransaction의 Annex 옵션 Update 요청을 한다.
 *
 * @param strDBID		{required} CfgTransaction DBID
 * @param strSection	{required} Annex section
 * @param strOption		{required} Annex section의 option
 * @param strValue		{required} Annex section의 option의 값
 *
 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
 */
sUpdateAnnexOption = function(strDBID, strSection, strOption, strValue)
{
	sLog("sUpdateAnnexOption","UpdateAnnexOption....[" + strDBID + "," + strSection + "," + strOption + "," + strValue + "]");
	
	if ( isValidInt(strDBID) == false ) return -1 ;
	if ( isValidStr(strSection) == false ) return -1 ;
	if ( isValidStr(strOption) == false ) return -1 ;
	if ( isValidStr(strValue) == false ) return -1 ;
	
	var refid = sGetRefID() ;
	
	var textRequest = WMessageType.RequestUpdateAnnex + MSG_DIM + refid + MSG_DIM + strDBID + ":" + strSection + ":" + strOption + ":" + strValue;

	if ( ! sSendExt(textRequest) ) return -1 ;
	
	sLog("sUpdateAnnexOption","UpdateAnnexOption sent....");
	
	textRequest = null ;

	return refid ;
};

/**
 * 문자열이고 길이가 1이상인지 확인한다. undefined 일 경우는 false이다.
 *
 * @param strData		{required} 문자열
 *
 * @return		문자열일 경우 true. 아니면 false이다.
 */
isValidStr = function(strData)
{
	if ( typeof strData != "undefined" && strData != null && (strData.trim()).length > 0  ) return true ;

	return false ;
};

/**
 * 숫자인지 확인한다. undefined 일 경우는 false이다.
 *
 * @param intData		{required} 숫자
 *
 * @return		숫자일 경우 true. 아니면 false이다.
 */
isValidInt = function(intData)
{
	if ( typeof intData == "number" ) return true ;
	if ( typeof intData != "undefined" && intData != null )
	{
		if ( typeof intData == "string" && ( intData = intData.trim()) != "" && isNaN(intData) == false ) return true ;
	}

	return false ;
};

/**
 * boolean 값인지 확인한다. undefined 일 경우는 false이다. String이면 true 이면 true이다. 0 보다 큰 숫자이면 true이고 아니면 false이다.
 *
 * @param boolInput		{required} boolean
 *
 * @return		true/false를 반환한다.
 */
getBoolean = function(boolInput)
{
	if ( typeof boolInput == "boolean" ) return boolInput ;
	if ( typeof boolInput != "undefined" && boolInput != null )
	{
		if ( typeof boolInput == "string"  )
		{
			if ( boolInput.toLowerCase()  == "true" ) return true ;
			else 									  return false ;
		} else
		if ( typeof boolInput == "number"  )
		{
			if ( boolInput > 0 ) return true ;
			else 			     return false ;
		} else
		{
			return false ;
		}
	}

	return false ;
};

/**
 * String으로 지정된 encoding으로 ByteBuffer 배열을 생성한다.
 *
 * @param strData		{required} 문자열
 *
 * @return		String을 ByteBuffer로 변경한 ByteBuffer
 */
getBytes = function(strData)
{
	// Create a new ByteBuffer container for the binary data
	//try { 부하 고려하여 try 제거
		ByteBuffer = window.dcodeIO.ByteBuffer
		//Charset = window.dcodeIO.Charset

		var buf = ByteBuffer.wrap(strData, "utf8",false) ;

		buf.flip();

		return buf.buffer;
	//} finally{
	//	buf = null ;
	//}
};

/**
 * ByteBuffer 배열을 String으로 변경한다
 *
 * @param arrByteBuffer		{required} ByteBuffer
 *
 * @return		ByteBuffer를 String으로 변경한 String
 */
 arr2Str = function(arrByteBuffer) {
	var out, i, len, c;
	var char2, char3;

	out = "";
	len = arrByteBuffer.length;
	i = 0;
	while(i < len) {
		c = arrByteBuffer[i++];
		switch(c >> 4)
		{
		  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			// 0xxxxxxx
			out += String.fromCharCode(c);
			break;
		  case 12: case 13:
			// 110x xxxx   10xx xxxx
			char2 = arrByteBuffer[i++];
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			break;
		  case 14:
			// 1110 xxxx  10xx xxxx  10xx xxxx
			char2 = arrByteBuffer[i++];
			char3 = arrByteBuffer[i++];
			out += String.fromCharCode(((c & 0x0F) << 12) |
						   ((char2 & 0x3F) << 6) |
						   ((char3 & 0x3F) << 0));
			break;
		}
	}
	char2 = null ;
	char3 = null ;
	return out;
} ;

/**
 * Date를 지정된 format으로 변경한다.
 *
 * @param format		{required} Date를 바꿀 format
 *
 * @return		format에 맞워서 변경된 String
 */
Date.prototype.format = function(format) //author: meizz
{
	var outform = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3)  //quarter
	}

	if(/(y+)/.test(format)) {
		format=format.replace(RegExp.$1,
								(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}

	if(/(S+)/.test(format)) {
		format=format.replace(RegExp.$1,
							("000" + this.getMilliseconds()).substr((this.getMilliseconds() + "").length + (3 - RegExp.$1.length )));
	}

	for(var k in outform){
		if(new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1,
								  RegExp.$1.length==1 ? outform[k] :("00"+ outform[k]).substr((""+ outform[k]).length));
		}
	}
	outform = null ;
	return format;
} ;

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
