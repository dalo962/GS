var fnObj = {};
var dnis_options = [];
var first_search_flag = true;
var save_flag = false;

var allList = [];

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var data = $.extend({}, this.searchView.getData());

    	// 저장으로 인한 조회일 때 조건 다 없애고 조회 //
    	if(save_flag) {
    		$("#startDate").val('');
        	$("#endDate").val('');
            $("#selMent").val('');

    		data.sdate = '';
    		data.edate = '';
    		data.ment = '';
    	}

    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/api/ivr/ivrEmerMent/EmerMentSearch",
            data: data,
            callback: function (res) {
        		setTimeout(function(){
            		caller.gridView01.setData(res);

            		// 처음 조회거나 저장하는 경우에만 실행 //
            		if(first_search_flag || save_flag) {
            			allList = res; // 전체리스트 저장

            			first_search_flag = false;
            			save_flag = false;
            		}
            		
            		/** 마우스 over **/
            		var displayClass = $(".display-hover");
                	var displayList = [];
                	for (var i = 0; i < displayClass.length; i++) {
                		displayList[i] = displayClass[i];
            		}
                	console.log(displayList);
                	displayList.forEach(function (n) {
                		var text = $(n).text();
                		$(n).attr('title',text);
                    });
                	/** 마우스 over **/
            	}, 200);
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
    	caller.gridView01.addRow();
    },
    PAGE_SAVE: function (caller, act, data) {
    	// Grid의 모든 data (deleted 포함)
    	var _saveList = [].concat(caller.gridView01.getData());
    	_saveList = _saveList.concat(caller.gridView01.getData("deleted"));

    	var saveList = [];

    	var reqExp = /^[0-9]*$/;
    	var bldnis = 0;
    	var blsdate = 0;
    	var bledate = 0;
    	var blstime = 0;
    	var bletime = 0;
    	var bllocation = 0;
    	var blemertype = 0;
    	var blment = 0;
    	var datedif = 0;
    	var timedif = 0;
    	var prtime = 0;
    	var ovment = 0;

    	_saveList.forEach(function (n) {
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외
    			saveList.push(n);
	    		var sd = n.sdate+n.stime;	// 나(n)의 시작시간
	    		var ed = n.edate+n.etime;	// 나(n)의 종료시간

	    		var r = allList.find(function (s) {
	    			// seq 값이 있으면 seq로 비교, 없으면 index로 비교 //
	    			var me = n.seq != '' && n.seq != null
	    				? n.seq != s.seq
	    				: n.__index != s.__index;

	        		var ssd = s.sdate+s.stime;	// 비교대상(s)의 시작시간
	        		var sed = s.edate+s.etime;	// 비교대상(s)의 종료시간

	        		// 자기자신이 아니면서 dnis가 같은 경우 //
	    			if(me && s.dnis == n.dnis && s.location == n.location && !n.__deleted__) {
	    				if(sd >= ssd && ed <= sed) {
	    					// 1. 입력된 시작/종료시간이 기존 시작/종료시간을 포함 //
	    					return s.dnis;
	    				} else if(sd <= ssd && ed >= sed) {
	    					// 2. 입력된 시작/종료시간이 기존 시작/종료시간에 포함 //
	    					return s.dnis;
	    				} else if(sd >= ssd && sd <= sed) {
	    					// 3. 입력된 시작시간이 기존 시작/종료시간 사이에 있음 //
	    					return s.dnis;
	    				} else if(ed >= ssd && ed <= sed) {
	    					// 4. 입력된 종료시간이 시작/종료시간 사이에 있음 //
	    					return s.dnis;
	    				}
	    			}
	    		});

	    		if(n.dnis == null || n.dnis == "")
	    		{
	    			bldnis = bldnis + 1;
	    		}
	    		if(n.sdate == null || n.sdate == "")
	    		{
	    			blsdate = blsdate + 1;
	    		}
	    		if(n.edate == null || n.edate == "")
	    		{
	    			bledate = bledate + 1;
	    		}
	    		if(n.stime == null || n.stime == "")
	    		{
	    			blstime = blstime + 1;
	    		}
	    		if(n.etime == null || n.etime == "")
	    		{
	    			bletime = bletime + 1;
	    		}
				if(n.location == null || n.location == "")
	    		{
	    			bllocation = bllocation + 1;
	    		}
	    		if(n.emer_type == null || n.emer_type == "")
	    		{
	    			blemertype = blemertype + 1;
	    		}
	    		if(n.ment == null || n.ment == "")
				{
	    			if(!n.__deleted__ && n.emer_type == 0)
	    			{
	        			// 삭제되지 않고, 유형이 "직접입력" 인 경우
	    				blment = blment + 1;
	    			}
				}
	    		if(n.sdate > n.edate) {	// 시작날짜가 종료날짜보다 큰 경우 (종료날짜가 시작날짜보다 작은 경우)
	    			datedif = datedif + 1;
	    		}
	    		if(n.sdate == n.edate) { // 날짜는 같은데 시작시간이 종료시간보다 큰 경우 (종료시간이 시작시간보다 작은 경우)
	    			if(n.stime > n.etime) {
	    				timedif = timedif + 1;
	    			}
	    		}
	    		if(r != null && r != '') { // dnis가 같으면서 시간이 겹치는 경우
	    			prtime = prtime + 1;
	    		}
	    		if(n.ment != null && n.ment != ""){
	    			if(getByteLength((n.ment))> 300){
	            		ovment = ovment + 1;
	            	}
	    		}
    		}
    	});
    	if(bldnis > 0)
    	{
    		alert("시나리오 케이스를 선택하시기 바랍니다.");
    		return;
    	}
    	if(blsdate > 0)
    	{
    		alert("시작날짜를 입력하시기 바랍니다.");
    		return;
    	}
    	if(bledate > 0)
    	{
    		alert("종료날짜를 입력하시기 바랍니다.");
    		return;
    	}
    	if(blstime > 0)
    	{
    		alert("시작시간을 입력하시기 바랍니다.");
    		return;
    	}
    	if(bletime > 0)
    	{
    		alert("종료시간을 입력하시기 바랍니다.");
    		return;
    	}
    	if(datedif > 0) {
    		alert("시작날짜가 종료날짜보다 클 수 없습니다.");
    		return;
    	}
    	if(timedif > 0) {
    		alert("시작시간이 종료시간보다 클 수 없습니다.");
    		return;
    	}
    	if(prtime > 0) {
    		alert("중복되는 기간이 있습니다. 기간을 확인해주세요.");
    		return;
    	}
    	if(blemertype > 0)
    	{
    		alert("유형을 선택하시기 바랍니다.");
    		return;
    	}
    	if(blment > 0)
    	{
    		alert("적용하려는 멘트내용이 없습니다.");
    		return;
    	}
		if(bllocation > 0)
    	{
    		alert("적용하려는 위치가 없습니다.");
    		return;
    	}
    	if(ovment > 0){
    		alert("멘트가 100자를 넘습니다. 100자 이내로 작성해주세요.");
    		return;
    	}

    	axDialog.confirm({
    		title:"확인",
            msg: "저장하시겠습니까?" // 여기까지 추가한 소스
        }, function () {
            if (this.key == "ok") {
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/api/ivr/ivrEmerMent/EmerMentSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);

		            	if(res.message.indexOf('관리자') == -1) {
		            		save_flag = true;
		            		axToast.push("저장 되었습니다.");
			            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            	}
		            },
		            options: {
		                onError: function (err) {
		                    alert("저장 작업에 실패하였습니다");
		                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		                }
		            }
		        });
            }
        });
    },
    PAGE_DEL: function (caller, act, data) {
    	caller.gridView01.delRow("selected");
    },
    EXCEL_EXPORT: function (caller, act, data) {
    	caller.gridView01.exportExcel();
    },
    SET_DNIS: function (caller, act, data) {
    	dnis_options.push({value:"ALL", text:"전체"});
    	dnis_options.push({value:"CATV", text:"CATV"});
    	dnis_options.push({value:"MYSHOP", text:"MYSHOP"});
    	dnis_options.push({value:"MCPC", text:"MCPC"});
    	fnObj.gridView01.initView();
    },
    GET_TTS: function (caller, act, data) {
    	var audio = null;
    	var filePN = "";

    	var ttsList = [].concat(fnObj.gridView01.getData("selected"));

    	if(ttsList[0].emer_type == '0'){
    		if(ttsList[0].upt_dt != undefined && ttsList[0].upt_dt != ''){
        		filePN = window.location.origin+'/assets/sound/gsshop/tts/'+ttsList[0].seq+'_'+ttsList[0].upt_dt+'.wav';
        	}else{
        		filePN = window.location.origin+'/assets/sound/gsshop/tts/'+ttsList[0].seq+'_'+ttsList[0].crt_dt+'.wav';
        		ttsList[0].upt_dt = '';
        	}

        	var params = {
        			seq : ttsList[0].seq,
        			crt_dt : ttsList[0].crt_dt,
        			upt_dt : ttsList[0].upt_dt,
        			ment : ttsList[0].ment,
        	};

        	axboot.ajax({
                type: "GET",
        		cache: false,
                url: "/api/ivr/ivrEmerMent/EmerMentTTS",
                data: params,
                callback: function (res) {
                	audio = new Audio(filePN);
                	audio.play();
                },
                options: {
                    onError: function (err) {
                        console.log(err);
                    }
                }
            });
    	}else{
    		filePN = window.location.origin+'/assets/sound/gsshop/voice/'+ttsList[0].emer_type+'.wav';
    		audio = new Audio(filePN);
        	audio.play();
    	}
    }
});

