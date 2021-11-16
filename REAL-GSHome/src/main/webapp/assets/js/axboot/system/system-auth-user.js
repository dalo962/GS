var fnObj = {};

var comlist = [];
var authlst = [];

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["users"],
            cache : false,
            data: caller.searchView.getData(),
            callback: function (res) {
            	res.list.forEach(function (n, index){
            		res.list[index].grpAuthCd = n.userauth.grpAuthCd;
            	});
                caller.gridView01.setData(res);
                caller.formView01.clear();
                ACTIONS.dispatch(ACTIONS.ROLE_GRID_DATA_INIT, {userCd: "", roleList: []});
            }
        });

        return false;
    },
    PAGE_SAVE: function (caller, act, data) { 
    	// 유효성 검사
    	var userNm = $("#userNm").val();
    	var userCd = $("#userCd").val();
    	var userPwd = $("#userPs").val();    	
    	var grpauth = $(":input:radio[name=grpAuthCd]:checked").attr("value");
    	var grpauthSort = $(":input:radio[name=grpAuthCd]:checked").attr("value2");
    	var form = caller.formView01.getData();
    	var grid = caller.gridView01.getData();
    	
    	if(userCd == null || userCd == "")
    	{
    		alert("아이디를 입력하세요.");
    		return;
    	}
    	
    	if(userPwd == null || userPwd == "")
    	{
    		var pwdchk = 0;
    		
    		grid.forEach(function (n){
        		if(n.userCd == userCd)
        		{
        			pwdchk = pwdchk + 1;
        		}
        		
        	});
    		
    		if(pwdchk == 0)
    		{
    			alert("패스워드를 입력하세요.");
        		return;	
    		}    		
    	}
    	
    	if(userNm == null || userNm == "")
    	{
    		alert("사용자 명을 입력하세요.");
    		return;
    	}

    	if(grpauth == "undefined" || grpauth == undefined)
    	{
    		alert("권한을 선택하세요.");
    		return;
    	}
    	if(form.company_cd == null || form.company_cd == "")
    	{
    		alert("소속을 선택하세요.");
    		return;
    	}

    	if(grpauthSort < info.sort)
    	{
    		alert("사용자보다 높은 권한은 선택할 수 없습니다.");
    		return;
    	}
    	
    	var reqExp = /system/i;
    	if(reqExp.test(userCd) == true)
    	{
    		alert("SYSTEM이란 계정은 사용할 수 없습니다.");
    		return;
    	}
    	
    	if(grpauth != "S0001")
    	{
    		// 홈쇼핑
    		if(form.company_cd == "2")
    		{
    			if(grpauth != "S0002" || grpauth != "S0003" || grpauth != "S0004")
    			{
    				alert("소속과 권한을 다르게 설정할 수 없습니다.");
    	    		return;
    			}
    		}
    		else
    		{
    			if(grpauth != "G0002" || grpauth != "G0003" || grpauth != "G0004")
    			{
    				alert("소속과 권한을 다르게 설정할 수 없습니다.");
    	    		return;
    			}
    		}
    	}
    	
    	axboot.ajax({
        	type: "GET",
    	    url: "/api/statLstMng/userAuthLstCd",
    	    cache : false,
    	    data:{user_cd:$("#userCd").val()},
    	    callback: function (res) {
    	    	res.forEach(function (n){
    	    		uchk.sort = n.sort;
    	    	});
    	    	
    	    	if(info.sort > uchk.sort)
    	    	{
    	    		alert("사용자보다 높은 권한은 수정할 수 없습니다.");
    	    		return;
    	    	}
    	    	
    	    	if(grpauthSort < info.sort)
    	    	{
    	    		alert("사용자보다 높은 권한은 선택할 수 없습니다.");
    	    		return;
    	    	}
    	    	
    	    	axDialog.confirm({
    	    		title:"확인",
    	            msg: "저장하시겠습니까?" // 여기까지 추가한 소스
    	        }, function () {
    	            if (this.key == "ok") {
    	            	if (caller.formView01.validate()) {
    	                    axboot.ajax({
    	                        type: "POST",
    	                        url: ["users"],
    	                        cache : false,
    	                        data: JSON.stringify([caller.formView01.getData()]),
    	                        callback: function (res) {
    	                        	ACTIONS.dispatch(ACTIONS.U_PAGE_SAVE);
    	                        }
    	                    });
    	                }
    	            }
    	        });
    	    }
    	});
    	
    }, //save다 끝나고 해야함 auth_group_m에 insert를 끝내고 실행
    U_PAGE_SAVE: function (caller, act, data) {    	
    	if (caller.formView01.validate()) {
            axboot.ajax({
                type: "POST",
                url: "/api/menuMng/menuMngUserSave",
                cache : false,
                data: JSON.stringify([caller.formView01.getData()]),
                callback: function (res) {
                	axToast.push("저장 되었습니다."); 
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                }
            });
        }
    },
    FORM_CLEAR: function (caller, act, data) {
        axDialog.confirm({
        	title:"확인",
            msg: LANG("ax.script.form.clearconfirm")
        }, function () {
            if (this.key == "ok") {
                caller.formView01.clear();
            }
        });
    },
    ITEM_CLICK: function (caller, act, data) {
    	axboot.ajax({
            type: "GET",
            url: ["users"],
            cache : false,
            data: {userCd: data.userCd},
            callback: function (res) {
            	caller.searchView.setData(res);
            	caller.formView01.setData(res);
            }
        });
        
    },
    ITEM_DEL: function (caller, act, data) {
    	var userCd = $("#userCd").val();
    	
    	if(userCd == "" || userCd == null)
    	{
    		axDialog.confirm({
    			title:"확인",
                msg: "아이디를 선택해주세요."
            }, function () {
                if (this.key == "ok") {
                    return;
                }
            });
    	}    	
    	
    	axboot.ajax({
        	type: "GET",
    	    url: "/api/statLstMng/userAuthLstCd",
    	    cache : false,
    	    data:{user_cd:$("#userCd").val()},
    	    callback: function (res) {
    	    	res.forEach(function (n){
    	    		uchk.sort = n.sort;
    	    	});
    	    	
    	    	if(info.sort > uchk.sort)
    	    	{
    	    		alert("사용자보다 높은 권한은 삭제할 수 없습니다.");
    	    		return;
    	    	}
    	    	
    	    	axDialog.confirm({
    	    		title:"확인",
    	            msg: "삭제하시겠습니까?"
    	        }, function () {
    	            if (this.key == "ok") {
    	            	axboot.ajax({
    	                    type: "POST",
    	                    url: "/api/v1/users/del",
    	                    cache : false,
    	                    data: JSON.stringify([caller.formView01.getData()]),
    	                    callback: function (res) {
    	                    	if(res.message == "Fail")
    	                    	{
    	                    		alert("현재 로그인중인 계정은 삭제할 수 없습니다."); 
    	                    	}
    	                    	else
    	                    	{
    	                    		axToast.push("삭제 되었습니다."); 
    	                    	}
    	                    	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
    	                    }
    	                });
    	            }
    	        });
    	    }
    	});
    },
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    },
    ROLE_GRID_DATA_INIT: function (caller, act, data) {
        var list = [];
        CODE.userRole.forEach(function (n) {
            //var item = {roleCd: n.roleCd, roleNm: n.roleNm, hasYn: "N", userCd: data.userCd};
        	var item = {roleCd: n.roleCd, roleNm: n.roleNm, hasYn: "Y", userCd: data.userCd};

            if (data && data.roleList) {
                data.roleList.forEach(function (r) {
                    if (item.roleCd == r.roleCd) {
                        item.hasYn = "Y";
                    }
                });
            }
            list.push(item);
        });

        caller.gridView02.setData(list);
    },
    ROLE_GRID_DATA_GET: function (caller, act, data) {
        return caller.gridView02.getData("Y");
    }
});

