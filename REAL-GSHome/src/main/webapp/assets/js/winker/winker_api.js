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
function winkWebSocket()
{
	this.wWebSocket = null ;		// 현재 Primary 인 WebSocket
	this.wUriC = null ; 			// 현재 연결 시도중인 URI 주소
	this.wUriP = null ;
	this.wUriB = null ;
	
	this.wLoginID    = null ;		// Winker 서버에 로그인할 경우 로그인할 때 사용할 ID
	this.wLoginPass	= null ;		// Winker 서버에 로그인할 경우 로그인할 때 사용할 ID에 대한 Password
	this.wLoginVer	= "1.1.100" ;	// Winker 서버에 접속하는 client의 기본 버전이다. 1.1.100 고정.
	this.wLoginMode	= WLoginMode[WLoginModeType.LoginModeWink] ;//"LoginModeWink" ; //		// Winker 서버에 접속하는 client의 접속 모드이다. Wink/WinkAdmin 두개가 존재한다. 상담사는 Wink/관리자는 WinkAdmin이나 기본 Wink로 고정.
	this.wLoginCenter= null ;
	
	this.wSerial		= 10000 ;			// 시작은 10000 이고 99999를 넘으면 다시 10000으로 reset
	
	this.wCallbackEventFunction = null ;
	
	this.wEventData = null ;
	this.wStoredBuffer = null ;		// 데이터를 받을 때 full data를 받지 못했으면 임시로 저장하는 buffer이다.
	
	this.wReconnectFlag = false ;	
	this.wReOpenStatFlag = false ;	// 연결이 되었다가 close된 후에 다시 연결이 되었을 때 reopen을 할지 말지 지정하는 flag
	
	// console이 지원되지 않아도 에러가 나지 않도록 하기 위함이다.
	this.wConsole = window.console || { log: function() {} };
	this.wConsoleFlag = false ;
	
	// AP 페이지가 기본 https를 사용할 때는 반드시 wss로 처리해야한다.
	// ws:// or wss://	
	this.wProtocolType = "ws://" ;   		
	
	// timer 처리를 clear 하기 위해 id를 저장한다.
	this.wTimerID = null ;			// 서버 연결 단절시 재연결을 위한 timer id
	this.wTimerIDHeartbeat = null ;	// heartbeat를 주기적으로 전송하기 위한 timer id. 연결이 되었을 때만 전송한다.
	
	// EventServerConnected를 보냈을 경우만 EventServerDisconnected를 보내도록 하기 위한 flag
	this.wServerConnected = false ;
	
	this.wReconnectInterval = 10000 ; 	// 연결되어 있는 상태에서 비정상 연결 종료시 재연결 시도 간격 ms.
	this.wHeartbeatInterval = 60000 ; 	// 연결되어 있는 상태에서 Heartbeat 전송 간격 ms.
	
	this.wStatMap = null ;				// 이미 통계 요청된 내용은 재연결이 되면 자동으로 다시 open 요청하도록 하기 위한 임시 저장 map
	this.wWinkerErr = null;
	
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
	this.wLog = function(strFunction, strMessage, consoleFlag) {
		var text = ((new Date).format("yyyy-MM-dd hh:mm:ss.SSS ")) + ("[" + strFunction + "]") + " " + strMessage + "\n" ;
		
		// 함수 호출시 console 로그 기록 요청이 지정되어 있지 않다면 global 옵션을 따라가고
		// 함수 호출시 직접 지정되어 있다면 지정된 옵션을 따라간다.
		if ( typeof consoleFlag == "undefined" )
		{
			if (this.wConsoleFlag == true)  this.wConsole.log(text) ;
			
		} else
		if ( this.getBoolean(consoleFlag) == true ) this.wConsole.log(text) ;
	
		// console이 아닌 다른 곳에 로그 기록을 하고자 할 때 callback 함수를 호출해서 저장한다.
		if ( typeof this.wCallbackLogFunction === "function" ) {
			this.wCallbackLogFunction(text) ;
		}
	
		text = null ;
	};			
	
	/**
	 * CTI 처리에 필요한 정보를 입력받아서 초기화 한다. 이 함수 호출 뒤 wConnectExt() 함수를 호출하여 서버 연결을 시도해야 서버 연결이 된다.
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
	this.wInitialize = function(strHostP, intPortP, strHostB, intPortB, strID, strPassword, strMode, strCenter, eventCallback, logCallback, consoleFlag, wssFlag)
	{
		this.wCallbackEventFunction = eventCallback ;
		this.wCallbackLogFunction = logCallback ;
		
		this.wLoginID		= strID ;
		this.wLoginPass		= strPassword ;
		
		if ( this.isValidStr(strMode ) ) this.wLoginMode = strMode ;
		else						this.wLoginMode = WLoginMode[WLoginModeType.LoginModeWink] ;
		
		this.wLoginCenter 	= strCenter ;
		
		this.wConsoleFlag	= this.getBoolean(consoleFlag) ;
		
		if ( this.getBoolean(wssFlag) == true ) this.wProtocolType = "wss://" ;
		else							   this.wProtocolType = "ws://" ;
		
		if ( this.isValidStr(strHostP) == true && this.isValidInt(intPortP) && parseInt(intPortP) > 0 ) 	this.wUriP = this.wProtocolType + strHostP + ":" + intPortP + "/" ;
		else																					this.wUriP = null ;
	
		if ( this.isValidStr(strHostB) == true && this.isValidInt(intPortB) && parseInt(intPortB) > 0 )
		{
			if ( strHostP != strHostB || intPortP != intPortB )		this.wUriB = this.wProtocolType + strHostB + ":" + intPortB + "/" ;
			else {
				this.wLog("wInitialize","Backup Server connection parameter is same to primary server....");
				this.wUriB = null ;
			}
		} else
		{
			this.wLog("wInitialize","Backup Server connection parameter is invalid....");
			this.wUriB = null ;
		}
	
		if ( this.wUriP == null && this.wUriB == null )
		{
			this.wLog("wInitialize","Server connection parameter is invalid....");
	
			return false ;
		}
	
		return true ;
	};
	
	/**
	 * CTI 처리에 필요한 정보를 입력받아서 서버 연결을 시도한다. 이 함수내에서 wConnectExt() 함수를 호출하여 직접 호출해서 서버 연결을 시도한다.
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
	this.wConnect = function(strHostP, intPortP, strHostB, intPortB, eventCallback, logCallback, consoleFlag, wssFlag)
	{
		this.wCallbackEventFunction = eventCallback ;
		this.wCallbackLogFunction = logCallback ;
				
		// 요청통계 항목을 저장할 map이 초기화 안되어 있으면 초기화 한다.
		if ( this.wStatMap == null ) this.wStatMap = new Map() ;
		
		if ( typeof consoleFlag != "undefined" ) this.wConsoleFlag	= this.getBoolean(consoleFlag) ;
		
		if ( this.getBoolean(wssFlag) == true ) this.wProtocolType = "wss://" ;
		else							   this.wProtocolType = "ws://" ;
		
		if ( this.isValidStr(strHostP) == true && this.isValidInt(intPortP) && parseInt(intPortP) > 0 ) 	this.wUriP = this.wProtocolType + strHostP + ":" + intPortP + "/" ;
		else																					this.wUriP = null ;
	
		if ( this.isValidStr(strHostB) == true && this.isValidInt(intPortB) && parseInt(intPortB) > 0 )
		{
			if ( strHostP != strHostB || intPortP != intPortB )		this.wUriB = this.wProtocolType + strHostB + ":" + intPortB + "/" ;
			else {
				this.wLog("wConnect","Backup Server connection parameter is same to primary server....");
				this.wUriB = null ;
			}
		} else
		{
			this.wLog("wConnect","Backup Server connection parameter is invalid....");
			this.wUriB = null ;
		}
	
		if ( this.wUriP == null && this.wUriB == null )
		{
			this.wLog("wConnect","Server connection parameter is invalid....");
	
			return false ;
		}
	
		if ( this.wUriP != null || this.wUriB != null )
		{
			this.wConnectExt(true) ;
		} else
		{
			this.wLog("wConnect","Server connection parameter is invalid....");
	
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
	this.wConnectExt = function(connectFlag, wobject)
	{
		var this_ = null ;
		
		
		if ( typeof wobject != "undefined" && wobject instanceof winkWebSocket )
		{
			this_ = wobject ;
		}else
		{
			this_ = this ;	
		}
		
		this_.wLog("wConnectExt","Starts...." + connectFlag) ;
	
		if ( typeof connectFlag == "undefined" && this_.wReconnectFlag == false )
		{
			this_.wLog("wConnectExt","Disconnect flag is set, no more retry....") ;
			
			return ;
		}
			
		this_.wWinkerErr = null;
		// 서버 연결을 시도한다.
		// WebSocket.CONNECTING	0
		// WebSocket.OPEN 		1
		// WebSocket.CLOSING		2
		// WebSocket.CLOSED		3	
		if ( this_.wWebSocket != null )
		{
			this_.wLog("wConnectExt","Server is already connected....") ;
			
			return ;
		}
		
		if ( this_.wUriC != this_.wUriP || this_.wUriB == null )
		{
			this_.wLog("wConnectExt","Connectiong primary...." + this_.wUriP);
			
			this_.wUriC = this_.wUriP ;
		} else{
			this_.wLog("wConnectExt","Connectiong backup...." + this_.wUriB);
			
			this_.wUriC = this_.wUriB ;
		}
		try{
			this_.wWebSocket = new WebSocket(this_.wUriC);
			//setTimeout("",1000);
			
			if(this_.wWebSocket != null && typeof this_.wWebSocket != "undefined"){
				this_.wWebSocket.binaryType = "arraybuffer";
				
				/**
				 * Primary 서버 연결이 되었을 때 호출되는 CallBack 함수이다.
				 *
				 * @return
				 */
				this_.wWebSocket.onopen = function()
				{
					this_.wReconnectFlag = true ;
					this_.wLog("WebSocket.onopen","Opened...." + this_.wUriC);
					
					// 먼저 서버 연결 메시지를 보낸다.
					this_.wServerConnected = true ;
					this_.wCallback(WMessageType.EventServerConnected, "EventID=<"+ WMessageType.EventServerConnected +"/>;EventName=<" + WMessage[WMessageType.EventServerConnected] + "/>") ;
					
					// 자동 로그인을 한다.
					this_.wLogin() ;
					
					// 혹시라도 실행중일지 모르니 clear 하고
					if ( this_.isValidInt(this_.wTimerIDHeartbeat) && this_.wTimerIDHeartbeat > 0 )
					{
						clearTimeout(this_.wTimerIDHeartbeat) ;
						this_.wTimerIDHeartbeat = 0 ;
					}
					
					// 새로 timer 시작
					//this_.wTimerIDHeartbeat = setInterval("wHeartbeatSend()", this_.wHeartbeatInterval);
					this_.wTimerIDHeartbeat = setInterval(this_.wHeartbeatSend, this_.wHeartbeatInterval, this_);
					// 자동 open해야할 내용이 있으면 처리한다.
					if ( this_.wReOpenStatFlag == true )
					{
						this_.wReOpenStat() ;
						this_.wReOpenStatFlag = false ;
					}
				};
			
				/**
				 * Primary 서버에서 메시지를 받는 CallBack 함수이다.
				 *
				 * @param msg   	{required} Winker 서버에서 받은 메시지
				 * @return
				 */
				this_.wWebSocket.onmessage = function(msg)
				{
					//var decoder = new TextDecoder("utf-8"); 		// TextDecoder 가 IE/Edge에서는 지원 안됨.
					//var decodedString = decoder.decode(msg.data);
					
					if(typeof this_.wWebSocket === "undefined" || this_.wWebSocket == null)	return;
					
					var decodedString = this_.arr2Str(new Uint8Array(msg.data)) ;
					
					this_.wLog("WebSocket.onmessage <<", "Message [" + decodedString + "]");
			
					if ( decodedString.charAt(decodedString.length-1 ) == LST_DIM || decodedString.charAt(decodedString.length-1 ) == DATA_ETX ) // 끝에 도달한거다.
					{
						// 이미 저장된게 있다면 그 뒤에 추가로 붙여 준다. 아니면 이걸 그대로 wEventHandler에 전달한다.
						if ( this_.wStoredBuffer != null )
						{
							var tempBuffer = new ArrayBuffer(this_.wStoredBuffer.length + msg.data.length) ;
							var tempIntArr = new Uint8Array(tempBuffer) ;
							
							tempIntArr.set(this_.wStoredBuffer) ;
							tempIntArr.set(msg.data, this_.wStoredBuffer.length) ;
							
							decodedString = arr2Str(tempIntArr) ;
						} else
						{
							this_.wEventHandler(decodedString, this_.wWebSocket) ;
						}
					} else
					{
						// 이미 저장된게 있다면 그 뒤에 추가로 붙여 준다. 아니면 새로 저장한다.
						if ( this_.wStoredBuffer != null )
						{
							var tempBuffer = new ArrayBuffer(this_.wStoredBuffer.length + msg.data.length) ;
							var tempIntArr = new Uint8Array(tempBuffer) ;
							
							tempIntArr.set(this_.wStoredBuffer) ;
							tempIntArr.set(msg.data, this_.wStoredBuffer.length) ;
							
							tempIntArr = null ;
						} else
						{
							this_.wStoredBuffer = new ArrayBuffer(msg.data.length) ;
							var tempIntArr = new Uint8Array(this_.wStoredBuffer) ;
							
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
				this_.wWebSocket.onclose = function()
				{
		
					if(typeof this_.wWebSocket === "undefined")	return;
					
					this_.wWebSocket = null;
					
					//this_.wLog("WebSocket.onclose", "Closed....");
					
					// heartbeat timer를 clear 먼저 하고
					if ( this_.isValidInt(this_.wTimerIDHeartbeat) && this_.wTimerIDHeartbeat > 0 )
					{
						clearTimeout(this_.wTimerIDHeartbeat) ;
						this_.wTimerIDHeartbeat = 0 ;
					}
					
					// 접속이 되었었다면.
					if ( this_.wReconnectFlag == true )
					{
						this_.wReOpenStatFlag = true ; // 접속이 되었었는데 재연결을 해야하는 상황이면 이건 Stat도 열려 있었던게 있으면 다시 오픈을 해야하는 상황
						
						this_.wLog("WebSocket.onclose", "Setting timer to reconnect in 10s...");
						
						// 서버 재 연결 timer 해제 먼저 처리
						if ( this_.wTimerID > 0 ) 
						{
							clearTimeout(this_.wTimerID) ;
							this_.wTimerID = 0 ;
						}
						
						//this_.wTimerID = setTimeout("wConnectExt()", wReconnectInterval);
						this_.wTimerID = setTimeout(this_.wConnectExt, this_.wReconnectInterval, null, this_);
			
						// EventServerConnected 보낸 경우만 EventServerDisconnected를 보낸다.
						if ( this_.wServerConnected == true )
						{
							// 먼저 서버 연결 종료 메시지를 보낸다.
							this_.wCallback(WMessageType.EventServerDisconnected, "EventID=<"+ WMessageType.EventServerDisconnected +"/>;EventName=<" + WMessage[WMessageType.EventServerDisconnected] + "/>") ;
								
							this_.wServerConnected = false ;
						}
					}
					
		
				};
			}
		}catch(e){
			this_.wWinkerErr = e.message;
		}
	} ;
	
	
	/**
	 * 서버 연결을 종료한다.
	 *
	 * @return		요청 접수 결과. true/false.
	 */
	this.wDisconnect = function() {
		this.wReconnectFlag = false ;
		this.wReOpenStatFlag = false ;
		this.wUriC = null ;
		this.wWinkerErr = null;
		
		// 서버 재 연결 timer 해제 처리
		if ( this.wTimerID > 0 ) 
		{
			clearTimeout(this.wTimerID) ;
			this.wTimerID = 0 ;
		}
	
		var text = "*CLOSE?*" + this.wLoginMode + "v" + this.wLoginVer + "#" ;
		this.wSend(text) ;
		
		//if ( this.wWebSocket != null && this.wWebSocket.readyState == WebSocket.OPEN ) {
		if ( this.wWebSocket != null ) {
			try{
				this.wWebSocket.close();	
			}catch(e){
				
			}
			
		}
		this.wWebSocket = null;
	
		// 재연결시 reopen을 위한 map을 clear 한다.
		this.wClearStatMap() ;
		
		return true ;
	};
	
	/**
	 * 서버로 요청을 전송한다.
	 *
	 * @param strRequest   	{required} 서버로 전송할 상세 요청 내용
	 *
	 * @return		요청 접수 결과. true/false.
	 */
	this.wSend = function(strRequest)
	{
		// 연결이 되어 있는 경우에만 전송
		if ( this.wWebSocket != null && this.wWebSocket.readyState == WebSocket.OPEN ) {
			this.wLog("wSend >>","Request  [" + strRequest + "]");
	
			// String을 bytebuffer로 바꿔서 전송
			this.wWebSocket.send(this.getBytes(strRequest));
		} else {
			this.wLog("wSend","connection is not opened  [" + strRequest + "]");
			
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
	this.wSendExt = function(strRequest)
	{
		// 전문 시작/종료 구분자
		strRequest = DATA_STX + strRequest + DATA_ETX ;
	
		// 연결이 되어 있는 경우에만 전송
		if ( this.wWebSocket != null && this.wWebSocket.readyState == WebSocket.OPEN ) {
			this.wLog("wSendExt >","Request  [" + strRequest + "]");
	
			// String을 bytebuffer로 바꿔서 전송
			this.wWebSocket.send(this.getBytes(strRequest));
		} else {
			this.wLog("wSendExt","connection is not opened  [" + strRequest + "]");
			
			return false ;
		}
	
		return true ;
	};
	
	/**
	 * 서버로 heartbeat를 전송한다.
	 *
	 * @return		요청 접수 결과. true/false.
	 */
	this.wHeartbeatSend = function(wobject)
	{
		var this_ = null ;
		
		if ( typeof wobject != "undefined" && wobject instanceof winkWebSocket )
		{
			this_ = wobject ;
		}else
		{
			this_ = this ;	
		}
		
		var text = "*" + this_.wGetRefID() + MSG_DIM + this_.wLoginMode + ":" + this_.wLoginVer + "#" ;
		
		this_.wLog("wHeartbeatSend","HeartbeatSend....[" + text + "]") ;
		
		this_.wSend(text) ;
		
		//this_.wTimerIDHeartbeat = setTimeout(wHeartbeatSend(this_), 10000) ; //this_.wHeartbeatInterval);
		
		return ;
	};
	
	/**
	 * 서버에 데이터 전송시 사용할 RefID를 만든다.
	 *
	 * @return		숫자로만 이루어진 생성한 RefID String. yyyyMMddhhmmss + 99999가 최대값인 연번(10001~99999). 
	 */
	this.wGetRefID = function()
	{
		if ( this.wSerial >= 99999 ) this.wSerial = 10000 ;
		
		return ((new Date).format("yyyyMMddhhmmss") + (++this.wSerial)) ;
	};
	
	/**
	 * 서버에서 받은 이벤트를 처리하는 함수이다. 이 함수에서 기본 처리를 하고 다시 CallBack 함수를 호출한다.
	 * 이 함수까지는 API 영역의 함수이며 tCallback 함수는 고객사별로 달라질 수 있다.
	 *
	 * @param msg   	{required} 서버에서 받은 메시지 내용
	 *
	 * @return
	 */
	this.wEventHandler = function(msg, webSocket)
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
				this.wLog("wEventHandler","Resend heartBeat.... [" + msgText + "]");
				if ( this.wWebSocket != null && this.wWebSocket.readyState == WebSocket.OPEN ) {
		
					// String을 bytebuffer로 바꿔서 전송
					this.wWebSocket.send(this.getBytes(msgText));
				}
				//this.wWebSocket.send(this.getBytes(msgText));
			} else
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
						if ( dataArr.length == 4 )  this.wCallback(parseInt(dataArr[0]), orgText, dataArr[1], dataArr[2], dataArr[3]) ;
						else						this.wCallback(parseInt(dataArr[0]), orgText, dataArr[1], null, dataArr[2]) ;
					} else
					{
						// 서울:100~1
						var statArr = orgText.split(OBJ_DIM) ;	// 서울:100~1 에서 : 로 분리
						
						if ( statArr.length == 2 )
						{
							var valArr  = statArr[1].split(VAL_DIM) ;	// ~ 로 분리
						
							if ( statArr.length == 2 )
							{
								var idArr = statArr[0].split(TYP_DIM) ;		// 101^2:100~1 일 경우에 대해
								
								// 화면과 연동하기 위한 CallBack 함수를 호출한다.
								// msgText : 원본 메시지
								// idArr[0] : object dbid 또는 name. 201^2:100~1 일 경우에 대해 201. 서울:100~1 일 경우에 '서울'
								// idArr[1] : object type. 201^2:100~1 일 경우에 대해 2. 서울:200~1 일 경우에는 undefined
								// valArr[0] : 통계ID. 201^2:100~1 에서 100
								// valArr[1] : 통계값. 201^2:100~1 에서 1
								this.wCallback(WMessageType.EventStatInfo, msgText, idArr[0], idArr[1], valArr[0], valArr[1]) ;
							} else{
								this.wLog("wEventHandler","Invalid StatData value....[" + statArr[1] + "]", true);
							}
						} else{
							this.wLog("wEventHandler","Invalid StatData name....[" + msgText + "]", true);
						}
					}
				}
			} else
			{
				// 서울:100~1
				var statArr = msgText.split(OBJ_DIM) ;	// 서울:100~1 에서 : 로 분리
				
				if ( statArr.length == 2 )
				{
					var valArr  = statArr[1].split(VAL_DIM) ;	// ~ 로 분리
				
					if ( statArr.length == 2 )
					{
						var idArr = statArr[0].split(TYP_DIM) ;		// 101^2:100~1 일 경우에 대해
						
						// 화면과 연동하기 위한 CallBack 함수를 호출한다.
						// msgText : 원본 메시지
						// idArr[0] : object dbid 또는 name. 201^2:100~1 일 경우에 대해 201. 서울:100~1 일 경우에 '서울'
						// idArr[1] : object type. 201^2:100~1 일 경우에 대해 2. 서울:200~1 일 경우에는 undefined
						// valArr[0] : 통계ID. 201^2:100~1 에서 100
						// valArr[1] : 통계값. 201^2:100~1 에서 1
						this.wCallback(WMessageType.EventStatInfo, msgText, idArr[0], idArr[1], valArr[0], valArr[1]) ;
					} else{
						this.wLog("wEventHandler","Invalid StatData value....[" + statArr[1] + "]", true);
					}
				} else{
					this.wLog("wEventHandler","Invalid StatData name....[" + msgText + "]", true);
				}
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
	this.wCallback = function(eventId, eventMsg, objectDBId, objectType, statId, statVal)
	{
		if ( typeof this.wCallbackEventFunction === "function" ) {		
			this.wCallbackEventFunction(eventId, eventMsg, objectDBId, objectType, statId, statVal) ;
		}
	};
	
	/**
	 * 서버에 로그인을 요청한다. Login 요청에 사용되는 Parameter는 wInitialize 함수에서 지정된 값이나 wLoginExt 함수를 통해서 지정된 값을 사용한다.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wLogin = function()
	{
		if ( this.isValidStr(this.wLoginID) == true ) return this.wLoginExt(this.wLoginID, this.wLoginPass, this.wLoginVer, this.wLoginMode, this.wLoginCenter) ;
	
		if ( ! this.wSend("*SkipInit!#") ) return -1 ;
	};
	
	/**
	 * 서버에 로그인을 요청한다.
	 * 로그인 전문,,00~12345678901234567890~WinkAdminPlus:1.1.100:sup1admin↑a↑구로1
	 
	 * @param strID			{required} Winker 서버에 로그인할 ID
	 * @param strPass		{required} Winker 서버에 로그인할 ID에 대한 비밀번호
	 * @param strVer		{optional} Winker 서버에 로그인하는 client version
	 * @param strMode		{optional} Winker 서버에 로그인하는 client mode
	 * @param strCenter		{optional} Winker 서버에 로그인하는 센터명
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wLoginExt = function(strID, strPass, strVer, strMode, strCenter)
	{
		this.wLoginID		= this.isValidStr(strID)?strID:this.wLoginID ;
		this.wLoginPass		= this.isValidStr(strPass)?strPass:this.wLoginPass ;
		this.wLoginVer		= this.isValidStr(strVer)?strVer:this.wLoginVer ;
		this.wLoginMode		= this.isValidStr(strMode)?strMode:this.wLoginMode ;
		this.wLoginCenter	= this.isValidStr(strCenter)?strCenter:this.wLoginCenter ;
	
		if ( this.isValidStr(this.wLoginID) == false ) return -1 ;
		if ( this.isValidStr(this.wLoginPass) == false ) return -1 ;
		
		var refid = this.wGetRefID() ;
		
		var textRequest = "00" + MSG_DIM + refid + MSG_DIM + this.wLoginMode + ":" + this.wLoginVer + ":" + this.wLoginID + "↑" + this.wLoginPass + "↑" + this.wLoginCenter;
	
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * 서버에 개별 통계항목 전송을 요청한다.
	 *
	 * @param strObjectID	{required} Winker 서버에 요청할 통계 항목에 대한 object key값. Person의 UserName. AgentGroup 이름. VDN/Queue 번호.
	 *								   dbid로 처리하는 경우에는 dbid^type 을 넣는다. type 값은 	ACDQ/VDN은 2, 상담사Person은 3, AgentGroup은 5이다.
	 *								   즉 상담사에 대한 통계를 요청할 때는 dbid1^2 형식으로 넣어주면 된다.
	 * @param strStatID		{required} Winker 서버에 요청할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등. 여러개를 요청하고자 한다면 STA_DIM 을 구분자로 하면 된다. 100 + STA_DIM + 101
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStat = function(strObjectID, strStatID)
	{
		this.wLog("wOpenStat","StatOpenRequest info....[" + strObjectID + "," + strStatID + "]");
		
		if ( this.isValidStr(strObjectID) == false ) return -1 ;
		if ( this.isValidStr(strStatID) == false ) return -1 ;
		
		if ( this.wStatMap == null ) return -1 ;
		
		// 먼저 map에 추가한다.
		var statidmap = this.wStatMap.get(strObjectID) ;
		
		if ( statidmap == null )
		{
			statidmap = new Map() ;
		}
		
		statidmap.put(strStatID,1) ;
		this.wStatMap.put(strObjectID, statidmap) ;
		
		var refid = this.wGetRefID() ;
		
		var textRequest = WMessageType.RequestOpenStat + MSG_DIM + refid + MSG_DIM+ strObjectID + STA_DIM + strStatID;
	
		if ( ! this.wSendExt(textRequest) ) return -1 ;
		
		this.wLog("wOpenStat","StatOpenRequest sent....");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * 서버에 다수 object에 다수 통계항목 전송을 요청한다.
	 *
	 * @param strObjectIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 object key값 배열 또는 "↑" 구분자 목록. Person의 UserName. AgentGroup 이름. VDN/Queue 번호. 
	 *								   dbid로 처리하는 경우에는 dbid^type 을 "↑" 구분자로 목록을 만든다. type 값은 	ACDQ/VDN은 2, 상담사Person은 3, AgentGroup은 5이다.
	 *								   즉 상담사에 대한 통계를 요청할 때는 dbid1^2↑dbid2^2 형식으로 넣어주면 된다.
	 * @param strStatIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값 배열 또는 "↑" 구분자 목록. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatExt = function(strObjectID, strStatID)
	{
		this.wLog("wOpenStatExt","StatOpenRequest info....[" + strObjectID + "," + strStatID + "]");
		
		if ( typeof strObjectID == "undefined" || strObjectID == null) return -1 ;
		if ( typeof strStatID == "undefined" || strStatID == null) return -1 ;
		
		if ( this.wStatMap == null ) return -1 ;
		
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestOpenStat + MSG_DIM + refid ;
	
		var objecIDArr = null ;
		var statIDArr = null ;
		var statIDStr = "" ;
		
		if ( strObjectID instanceof Array )
		{
			objecIDArr = strObjectID ;
		} else
		if ( typeof strObjectID == "string" )
		{	
			objecIDArr = strObjectID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
	
		if ( strStatID instanceof Array )
		{
			statIDArr = strStatID.slice() ;
			for(var statIDIdx in strStatID)
			{
				var statID = strStatID[statIDIdx] ;
	
				if ( statID == "" ) continue ;
				statIDStr = statIDStr + STA_DIM + statID ;
			}		
		} else
		if ( typeof strStatID == "string" )
		{
			statIDArr = strStatID.split(STA_DIM) ;
			
			if ( statIDStr.charAt(0) == STA_DIM ) 	statIDStr = strStatID ;
			else							  		statIDStr = STA_DIM + strStatID ;
		} else
		{
			return -1 ;
		}
		
		for(var objectIDIdx in objecIDArr)
		{
			var objectID = objecIDArr[objectIDIdx] ;
			
			if ( objectID == "" ) continue ;
			textRequest = textRequest + MSG_DIM + objectID + statIDStr ;
		
			// 먼저 map에 추가한다.
			var statidmap = this.wStatMap.get(objectID) ;
			
			if ( statidmap == null )
			{
				statidmap = new Map() ;
			}
			
			for(var statIDIdx in statIDArr)
			{
				var statID = statIDArr[statIDIdx] ;
	
				if ( statID == "" ) continue ;
				statidmap.put(statID,1) ;
			}
			
			this.wStatMap.put(objectID, statidmap) ;
		}
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wOpenStatExt","StatOpenRequest sent....[" + textRequest +"]");
		
		textRequest = null ;
		objecIDArr = null ;
		statIDStr = null ;
	
		return refid ;
	};
	
	/**
	 * 서버에 상담원 개별 통계항목 전송을 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatAgent = function(strDBID, strStatID)
	{
		return this.wOpenStat(strDBID + TYP_DIM + WObjectType.CFGPerson, strStatID) ;
	};
	
	/**
	 * 서버에 다수 상담원 다수 통계항목 전송을 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatAgentExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGPerson ;
		}
		
		return this.wOpenStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 서버에 상담원그룹(Skill/업무) 개별 통계항목 전송을 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatAgentGroup = function(strDBID, strStatID)
	{
		return this.wOpenStat(strDBID + TYP_DIM + WObjectType.CFGAgentGroup, strStatID) ;
	};
	
	/**
	 * 서버에 다수 상담원그룹(Skill/업무) 다수 통계항목 전송을 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatAgentGroupExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGAgentGroup ;
		}
		
		return this.wOpenStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 서버에 DN(VDN/ACDQueue) 개별 통계항목 전송을 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatDN = function(strDBID, strStatID)
	{
		return this.wOpenStat(strDBID + TYP_DIM + WObjectType.CFGDN, strStatID) ;
	};
	
	/**
	 * 서버에 다수 DN(VDN/ACDQueue) 다수 통계항목 전송을 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatDNExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGDN ;
		}
		
		return this.wOpenStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 서버에 DN(VDN/ACDQueue) 개별 통계항목 전송을 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatDNGroup = function(strDBID, strStatID)
	{
		return this.wOpenStat(strDBID + TYP_DIM + WObjectType.CFGDNGroup, strStatID) ;
	};
	
	/**
	 * 서버에 다수 DN(VDN/ACDQueue) 다수 통계항목 전송을 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wOpenStatDNGroupExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGDNGroup ;
		}
		
		return this.wOpenStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 서버가 재연결되면 기존에 열었었던 통계 항목을 자동으로 다시 open한다.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wReOpenStat = function()
	{
		this.wLog("wReOpenStat","ReOpen starts....");
		
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestOpenStat + MSG_DIM + refid ;
		
		var reopenObjectCount = 0 ;
		var objectIDs = this.wStatMap.keys() ;
		
		for(var index in objectIDs)
		{
			var objectID = objectIDs[index] ;
			
			var statMap = this.wStatMap.get(objectID) ;
			var statIDs = statMap.keys() ;
			var strStatID = "" ;
			
			for(var statIDIdx in statIDs)
			{
				var statID = statIDs[statIDIdx] ;
				
				strStatID = strStatID + STA_DIM + statID ;
			}
			
			textRequest = textRequest + MSG_DIM + objectID + strStatID ;
			
			reopenObjectCount ++ ;
		}
		
		if ( reopenObjectCount > 0 )
		{
			this.wLog("wReOpenStat","StatReOpenRequest Data....(" + reopenObjectCount + ")[" + textRequest +"]");
		
			if ( ! this.wSendExt(textRequest) ) return -1 ;
	
			this.wLog("wReOpenStat","StatReOpenRequest sent....");
		} else
		{
			this.wLog("wReOpenStat","Nothing to reopen....");
		}
	
		return refid ;
	};
	
	/**
	 * 서버에 개별 통계항목 전송을 취소 요청한다.
	 *
	 * @param strObjectID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object key값. Person의 UserName. AgentGroup 이름. VDN/Queue 번호.
	 *								   dbid로 처리하는 경우에는 dbid^type 넣는다. type 값은 	ACDQ/VDN은 2, 상담사Person은 3, AgentGroup은 5이다.
	 * @param strStatID		{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStat = function(strObjectID, strStatID)
	{
		this.wLog("wCloseStat","StatCloseRequest info....[" + strObjectID + "," + strStatID + "]");
		
		if ( this.isValidStr(strObjectID) == false ) return -1 ;
		if ( this.isValidStr(strStatID) == false ) return -1 ;
		
		if ( this.wStatMap == null ) return -1 ;
		
		// 먼저 map에서 지운다.
		var statidmap = this.wStatMap.get(strObjectID) ;
		
		if ( statidmap != null )
		{
			statidmap.remove(strStatID) ;
			
			if ( statidmap.size() == 0 )
			{
				this.wStatMap.remove(strObjectID) ;
			}
		}
		
		var refid = this.wGetRefID() ;
		
		var textRequest = WMessageType.RequestCloseStat + MSG_DIM + refid + MSG_DIM + strObjectID + STA_DIM + strStatID;
	
		if ( ! this.wSendExt(textRequest) ) return -1 ;
		
		this.wLog("wCloseStat","StatCloseRequest sent...." + textRequest);
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * 서버에 다수 object에 다수 통계항목 전송을 취소 요청한다.
	 *
	 * @param strObjectIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object key값 배열 또는 STA_DIM 구분자 목록. Person의 UserName. AgentGroup 이름. VDN/Queue 번호.
	 *								   dbid로 처리하는 경우에는 dbid^type 을 STA_DIM 구분자로 목록을 만든다. type 값은 	ACDQ/VDN은 2, 상담사Person은 3, AgentGroup은 5이다.
	 * @param strStatIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값 배열 또는 STA_DIM 구분자 목록. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatExt = function(strObjectID, strStatID)
	{
		this.wLog("wCloseStatExt","StatCloseRequest info....[" + strObjectID + "," + strStatID + "]");
		
		if ( typeof strObjectID == "undefined" || strObjectID == null) return -1 ;
		if ( typeof strStatID == "undefined" || strStatID == null) return -1 ;
		
		if ( this.wStatMap == null ) return -1 ;
		
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestCloseStat + MSG_DIM + refid ;
	
		var objecIDArr = null ;
		var statIDArr = null ;
		var statIDStr = "" ;
		
		if ( strObjectID instanceof Array )
		{
			objecIDArr = strObjectID ;
		} else
		if ( typeof strObjectID == "string" )
		{	
			objecIDArr = strObjectID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
	
		if ( strStatID instanceof Array )
		{
			statIDArr = statIDStr.slice() ;
			for(var index in strStatID)
			{
				var statID = strStatID[index] ;
	
				if ( statID == "" ) continue ;
				statIDStr = statIDStr + STA_DIM + statID ;
			}		
		} else
		if ( typeof strStatID == "string" )
		{
			statIDArr = strStatID.split(STA_DIM) ;
			if ( statIDStr.charAt(0) == STA_DIM ) statIDStr = strStatID ;
			else							  statIDStr = STA_DIM + strStatID ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			var objectID = objecIDArr[index] ;
	
			if ( objectID == "" ) continue ;
			textRequest = textRequest + MSG_DIM + objectID + statIDStr ;
			
			// 먼저 map에서 삭제한다.
			var statidmap = this.wStatMap.get(objectID) ;
			
			if ( statidmap != null )
			{	
				for(var statID in statIDArr)
				{
					if ( statID == "" ) continue ;
					statidmap.remove(statID) ;
				}
				
				if ( statidmap.size() == 0 )
				{
					this.wStatMap.remove(objectID) ;
				}
			}
		}
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wCloseStatExt","StatCloseRequest sent....[" + textRequest +"]");
		
		textRequest = null ;
	
		return refid ;
	};
	
	
	/**
	 * 서버에 상담원 개별 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatAgent = function(strDBID, strStatID)
	{
		return this.wCloseStat(strDBID + TYP_DIM + WObjectType.CFGPerson, strStatID) ;
	};
	
	/**
	 * 서버에 다수 상담원 다수 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatAgentExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGPerson ;
		}
		
		return this.wCloseStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 서버에 AgentGroup(Skill/업무) 개별 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatAgentGroup = function(strDBID, strStatID)
	{
		return this.wCloseStat(strDBID + TYP_DIM + WObjectType.CFGAgentGroup, strStatID) ;
	};
	
	/**
	 * 서버에 다수 AgentGroup(Skill/업무) 다수 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatAgentGroupExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGAgentGroup ;
		}
		
		return this.wCloseStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 서버에 DN(VDN/ACDQueue) 개별 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatDN = function(strDBID, strStatID)
	{
		return this.wCloseStat(strDBID + TYP_DIM + WObjectType.CFGDN, strStatID) ;
	};
	
	/**
	 * 서버에 다수 DN(VDN/ACDQueue) 다수 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatDNExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGDN ;
		}
		
		return this.wCloseStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 서버에 DN(VDN/ACDQueue) 개별 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값.
	 * @param strStatID	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatDNGroup = function(strDBID, strStatID)
	{
		return this.wCloseStat(strDBID + TYP_DIM + WObjectType.CFGDNGroup, strStatID) ;
	};
	
	/**
	 * 서버에 다수 DN(VDN/ACDQueue) 다수 통계항목 전송 취소를 요청한다.
	 *
	 * @param strDBIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 object dbid값 배열.
	 * @param strStatIDArr	{required} Winker 서버에 요청 취소할 통계 항목에 대한 stat key값 배열. 3자리 통계항목의 ID 값. 100,101 등.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wCloseStatDNGroupExt = function(strDBID, strStatID)
	{
		var objecIDArr = null ;
		
		if ( strDBID instanceof Array )
		{
			objecIDArr = strDBID ;
		} else
		if ( typeof strDBID == "string" )
		{	
			objecIDArr = strDBID.split(STA_DIM) ;
		} else
		{
			return -1 ;
		}
		
		for(var index in objecIDArr)
		{
			objecIDArr[index] = objecIDArr[index] + TYP_DIM + WObjectType.CFGDNGroup ;
		}
		
		return this.wCloseStatExt(objecIDArr, strStatID) ;
	};
	
	/**
	 * 통계 요청 map에 저장되어 있던 내용을 모두 지운다
	 *
	 * @return
	 */
	this.wClearStatMap = function()
	{
		//wLog("wClearStatMap","Clear starts....");
		
		var objectIDs = this.wStatMap.keys() ;
		
		for(var index in objectIDs)
		{
			var objectID = objectIDs[index] ;
			
			var statMap = this.wStatMap.get(objectID) ;
		}
		
		this.wStatMap.clear() ;
	
		//wLog("wClearStatMap","Clear ends....");
		
		return  ;
	};
	
	/**
	 * 업무 센터 목록을 요청한다.  dbid:type:name 값을 "," 구분자로 이어서 온다. 즉 "부모조직이름:dbid:type~구로1:200:22,구로2:684:22" 와 같이 나중에 event로 온다.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패. 이 값을 저장해 놓고 나중에 Event가 올 때 비교해서 구분해야 한다.
	 */
	this.wGetOrgCenterList = function()
	{
		this.wLog("wGetCenterList","Requesting Center List....");
	
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestOrgInfo + MSG_DIM + refid +MSG_DIM + ":0:" + WObjectType.CFGFolder ;
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wCloseStatExt","Requesting Center List sent....[" + textRequest +"]");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * 상담사 목록을 조회하기 위해 Level1 조직 정보를 요청한다. 최종 상담원 그룹 목록을 받기 위해서는 Center -> Level1 -> Level2 -> AgentGroup -> AgentList 순서로 조회한다.
	 * 이 조직 구조는 고객사의 요청에 따른 업무 형태에 따라서 Level2가 제외되거나 Level3가 추가될 수도 있다.
	 * dbid:type:name 값을 "," 구분자로 이어서 온다. 즉  즉 "부모조직이름:dbid:type~200:22:조직1,684:22:조직2" 와 같이 나중에 event로 온다.
	 *
	 * @param parentDBID	{required} 조직 목록을 구하고자 하는 Parent Object의 DBID
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패. 이 값을 저장해 놓고 나중에 EventAgentOrgInfo가 올 때 비교해서 구분해야 한다.
	 */
	this.wGetOrgListForAgent = function(parentDBID)
	{
		this.wLog("wGetOrgListForAgent","Requesting Org List for Agent....[" + parentDBID + "]");
	
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestAgentOrgInfo + MSG_DIM + refid +MSG_DIM +":" + parentDBID + ":" + WObjectType.CFGFolder ;
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wGetOrgListForAgent","Requesting Org List sent....[" + textRequest +"]");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * 상담원 그룹에 대해서 상담사 목록을 요청한다.
	 * dbid:type:name 값을 "," 구분자로 이어서 온다. 즉  즉 "상담사그룹이름:dbid:5~dbid:type:FirstName^LastName^EmpID^UserNamme,238:3:90278^김민경M_Test_1^KG5061^KG5061" 와 같이 나중에 event로 온다.
	 *    
	 * @param agentGroupDBID	{required} 상담원 목록을 구하고자 하는 AgentGroup Object의 DBID
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패. 이 값을 저장해 놓고 나중에 EventAgentOrgInfo가 올 때 비교해서 구분해야 한다.
	 */
	this.wGetOrgAgentList = function(agentGroupDBID)
	{
		this.wLog("wGetOrgAgentList","Requesting Org Agent List ....[" + agentGroupDBID + "]");
	
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestAgentOrgInfo + MSG_DIM + refid + MSG_DIM + ":" + agentGroupDBID + ":" + WObjectType.CFGAgentGroup ;
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wGetOrgAgentList","Requesting Org List sent....[" + textRequest +"]");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * Skill업무 목록을 조회하기 위해 Level1 조직 정보를 요청한다. 최종 Skill 업무 그룹 목록을 받기 위해서는 Center -> Level1 -> Level2 -> AgentGroup 순서로 조회한다.
	 * 이 조직 구조는 고객사의 요청에 따른 업무 형태에 따라서 Level2가 제외되거나 Level3가 추가될 수도 있다.
	 * dbid:type:name 값을 "," 구분자로 이어서 온다. 즉  즉 "부모조직이름:dbid:type~조직1:200:22,조직2:684:22" 와 같이 나중에 event로 온다.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패. 이 값을 저장해 놓고 나중에 EventSkillOrgInfo가 올 때 비교해서 구분해야 한다.
	 */
	this.wGetOrgListForSkill = function(parentDBID)
	{
		this.wLog("wGetOrgListForSkill","Requesting Org List for Skill....[" + parentDBID + "]");
	
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestSkillOrgInfo + MSG_DIM + refid + MSG_DIM + ":" + parentDBID + ":" + WObjectType.CFGFolder ;
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wGetOrgListForSkill","Requesting Org List sent....[" + textRequest +"]");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * VDN/Queue 목록을 요청하기 위한 Switch 목록을 요청한다. 결과는 "dbid:CTISwitch명:표시명" 에 대해 "," 구분자로 목록이 온다. ex) 133:tst_tsapi_gr:TSAPI,101:tst_switch_gr:구로,105:tst_switch_ja:장안
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패. 이 값을 저장해 놓고 나중에 EventSwitchInfo가 올 때 비교해서 구분해야 한다.
	 */
	this.wGetSwitchList = function()
	{
		wLog("wGetSwitchList","Requesting Switch List....");
	
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestSwitchInfo + MSG_DIM + refid + MSG_DIM + ":0:";
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wGetSwitchList","Requesting Switch List sent....[" + textRequest +"]");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * VDN 목록을 조회 요청한다. switch 정보를 지정하면 해당 switch에 속한 vdn만 조회되나 지정하지 않으면 모든 switch의 목록이 온다.
	 * 결과는 "Switch표시명^dbid1:number1:alias1↑dbid2:number2:alias2" 와 같이 온다. ex) TSAPI^10807↑15556↑15556_AutorouteTest2↓10806↑15555↑15555_AutorouteTest1
	 *
	 * @param switchDBID	{optional} VDN 목록을 구하고자 하는 Switch Object의 DBID. 이름보다 DBID가 우선한다.
	 * @param switchName	{optional} VDN 목록을 구하고자 하는 Switch Object의 이름. DBID가 없으면 이름으로 조회한다.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패. 이 값을 저장해 놓고 나중에 EventVDNList 올 때 비교해서 구분해야 한다.
	 */
	this.wGetVDNList = function(switchDBID, switchName)
	{
		this.wLog("wGetVDNList","Requesting VDN List....[" + switchDBID + "," + switchName + "]");
		
		var dbid = "" ;
		var name = "" ;
		if ( this.isValidInt(switchDBID) == true ) dbid = switchDBID ;
		if ( this.isValidStr(switchName) == true ) name = switchName ;
		
		var refid = this.wGetRefID() ;
		
		var textRequest = WMessageType.RequestVDNList + MSG_DIM + refid + MSG_DIM + dbid + ":" + name + ":" ;
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wGetVDNList","Requesting VDN List sent....[" + textRequest +"]");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * ACDQ 목록을 조회 요청한다. switch 정보를 지정하면 해당 switch에 속한 vdn만 조회되나 지정하지 않으면 모든 switch의 목록이 온다.
	 * 결과는 "Switch표시명^dbid1:number1:alias1↑dbid2:number2:alias2" 와 같이 온다. ex) TSAPI^10807↑15556↑15556_AutorouteTest2↓10806↑15555↑15555_AutorouteTest1
	 *
	 * @param switchDBID	{optional} VDN 목록을 구하고자 하는 Switch Object의 DBID. 이름보다 DBID가 우선한다.
	 * @param switchName	{optional} VDN 목록을 구하고자 하는 Switch Object의 이름. DBID가 없으면 이름으로 조회한다.
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패. 이 값을 저장해 놓고 나중에 EventVDNList 올 때 비교해서 구분해야 한다.
	 */
	this.wGetACDQList = function(switchDBID, switchName)
	{
		this.wLog("wGetACDQList","Requesting ACDQ List....[" + switchDBID + "," + switchName + "]");
	
		var dbid = "" ;
		var name = "" ;
		if ( this.isValidInt(switchDBID) == true ) dbid = switchDBID ;
		if ( this.isValidStr(switchName) == true ) name = switchName ;
		
		var refid = this.wGetRefID() ;
		var textRequest = WMessageType.RequestQueueList + MSG_DIM + refid + MSG_DIM + dbid + ":" + name + ":" ;
		
		if ( ! this.wSendExt(textRequest) ) return -1 ;
	
		this.wLog("wGetACDQList","Requesting ACDQ List sent....[" + textRequest +"]");
		
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
	this.wLogoutDN = function(strRequestDN, strLogoutDN)
	{
		this.wLog("wLogoutDN","LogoutRequest....[" + strRequestDN + "," + strLogoutDN + "]");
		
		if ( this.isValidStr(strRequestDN) == false ) return -1 ;
		if ( this.isValidStr(strLogoutDN) == false ) return -1 ;
	
		var refid = this.wGetRefID() ;
		
		var textRequest = WMessageType.RequestAgentLogout + MSG_DIM + refid + MSG_DIM + strRequestDN + ":" + strLogoutDN ;
	
		if ( ! this.wSendExt(textRequest) ) return -1 ;
		
		this.wLog("wLogoutDN","LogoutRequest sent....");
		
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
	this.wListenDN = function(strRequestDN, strListenDN)
	{
		this.wLog("wListenDN","ListenRequest....[" + strRequestDN + "," + strListenDN + "]");
		
		if ( this.isValidStr(strRequestDN) == false ) return -1 ;
		if ( this.isValidStr(strListenDN) == false ) return -1 ;
	
		var refid = this.wGetRefID() ;
		
		var textRequest = WMessageType.RequestListenDN + MSG_DIM + refid + MSG_DIM + strRequestDN + ":" + strListenDN ;
	
		if ( ! this.wSendExt(textRequest) ) return -1 ;
		
		this.wLog("wListenDN","ListenRequest sent....");
		
		textRequest = null ;
	
		return refid ;
	};
	
	/**
	 * 웹소캣 readystate체크
	 *
	 * @param strRequestDN	{required} Listen을 요청하는 사람 dn
	 * @param strListenDN	{required} Listen을 할 대상 dn
	 *
	 * @return		요청 접수 ReferenceID. -1 이면 요청 실패.
	 */
	this.wReadyState = function()
	{
		this.wLog("wReadyState","wReadyState....");
		
		//if ( isValidStr(strRequestDN) == false ) return -1 ;
		//if ( isValidStr(strListenDN) == false ) return -1 ;
		if(typeof this.wWebSocket === "undefined")	return -1;
		
		var readystate = 0;
		// 연결이 되어 있는 경우에만 전송
		if ( this.wWebSocket != null ) {
			readystate = this.wWebSocket.readyState;
		} else {
			//wLog("wSend","connection is not opened  [" + strRequest + "]");
			
			return -1;;
		}
		 
	
		return readystate ;
	};
	
	/**
	 * Key,Value String에서 원하는 Key와 매핑되는 value를 꺼낸다. Key,Value의 구조는 다음과 같다.
	 * Event=<EventOffHook/>;ThisDN=<19322/>;Time=<1343633748/>
	 *
	 * @param key    	 {required} Value를 구하고자 하는 Key값.
	 * @param keyValList {required} Value를 구하고자 하는 Key/Value String
	 *
	 * @return String
	 */
	wGetEventAttrValue = function(key, keyValList)
	{
		var index1 = -1 ;
		var index2 = -1 ;
		var retstr = null ;
	
		if(key == null) key = "";
		if(keyValList == null) keyValList = "";
	
		if (  key.length == 0 ||  keyValList.length == 0 )
		{
			return null ;
		} else {
	
			if ( keyValList.charAt(0) != ";" ) 					   keyValList = ";" + keyValList ;
			if ( keyValList.charAt(keyValList.length - 1) != ";" ) keyValList = keyValList + ";" ;
	
			index1 = keyValList.indexOf(";" + key + "=<")  ;
	
			if( index1 >= 0 ) {
				index1 = index1 + key.length + 3 ;
	
				index2 = keyValList.indexOf("/>;", index1) ;
	
				if ( index2 > 0 )
				{
					retstr = keyValList.substr(index1, index2-index1) ;
					return retstr;
				} else
				{
					return null ;
				}
			} else {
				return null ;
			}
		}
	};
	
	/**
	 * Key,Value String에서 원하는 Reasons, UserData, Extensions를 찾아서 해당 key/value를 지운다.
	 * Event=<EventOffHook/>;ThisDN=<19322/>;Reasons=<ReasonCode=<1/>,/>;Time=<1343633748/>
	 * 위 String에 대해서 호출하면 Event=<EventOffHook/>;Time=<1343633748/> 가 반환된다.
	 *
	 * @param keyValList {required} 삭제하고자 하는 Key/Value String
	 *
	 * @return String 해당 key가 삭제된 Key/Value String
	 */
	this.wRemoveEventAttrValue = function(keyValList)
	{
		if( keyValList == null ) return keyValList;
	
		if ( keyValList.length == 0 )
		{
			return keyValList ;
		} else {
			keyValList = keyValList.replace(tPatReasons, "") ;
			keyValList = keyValList.replace(tPatUserData, "") ;
			keyValList = keyValList.replace(tPatExtensions, "") ;
	
			return keyValList ;
		}
	};
	
	/**
	 * Key,Value String에서 원하는 Key와 매핑되는 value를 꺼낸다. Key,Value의 구조는 다음과 같다.
	 * Event=<EventOffHook/>;ThisDN=<19322/>;Time=<1343633748/>. 값이 없는 경우에는 -1을 return한다.
	 *
	 * @param key    	 {required} Value를 구하고자 하는 Key값.
	 * @param keyValList {required} Value를 구하고자 하는 Key/Value String
	 *
	 * @return Integer
	 */
	this.wGetEventAttrValueInt = function(key, keyValList)
	{
		var retstr = this.wGetEventAttrValue(key, keyValList) ;
	
		if( this.isValidInt(retstr) )
		{
			return parseInt(retstr) ;
		} else
		{
			return -1 ;	
		}
	};
	
	/**
	 * Key,Value String에서 원하는 Key와 매핑되는 value를 꺼낸다. Key,Value의 구조는 다음과 같다.
	 * UserData=<key1=<val1/>,key2=<val2/>>
	 *
	 * @param key    	 {required} Value를 구하고자 하는 Key값. ex) key1
	 * @param keyValList {required} Value를 구하고자 하는 Key/Value String. ex) key1=<val1/>,key2=<val2/>
	 *
	 * @return String
	 */
	this.wGetEventKeyValue = function(key, keyValList)
	{
		var index1 = -1 ;
		var index2 = -1 ;
		var retstr = null ;
	
		if(key == null) return null ;
		if(keyValList == null) return null ;
	
		if (  key.length == 0 ||  keyValList.length == 0 )
		{
			return null ;
		} else {
			if ( keyValList.charAt(0) != "," ) keyValList = "," + keyValList ;
			if ( keyValList.charAt(keyValList.length - 1) != "," ) keyValList = keyValList + "," ;
	
			index1 = keyValList.indexOf("," + key + "=<")  ;
	
			if( index1 >= 0 ) {
				index1 = index1 + key.length + 3 ;
	
				index2 = keyValList.indexOf("/>,", index1) ;
	
				if ( index2 > 0 )
				{
					retstr = keyValList.substr(index1, index2-index1) ;
					return retstr;
				} else {
					return null ;
				}
			} else {
				return null ;
			}
		}
	};
	
	/**
	 * Key,Value String에서 원하는 Key와 매핑되는 value를 꺼낸다. Key,Value의 구조는 다음과 같다.
	 * UserData=<key1=<val1/>,key2=<val2/>>. 값이 없는 경우에는 -1을 return한다.
	 *
	 * @param key    	 {required} Value를 구하고자 하는 Key값. ex) key1
	 * @param keyValList {required} Value를 구하고자 하는 Key/Value String. ex) key1=<val1/>,key2=<val2/>
	 *
	 * @return Integer
	 */
	this.wGetEventKeyValueInt = function(key, keyValList)
	{
		var retstr = this.wGetEventKeyValue(key, keyValList) ;
	
		if( this.isValidInt(retstr) )
		{
			return parseInt(retstr) ;
		} else
		{
			return -1 ;	
		}
	};
	
	
	/**
	 * 문자열이고 길이가 1이상인지 확인한다. undefined 일 경우는 false이다.
	 *
	 * @param strData		{required} 문자열
	 *
	 * @return		문자열일 경우 true. 아니면 false이다.
	 */
	this.isValidStr = function(strData)
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
	this.isValidInt = function(intData)
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
	this.getBoolean = function(boolInput)
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
	this.getBytes = function(strData)
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
	 this.arr2Str = function(arrByteBuffer) {
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
};
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

