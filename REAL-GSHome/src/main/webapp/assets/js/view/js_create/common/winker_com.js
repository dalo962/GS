var wAlive = false;
var reqCnt = 0;
var revCnt = 0;
var reqData = [];
var revData = [];
var hisUrl = "";

var skmenu = ""; 
var resCnt = 0;
var refCnt = 0;

var tcnt = 0;
var index = 0;

var ws = new winkWebSocket();

function WinkSkillEvent(eventId, eventMsg, param1, param2, param3, param4) //eventId, eventMsg,ObjectId,ObjectType,statId,statValue
{
	var msgArr = eventMsg.split("~") ;
	
	ws.wLog("WinkEvent < ", WMessage[eventId] + "(" + eventId + ") " + eventMsg, false) ;
	console.log("WinkEvent < ", WMessage[eventId] + "(" + eventId + ") " + eventMsg + " / param1 : " + param1 + " / param2 : " + param2 + " / param3 : " + param3 + " / param4 : " + param4) ;
	switch(eventId)
	{
		case WMessageType.EventServerConnected :
			//document.getElementById("textConStatusP").value = "연결" ;
	        axToast.push("웹소켓에 연결되었습니다.");
	        wAlive = true;
			break ;
		case WMessageType.EventServerDisconnected :
			//document.getElementById("textConStatusP").value = "끊김" ;
	        axToast.push("웹소켓 연결이 종료되었습니다.");
			break ;
		case WMessageType.EventSkillAdded :			
		case WMessageType.EventSkillUpdated :			
		case WMessageType.EventSkillDeleted :
			var reqMsg = msgArr[0] ;			// 요청할 때 전송했던 요청 내용. PersonDBID:SkillDbid:SkillLevel
			var refID = msgArr[1] ;			// 요청할 때 return 받은 referenceID  값과 비교가능			
			
			break ;
		case WMessageType.EventAgentLogout :
			break ;
		case WMessageType.EventListenDN :
			break ;
		case WMessageType.EventAnnexUpdated :
			break ;
		case WMessageType.EventError :
	        axToast.push("웹소켓 요청 에러가 발생하였습니다.");
	        console.log("Error Exception-->>"  + eventMsg);
			break ;
		default:
			console.log("WinkEvent < ", WMessage[eventId] + "(" + eventId + ") " + eventMsg, false);
			break;
	}		
	
	// 상담사 스킬 관리 (기본)
	if(skmenu == 1)
	{
		revCnt++;
		revData.push(reqData[param1]);
		
		if(revData[0] != undefined)
		{
			if(reqMsg != 98 && reqMsg != 99 && reqMsg != undefined)
			{
				if(reqData[param1] != undefined)
				{
					resCnt++;
					reqData[param1].suss = "성공";
				}
			}
			else
			{
				if(reqData[param1] != undefined)
				{
					refCnt++;
					reqData[param1].suss = "실패";
				}
			}
		}
		
		// 건 by 건으로 처리
		//revData = [];
		//revData.push(reqData[param1]);
		
		if(reqCnt == revCnt)
		{
			//전체 적용 완료후 (마지막스킬,상담원과 현재까지 적용된 스킬,상담원 비교)																							  
			if(typeof hisUrl != "undefined" && hisUrl != "")
			{
		        axboot.ajax({
		            type: "POST",
		            url: hisUrl,
		            cache : false,
		            data: JSON.stringify(revData),
		            callback: function (res) 
		            {
		            	if(regGb == "등록" || regGb == "변경")
		            	{
		            		alert(revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n스킬 변경이 완료 되었습니다.");            		
		            	}
		            	else if(regGb == "삭제")
		            	{
		            		alert(revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n스킬 삭제가 완료 되었습니다.");
		            	}
				        axMask.close();	
				        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            }
		        });
			}	
		}
		/* 건 by 건으로 처리
		else
		{
			if(revData[0] != undefined)
			{
				if(typeof hisUrl != "undefined" && hisUrl != "")
				{
			        axboot.ajax({
			            type: "POST",
			            url: hisUrl,
			            cache : false,
			            data: JSON.stringify(revData),
			            callback: function (res) 
			            {
			            	console.log("Main DB Insert..!");
			            }
			        });
				}
			}
		}
		*/
	}
	// 상담사 스킬 관리 (그룹)
	else if(skmenu == 2)
	{	
		if(revCnt != 0)
		{
			tcnt++;
			result = tcnt / 2; 
			result = Math.round(result);
			
			$("#goingCnt").html("*총 대상 상담사 " + revCnt + "명 중 " + result + "명 스킬 그룹 변경");
			console.log(tcnt + ":" + result);	
		}
		
		if(revCnt != 0)
		{
			if(reqMsg != 98 && reqMsg != 99 && reqMsg != undefined)
			{			
				//resCnt++;
				//resCnt = tcnt / 2;			
				//resCnt = Math.round(resCnt);
				
				if(reqData[param1] != undefined)
				{
					resCnt++;
					
					reqData[param1].suss = "성공";
						
					revData.push(reqData[param1]);
				}
			}
			else
			{
				//refCnt++;
				//refCnt = tcnt / 2;
				//refCnt = Math.round(refCnt);
				
				if(reqData[param1] != undefined)
				{
					refCnt++;
					
					reqData[param1].suss = "실패";
						
					revData.push(reqData[param1]);
				}
			}
		}
		
		// 건 by 건으로 처리 
		//revData = [];
		//revData.push(reqData[param1]);
		
		if(refid == msgArr[1])
		{
			const set = Array.from(new Set(revData));
			
	    	if(typeof hisUrl != "undefined" && hisUrl != "")
			{
		        axboot.ajax({
		            type: "POST",
		            url: hisUrl,
		            cache : false,
		            data: JSON.stringify(revData),
		            callback: function (res) 
		            {
		            	if(regGb == "대표그룹등록")
		            	{
		            		alert("[대표그룹등록]\n" + revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n대표그룹등록이 완료 되었습니다.");
		            	}
		            	else if(regGb == "스킬변경")
		            	{
		            		alert("[스킬변경]\n" + revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n스킬변경이 완료 되었습니다.");
		            	}
		            	else if(regGb == "스킬원복")
		            	{
		            		alert("[스킬원복]\n" + revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n스킬원복이 완료 되었습니다.");
		            	}
		            	else if(regGb == "자율부여")
		            	{
		            		alert("[자율부여]\n" + revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n자율부여가 완료 되었습니다.");
		            	}
		            	else if(regGb == "자율원복")
		            	{
		            		alert("[자율원복]\n" + revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n자율원복이 완료 되었습니다.");
		            	}
				        axMask.close();	
				        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
				        				        
				        tcnt = 0;	
				        $("#goingCnt").html("*총 대상 상담사 " + revCnt + "명 중 " + revCnt + "명 스킬 그룹 변경");
				        revCnt = 0;
		            }
		        });
			}
		}
		/* 건 by 건으로 처리
		else
		{
			if(revData[0] != undefined)
			{
				if(typeof hisUrl != "undefined" && hisUrl != "")
				{
			        axboot.ajax({
			            type: "POST",
			            url: hisUrl,
			            cache : false,
			            data: JSON.stringify(revData),
			            callback: function (res) 
			            {
			            	console.log("Group DB Insert..!");
			            }
			        });
				}
			}
		}	
		*/	
	}
	// 상담사 스킬 관리 (엑셀)
	else if(skmenu == 3)
	{
		if(revCnt != 0)
		{
			tcnt++;
			result = tcnt / 2; 
			result = Math.round(result);
			
			$("#goingCnt").html("*총 대상 상담사 " + revCnt + "명 중 " + result + "명 스킬 그룹 변경");
			console.log(tcnt + ":" + result);	
		}
		
		if(revCnt != 0)
		{
			if(reqMsg != 98 && reqMsg != 99 && reqMsg != undefined)
			{			
				//resCnt++;
				//resCnt = tcnt / 2;			
				//resCnt = Math.round(resCnt);
				
				if(reqData[param1] != undefined)
				{
					resCnt++;
					reqData[param1].suss = "성공";
					revData.push(reqData[param1]);
					aglist[index].exec = "성공";
					index++;
				}
			}
			else
			{
				//refCnt++;
				//refCnt = tcnt / 2;
				//refCnt = Math.round(refCnt);
				
				if(reqData[param1] != undefined)
				{
					refCnt++;
					reqData[param1].suss = "실패";
					revData.push(reqData[param1]);
					aglist[index].exec = "실패";
					index++;
				}				
			}
		}
				
		// 건 by 건으로 처리
		//revData = [];
		//revData.push(reqData[param1]);
		
		if(refid == msgArr[1])
		{
			const set = Array.from(new Set(revData));
			
	    	if(typeof hisUrl != "undefined" && hisUrl != "")
			{
		        axboot.ajax({
		            type: "POST",
		            url: hisUrl,
		            cache : false,
		            data: JSON.stringify(revData),
		            callback: function (res) 
		            {
		            	alert(revCnt + "건 중 "+ resCnt +"건 성공 " + refCnt + "건 실패\n일괄등록이 완료 되었습니다.");
		            	ACTIONS.dispatch(ACTIONS.PAGE_RESULT);
		            	axMask.close();
		            			            	
		            	tcnt = 0;	
		            	$("#goingCnt").html("*총 대상 상담사 " + revCnt + "명 중 " + revCnt + "명 스킬 그룹 변경");
				        revCnt = 0;
				        index = 0;
		            }
		        });
			}
		}
		/* 건 by 건으로 처리
		else
		{
			if(revData[0] != undefined)
			{
				if(typeof hisUrl != "undefined" && hisUrl != "")
				{
			        axboot.ajax({
			            type: "POST",
			            url: hisUrl,
			            cache : false,
			            data: JSON.stringify(revData),
			            callback: function (res) 
			            {
			            	console.log("Excel DB Insert..!");
			            }
			        });
				}
			}
		}
		*/
	}
	
	tmpStr = null ;
	line = null ;
}; 


function disconnect_click(e) {  
	sDisconnect() ;
};		


function requestSkillAdd_click(e) {

	var txtPersonDBID = document.getElementById("textPersonDBIDAdd")==null?"":document.getElementById("textPersonDBIDAdd").value;
	var txtSkillDBID = document.getElementById("textSkillDBIDAdd")==null?"":document.getElementById("textSkillDBIDAdd").value;
	var txtSkillLevel = document.getElementById("textSkillLevelAdd")==null?"":document.getElementById("textSkillLevelAdd").value;
	
	var refid = sAddSkill(txtPersonDBID, txtSkillDBID, txtSkillLevel) ;
	
	document.getElementById("textRefIDAdd").value = refid ;
	
	refid = null ;
}

function requestSkillUpdate_click(e) {

	var txtPersonDBID = document.getElementById("textPersonDBIDUpdate")==null?"":document.getElementById("textPersonDBIDUpdate").value;
	var txtSkillDBID = document.getElementById("textSkillDBIDUpdate")==null?"":document.getElementById("textSkillDBIDUpdate").value;
	var txtSkillLevel = document.getElementById("textSkillLevelUpdate")==null?"":document.getElementById("textSkillLevelUpdate").value;
	
	var refid = sUpdateSkill(txtPersonDBID, txtSkillDBID, txtSkillLevel) ;
	
	document.getElementById("textRefIDUpdate").value = refid ;
	
	refid = null ;
}

function requestSkillDelete_click(e) {

	var txtPersonDBID = document.getElementById("textPersonDBIDDelete")==null?"":document.getElementById("textPersonDBIDDelete").value;
	var txtSkillDBID = document.getElementById("textSkillDBIDDelete")==null?"":document.getElementById("textSkillDBIDDelete").value;

	var refid = sDeleteSkill(txtPersonDBID, txtSkillDBID) ;
	
	document.getElementById("textRefIDDelete").value = refid ;
	
	refid = null ;
}

function requestUpdateAnnex_click(e) {

	var textAnnexDBID = document.getElementById("textAnnexDBID")==null?"":document.getElementById("textAnnexDBID").value;
	var textAnnexSection = document.getElementById("textAnnexSection")==null?"":document.getElementById("textAnnexSection").value;
	var textAnnexOption = document.getElementById("textAnnexOption")==null?"":document.getElementById("textAnnexOption").value;
	var textAnnexValue = document.getElementById("textAnnexValue")==null?"":document.getElementById("textAnnexValue").value;

	var refid = sUpdateAnnexOption(textAnnexDBID, textAnnexSection, textAnnexOption, textAnnexValue) ;
	
	document.getElementById("textRefIDAnnex").value = refid ;
	
	refid = null ;
}	

// tLog를 호출할 때 이 함수를 callback으로 넣으면 아래가 호출된다.
/*
function addLogText(strText)
{
	// Create an Option object
	var opt = document.createElement("option");
	var loglist = document.getElementById("logList");

	// Add an Option object to Drop Down/List Box
	loglist.options.add(opt, 0);
	loglist.options[0].selected = true;
	
	// Assign text and value to Option object
	opt.text = strText;
	opt.value = 1;	
	
	if ( loglist.length > 100 )
	{
		loglist.options[100] = null;
	}
	
	opt = null ;
	loglist = null ;
}
*/