var CODE = {};
var info = {};

var uchk = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    $("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});
    
    var data = {}; 
    data.groupCd = "AUTH_GROUP";
    
    axboot
        .call({
            type: "GET",
            url: ["commonCodes"],
            data: {groupCd: "USER_ROLE", useYn: "Y"},
            callback: function (res) {
                var userRole = [];
                res.list.forEach(function (n) {
                    userRole.push({
                        value: n.code, text: n.name + "(" + n.code + ")",
                        roleCd: n.code, roleNm: n.name,
                        data: n
                    });
                });
                this.userRole = userRole;
            }
        })
        .call({
        	type: "POST",
		    url: "/api/statLstMng/userAuthLst",
		    data: "",
            callback: function (res) {
            	res.forEach(function (n){
		    		info.grpcd = n.grp_auth_cd;
		    		info.comcd = n.company_cd;
		    		info.sort	= n.sort;
		    		info.usercd = n.user_cd;
		    	});
    	
                axboot.ajax({
            	type: "POST",
        	    url: "/api/mng/searchCondition/company",
        	    cache : false,
        	    data: JSON.stringify($.extend({}, info)),
        	    callback: function (res) {
        	        var resultSet = [];
        	        var resultSetWhere = [{value : "", text:"전체"}];

        	        res.list.forEach(function (n) {
        	        	resultSet.push({
        	                value: n.id, text: n.name,
        	            });
        	        	resultSetWhere.push({
        	                value: n.id, text: n.name,
        	            });
        	        	comlist.push({
        	                value: n.id, text: n.name,
        	            });
        	        });	    
        	        $("[data-ax5select='comSelect']").ax5select({
        		        theme: 'primary',
        		        onStateChanged: function () {
        		        },
        		        options: resultSet,
        	        });	   
        	        $("[data-ax5select='comSelectWhere']").ax5select({
        		        theme: 'primary',
        		        onStateChanged: function () {
        		        },
        		        options: resultSetWhere,
        	        });
        	    	}
                })
            }            
        })
        .call({
    	type: "POST",
    	url: "/api/mng/searchCondition/groupcdSelect",
	    data: JSON.stringify($.extend({}, data)),
	    callback: function (res) {
	        authlst = [{value : "", text:"전체"}];
	        res.list.forEach(function (n) {
	        	authlst.push({
	                value: n.code, text: n.name,
	            });
	        });
	        $("[data-ax5select='gunhanSelectWhere']").ax5select({
		        theme: 'primary',
		        options: authlst,
	        });	
	    	}	
        })
        .done(function () {

            CODE = this; // this는 call을 통해 수집된 데이터들.
            
            _this.pageButtonView.initView();
            _this.searchView.initView();
            _this.gridView01.initView();
            _this.gridView02.initView();
            _this.formView01.initView();

            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
      	
        });
};

