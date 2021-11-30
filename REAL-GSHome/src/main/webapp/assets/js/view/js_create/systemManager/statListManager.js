var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var selSelect = $("[data-ax5select='selSelect']").ax5select("getValue")[0].value;
   
    	if(selSelect == "ALL")
    	{
    		return;
    	}
    	
    	axboot.ajax({
            type: "GET",
            url: "/api/statLstMng/statLstMngSearch",
            cache : false,
            data: {stattype:selSelect},
            callback: function (res) {
                caller.gridView01.setData(res);
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
            }
        });

        return false;
    },    
    PAGE_ADD: function (caller, act, data) {
    	var selSelect = $("[data-ax5select='selSelect']").ax5select("getValue")[0].value;
    	
    	if(selSelect == "ALL")
    	{
    		alert("검색 조건을 선택하세요.");
    		return;
    	}
    	
    	caller.gridView01.addRow();
    },   
    PAGE_SAVE: function (caller, act, data) {
    	var saveList = [].concat(caller.gridView01.getData());
    	saveList = saveList.concat(caller.gridView01.getData("deleted"));
    	var selSelect = $("[data-ax5select='selSelect']").ax5select("getValue")[0].value;
    	saveList.forEach(function (n){
    		n.stat_type = selSelect;
    		
    	});
    	
    	var r1 = 0; 
    	var r11 = 0;
    	var r2 = 0; 
    	var r3 = 0;
    	var r4 = 0;
    	var r5 = 0;
    	var r6 = 0;
    	var r7 = 0;
    	var r8 = 0;
    	var majchk = 0;
    	var reqExp = /^[0-9]*$/;
    	if(select == "STAT01" || select == "STAT02")
    	{
    		saveList.forEach(function (n){
    			if(n.seq == null || n.seq == "")
        		{
    				r1 = r1 + 1;
        		}
    			if(reqExp.test(n.seq) == false)
                {
    				r11 = r11 + 1;
                }    			
    			if(n.colname == null || n.colname == "")
        		{
    				r2 = r2 + 1;
        		}
    			if(n.hanname == null || n.hanname == "")
        		{
    				r3 = r3 + 1;
        		}
    			if(n.gubun == null || n.gubun == "" || n.gubun == "undefined")
        		{
    				r4 = r4 + 1;
        		}
    			if(n.type == null || n.type == "" || n.type == "undefined" )
        		{
    				r5 = r5 + 1;
        		}
    			if(n.stype == null || n.stype == "" || n.stype == "undefined")
        		{
    				r6 = r6 + 1;
        		}
    			if(n.gubun == "M" && (n.type != "MAJOR" || n.stype != "MAJOR"))
    			{
    				majchk = majchk + 1;
    			}
    			if(n.asname == null || n.asname == "" || n.stype == "undefined")
        		{
    				r7 = r7 + 1;
        		}
    			if(n.interval == null || n.interval == "" || n.interval == "undefined")
        		{
    				r8 = r8 + 1;
        		}
        	});
    		if(r1 > 0) 
        	{ 
        		alert("번호를 입력해 주시기 바랍니다."); 
        		return;
        	}
    		if(r11 > 0)
    		{    			
    			alert("번호는 숫자만 입력해 주시기 바랍니다."); 
        		return;                
    		}
    		if(r3 > 0) 
        	{ 
        		alert("한글항목명을 입력해 주시기 바랍니다."); 
        		return;
        	}
    		if(r7 > 0) 
        	{ 
        		alert("영문항목명을 입력해 주시기 바랍니다."); 
        		return;
        	}
    		if(r2 > 0) 
        	{ 
        		alert("속성을 입력해 주시기 바랍니다."); 
        		return;
        	}    		    		
    		if(r4 > 0) 
        	{ 
        		alert("표시타입을 선택해 주시기 바랍니다."); 
        		return;
        	}
    		if(r5 > 0) 
        	{ 
        		alert("구분을 선택해 주시기 바랍니다."); 
        		return;
        	}
    		if(r6 > 0) 
        	{ 
        		alert("조회타입을 선택해 주시기 바랍니다."); 
        		return;
        	}
    		if(majchk > 0)
    		{
    			alert("표시타입이 기본항목일때 구분과\n조회타입은 기본을 선택해 주시기 바랍니다."); 
        		return;
    		}
    		if(r8 > 0)
    		{
    			alert("표시구간을 선택해 주시기 바랍니다.");
    			return;
    		}
    	}
    	
    	if (!confirm("저장 하시겠습니까?")) return; 	
        axboot.ajax({
            type: "POST",
            url: "/api/statLstMng/statLstMngSave",
            cache : false,
            data: JSON.stringify(saveList),
            callback: function (res) {
            	if(res.message == "Fail")
            	{
            		alert("등록된 항목이 있습니다."); 
            	}
            	else
            	{
            		axToast.push("저장 되었습니다.");
            	}
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);                
            },
            options: {
                onError: function (err) {
                    alert("저장 작업에 실패하였습니다");
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                }
            }
        });
    },
    PAGE_DEL: function (caller, act, data) {
    	var selSelect = $("[data-ax5select='selSelect']").ax5select("getValue")[0].value;

    	if(selSelect == "ALL")
    	{
    		alert("검색 조건을 선택하세요.");
    		return;
    	}

    	caller.gridView01.delRow("selected");
    },
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    },
    MODAL_OPEN: function (caller, act, data) {    	
        axboot.modal.open({
            modalType: "STAT_MENU_MANAGER",
            //param: param,
            sendData: function () {
                return {
                    //"sendData": "major_factor",
                    //"inter" : inter
                };
            },
            callback: function (data) {
            	//if(data==1){
            	//	window.location.reload();
            	//}
                this.close();                
            }
        });
        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
    }
});