var CODE = {};
var info = {};

fmtDay = function (strValue) {
    var val = (strValue || "").replace(/\D/g, "");
    var regExpPattern = /^([0-9]{4})\-?([0-9]{2})?\-?([0-9]{2})?/,
        returnValue = val.replace(regExpPattern, function (a, b) {
        var nval = [arguments[1]];
        if (arguments[2]) nval.push(arguments[2]);
        if (arguments[3]) nval.push(arguments[3]);
        return nval.join("-");
    });
    return returnValue;
};

fmtTime = function (strValue) {
    var val = (strValue || "").replace(/\D/g, "");
    var regExpPattern = /^([0-9]{2})\-?([0-9]{2})?\-?([0-9]{2})?/,
        returnValue = val.replace(regExpPattern, function (a, b) {
        var nval = [arguments[1]];
        if (arguments[2]) nval.push(arguments[2]);
        if (arguments[3]) nval.push(arguments[3]);
        return nval.join(":");
    });
    return returnValue;
};

nullChk = function(strValue){
	var returnValue = "";
	if(typeof strValue != "undefined" && strValue != "undefined"){
		returnValue = strValue;
	}
	return returnValue;
};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

   	_this.pageButtonView.initView();
    _this.searchView.initView();

    ACTIONS.dispatch(ACTIONS.SET_DNIS);
    date_set();
    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH); // searchView - comp_cd 불러온 이후로 위치변경

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
            "tts": function () {
                ACTIONS.dispatch(ACTIONS.GET_TTS);
            },
        });
    }
});


fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
    },
    getData: function () {
    	var startDate = $("#startDate").val().replaceAll('-','');
        var endDate = $("#endDate").val().replaceAll('-','');
        var selMent = $("#selMent").val();
        return {
        	sdate: startDate,
        	edate: endDate,
        	ment: selMent,
        }
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;
        var _ment = {};		// 멘트를 임시로 저장하는 변수 ( _ment.index )

        this.target = axboot.gridBuilder({
        	showRowSelector: true,
            frozenColumnIndex: 0,
            multipleSelect: true,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
            	{key: "seq", label: "seq", width: 0, align: "center"},
            	{key: "dnis", label: "매체", width: 100, align: "center", sortable: true,  editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: dnis_options
                	}
                }, formatter: function() {
                	switch(this.item.dnis) {
	            		case "ALL":
	        				return "전체";
	        				break;
	            		case "CATV":
	            			return "CATV";
	            			break;
	            		case "MYSHOP":
	            			return "MYSHOP";
	            			break;
	            		case "MCPC":
	            			return "MCPC";
	            			break;
	            		default :
	            			return '<span style="color: red;">선택</span>';
	            			break;
                	}
                }},
            	{key: "sdate", label: "시작날짜", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var sdate = "";
                		if(this.item.sdate == '' || this.item.sdate == null) {
                			return '<span style="color: red;">YYYYMMDD</span>';
                		}

                		if(this.item.sdate != null && this.item.sdate != '')
                		{
                			sdate = this.item.sdate.substr(0,4) + "-" + this.item.sdate.substr(4,2) + "-" + this.item.sdate.substr(6,2);
                		}
                		return sdate;
                }},
            	{key: "stime", label: "시작시각", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var stime = "";
                		if(this.item.stime == '' || this.item.stime == null) {
                			return '<span style="color: red;">HHMMSS</span>';
                		}

                		if(this.item.stime != null && this.item.stime != '')
                		{
                			stime = this.item.stime.substr(0,2) + ":" + this.item.stime.substr(2,2) + ":" + this.item.stime.substr(4,2);
                		}
                		return stime;
                }},
            	{key: "edate", label: "종료날짜", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var edate = "";
                		if(this.item.edate == '' || this.item.edate == null) {
                			return '<span style="color: red;">YYYYMMDD</span>';
                		}

                		if(this.item.edate != null && this.item.edate != '')
                		{
                			edate = this.item.edate.substr(0,4) + "-" + this.item.edate.substr(4,2) + "-" + this.item.edate.substr(6,2);
                		}
                		return edate;
                }},
            	{key: "etime", label: "종료시각", width: 100, align: "center", sortable: true, editor:"text",
                	formatter: function() {
                		var etime = "";
                		if(this.item.etime == '' || this.item.etime == null) {
                			return '<span style="color: red;">HHMMSS</span>';
                		}

                		if(this.item.etime != null && this.item.etime != '')
                		{
                			etime = this.item.etime.substr(0,2) + ":" + this.item.etime.substr(2,2) + ":" + this.item.etime.substr(4,2);
                		}
                		return etime;
                }},
                {key: "location", label: "적용위치", width: 120, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "F", text: "인입"},
                			{value: "B", text: "연결전"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.location) {
                		case "F":
            				return "인입";
            				break;
                		case "B":
                			return "연결전";
                			break;
                		default :
                			return '<span style="color: red;">선택</span>';
                			break;
                	}
                }},
                {key: "emer_type", label: "비상멘트유형", width: 200, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "0", text: "00.직접입력"},
                			{value: "1", text: "01.에코장애"},
                			{value: "2", text: "02.당사장애"},
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.emer_type) {
                		case "0":
            				return "00.직접입력";
            				break;
                		case "1":
                			return "01.에코장애";
                			break;
                		case "2":
                			return "02.당사장애";
                			break;
                		default :
                			return '<span style="color: red;">선택</span>';
                			break;
                	}
                }},
                {key: "ment", label: "멘트", width: 400, align: "center", sortable: true,
                	formatter: function () {
                		if(this.item.emer_type == 0) {
                			return this.item.ment;
                		} else if(this.item.emer_type == 1) {
                			return "현재 일시적인 시스템 장애로 인하여 고객센터 연결이 어렵습니다.";
                		} else if(this.item.emer_type == 2) {
                			return "현재 일시적인 네트워크 장애로 인하여 GSSHOP 서비스가 원활하지 않습니다. ";
                		} else {
                			return "";
                		}
                	},
                	editor: {
	                	type: "text", disabled: function () {
	                		return this.item.emer_type != 0;
	                	}
	                },
	                styleClass: function(){
	                	return "display-hover";
	                }
                },
                {key: "ttsBtn", label: "듣기", width: 50, align: "center",
                	formatter: function() {
                		if(this.item.emer_type=='0'||this.item.emer_type=='1'||this.item.emer_type=='2'){
                			return '<a href="#"><img src="/assets/images/speaker.png" width="20 height="18" border="0"><a>';
                		}else{
                			return '';
                		}
                	}
                },
                {key: "crt_dt", label: "작성일자", width: 200, align: "center", sortable: true,
                	formatter: function() {
                		var crdt = "";
                		if(this.item.crt_dt != null)
                		{
                			crdt = this.item.crt_dt.substr(0,4) + "-" + this.item.crt_dt.substr(4,2) + "-" + this.item.crt_dt.substr(6,2) +
                			" " + this.item.crt_dt.substr(8,2) + ":" + this.item.crt_dt.substr(10,2) + ":" + this.item.crt_dt.substr(12,2)
                		}
                		return crdt;
                }},
                {key: "crt_by", label: "작성자", width: 150, align: "center", sortable: true},
                {key: "upt_dt", label: "수정일자", width: 200, align: "center", sortable: true,
                	formatter: function() {
                		var updt = "";
                		if(this.item.upt_dt != null)
                		{
                			updt = this.item.upt_dt.substr(0,4) + "-" + this.item.upt_dt.substr(4,2) + "-" + this.item.upt_dt.substr(6,2) +
                			" " + this.item.upt_dt.substr(8,2) + ":" + this.item.upt_dt.substr(10,2) + ":" + this.item.upt_dt.substr(12,2)
                		}
                		return updt;
                }},
                {key: "upt_by", label: "수정자", width: 150, align: "center", sortable: true}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                    if (this.column.key == "ttsBtn" && (this.item.emer_type != '' && this.item.emer_type != null))
                    {
                    	var data = this.list[this.dindex];
                    	if(data.__depth__ != '0')
                    	{
                    		ACTIONS.dispatch(ACTIONS.GET_TTS);
                    	}
                    }
                },
                onDBLClick: function () {
                	console.log(this);
                    this.self.select(this.dindex, {selectedClear: true});
                },
                onDataChanged: function () {
                	var key = this.key;
                	if(key == "emer_type") { // 변경된 것이 emer_type 일 때
                		var type = this.item.emer_type;		// emer_type의 value
	                    var index = this.item.__index;	// 변경될 index
	                    var ment = "";	// 변경될 ment 값 ( default = "" )

	                    // emer_type 가 TTS 로 설정되었고, 저장된 멘트가 있을 때
	                    if(type == 0 && _ment.index != null) {
	                    	ment = _ment.index;
	                    	_ment.index = null;
	                    }
	                    // 저장된 멘트가 없을 때
	                    else if(_ment.index == null) {
	                    	_ment.index = this.item.ment;
	                    }

	                    if(type == 1){
	                    	ment = "현재 일시적인 시스템 장애로 인하여 고객센터 연결이 어렵습니다.";
	                    }else if(type == 2){
	                    	ment = "현재 일시적인 네트워크 장애로 인하여 GSSHOP 서비스가 원활하지 않습니다.";
	                    }
	                    
	                    this.self.setValue(index, "ment", ment);

                	} else if (key == "sdate" || key == "edate") {		// 날짜인경우
                		var date = this.item[key].replaceAll(/[-\/]/g,'');	// 입력된 날짜에서 -, / 제외
	                    var index = this.item.__index;					// 변경될 index
                		var regex = /^([1-2]\d{3})([0][1-9]|1[0-2])(\d{2})$/g;// 날짜 (YYYYMMDD) => 숫자 8자리
                		var matcher = regex.exec(date);					// 입력된 날짜와 정규식의 매칭 결과

            			if(date != "" && !matcher) {	// 입력된 날짜가 정규식과 다른 경우
            				alert("올바른 날짜 형식으로 입력하시기 바랍니다."); // alert 띄우고
            	    		date = "";	// 입력된 값을 빈칸으로

            			} else if(date != "" && matcher) {
            				var year = matcher[1];
            				var month = matcher[2];
            				var day = matcher[3];

            				var _d31 = ["01", "03", "05", "07", "08", "10", "12"];
            				var _d30 = ["04", "06", "09", "11"];

            				if(day < "01" || // day 가 1보다 작으면 (0, 음수)
            						(_d31.find(function(m) { if(m == month) return m == month }) && day > "31") ||	// 최대 일이 31일 인것들
            						(_d30.find(function(m) { if(m == month) return m == month }) && day > "30")) {	// 최대 일이 30일 인것들
                				alert("올바른 날짜 형식으로 입력하시기 바랍니다."); // alert 띄우고
                	    		date = "";	// 입력된 값을 빈칸으로
            				} else if(month == "02") { // 2월 윤달 계산
        						var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        						if(day > 29 || (day == 29 && !isleap)) {
                    				alert("올바른 날짜 형식으로 입력하시기 바랍니다."); // alert 띄우고
                    	    		date = "";	// 입력된 값을 빈칸으로
        						}
            				}
            			}

	                    this.self.setValue(index, key, date);

                	} else if (key == "stime" || key == "etime") {		// 시간인경우
                		var time = this.item[key].replaceAll(':','');	// 입력된 시간에서 : 제외
	                    var index = this.item.__index;					// 변경될 index
                		var regex = /^([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/g;	// 시간 (HHMMSS) => 숫자 6자리
                		var matcher = regex.exec(time);					// 입력된 시간과 정규식의 매칭 결과

            			if(time != "" && !matcher) {	// 입력된 시간이 정규식과 다른 경우
            				alert("올바른 시간 형식으로 입력하시기 바랍니다."); // alert 띄우고
            	    		time = "";	// 입력된 값을 빈칸으로
            			}

	                    this.self.setValue(index, key, time);

                	}
                }
            }
        });
        
        axboot.buttonClick(this, "data-grid-view-01-btn", {
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
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.seq;
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
    addRowExcel: function (Exani, Exflag) {

    	if(Exflag == "사용" || Exflag == "Y")
    	{
    		Exflag = "Y";
    	}
    	else
    	{
    		Exflag = "N";
    	}

        this.target.addRow({__created__: true, ani:Exani, flag:Exflag}, "last");
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
    	this.target.exportExcel("비상멘트_목록_" + dateString + ".xls");
    }
});