fnObj.pageResize = function () {

};

function userChk(){
	axboot.ajax({
    	type: "GET",
	    url: "/api/statLstMng/userAuthLstCd",
	    cache : false,
	    data:{user_cd:$("#userCd").val()},
	    callback: function (res) {
	    	res.forEach(function (n){
	    		uchk.sort = n.sort;
	    	});
	    }
	});
}

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            }
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
    },
    setData: function (data){
    	$("[data-ax5select='comSelect']").ax5select("setValue", data.company_cd);
    },
    getData: function () {
    	var comCd = "";
    	if($("[data-ax5select='comSelectWhere']").ax5select("getValue")[0].value === undefined)
    	{
    		comCd = "";
    	}
    	
        return {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            filter: this.filter.val(),
            //comCd: $("[data-ax5select='comSelectWhere']").ax5select("getValue")[0].value,
            comCd: comCd,
            grpCd: $("[data-ax5select='gunhanSelectWhere']").ax5select("getValue")[0].value
        }
    }
});

/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {

        var _this = this;
        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {
                    key: "userCd",
                    label: COL("user.id"),
                    width: 130,
                    sortable: true,
                    align:"center"
                },
                {
                    key: "userNm",
                    label: COL("user.name"),
                    width: 130,
                    sortable: true,
                    align:"center"
                },
                {key: "company_cd", label:"소속", width: 130, align:"center", sortable: true,
                	formatter:function(){                
	                	var _this = this;	                	
	                	var com = "";
	                	comlist.forEach(function(n){
	                		if(n.value == _this.value){
	                			com = n.text
	                			return;
	                		}
	                	});
	                	return com;
                	}
                },               
                {key: "grpAuthCd", label:"권한", width: 120, align:"center", sortable: true,
                	formatter:function(){           
                		var _this = this;
                		var auth = "";                		
                		authlst.forEach(function(n){
	                		if(n.value == _this.value){
	                			auth = n.text
	                			return;
	                		}		                		
	                	});
                	return auth;
                	}
                }
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex);
                    ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.list[this.dindex]);
                }
            }
        });
    },
    setData: function (_data) {
        this.target.setData(_data);
    },
    setValue: function (index, key, value) {    	
    	this.target.setValue(index, key, value);
    }, // getdata추가
    getData: function (_type) {
    	var list = [];
        var _list = this.target.getList(_type);
        
        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
            	return this.bizCd;
            });
        } else {
            list = _list;
        }
        return list;
    },
    align: function () {
        this.target.align();
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
    	this.target.exportExcel("사용자_목록" +dateString+ ".xls");
    	//this.target.exportExcelXlsx("사용자 목록_" +dateString);
    }
});