var CODE = {};
var TypeList = [];

var test = {};
test.menu_id = "111";
// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    axboot.promise()
    .then(function (ok, fail, data){
    	 axboot.ajax({
             type: "POST", 
             url: "/api/statLstMng/statTypeLst",           
             cache : false,
             callback: function (res) {	
            	TypeList.push({text: "선택", value: "ALL"});
                res.forEach(function (n) {
                	TypeList.push({text: n.name, value: n.type});  
                });                 
                ok();
            }
        });
    }).then(function(ok){
    	_this.pageButtonView.initView();
        _this.searchView.initView();
        _this.gridView01.initView();

        //ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
   });
};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
        });
    }
});


//== view 시작
/**
 * searchView
 */
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter"); 
        
        $("#mbtn").hide();
        $("#disp").hide();        
        $("[data-ax5select='selSelect']").ax5select({
	        theme: 'primary',
	        options: TypeList,
	        onChange: function () {
	        	select = $("[data-ax5select='selSelect']").ax5select("getValue")[0].value;
	        	if(select == "STAT01" || select == "STAT02")
	        	{
	        		fnObj.gridView01.clearView("누적통계");
	        		$("#mbtn").show();
	        		
	        		var dispList = [];
	        		dispList.push({text: "전체", value: "ALL"});
	        		if(select == "STAT01")
	        		{
	        			dispList.push({text: "스킬 통계", value: "skill"});
	        			 $("[data-ax5select='dispSelect']").ax5select({
	        			        theme: 'primary',
	        			        options: dispList,
	        		        });
	        		}
	        		else if(select == "STAT02")
	        		{
	        			dispList.push({text: "상담사 통계", value: "agent"});
	        			dispList.push({text: "상담사 생산성 통계", value: "agentProdt"});
	        			dispList.push({text: "상담사 스킬 통계", value: "agentSkill"});
	        			 $("[data-ax5select='dispSelect']").ax5select({
	        			        theme: 'primary',
	        			        options: dispList,
	        		        });
	        		}
	        	}
	        	else
	        	{
	        		fnObj.gridView01.initView();
	        		return;
	        	}
	        	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
	        }
        });
    },
    getData: function () {
        return {

        }
    }
});

