var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
	PAGE_START: function (caller, act, data) {
		var user_cd = parent.axboot.modal.getData().sendData;
		
		axboot.ajax({
            type: "GET",
            cache : false,
            url: "/api/v2/userUp/setting",
            data: {user_cd: user_cd},
            callback: function (res) {
            },
            options: {
                onError: function (err) {
                	alert("조회작업에 실패하였습니다. 관리자에게 문의하세요");
                    console.log(err);
                }
            }
        });
    },
    PAGE_SAVE: function (caller, act, data) {
    	var uid = $("#uid").val();
    	var npwd = $("#npwd").val();
    	var nopwd = $("#nopwd").val();
    	
    	if((npwd == '' || npwd == null) && (nopwd == '' || nopwd == null))
    	{    	
    		//parent.axboot.modal.close();
    		alert("새로운 비밀번호 및 확인을 입력해주세요!");
    		return;
    	}
    	
    	if((npwd != '' || npwd != null) && (nopwd == '' || nopwd == null))
    	{
    		alert("새로운 비밀번호 및 확인을 입력해주세요!");
    		return;
    	}
    	
    	if(npwd != nopwd)
    	{
    		alert("입력하신 새로운 비밀번호가 서로 다릅니다!");
    		return;
    	}
    	
    	axboot.ajax({
            type: "GET",
            cache : false,
            url: "/api/v2/userUp/Save",
            data: {uid:uid, npwd:npwd},
            callback: function (res) {
            	if(res == 1)
            	{
            		alert("저장이 완료 되었습니다!");
            		parent.axboot.modal.close();            		
            	}
            	else 
            	{
            		alert("저장작업에 실패하였습니다.");
            		return;
            	}
            },
            options: {
                onError: function (err) {
                	alert("저장작업에 실패하였습니다. 관리자에게 문의하세요");
                    console.log(err);
                }
            }
        });
    },
    PAGE_CLOSE: function (caller, act, data) {
        parent.axboot.modal.close();
    }
});

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
	$("#npwd").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
		}
	});
	
	$("#nopwd").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
		}
	});
		
    this.pageButtonView.initView();
};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
            }
        });
    }
});