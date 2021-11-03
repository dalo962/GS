

DATA_STX = "" ;
DATA_ETX = "" ;
MSG_DIM = "~" ;		// send : stx type~refid~requestdetail etx
VAL_DIM = "~" ;		// receive : object:statid~val;
OBJ_DIM = ":" ;		// receive : object:statid~val;
LST_DIM = ";" ;		// receive : object:statid~val;
STA_DIM = "↑" ;		// send : object↑statid1↑statid2↑statid3;
TYP_DIM = "^" ;		// send/receive : objectdbid^type

WMessageType = {
	RequestEventLogin		:0,		// Request이기도 하고 Event이기도 하다.
	RequestOrgInfo			:1,
	EventOrgInfo			:2,
	RequestTeamInfo			:3,
	EventTeamInfo			:4,
	RequestVDNList			:5,
	EventVDNList			:6,
	RequestQueueList		:7,
	EventQueueList			:8,
	RequestSwitchInfo		:9,
	EventSwitchInfo			:10,	
	RequestOpenStat			:11,
	RequestCloseStat		:12,
	EventStatInfo			:13,
	RequestAgentOrgInfo		:14,
	RequestSkillOrgInfo		:15,
	EventAgentOrgInfo		:16,
	EventSkillOrgInfo		:17,
	RequestAddSkill			:18,
	RequestUpdateSkill		:19,
	RequestDeleteSkill		:20,
	EventSkillAdded			:21,
	EventSkillUpdated		:22,
	EventSkillDeleted		:23,
	RequestAgentLogout		:24,
	EventAgentLogout		:25,
	RequestListenDN			:26,
	EventListenDN			:27,
	RequestUpdateAnnex		:28,
	EventAnnexUpdated		:29,
	EventLoginInvalid		:98,
	EventError				:99,
	EventServerConnected	:100,
	EventServerDisconnected	:101,
}; 

WMessage = [
	"RequestEventLogin",		// 0	Request이기도 하고 Event이기도 하다.
	"RequestOrgInfo",			// 1
	"EventOrgInfo",				// 2
	"RequestTeamInfo",			// 3
	"EventTeamInfo",			// 4
	"RequestVDNList",			// 5
	"EventVDNList",				// 6
	"RequestQueueList",			// 7
	"EventQueueList",			// 8
	"RequestSwitchInfo",		// 9
	"EventSwitchInfo",			// 10
	"RequestOpenStat",			// 11
	"RequestCloseStat",			// 12
	"EventStatInfo",			// 13
	"RequestAgentOrgInfo",		// 14
	"RequestSkillOrgInfo",		// 15
	"EventAgentOrgInfo",		// 16
	"EventSkillOrgInfo",		// 17
	"RequestAddSkill",			// 18
	"RequestUpdateSkill",		// 19
	"RequestDeleteSkill",		// 20
	"EventSkillAdded",			// 21
	"EventSkillUpdated",		// 22
	"EventSkillDeleted",		// 23
	"RequestAgentLogout",		// 24
	"EventAgentLogout",			// 25
	"RequestListenDN",			// 26
	"EventListenDN",			// 27
	"RequestUpdateAnnex",
	"EventAnnexUpdated",
	"", "",	"",	"",	"",	"",																			// 28~35
	"",	"",	"",	"", "",	"",	"",	"",	"",	"",	"",	"",	"",	"",	"", "",	"",	"",	"",	"",							// 36~55
	"",	"",	"",	"", "",	"",	"",	"",	"",	"",	"",	"",	"",	"",	"", "",	"",	"",	"",	"",							// 56~75
	"",	"",	"",	"", "",	"",	"",	"",	"",	"",	"",	"",	"",	"",	"", "",	"",	"",	"",	"",							// 76~95
	"",							// 96
	"",							// 97
	"",							// 98
	"EventError",				// 99
	"EventServerConnected",		// 100
	"EventServerDisconnected",	// 101
	] ;

WLoginModeType = {
	LoginModeUnknown  		:0,
	LoginModeWink     		:1,
	LoginModeWinkAdmin		:2,
	LoginModeWinkAdminPlus	:3,
	};

WLoginMode = [
	"LoginModeUnknown",
	"LoginModeWink",
	"LoginModeWinkAdmin",
	"LoginModeWinkAdminPlus",
	] ;

