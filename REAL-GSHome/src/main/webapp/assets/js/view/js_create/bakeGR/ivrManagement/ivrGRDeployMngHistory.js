var fnObj = {};
var dnis_options = [];
var fisrt_search_flag = true;
var save_flag = false;
var uploadE = null;
var deployMask = {};
var eventSource = {};

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var data = $.extend({}, this.searchView.getData());
    	
    	// 저장으로 인한 조회일 때 조건 다 없애고 조회 //
    	if(save_flag||fisrt_search_flag) { 
    		data.sdate = '';
    		data.edate = '';
    		data.step = '';
    		
    		
    		if(fisrt_search_flag){
    			fisrt_search_flag = !fisrt_search_flag;
    		}
    		if(save_flag){
    			save_flag = !save_flag;
    		}
    	}
    	
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/gr/api/ivr/ivrDeployMng/DeployMngSearch",
            data: data,
            callback: function (res) {
            	console.log(res);
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
    PAGE_ROLLBACK: function (caller, act, data) {
    	
    	var _rollbackList = [].concat(caller.gridView01.getData("selected"));
    	var rollbackList = [];
    	if(_rollbackList.length == 0){
    		alert("선택된 데이터가 없습니다.");
    		return;
    	}

    	var blstep = 0;
    	var blbackupdt = 0;

    	_rollbackList.forEach(function (n){
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외    			
    			rollbackList.push(n);
	    		if(n.step != '4')
	    		{
	    			blstep = blstep + 1;
	    		}
	    		if(n.backup_dt == null || n.backup_dt == "")
	    		{
	    			blbackupdt = blbackupdt + 1;
	    		}
    		}
    	});
    	if(blstep > 0)
    	{
    		alert("배포된 파일만 원복 가능합니다.");
    		return;
    	}
    	if(blbackupdt > 0)
    	{
    		alert("백업이 있는 파일만 원복 가능합니다.");
    		return;
    	}

    	axDialog.confirm({
    		title:"확인",
            msg: "시나리오 원복을 실행 하시겠습니까?" // 여기까지 추가한 소스
        }, function () {
            if (this.key == "ok") {
            	setMask(true);
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/gr/api/ivr/ivrDeployMng/DeployMngRollback",
		            data: JSON.stringify(rollbackList),
		            callback: function (res) {
		            	alert(res.message);
		            	setMask(false);
		            	save_flag = true;
		            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            },
		            options: {
		                onError: function (err) {
		                    alert("저장 작업에 실패하였습니다");
		                    setMask(false);
		                    save_flag = true;
		                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		                },
		                nomask: true,
		            }
		        });
            }
        });
    },
    PAGE_CODECHECK: function (caller, act, data) {
    	
    	axboot.ajax({
            type: "POST",
            cache: false,
            url: "/gr/api/ivr/ivrDeployMng/DeployMngCodeCheck",
            data: "",
            callback: function (res) {
            	if(res.message != 'success'){
            		alert("공통코드(필수값)가 없습니다. 공통코드 입력 후 이용해주세요.");
            		location.href = "";
            	}
            },
            options: {
                onError: function (err) {
                	alert("공통코드(필수값)가 없습니다. 공통코드 입력 후 이용해주세요2.");
                }
            }
        });
    },
    PAGE_SETMASK: function(){
    	deployMask = new ax5.ui.mask();
    	var contentStr = "";
    	contentStr +="<h1 id='mask_top' style='padding-top:100px; z-index:99999; position:inherit; text-shadow: 2px 2px 2px black; font-weight: bold;'></h1>",
    	contentStr +="<h3 id='mask_center' style='padding-top:10px; z-index:99999; position:inherit; text-shadow: 2px 2px 2px black; font-weight: bold;'></h3>",
    	contentStr +="<h3 id='mask_bottom' style='padding-top:10px; z-index:99999; position:inherit; text-shadow: 2px 2px 2px black; font-weight: bold;'></h3>",
    	deployMask.setConfig({
            target: document.body,
            content: contentStr,
        });
    },
    PAGE_SETEMITTER: function(){
    	eventSource = new EventSource("/gr/api/ivr/ivrDeployMng/ConnectEmitter");
    	eventSource.onopen = function(e) {
    		console.log("EventSource is open"); 
    	}; 
    	eventSource.onerror = function(e) {
    		if (this.readyState == EventSource.CONNECTING) {
    			console.log("Connection is interrupted, connecting ..."); 
    		} else { 
    			console.log("Error, state: " + this.readyState);
    			console.log("eventSource, onerror: " + e);
    		} 
    	};
    	eventSource.onmessage = function(e) { 
    		console.log(e.data);
    		var res = e.data.split(";");
    		if(res.length == 3){
    			$("#mask_top").text(res[0]);
    			$("#mask_center").text(res[1]);
    			$("#mask_bottom").text(res[2]);
    		} else if(res.length == 2){
    			if(res[1] == "END"){    				
    				$("#mask_top").text(res[0]);
        			$("#mask_center").text(res[1]);
        			$("#mask_bottom").text("Complete!!");
        			setTimeout(function(){
        				$("#mask_top").text("");
            			$("#mask_center").text("");
            			$("#mask_bottom").text("");
        			},3000);
    			}
    		}
    	}
    }
});


// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
	
//	ACTIONS.dispatch(ACTIONS.PAGE_CODECHECK);
	ACTIONS.dispatch(ACTIONS.PAGE_SETMASK);
	ACTIONS.dispatch(ACTIONS.PAGE_SETEMITTER);
	
    var _this = this;
   	_this.pageButtonView.initView();
    _this.searchView.initView();
    _this.gridView01.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};

function setMask(open){
	if(open){
		deployMask.open();
    	$(".ax-mask .ax-mask-content .ax-mask-body").toggleClass("deploymng");
	}else{
		deployMask.close();
	}
}

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "upload": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_UPLOAD_FILE);
            },
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
        });
    }
});

var allFlag = false;
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
    	// 단계 선택 설정 //
    	var stepOptions = [];
	    stepOptions.push({text:'전체',	value:'',	sel:'1'});
	    stepOptions.push({text:'배포준비',	value:'0',	sel:'0'});
	    stepOptions.push({text:'정합성완료',value:'1',	sel:'0'});
	    stepOptions.push({text:'신규파일',	value:'2',	sel:'0'});
	    stepOptions.push({text:'백업완료',	value:'3',	sel:'0'});
	    stepOptions.push({text:'배포완료',	value:'4',	sel:'0'});
	    stepOptions.push({text:'원복',	value:'5',	sel:'0'});
    	$("[data-ax5select='stepSelect']").ax5select({
	        theme: 'primary',
	        multiple: true,
	        options: stepOptions,
	        onChange: function(e)
	        {
	        	
	        	if( this.item.selected.length  == 0 )
	        	{
	        		$('[data-ax5select="stepSelect"]').ax5select("setValue",[""],true);
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
	        				$('[data-ax5select="skSelect"]').ax5select("setValue",[""],false);
	        	    	
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
    	        			$('[data-ax5select="stepSelect"]').ax5select("setValue",[""],false);
    	        			this.item.options[0].sel = "0" ;
	        			} 
	        			else
	        			{
	        				this.item.options[0].sel = "1" ;
    	        			for(var i = 1; i < this.item.options.length; i++)
    	        			{
    	        				$('[data-ax5select="stepSelect"]').ax5select("setValue",[this.item.options[i].value],false);
    	        			}
	        			}
	        			
	        			if(allFlag){
	        				$('[data-ax5select-option-group]').click();
	        			}else{
	        				$('[data-option-index="0"]').attr('data-option-selected', false);
	        			}
	        			allFlag = !allFlag;
	        		}
	        	}       	        	
			}        	        	        	        
        });
        $('[data-ax5select="stepSelect"]').ax5select("setValue",[""]);
        $("#startDate").val(getToday());
        $("#endDate").val(getToday());
        
        date_set();
    },
    getData: function () {
    	var startDate = $("#startDate").val().replaceAll('-','');
        var endDate = $("#endDate").val().replaceAll('-','');
        var list = $('[data-ax5select="stepSelect"]').ax5select("getValue");
        var fileName = $("#fileTxt").val();
    	var steplist = "";
    	if(list != "")
    	{	    	
    		
	    	for(var i=0; i < list.length; i++)
	    	{
	    		steplist += list[i].value+",";
	    	}
	    	steplist = steplist.substring(0,steplist.length-1);
    	}
        return {
        	sdate: startDate,
        	edate: endDate,
        	step: steplist,
        	filename: fileName,
        }
    }
});

