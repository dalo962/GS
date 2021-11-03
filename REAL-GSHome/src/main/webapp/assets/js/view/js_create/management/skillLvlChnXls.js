var fnObj = {};
var refid = '';
var regGb = '';

var skmenu = 3;

var aglist = [];

var reqMsg = "";

fnObj.state = [{color:"grid-cell-pink"}];
fnObj.good = [{color:"grid-cell-green"}];

var personTarget = document.getElementById("jresult");

var bcheck = false;
var ACTIONS = axboot.actionExtend(fnObj, {
	PAGE_CHK: function (caller, act, data) {
		aglist = [].concat(caller.gridView01.getData());
		
		if(aglist.length == 0)
		{
			alert("등록된 목록이 없습니다.");
			return;
		}
		
		var logid = 0;		
		var agname = 0;
		//var partnm = 0;
		var skgrp = 0;
		
		aglist.forEach(function (n){
    		// 시스템사번
    		if(n.logid == null || n.logid == "" || n.logid == undefined)
    		{
    			logid = logid + 1;
    		}    	
    		// 상담사명
    		if(n.first_name == null || n.first_name == "" || n.first_name == undefined)
    		{
    			agname = agname + 1;
    		}
    		// 소속
    		//if(n.partName == null || n.partName == "" || n.partName == undefined)
    		//{
    		//	partnm = partnm + 1;
    		//}
    		// 대표스킬그룹
    		if(n.skgroup == null || n.skgroup == "" || n.skgroup == undefined)
    		{
    			skgrp = skgrp + 1;
    		}
    	});
		
		if(logid > 0)
    	{
    		alert("시스템사번을 입력해 주시기 바랍니다.");
    		return;
    	}
    	
    	if(agname > 0)
    	{
    		alert("상담사명을 입력해 주시기 바랍니다.");
    		return;
    	}
    	
    	//if(partnm > 0)
    	//{
    	//	alert("상담사센터를 입력해 주시기 바랍니다");
    	//	return;
    	//}
    	
    	if(skgrp > 0)
    	{
    		alert("대표스킬그룹을 입력해 주시기 바랍니다");
    		return;
    	}
        	
    	axboot.ajax({
			type: "POST",
	        url: "/api/mng/skillLvlChnXls/agentCheck",
	        cache : false,
	        data: JSON.stringify(aglist),
	        callback: function (res) {
	        	//console.log(res);	            	
	            caller.gridView01.setData(res);
	            bcheck = true;	            
	            
	            var ss = 0
	            var ff = 0;
	            res.forEach(function (n){
	            	if(n.checkyn == "적합")
	            	{
	            		ss = ss + 1;
	            	}
	            	else
	            	{
	            		ff = ff + 1;
	            	}
	            });
	            
	            personTarget.innerHTML = "<b>" + "*정합성 검사 결과: " + ss + "명 적합, " + ff + "명 부적합" + "</b>";
	            
	        },
	        options: {
	        	onError: function (err) {
	        		alert("정합성검사 중 문제가 발생하였습니다.\n관리자에게 문의하세요.");
	        		return;
	        	}
	        }
		});
    },
    PAGE_SAVE: function (caller, act, data) {
    	if (ws.wWebSocket != null && ws.wWebSocket.readyState == WebSocket.OPEN) 
		{
	    	aglist = [].concat(caller.gridView01.getData());
	    	var data = [];
	    	
	    	if(aglist.length == 0)
			{
				alert("등록된 목록이 없습니다.");
				return;
			}
	    	
	    	if(!bcheck)
	    	{
	    		alert("정합성 검사 후 저장이 가능합니다.")
	    		return;
	    	}
	    	
	    	var j = 0;
	    	var k = 0;
	    	aglist.forEach(function (n){	
	    		if(n.checkyn != undefined)
	    		{
	    			if(n.checkyn.indexOf("부적합") != -1)
	    			{
	    				j += 1;
	    			}
	    		}
	    		else
	    		{
	    			k += 1;
	    		}
	    	});
	    	
	    	if(j > 0)
	    	{
	    		alert("부적합한 항목이 있습니다.\n항목을 확인하시기 바랍니다.")
	    		return;
	    	}
	    	
	    	if(k > 0)
	    	{
	    		alert("정합성 검사 후 재시도하시기 바랍니다.")
	    		return;
	    	}
	    	
	    	axDialog.confirm({
	    		title:"확인",
	            msg: "적용 하시겠습니까?" // 여기까지 추가한 소스
	        }, function () {
	            if (this.key == "ok") {
	            	axMask.open();
            		revCnt = aglist.length;
            		resCnt = 0;
            		refCnt = 0;
		            reqData = [];
		            revData = [];
		            hisUrl = "/api/mng/skillLvlChnXls/saveAgtSkill";
		            regGb = '일괄등록';
		            
		            aglist.forEach(function(n, index){
		            	data.grpid = n.id
			    		data.agtDbid = n.agtDbid;
		            
		            	axboot.ajax({
				            type: "POST",
				            cache: false,
				            url: "/api/mng/skillLvlChnXls/skillGrpAddCheck",
				            data: JSON.stringify($.extend({}, data)),
				            callback: function (res) {
				            	if(res.list.length > 0)
				            	{
				            		data = res.list;
				            		
				            		if(n.agtDbid != undefined)
				            		{
				            			var sklist = n.skillList.split(";")
				            			
				            			if(sklist.length != 0)
				            			{
							            	var del_dbid = "";
							            	
				            				for(var i=0; i < sklist.length; i++)
				        					{
				            					if(sklist[i] != "undefined")
				            					{
				            						del_dbid += sklist[i] + ",";							            			
				            					}
				        					}
				            				
				            				del_dbid = del_dbid.substring(0,del_dbid.length-1);
	            							
		            						//refid = ws.wDeleteSkill(n.agtDbid, sklist[i]);
		            						refid = ws.wDeleteSkillMulti(n.agtDbid, del_dbid);
		            						
										    if(refid == -1 && refid == "undefined")
								            {
								            	alert("스킬 삭제 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
								            	return;
								            }
				            			}
				            		}
				            		else
				            		{
				            			alert("상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
				            			return;					            			
				            		}
				            					
				            		var aglastindex = data.length - 1;
				            		var add_dbid = "";
					            	var add_level = "";
					            	
				            		// 2.해당스킬그룹의 스킬로 다 넣음
					            	data.forEach(function(d, index)
					            	{
					            		if(n.agtDbid != undefined && d.skillDbid != undefined && d.skillLevel != undefined)
					            		{	
					            			add_dbid += d.skillDbid + ",";
					            			add_level += d.skillLevel + ",";
					            			
					            			if(aglastindex == index)
					            			{
					            				add_dbid = add_dbid.substring(0,add_dbid.length-1);
						            			add_level = add_level.substring(0,add_level.length-1);
						            			
						            			//refid = ws.wAddSkill(n.agtDbid, d.skillDbid, d.skillLevel);	
						            			refid = ws.wAddSkillMulti(n.agtDbid, add_dbid, add_level);
						            			
						            			if(refid != -1 && refid != "undefined")
							            		{
							            			reqData[refid] = 
									               	{
									            		compId : n.compId,
							        					partName : n.partName,
				        	        					teamName : n.teamName,
				        	        					agtLogId : n.logid,
				        	        					employeeid : n.employee_id,
								        				agtDbid : n.agtDbid,
								        				agtName : n.first_name,
								        				defaultGrp : n.defaultGrp_nm,
								        				applyGrp : n.applyGrp_nm,
								        				skillId : d.id,
								        				skillDbid : d.skillDbid,  
								        				skillLevel : d.skillLevel, 
								        				grpname : d.name,
								        				grpid : d.id,
								        				regGb : regGb,
							        					suss : "작업중"
									               	};
							    	            }
							            		else
							            		{
							            			alert("스킬 추가 중 CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
							            			return;
							            		}
					            			}
					            		}
					            		else
					            		{
					            			if(n.agtDbid == undefined)
						            		{
					            				alert("상담사 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
						            		}
					            			else if(d.skillDbid == undefined)
					            			{
					            				alert("스킬 정보가 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}			
					            			else if(d.skillLevel == undefined)
					            			{
					            				alert("스킬 레벨이 존재하지 않습니다.\n관리자에게 문의하세요.");
					            				return;
					            			}
					            		}
					            	});
					            	
					            	if(refid != -1 && refid != "undefined")
				            		{					            		
					            		//resCnt++;	
					            		//aglist[index].exec = "성공";
				    	            	//revData.push(reqData[refid]);
				            		}
					            	else
					            	{
					            		//refCnt++;
					            		//aglist[index].exec = "실패";
					            	}
				            	}
				            	else
				            	{
				            		alert("해당 스킬그룹에 스킬이 없습니다.\n스킬을 등록해 주시기 바랍니다.");
				                    return;
				            	}
				            }
		            	});
		            });
	            }
	        });	    	
		}
    	else
    	{
			alert("CTI서버와 연결이 끊어졌습니다.\n화면을 새로고침 하세요.");
		}
    },
    EXCEL_EXPORT: function (caller, act, data) {
    	window.open('/assets/js/common/template.xlsx');
    },
    PAGE_RESULT: function (caller, act, data) {
    	caller.gridView01.setData(aglist);
    	//personTarget.innerHTML = "<b>" + "*정합성 검사 결과:" + "</b>";
		bcheck = false;
    },
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridView01.exportExcel();
    },
});

var CODE = {};
var defaultDisp = [];

var ws = new winkWebSocket();

var webSocketTimer = null;
// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
   	
    _this.searchView.initView();
    _this.gridView01.initView();   
    _this.searchView.dispSklSearch();
    _this.pageButtonView.initView();
    
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


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
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
        return {
        	
        }
    },
    dispSklSearch: function(){
        var data = {}; 
        data.compId = "";
        
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


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
        	showRowSelector: false,
            frozenColumnIndex: 0,
            multipleSelect: false,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
            	//{key: "partName", label: "센터", width: 150, align: "center"},
            	{key: "logid", label: "시스템사번", width: 120, align: "center", sortable:true},
            	{key: "first_name", label: "상담사명", width: 120, align: "center", sortable:true},            	
            	{key: "skgroup", label: "대표스킬그룹", width: 150, align: "center", sortable:true},
            	{key: "checkyn", label: "정합성여부", width: 400, align: "center", sortable:true,
                	styleClass: function(){             		
                		var color = "";
                		var result = this.item["checkyn"];
                		
                		if(result != undefined)
                		{
	                		if(result.indexOf("부적합") != -1)
	                		{
	                			fnObj.state.forEach(function (n)
	                			{
	                				color = n.color;
	                			});
	                		}
	                		else if(result == "적합")
	                		{
	                			fnObj.good.forEach(function (n)
	                        	{
	                        		color = n.color;
	                        	});
	                		}
	                			
	                	}
                		return color;
                	}
                },
                {key: "exec", label: "결과", width: 120, align: "center", sortable:true}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                }
            }
        });
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"sample": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
        	"check": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CHK);
            },
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.ani;
            });
        } else {
            list = _list;
        }
        return list;
    },
    exportExcel: function () {
    	this.target.exportExcel("상담사_스킬_일괄등록.xls");
    }
});