WAgentStatusType = {
	StatusUnknown0	  		:0,
	StatusUnknown1			:1,
	StatusUnknown2			:2,
	StatusUnknown3			:3,
	StatusReady	     		:4,
	StatusOffHook			:5,
	StatusDialing			:6,
	StatusRinging			:7,
	StatusAuxWork			:8,
	StatusAfterCallWork		:9,
	StatusUnknown10			:10,
	StatusUnknown11			:11,
	StatusUnknown12			:12,
	StatusOnHold			:13,
	StatusUnknown14			:14,
	StatusUnknown15			:15,
	StatusUnknown16			:16,
	StatusUnknown17			:17,
	StatusUnknown18			:18,	  
	StatusOnConsult			:19,
	StatusOnInternal		:20,
	StatusOnOutbound		:21,
	StatusOnInbound			:22,
	StatusLoggedOut			:23
	};

WAgentStatus = [
	"StatusUnknown0",			// 0
	"StatusUnknown1",
	"StatusUnknown2",
	"StatusUnknown3",
	"StatusReady",
	"StatusOffHook",			// 5
	"StatusDialing",
	"StatusRinging",
	"StatusAuxWork",
	"StatusAfterCallWork",
	"StatusUnknown10",			// 10
	"StatusUnknown11",
	"StatusUnknown12",
	"StatusOnHold",
	"StatusUnknown14",
	"StatusUnknown15",			// 15
	"StatusUnknown16",
	"StatusUnknown17",
	"StatusUnknown18",
	"StatusOnConsult",
	"StatusOnInternal",			// 20
	"StatusOnOutbound",
	"StatusOnInbound",
	"StatusLoggedOut",
	] ;
		
WObjectType = {
	CFGNoObject	:0,
	CFGSwitch	:1,
	CFGDN	:2,
	CFGPerson	:3,
	CFGPlace	:4,
	CFGAgentGroup	:5,
	CFGPlaceGroup	:6,
	CFGTenant	:7,
	CFGService	:8,
	CFGApplication	:9,
	CFGHost	:10,
	CFGPhysicalSwitch	:11,
	CFGScript	:12,
	CFGSkill	:13,
	CFGActionCode	:14,
	CFGAgentLogin	:15,
	CFGTransaction	:16,
	CFGDNGroup	:17,
	CFGStatDay	:18,
	CFGStatTable	:19,
	CFGAppPrototype	:20,
	CFGAccessGroup	:21,
	CFGFolder	:22,
	CFGField	:23,
	CFGFormat	:24,
	CFGTableAccess	:25,
	CFGCallingList	:26,
	CFGCampaign	:27,
	CFGTreatment	:28,
	CFGFilter	:29,
	CFGTimeZone	:30,
	CFGVoicePrompt	:31,
	CFGIVRPort	:32,
	CFGIVR	:33,
	CFGAlarmCondition	:34,
	CFGEnumerator	:35,
	CFGEnumeratorValue	:36,
	CFGObjectiveTable	:37,
	CFGCampaignGroup	:38,
	CFGGVPReseller	:39,
	CFGGVPCustomer	:40,
	CFGGVPIVRProfile	:41,
	CFGScheduledTask	:42,
	CFGRole	:43,
	CFGPersonLastLogin	:44,
	CFGMaxObjectType	:45,
	} ;
	
WObject = [
	"CFGNoObject",
	"CFGSwitch",
	"CFGDN",
	"CFGPerson",
	"CFGPlace",
	"CFGAgentGroup",
	"CFGPlaceGroup",
	"CFGTenant",
	"CFGService",
	"CFGApplication",
	"CFGHost",
	"CFGPhysicalSwitch",
	"CFGScript",
	"CFGSkill",
	"CFGActionCode",
	"CFGAgentLogin",
	"CFGTransaction",
	"CFGDNGroup",
	"CFGStatDay",
	"CFGStatTable",
	"CFGAppPrototype",
	"CFGAccessGroup",
	"CFGFolder",
	"CFGField",
	"CFGFormat",
	"CFGTableAccess",
	"CFGCallingList",
	"CFGCampaign",
	"CFGTreatment",
	"CFGFilter",
	"CFGTimeZone",
	"CFGVoicePrompt",
	"CFGIVRPort",
	"CFGIVR",
	"CFGAlarmCondition",
	"CFGEnumerator",
	"CFGEnumeratorValue",
	"CFGObjectiveTable",
	"CFGCampaignGroup",
	"CFGGVPReseller",
	"CFGGVPCustomer",
	"CFGGVPIVRProfile",
	"CFGScheduledTask",
	"CFGRole",
	"CFGPersonLastLogin",
	"CFGMaxObjectType",
	] ;