function getByteLength(s,b,i,c){
    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
    return b;
}

function date_set(){
	var date = new Date();
    var yyyy = date.getFullYear().toString();
    var MM = (date.getMonth() + 1).toString();
    if(MM.length == 1) MM = "0"+MM;
    //var dd = (date.getDate() - 1).toString();
    var dd = date.getDate().toString();
    if(dd == "0" || dd == "00")
    {
    	MM = MM - 1;
    	var len = MM.toString().length;
    	if(len == 1) MM = "0" + MM;
    	if(MM == "0" || MM == "00")
    	{
    		yyyy = yyyy - 1;
    		MM = "12";
    		dd = "31";
    	}
    	else if(MM == "01" || MM == "03" || MM == "05" || MM == "07" || MM == "08" || MM == "10" || MM == "12")
    	{
    		dd = "31";
    	}
    	else if(MM == "02")
    	{
    		if((yyyy%4 == 0 && yyyy%100 != 0) || yyyy%400 == 0) // 윤달계산
    		{
    			dd = "29";
    		}
    		else
    		{
    			dd = "28";
    		}
    	}
    	else if(MM == "04" || MM == "06" || MM == "09" || MM == "11")
    	{
    		dd = "30";
    	}
    }
    else
    {
    	if(dd.length == 1) dd = "0"+dd;
    }

	if($("#startDate").val().length != 10 || $("#endDate").val().length != 10)
	{
		//$("#startDate").val(yyyy+"-"+MM+"-"+dd);
    	//$("#endDate").val(yyyy+"-"+MM+"-"+dd);
		$("#startDate").val('');
    	$("#endDate").val('');
	}

	$('[data-ax5picker="date"]').ax5picker({
        direction: "auto",
        content: {
            type: 'date',
            config: {
            	selectMode: "day",
            	control:{
    				yearTmpl: "%s년",
    				dayTmpl: "%s"
    			},
            	lang: {
                    yearTmpl: "%s년",
                    months: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
                    dayTmpl: "%s"
                },
                marker: (function () {
                    var marker = {};
                    marker[ax5.util.date(new Date(), {'return': 'yyyy-MM-dd', 'add': {d: 0}})] = true;

                    return marker;
                })()
            }
        },
        btns: {
            today: {
                label: "Today", onClick: function () {
                	var date = new Date();
                    var yyyy = date.getFullYear().toString();
                    var MM = (date.getMonth() + 1).toString();
                    if(MM.length == 1) MM = "0"+MM;
                    var dd = date.getDate().toString();
                    if(dd.length == 1) dd = "0"+dd;
                        this.self
                            .setContentValue(this.item.id, 0, ax5.util.date(yyyy+MM+dd, {"return": "yyyy-MM-dd"}))
                            .setContentValue(this.item.id, 1, ax5.util.date(yyyy+MM+dd, {"return": "yyyy-MM-dd"}))
                            .close()
                    ;
                }
            },
            clear: {
                label: "Clear", onClick: function () {
                        this.self
                            .setContentValue(this.item.id, 0, "")
                            .setContentValue(this.item.id, 1, "")
                            .close()
                    ;
                }
            },
            ok:{label:"Close", theme:"default"}
        }
    });
}

//var input_dom_element;