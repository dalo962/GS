var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
    	var menuSelect = $("[data-ax5select='menuSelect']").ax5select("getValue")[0].value;
    	
        axboot.ajax({
            type: "GET",
            url: "/api/statLstMng/statLstMngMenuSearch",   
            cache : false,
            data: {disp:menuSelect},
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
    PAGE_SAVE: function (caller, act, data) {
    	var saveList = [].concat(caller.gridView01.getData());
    	var menuSelect = $("[data-ax5select='menuSelect']").ax5select("getValue")[0].value;
    	var chk = 0;
    	saveList.forEach(function (n){
    		n.dispname = menuSelect;
    		
    		if(n.use_yn == "Y")
    		{
    			chk++;
    		}
    	});
    	
    	if(chk < 3)
    	{
    		alert("최소 3개 이상은 선택이 필요합니다.");
    		return;
    	}
    	
    	
        axboot.ajax({
            type: "POST",
            url: "/api/statLstMng/statLstMngMenuSave",
            cache : false,
            data: JSON.stringify(saveList),
            callback: function (res) {
            	axToast.push("저장 되었습니다."); 
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);                
            },
            options: {
                onError: function (err) {
                	alert("저장 작업에 실패하였습니다.\n다시 확인해 주시기 바랍니다.");                    
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                }
            }
        });
    },
    PAGE_CLOSE: function (caller, act, data) {
        //parent.axboot.modal.callback(1);
    	parent.axboot.modal.close();
    }
});

var CODE = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    _this.pageButtonView.initView();
    _this.searchView.initView();
    _this.gridView01.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);

};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
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

        var menuList = [];        
        menuList.push({text: "스킬 통화 통계", value: "skCall"});
        menuList.push({text: "스킬 대기 분포", value: "skWait"});
        menuList.push({text: "상담사 실적 통계", value: "agCall"});
        menuList.push({text: "상담사 생산성 통계", value: "agProdt"});
        menuList.push({text: "상담사 스킬 통계", value: "agSkill"});
		 $("[data-ax5select='menuSelect']").ax5select({
		        theme: 'primary',
		        options: menuList,
		        onChange: function () {
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
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
        	showRowSelector: false,
            frozenColumnIndex: 0,
            multipleSelect: false,
            showLineNumber:false,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [            	
            	{key: "seq", label: "번호", width: 50, align: "center", sortable: true},
            	{key: "sgroup", label: "항목헤더", width: 120, align: "center", editor: "text"},
            	{key: "asname", label: "영문항목명", width: 180, align: "center"},
                {key: "hanname", label: "한글항목명", width: 180, align: "center"},                
                {key: "use_yn", label: "사용여부", width: 80, align: "center", editor: "checkYn"}
                
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                    },          
            }
        });
        
        axboot.buttonClick(this, "data-grid-view-01-btn", {
        	"allselect": function () {
        		this.target.list.forEach(function (n){
        			n.use_yn = "N";
        			n.use_yn = "Y";
        			
        			n.__modified__ = true;
        		});
        		this.target.repaint();
            },
            "allxselect": function () {
        		this.target.list.forEach(function (n){
        			n.use_yn = "N";
        			
        			n.__modified__ = true;
        		});
        		this.target.repaint();
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
    }
});