/**
 * formView01
 */
fnObj.formView01 = axboot.viewExtend(axboot.formView, {
    getDefaultData: function () {
        return $.extend({}, axboot.formView.defaultData, {
            "compCd": "S0001",
            roleList: [],
            authList: []
        });
    },
    initView: function () {
        this.target = $("#formView01");
        this.model = new ax5.ui.binder();
        this.model.setModel(this.getDefaultData(), this.target);
        this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
        //this.initEvent();

        axboot.buttonClick(this, "data-form-view-01-btn", {
            "form-clear": function () {
                ACTIONS.dispatch(ACTIONS.FORM_CLEAR);
            },
        	"form-delete": function () {
        		ACTIONS.dispatch(ACTIONS.ITEM_DEL);
        	}
        });

        ACTIONS.dispatch(ACTIONS.ROLE_GRID_DATA_INIT, {});
    },
    initEvent: function () {
        var _this = this;
        this.model.onChange("password_change", function () {
            if (this.value == "Y") {
                _this.target.find('[data-ax-path="userPs"]').removeAttr("readonly");
                _this.target.find('[data-ax-path="userPs_chk"]').removeAttr("readonly");
            } else {
                _this.target.find('[data-ax-path="userPs"]').attr("readonly", "readonly");
                _this.target.find('[data-ax-path="userPs_chk"]').attr("readonly", "readonly");
            }
        });
    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
        //console.log(data);
        var value = $(":input:radio[name=grpAuthCd]:checked").val();

        //console.log(value);
        data.authList = [{userCd: data.userCd, grpAuthCd:value}];
        
        // 코드를 넣어준다 망할
        var com = "";
        if($("[data-ax5select='comSelect']").ax5select("getValue")[0] != undefined)
        {
        	com = $("[data-ax5select='comSelect']").ax5select("getValue")[0].value;
        }
        
        data.company_cd = com;
        
        // 여기까지
        /*if (data.grpAuthCd) {        
            data.grpAuthCd.forEach(function (n) {
                data.authList.push({
                    userCd: data.userCd,
                    grpAuthCd: n
                });
            });
        }*/
        
        data.roleList = ACTIONS.dispatch(ACTIONS.ROLE_GRID_DATA_GET);        
        return $.extend({}, data);
    },
    setData: function (data) {

        if (typeof data === "undefined") data = this.getDefaultData();
        data = $.extend({}, data);

        if (data.authList) {
            data.grpAuthCd = [];
            data.authList.forEach(function (n) {
            	data.grpAuthCd.push(n.grpAuthCd);
            });
        }
        ACTIONS.dispatch(ACTIONS.ROLE_GRID_DATA_INIT, {userCd: data.userCd, roleList: data.roleList});
        $("#compId").val(data.company_cd);
		
        data.userPs = "";
        data.password_change = "";
        //this.target.find('[data-ax-path="userPs"]').attr("readonly", "readonly");
        //this.target.find('[data-ax-path="userPs_chk"]').attr("readonly", "readonly");
        this.model.setModel(data);
        this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
        
    },
    validate: function () {
        var rs = this.model.validate();
        if (rs.error) {
            alert(LANG("ax.script.form.validate", rs.error[0].jquery.attr("title")));
            rs.error[0].jquery.focus();
            return false;
        }
        return true;
    },
    clear: function () {
    	$("#compId").val("");
		
        this.model.setModel(this.getDefaultData());
    }
});

/**
 * gridView
 */
fnObj.gridView02 = axboot.viewExtend(axboot.gridView, {
    initView: function () {

        var _this = this;
        this.target = axboot.gridBuilder({
            showLineNumber: false,
            target: $('[data-ax5grid="grid-view-02"]'),
            columns: [
                {key: "hasYn", label: COL("ax.admin.select"), width: 50, align: "center", editor: "checkYn"},
                {key: "roleCd", label: COL("ax.admin.user.role.code"), width: 150},
                {key: "roleNm", label: COL("ax.admin.user.role.name"), width: 180},
            ],
            body: {
                onClick: function () {
                    //this.self.select(this.dindex);
                    //ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.list[this.dindex]);
                }
            }
        });
    },
    setData: function (_data) {
        this.target.setData(_data);
    },
    getData: function (hasYn) {
        hasYn = hasYn || "Y";
        var list = ax5.util.filter(this.target.getList(), function () {
            return this.hasYn == hasYn;
        });
        return list;
    },
    align: function () {
        this.target.align();
    }
});