function getToday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}


/**
 * gridView 배포관리 리스트
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
        	showRowSelector: true,
            frozenColumnIndex: 0,
            multipleSelect: true,
            showLineNumber:true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
            	{key: "seq", label: "seq", width: 0, align: "center"},
            	{key: "upt_dt", label: "반영일자", width: 200, align: "center", sortable: true,
                	formatter: function() {
                		var updt = "";
                		if(this.item.upt_dt != null)
                		{
                			updt = this.item.upt_dt.substr(0,4) + "-" + this.item.upt_dt.substr(4,2) + "-" + this.item.upt_dt.substr(6,2) +
                			" " + this.item.upt_dt.substr(8,2) + ":" + this.item.upt_dt.substr(10,2) + ":" + this.item.upt_dt.substr(12,2)
                		}
                		return updt;
                }},
            	{key: "directory", label: "디렉토리", width: 200, align: "center", sortable: true,  editor: {
            		type: "text", disabled:function(){
        				if(this.item["step"] == null || this.item["step"] == "" || this.item["step"] == "0")
        					return false;
        				else
        					return true;
        			}
        		},
                	formatter: function() {
                		if(this.item.directory == '' || this.item.directory == null) {
                			return '<span style="color: red;">ex)MAIN/src/</span>';
                		}else{
                			return this.item.directory;
                		}
                }},
                {key: "filename", label: "파일명", width: 120, align: "center", sortable: true,  editor: {
            		type: "text", disabled:function(){
        				if(this.item["step"] == null || this.item["step"] == "" || this.item["step"] == "0")
        					return false;
        				else
        					return true;
        			}
        		},
                	formatter: function() {
                		if(this.item.filename == '' || this.item.filename == null) {
                			return '<span style="color: red;">ex)main.jsp</span>';
                		}else{
                			return this.item.filename;
                		}
                }},
                {key: "filesize", label: "용량", width: 80, align: "center", sortable: true,
                	formatter: function() {
                		var filesize = this.item.filesize;
                		if(filesize != null)
                		{
                			if(filesize < 1024){
                				return filesize + "B";
                			}
                			else if(filesize < 1024*1024){
                				return Math.floor(filesize/1024) + "KB";
                			}
                			else if(filesize < 1024*1024*1024){
                				return Math.floor(filesize/(1024*1024)) + "MB";
                			}
                		}
                		return filesize;
                }},
                {key: "description", label: "사유", width: 280, align: "center", sortable: true,  editor: {
            		type: "text", disabled:function(){
        				if(this.item["step"] == null || this.item["step"] == "" || this.item["step"] == "0")
        					return false;
        				else
        					return true;
        			}},
                	formatter: function() {
                		if(this.item.description == '' || this.item.description == null) {
                			return '<span style="color: red;">배포 사유</span>';
                		}else{
                			return this.item.description;
                		}
                }},
                {key: "step", label: "단계", width: 100, align: "center", sortable: true, 
                	formatter: function() {
                		switch(this.item.step) {
	                		case "0":
	                			return "배포준비";
	                			break;  
	                		case "1":
	                			return "정합성완료";
	                			break;  
	                		case "2":
	                			return "신규파일";
	                			break;
	                		case "3":
	                			return "백업완료";
	                			break;
	                		case "4":
	                			return "배포완료";
	                			break;
	                		case "5":
	                			return "원복";
	                			break;
	                		default :
	                			return '';
	                			break;
                		}
                	},
                	styleClass: function () {
                		if(this.item.step == '0'){
                			return "grid-cell-pink";
                		} else if(this.item.step == '1'){
                			return "grid-cell-apricot";
                		} else if(this.item.step == '2' || this.item.step == '3'){
                			return "grid-cell-blue";
                		} else if(this.item.step == '4'){
                			return "grid-cell-green";
                		} else if(this.item.step == '5'){
                			return "grid-cell-orange";
                		} else{
                			return "";
                		}
                    },
                },
                {key: "backup_dt", label: "백업일자", width: 200, align: "center", sortable: true,
                	formatter: function() {
                		var bkdt = "";
                		if(this.item.backup_dt != null)
                		{
                			bkdt = this.item.backup_dt.substr(0,4) + "-" + this.item.backup_dt.substr(4,2) + "-" + this.item.backup_dt.substr(6,2) +
                			" " + this.item.backup_dt.substr(8,2) + ":" + this.item.backup_dt.substr(10,2) + ":" + this.item.backup_dt.substr(12,2)
                		}
                		return bkdt;
                }},
                {key: "mpvivrmcp001", label: "MP1", width: 100, align: "center", styleClass: function() {if(this.item.mpvivrmcp001==null){return "";} else if(this.item.mpvivrmcp001.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "mpvivrmcp002", label: "MP2", width: 100, align: "center", styleClass: function() {if(this.item.mpvivrmcp002==null){return "";} else if(this.item.mpvivrmcp002.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "mpvivrmcp003", label: "MP3", width: 100, align: "center", styleClass: function() {if(this.item.mpvivrmcp003==null){return "";} else if(this.item.mpvivrmcp003.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "mpvivrmcp004", label: "MP4", width: 100, align: "center", styleClass: function() {if(this.item.mpvivrmcp004==null){return "";} else if(this.item.mpvivrmcp004.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "mpvivrmcp005", label: "MP5", width: 100, align: "center", styleClass: function() {if(this.item.mpvivrmcp005==null){return "";} else if(this.item.mpvivrmcp005.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "mpvivrmcp006", label: "MP6", width: 100, align: "center", styleClass: function() {if(this.item.mpvivrmcp006==null){return "";} else if(this.item.mpvivrmcp006.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "dpvivrmcp001", label: "DP1", width: 100, align: "center", styleClass: function() {if(this.item.dpvivrmcp001==null){return "";} else if(this.item.dpvivrmcp001.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "dpvivrmcp002", label: "DP2", width: 100, align: "center", styleClass: function() {if(this.item.dpvivrmcp002==null){return "";} else if(this.item.dpvivrmcp002.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "dpvivrmcp003", label: "DP3", width: 100, align: "center", styleClass: function() {if(this.item.dpvivrmcp003==null){return "";} else if(this.item.dpvivrmcp003.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "dpvivrmcp004", label: "DP4", width: 100, align: "center", styleClass: function() {if(this.item.dpvivrmcp004==null){return "";} else if(this.item.dpvivrmcp004.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "dpvivrmcp005", label: "DP5", width: 100, align: "center", styleClass: function() {if(this.item.dpvivrmcp005==null){return "";} else if(this.item.dpvivrmcp005.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
                {key: "dpvivrmcp006", label: "DP6", width: 100, align: "center", styleClass: function() {if(this.item.dpvivrmcp006==null){return "";} else if(this.item.dpvivrmcp006.indexOf("성공")>-1){return "grid-cell-green";} else{return "grid-cell-orange";}}},
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
                {key: "upt_by", label: "수정자", width: 150, align: "center", sortable: true}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                },
                onDBLClick: function () {
                	console.log(this);
                    this.self.select(this.dindex, {selectedClear: true});
                },
            }
        });
        axboot.buttonClick(this, "data-grid-view-01-btn", {
            "rollback": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_ROLLBACK);
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