/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function (data) {
        var _this = this;

        this.target = axboot.gridBuilder({
        showRowSelector: true,
        frozenColumnIndex: 0,
        multipleSelect: true,
        showLineNumber:false,
        target: $('[data-ax5grid="grid-view-01"]'),
                columns: [
                	{key: "seq", label: "번호", width: 80, align: "center", sortable: true,
                		editor:{type:"number",                	
                    		disabled: function () {
                            	var dis = "";
                            	if(this.item["stat_id"] != null)
                            	{
                            		dis = true;
                            	}
                            	else
                            	{
                            		dis = false;
                            	}
                            	return dis;
                    		}}
                    	},
                    {key: "stat_id", label: "통계구분", width: 130, align: "center"},  
                    {key: "hanname", label: "한글항목명", width: 250, align: "center", editor: "text", multiLine:true},
                    {key: "asname", label: "영문항목명", width: 250, align: "center",
                       	editor:{type:"text",                	
                       		/*disabled: function () {
                               	var dis = "";
                               	if(this.item["stat_id"] != null)
                               	{
                               		dis = true;
                               	}
                               	else
                               	{
                               		dis = false;
                               	}
                               	return dis;
                       		}*/}
                    , multiLine:true},	
                    {key: "colname", label: "속성", width: 450, align: "left",
                    	editor:{type:"text",                	
                    		/*disabled: function () {
                            	var dis = "";
                            	if(this.item["stat_id"] != null)
                            	{
                            		dis = true;
                            	}
                            	else
                            	{
                            		dis = false;
                            	}
                            	return dis;
                    		}*/}
                    , multiLine:true},
                    {key: "gubun", label: "표시타입", width: 100, align: "center", editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "M", text: "기본항목"},
                    			{value: "N", text: "건수"},
                        		{value: "T", text: "시간"},
                        		{value: "P", text: "퍼센트"},
                        		{value: "PS", text: "명"},
                        		//{value: "PSG", text: "명(%)"},
                        		{value: "TX", text: "텍스트"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.gubun) {
	                    	case "M":
	                			return "기본항목";
	                			break;                    	
	                		case "N":
	                			return "건수";
	                			break;
	                		case "T" :
	                			return "시간";
	                			break;
	                		case "P" :
	                			return "퍼센트";
	                			break;	
	                		case "PS" :
                    			return "명";
                    			break;
	                		//case "PSG" :
                    		//	return "명(%)";
                    		//	break;
	                		case "TX" :
                    			return "텍스트";
                    			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
                    {key: "type", label: "구분", width: 100, align: "center", editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "MAJOR", text: "기본"},
                        		{value: "CALL", text: "호"},
                        		{value: "STATUS", text: "상태"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.type) {
	                    	case "MAJOR":
	                			return "기본";
	                			break;                    		
	                		case "CALL":
	                			return "호";
	                			break;
	                		case "STATUS" :
	                			return "상태";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
                    {key: "stype", label: "조회타입", width: 100, align: "center", editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "MAJOR", text: "기본"},
                    			{value: "SUM", text: "합계"},
                        		{value: "ROUND", text: "평균"},
                    			{value: "MAX", text: "최대"},
                    			{value: "MIN", text: "최소"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.stype) {
                    		case "MAJOR":
                				return "기본";
                				break; 
	                    	case "SUM":
	                			return "합계";
	                			break;                    		
	                		case "ROUND":
	                			return "평균";
	                			break;
	                		case "MAX":
	                			return "최대";
	                			break;
	                		case "MIN":
	                			return "최소";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
                    {key: "interval", label: "표시단위", width: 120, align: "center", editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "0", text: "전체"},
                    			{value: "1", text: "5분"},
                    			{value: "2", text: "15분"},
                    			{value: "3", text: "1시간"},
                    			{value: "4", text: "일"},
                        		{value: "5", text: "월"},
                        		{value: "6", text: "5분,15분,1시간"},
                        		{value: "7", text: "5분,15분,1시간,일"},
                        		{value: "8", text: "일,월"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.interval) {
                    		case "0":
                				return "전체";
                				break; 
	                    	case "1":
	                			return "5분";
	                			break;                    		
	                		case "2":
	                			return "15분";
	                			break;
	                		case "3":
	                			return "1시간";
	                			break;
	                		case "4":
	                			return "일";
	                			break;
	                		case "5":
	                			return "월";
	                			break;
	                		case "6":
	                			return "5분,15분,1시간";
	                			break;
	                		case "7":
	                			return "5분,15분,1시간,일";
	                			break;
	                		case "8":
	                			return "일,월";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
                ],
                body: {
                	columnHeight:50,
                	onClick: function () {
                        this.self.select(this.dindex, {selectedClear: true});
                    }
                }
            });

        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"modal": function () {
                ACTIONS.dispatch(ACTIONS.MODAL_OPEN);
            },
        	"add": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_ADD);
            },            
        	"save": function () {
        		ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
        	},
        	"delete": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_DEL);
            }      
        });

    },
    clearView: function(data){
    	var _this = this;

    	this.target = axboot.gridBuilder({
        showRowSelector: true,
        frozenColumnIndex: 0,
        multipleSelect: true,
        showLineNumber:false,
        target: $('[data-ax5grid="grid-view-01"]'),
                columns: [
                	{key: "seq", label: "번호", width: 80, align: "center", sortable: true,
                		editor:{type:"number",                	
                    		disabled: function () {
                            	var dis = "";
                            	if(this.item["stat_id"] != null)
                            	{
                            		dis = true;
                            	}
                            	else
                            	{
                            		dis = false;
                            	}
                            	return dis;
                    		}}
                    	},
                    {key: "stat_id", label: "통계구분", width: 130, align: "center"},                                         
                    {key: "hanname", label: "한글항목명", width: 250, align: "center", editor: "text", multiLine:true},
                    {key: "asname", label: "영문항목명", width: 250, align: "center",
                       	editor:{type:"text",                	
                       		/*disabled: function () {
                               	var dis = "";
                               	if(this.item["stat_id"] != null)
                               	{
                               		dis = true;
                               	}
                               	else
                               	{
                               		dis = false;
                               	}
                               	return dis;
                       		}*/}
                    , multiLine:true},	
                    {key: "colname", label: "속성", width: 450, align: "left",
                    	editor:{type:"text",                	
                    		/*disabled: function () {
                            	var dis = "";
                            	if(this.item["stat_id"] != null)
                            	{
                            		dis = true;
                            	}
                            	else
                            	{
                            		dis = false;
                            	}
                            	return dis;
                    		}*/}
                    , multiLine:true},
                    {key: "gubun", label: "표시타입", width: 100, align: "center", editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "M", text: "기본항목"},
                        		{value: "N", text: "건수"},
                        		{value: "T", text: "시간"},
                        		{value: "P", text: "퍼센트"},
                        		{value: "PS", text: "명"},
                        		//{value: "PSG", text: "명(%)"},
                        		{value: "TX", text: "텍스트"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.gubun) {                    	
                    		case "M":
                    			return "기본항목";
                    			break;                    	
                    		case "N":
                    			return "건수";
                    			break;
                    		case "T" :
                    			return "시간";
                    			break;
                    		case "P" :
                    			return "퍼센트";
                    			break;	
                    		case "PS" :
                    			return "명";
                    			break;
                    		//case "PSG" :
                    		//	return "명(%)";
                    		//	break;
                    		case "TX" :
                    			return "텍스트";
                    			break;
                    		default :
                    			return "선택";
                    			break;
                    	}
                    }},
                    {key: "type", label: "구분", width: 100, align: "center", editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "MAJOR", text: "기본"},
                        		{value: "CALL", text: "호"},
                        		{value: "STATUS", text: "상태"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.type) {
                    		case "MAJOR":
                    			return "기본";
                    			break;                    		
                    		case "CALL":
                    			return "호";
                    			break;
                    		case "STATUS" :
                    			return "상태";
                    			break;
                    		default :
                    			return "선택";
                    			break;
                    	}
                    }},
                    {key: "stype", label: "조회타입", width: 100, align: "center", sortable:true, editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "MAJOR", text: "기본"},
                    			{value: "SUM", text: "합계"},
                        		{value: "ROUND", text: "평균"},
                        		{value: "MAX", text: "최대"},
                    			{value: "MIN", text: "최소"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.stype) {
                    		case "MAJOR":
                				return "기본";
                				break; 	
                    		case "SUM":
	                			return "합계";
	                			break;                    		
	                		case "ROUND":
	                			return "평균";
	                			break;
	                		case "MAX":
	                			return "최대";
	                			break;
	                		case "MIN":
	                			return "최소";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
                    {key: "interval", label: "표시단위", width: 120, align: "center", editor: {
                    	type: "select", config: {
                    		columnKeys: {
                    			optionValue: "value", optionText: "text"
                    		},
                    		options: [
                    			{value: "0", text: "전체"},
                    			{value: "1", text: "5분"},
                    			{value: "2", text: "15분"},
                    			{value: "3", text: "1시간"},
                    			{value: "4", text: "일"},
                        		{value: "5", text: "월"},
                        		{value: "6", text: "5분,15분,1시간"},
                        		{value: "7", text: "5분,15분,1시간,일"},
                        		{value: "8", text: "일,월"},
                        	]
                    	}
                    }, formatter: function() {
                    	switch(this.item.interval) {
                    		case "0":
                				return "전체";
                				break; 
	                    	case "1":
	                			return "5분";
	                			break;                    		
	                		case "2":
	                			return "15분";
	                			break;
	                		case "3":
	                			return "1시간";
	                			break;
	                		case "4":
	                			return "일";
	                			break;
	                		case "5":
	                			return "월";
	                			break;
	                		case "6":
	                			return "5분,15분,1시간";
	                			break;
	                		case "7":
	                			return "5분,15분,1시간,일";
	                			break;
	                		case "8":
	                			return "일,월";
	                			break;
	                		default :
	                			return "선택";
	                			break;
                    	}
                    }},
                ],
                body: {
                	columnHeight:50,
                	onClick: function () {
                        this.self.select(this.dindex, {selectedClear: true});
                    }
                }
            });
        	$("#gird").hover(
					function () {
		                  $(this).attr('title','추가시 통계구분은 입력하지 않습니다.\n\n영문항목명은 중복될 수 없으며 대문자로 입력해야합니다.\n속성은 실제 컬럼명 및 수식입니다.');
		            }, 
						
		               function () {
		                  $(this).attr('title','');
		               }
					);
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.stat_id;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true}, "last");
        this.target.focus("END");
    },
    exportExcel: function () {
    	var date = new Date();
    	var dateString = "";
    	dateString += date.getFullYear();
    	if(date.getMonth()<10){
    		dateString += "0"+(date.getMonth() + 1);
    	}
    	else{
    		dateString += (date.getMonth() + 1);
    	}
    	
    	if(date.getDate()<10){
    		dateString += "0"+date.getDate();
    	}
    	else{
    		dateString += date.getDate();
    	}  	
    	this.target.exportExcel("통계 항목_목록.xls");
    }
});