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
    PAGE_SAVE: function (caller, act, data) {
    	// Grid의 모든 data (deleted 포함)
    	var _saveList = [].concat(caller.gridView01.getData());
    	_saveList = _saveList.concat(caller.gridView01.getData("deleted"));
    	console.log(_saveList);
    	var saveList = []; 

    	var bldirectory = 0;
    	var blfilename = 0;
    	var bldescription = 0;
    	var ovdirectory = 0;
    	var ovfilename = 0;
    	var ovdescription = 0;

    	_saveList.forEach(function (n){
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외    			
    			saveList.push(n);
	    		if(n.directory == null || n.directory == "")
	    		{
	    			bldirectory = bldirectory + 1;
	    		}
	    		if(n.filename == null || n.filename == "")
	    		{
	    			blfilename = blfilename + 1;
	    		}
	    		if(n.description == null || n.description == "")
	    		{
	    			bldescription = bldescription + 1;
	    		}
	    		if(n.directory != null && n.directory != ""){
	    			if(getByteLength((n.directory))> 100){
	    				ovdirectory = ovdirectory + 1;
	            	}
	    		}
	    		if(n.filename != null && n.filename != ""){
	    			if(getByteLength((n.filename))> 50){
	    				ovfilename = ovfilename + 1;
	            	}
	    		}
	    		if(n.description != null && n.description != ""){
	    			if(getByteLength((n.description))> 300){
	    				ovdescription = ovdescription + 1;
	            	}
	    		}
    		}
    	});
    	console.log(saveList);
    	if(ovdirectory > 0)
    	{
    		alert("디렉토리를 100Byte 이내로 작성해주세요.(한글 3Byte)");
    		return;
    	}
    	if(ovfilename > 0)
    	{
    		alert("파일이름을 50Byte 이내로 작성해주세요.(한글 3Byte)");
    		return;
    	}
    	if(ovdescription > 0) {
    		alert("사유를 300Byte 이내로 작성해주세요.(한글 3Byte)");
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
		            url: "/gr/api/ivr/ivrDeployMng/DeployMngSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);
		            	axToast.push("저장 되었습니다.");
		            	save_flag = true;
		            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            },
		            options: {
		                onError: function (err) {
		                    alert("저장 작업에 실패하였습니다");
		                    save_flag = true;
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
    PAGE_UPLOAD_FILE: function(){
    	if(uploadE == null){
    		return;
    	}
    	var fileList = [];
        var files = uploadE.target.files;
        // 파일 배열 담기
        var filesArr = Array.prototype.slice.call(files);
        
        // 각각의 파일 배열담기 및 기타
        filesArr.forEach(function (f) {
        	fileList.push(f);
        });
        
        var form = $("#dummy-form")[0];
     	var formData = new FormData(form);
    	for (var x = 0; x < fileList.length; x++) {
    		formData.append("fileList", fileList[x]);		
    	}
        
    	setMask(true);
    	
    	$.ajax({
	  			type: "POST",
        	  	enctype: "multipart/form-data",
        	  	url: "/gr/api/ivr/ivrDeployMng/DeployFileUploadSimple",
        	  	data : formData,
        	  	processData: false,
        	  	contentType: false,
        	  	success: function (res) {
        	  		alert(res.message);
        	  		
        	  		setMask(false);
        	  		$("#fileupload").val('');
        	  		$("#fileupload_text").text('※ 파일리스트');
        	  		
        	  		ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
        	  	},
        	  	error: function (xhr, status, error) {
        	  		alert("서버오류로 지연되고있습니다. 잠시 후 다시 시도해주시기 바랍니다.");
        	  		setMask(false);
        	  	}
         });
    },
    PAGE_DEPLOY: function (caller, act, data) {
    	var _deployList = [].concat(caller.gridView01.getData("selected"));
    	var deployList = [];
    	if(_deployList.length == 0){
    		alert("선택된 데이터가 없습니다.");
    		return;
    	}

    	var bldirectory = 0;
    	var blfilename = 0;    	
    	var bldescription = 0;
    	var bluuid = 0;
    	var blstep = 0;
    	var blcrtdt = 0;
    	var ovdirectory = 0;
    	var ovfilename = 0;
    	var ovdescription = 0;
    	var ovuuid = 0;

    	_deployList.forEach(function (n){
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외    			
    			deployList.push(n);
	    		if(n.directory == null || n.directory == "")
	    		{
	    			bldirectory = bldirectory + 1;
	    		}
	    		if(n.filename == null || n.filename == "")
	    		{
	    			blfilename = blfilename + 1;
	    		}
	    		if(n.description == null || n.description == "")
	    		{
	    			bldescription = bldescription + 1;
	    		}
	    		if(n.uuid == null || n.uuid == "")
	    		{
	    			bluuid = bluuid + 1;
	    		}
	    		if(n.step != "0")
	    		{
	    			blstep = blstep + 1;
	    		}
	    		if(n.crt_dt == null || n.crt_dt == "")
	    		{
	    			blcrtdt = blcrtdt + 1;
	    		}
	    		if(n.directory != null && n.directory != ""){
	    			if(getByteLength((n.directory))> 100){
	    				ovdirectory = ovdirectory + 1;
	            	}
	    		}
	    		if(n.filename != null && n.filename != ""){
	    			if(getByteLength((n.filename))> 50){
	    				ovfilename = ovfilename + 1;
	            	}
	    		}
	    		if(n.description != null && n.description != ""){
	    			if(getByteLength((n.description))> 300){
	    				ovdescription = ovdescription + 1;
	            	}
	    		}
	    		if(n.uuid != null && n.uuid != ""){
	    			if(getByteLength((n.uuid))> 300){
	    				ovuuid = ovuuid + 1;
	            	}
	    		}
	    		
    		}
    	});
    	if(bldirectory > 0)
    	{
    		alert("디렉토리를 입력하시기 바랍니다.");
    		return;
    	}
    	if(blfilename > 0)
    	{
    		alert("파일명을 입력하시기 바랍니다.");
    		return;
    	}
    	if(bldescription > 0)
    	{
    		alert("사유를 입력해주시기 바랍니다.");
    		return;
    	}
    	if(bluuid > 0)
    	{
    		alert("UUID를 입력해주시기 바랍니다.");
    		return;
    	}
    	if(blstep > 0)
    	{
    		alert("배포준비 단계만 배포 가능합니다.");
    		return;
    	}
    	if(blcrtdt > 0)
    	{
    		alert("저장 후 시도하시기 바랍니다.");
    		return;
    	}
    	if(ovdirectory > 0)
    	{
    		alert("디렉토리를 100Byte 이내로 작성해주세요.(한글 3Byte)");
    		return;
    	}
    	if(ovfilename > 0)
    	{
    		alert("파일이름을 50Byte 이내로 작성해주세요.(한글 3Byte)");
    		return;
    	}
    	if(ovdescription > 0) {
    		alert("사유를 300Byte 이내로 작성해주세요.(한글 3Byte)");
    		return;
    	}
    	if(ovuuid > 0) {
    		alert("UUID를 50Byte 이내로 작성해주세요.(한글 3Byte)");
    		return;
    	}

    	axDialog.confirm({
    		title:"확인",
            msg: "시나리오 배포를 실행 하시겠습니까?" // 여기까지 추가한 소스
        }, function () {
            if (this.key == "ok") {
            	setMask(true);
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/gr/api/ivr/ivrDeployMng/DeployMngSimple",
		            data: JSON.stringify(deployList),
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
    PAGE_COMPLETE: function (caller, act, data) {
    	
    	var _completeList = [].concat(caller.gridView01.getData("selected"));
    	var completeList = [];
    	if(_completeList.length == 0){
    		alert("선택된 데이터가 없습니다.");
    		return;
    	}

    	var blstep = 0;
    	var blbackupdt = 0;

    	_completeList.forEach(function (n){
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외    			
    			completeList.push(n);
	    		if(n.step != '4' && n.step != '5')
	    		{
	    			blstep = blstep + 1;
	    		}
    		}
    	});
    	if(blstep > 0)
    	{
    		alert("배포, 원복된 파일만 완료 가능합니다.");
    		return;
    	}

    	axDialog.confirm({
    		title:"확인",
            msg: "배포를 완료 하시겠습니까?"
        }, function () {
            if (this.key == "ok") {
            	setMask(true);
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/gr/api/ivr/ivrDeployMng/DeployMngComplete",
		            data: JSON.stringify(completeList),
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
    PAGE_DIRINSERT: function (caller, act, data) {
    	
    	var dirTxt = $("#dirTxt").val();
    	var discTxt = $("#discTxt").val();
    	
//    	var _dirInsertList = [].concat(caller.gridView01.getData("selected"));
    	var _dirInsertList = [].concat(caller.gridView01.getData());
    	console.log(_dirInsertList);
    	var dirInsertList = [];
    	if(_dirInsertList.length == 0){
    		alert("선택된 데이터가 없습니다.");
    		return;
    	}

    	_dirInsertList.forEach(function (n){
    		if(!(n.__created__ && n.__deleted__)) { // 새로운데이터이면서 삭제된건 제외    	
    			if(n.__selected__ && n.step == '0'){
    				n.directory = dirTxt;
    				n.description = discTxt;
    				n.__modified__ = true;
    			}
    			dirInsertList.push(n);
    		}
    	});
    	
    	caller.gridView01.setData(dirInsertList);
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
	
	ACTIONS.dispatch(ACTIONS.PAGE_CODECHECK);
	ACTIONS.dispatch(ACTIONS.PAGE_SETMASK);
	ACTIONS.dispatch(ACTIONS.PAGE_SETEMITTER);
	
    var _this = this;
    $("#fileupload").on("change", viewFileList);
   	_this.pageButtonView.initView();
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

function viewFileList(e) {
    var files = e.target.files;
    // 파일 배열 담기
    var filesArr = Array.prototype.slice.call(files);
    
    // 각각의 파일 배열담기 및 기타
    var fileNum = 1;
    var fileStr = "";
    filesArr.forEach(function (f) {
    	fileStr += "<div>"+fileNum+"."+f.name+"</div>";
    	fileNum++;
    });
    $('#fileupload_text').html(fileStr);
    uploadE = e;
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

fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
    },
    getData: function () {
        return {
        	work_flag: 'S',
        }
    }
});

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
                },
                onDBLClick: function () {
                	console.log(this);
                    this.self.select(this.dindex, {selectedClear: true});
                },
            }
        });
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"save": function () {
        		ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
        	},
        	"delete": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_DEL);
            },
            "deploy": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_DEPLOY);
            },
            "rollback": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_ROLLBACK);
            },
            "complete": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_COMPLETE);
            },
            "dirInsert": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_DIRINSERT);
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
