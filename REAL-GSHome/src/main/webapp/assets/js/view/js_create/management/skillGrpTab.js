var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
	PAGE_SAVE: function (caller, act, data) {
		var checklist = caller.gridView01.getData("selected");
		var skillLevel = $(":input:radio[name=chkLvl]:checked").val();		
		
		if(checklist.length == 0)
    	{
    		alert("스킬을 선택하세요.");
    		return;
    	}
				
		checklist.forEach(function(n, index)
	    {
			n.skillLevel = skillLevel;		
		});
				
		axDialog.confirm({
			title:"확인",
            msg: "저장하시겠습니까?" // 여기까지 추가한 소스
        }, function () {
     	   	if (this.key == "ok") 
     	   	{	
     	   		axboot.ajax({
     	   			type: "POST",
     	   			url: "/api/mng/skillGrpMng/saveSkGrpSk",
     	   			cache : false,
     	   			data: JSON.stringify(checklist),
     	   			callback: function (res){
     	   				alert("저장 되었습니다.");
     	   				fnObj.pageStart();
     	   			},
 		            options: {
 		                onError: function (err) {
 		                    alert("저장 작업에 실패하였습니다");
 		                    fnObj.pageStart();
 		                }
 		            }
     	   		});
     	   	}
        });
		
    },
	PAGE_CLOSE: function (caller, act, data) {		
		parent.axboot.modal.close();
		parent.axboot.modal.callback(data);
    },
    EXCEL_EXPORT: function (caller, act, data) {
        caller.gridView01.exportExcel();
    }
});

var CODE = {};
var aglist = [];
var data = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
    
    var grpnm = document.getElementById("skgnm");
    
    data.skGrpId = parent.axboot.modal.getData().grpid;
    
    grpnm.innerText = parent.axboot.modal.getData().skgname;
    
    axboot
    .call({
        type:"POST",
        url: "/api/mng/skillGrpMng/selectSkGrpSk",
        cache : false,
        data: JSON.stringify($.extend({}, data)),
        callback: function (res) {
        	aglist = res;
        }
    })
    .done(function () {
    	_this.pageButtonView.initView();
        _this.gridView01.initView();
        _this.gridView01.setData(aglist);
    });
};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
            },
        });
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
	initView: function () {
		 var _this = this;
		 
		 var Columns = [];
		 
		 Columns.push({key: "sklvl", label: "스킬레벨", width: 160, align: "center", sortable: true, formatter:function(){
	 			if(this.value == 99)
				{
					return "분배 제외"
				}
	 			else
	 			{
	 				return this.value;
	 			}
		 }});		 
		 Columns.push({key: "sknm", label: "스킬", width: 300, align: "center", sortable: true});
		 
		 this.target = axboot.gridBuilder({
	        	showRowSelector: true,
	            frozenColumnIndex: 0,
	            multipleSelect: true,
	            showLineNumber:true,
	            target: $('[data-ax5grid="grid-view-01"]'),
	            columns: Columns,                  		            
	            body: {
	                onClick: function () {
	                    this.self.select(this.dindex, {selectedClear: true});
	                }
	            }
	        });
    },
    getData: function (_type) {
    	var _list = this.target.getList(_type);
        return _list;
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
    	this.target.exportExcel("스킬그룹_보유스킬.xls");
    }
});