//엑셀 업로드
var rABS = true; 

function fixdata(data) {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
}

function getConvertDataToBin($data){
    var arraybuffer = $data;
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
 
    return bstr;
}

function getCsvToJson($csv){
 
    var startRow = 2;
    var csvSP = $csv.split( "|" );
    var csvRow = [], csvCell = [];
    var cellName = ["logid", "first_name", "skgroup"];
    csvSP.forEach(function(item, index, array){
 
        var patt = new RegExp(":"); 
        var isExistTocken = patt.test( item );
 
        if( isExistTocken && ( startRow - 1 ) <= index ){
            csvRow.push( item );
        }
    });
 
    csvRow.forEach(function(item, index, array){
        var row = item.split(":");
        var obj = {};
        row.forEach(function(item, index, array){
            obj[ cellName[index] ] = item;
        });
 
        csvCell[index] = obj;
    });
    return csvCell;
}

function handleFile(e) {
    var files = e.target.files;
    var i,f;
    for (i = 0; i != files.length; ++i) {
        f = files[i];
        var reader = new FileReader();
        var name = f.name;
 
        reader.onload = function(e) {
            var data = e.target.result;

            var workbook;
 
            if(rABS) {
                /* if binary string, read with type 'binary' */
                //workbook = XLSX.read(data, {type: 'binary'});
            	var binary = "";
            	var bytes = new Uint8Array(data);
            	var length = bytes.byteLength;
            	for (var i=0; i < length; i++){
            		binary += String.fromCharCode(bytes[i])
            	}
            	workbook = XLSX.read(binary, {type:'binary'});          	
            	
            } else {
                /* if array buffer, convert to base64 */
                //var arr = fixdata(data);
                //workbook = XLSX.read(btoa(arr), {type: 'base64'});
            	workbook = XLSX.read(data, {type:'binary'}); 
            }//end. if
 			console.log(workbook);
            
 			workbook.SheetNames.forEach(function(item, index, array) 
 			{
 				if(item == 'Sheet1')
 				{
 					var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[item],{FS:":",RS:"|"} );
	                
 					console.log(getCsvToJson(csv));
 					fnObj.gridView01.setData(getCsvToJson(csv));
 				}
 			});//end. forEach 			 			
        }; //end onload
 
        if(rABS) reader.readAsArrayBuffer(f); //reader.readAsBinaryString(f);
        else reader.readAsBinaryString(f); //reader.readAsArrayBuffer(f);
 
    }//end. for
}
 
var input_dom_element;
$(function() {
    input_dom_element = document.getElementById('excel');
    if(input_dom_element.addEventListener) {
        input_dom_element.addEventListener('change', handleFile, false);
    }
});


$(window).unload(function(){
	ws.wDisconnect() ;
	setTimeout("",1000);
});