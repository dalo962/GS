var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {        
    	axboot.ajax({
            type: "GET",
            cache: false,
            url: "/api/ivr/ivrDnisTimeList/DnisListSearch",
            data: "",
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
    	caller.gridView01.addRow();
    },   
    PAGE_SAVE: function (caller, act, data) {
    	var saveList = [].concat(caller.gridView01.getData());
    	saveList = saveList.concat(caller.gridView01.getData("deleted"));
    	    	
    	var reqExp = /^[0-9]*$/;
    	var reqExp2 = /^\d{6}$/;
    	var wkdnis = 0;
    	var wkuseyn = 0;
    	var wklcuseyn = 0;
    	var wknumber = 0;    	
    	var wknumber2 = 0;
    	saveList.forEach(function (n){
    		if(n.dnis == null || n.dnis == "")
    		{
    			wkdnis = wkdnis + 1;
    		}
    		if(n.useyn == null || n.useyn == "")
    		{
    			wkuseyn = wkuseyn + 1;
    		}
    		if(n.lc_useyn == null || n.lc_useyn == "")
    		{
    			wklcuseyn = wklcuseyn + 1;
    		}
    		/*
    		if(reqExp.test(n.dnis) == false 
    		  || reqExp.test(n.wr_stime) == false  || reqExp.test(n.wr_etime) == false
    		  || reqExp.test(n.lc_stime) == false  || reqExp.test(n.lc_etime) == false
    		  || reqExp.test(n.sat_stime) == false || reqExp.test(n.sat_etime) == false
    		  || reqExp.test(n.sun_stime) == false || reqExp.test(n.sun_etime) == false
    		  || reqExp.test(n.hl_stime) == false  || reqExp.test(n.hl_etime) == false)
    		{
    			wknumber = wknumber + 1;
    		}
    		if(  reqExp2.test(n.wr_stime) == false  || reqExp2.test(n.wr_etime) == false
    	      || reqExp2.test(n.lc_stime) == false  || reqExp2.test(n.lc_etime) == false
    	      || reqExp2.test(n.sat_stime) == false || reqExp2.test(n.sat_etime) == false
    	      || reqExp2.test(n.sun_stime) == false || reqExp2.test(n.sun_etime) == false
    	      || reqExp2.test(n.hl_stime) == false  || reqExp2.test(n.hl_etime) == false)
    	    {
    			wknumber2 = wknumber2 + 1;
    	    }*/
    	});
    	if(wkdnis > 0) 
    	{ 
    		alert("??????????????? ??????????????? ????????????."); 
    		return;
    	}
    	if(wkuseyn > 0) 
    	{ 
    		alert("???????????? ??????????????? ??????????????? ????????????."); 
    		return;
    	}
    	if(wklcuseyn > 0) 
    	{ 
    		alert("???????????? ??????????????? ??????????????? ????????????."); 
    		return;
    	}
    	if(wknumber > 0) 
    	{ 
    		alert("??????????????? ????????? ??????????????? ????????????."); 
    		return;
    	}
    	if(wknumber2 > 0) 
    	{ 
    		alert("??????????????? HH24MISS???????????? ??????????????? ????????????."); 
    		return;
    	}

    	axDialog.confirm({
    		title:"??????",
            msg: "?????????????????????????" // ???????????? ????????? ??????
        }, function () {
            if (this.key == "ok") {
		    	axboot.ajax({
		            type: "POST",
		            cache: false,
		            url: "/api/ivr/ivrDnisTimeList/DnisListSave",
		            data: JSON.stringify(saveList),
		            callback: function (res) {
		            	alert(res.message);
		            	axToast.push("?????? ???????????????.");		            	
		            	ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		            },
		            options: {
		                onError: function (err) {
		                    alert("?????? ????????? ?????????????????????");
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
    }
});

var CODE = {};

// fnObj ?????? ?????? ???????????? ????????????
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
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.EXCEL_EXPORT);
            },
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
    }
});

/**
 * gridView
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
            	{key: "dnis", label: "????????????", width: 150, align: "center", sortable: true, editor: {
            		type: "text", disabled:function(){
        				var dis = "";
        				if(typeof this.item["crt_dt"] != null && this.item["crt_dt"] != "" && this.item["crt_dt"] != undefined)
        				{
        					dis = true
        				}
        				else
        				{
        					dis = false;
        				}
        				return dis;
        			}
            	}}, 
                {key: "useyn", label: "???????????? ????????????", width: 140, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "0", text: "?????????"},
                			{value: "1", text: "???-???"},
                			{value: "2", text: "???-???"},
                			{value: "3", text: "???-???"},
                			{value: "4", text: "???-???(????????????)"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.useyn) {
                		case "0":
            				return "?????????";
            			break;
                		case "1":
            				return "???-???";
            				break; 	
                		case "2":
                			return "???-???";
                			break;       
                		case "3":
                			return "???-???";
                			break;   
                		case "4":
                			return "???-???(????????????)";
                			break;   
                		default :
                			return "??????";
                			break;
                	}
                }},
                {key: "wr_stime", label: "???????????? ????????????", width: 140, align: "center", sortable: true, editor:"text"},
                {key: "wr_etime", label: "???????????? ????????????", width: 140, align: "center", sortable: true, editor:"text"}, 
                {key: "lc_useyn", label: "???????????? ????????????", width: 140, align: "center", sortable: true, editor: {
                	type: "select", config: {
                		columnKeys: {
                			optionValue: "value", optionText: "text"
                		},
                		options: [
                			{value: "0", text: "?????????"},
                			{value: "1", text: "???-???"},
                			{value: "2", text: "???-???"},
                			{value: "3", text: "???-???"},
                			{value: "4", text: "???-???(????????????)"}
                    	]
                	}
                }, formatter: function() {
                	switch(this.item.lc_useyn) {
                		case "0":
                			return "?????????";
                			break; 	
                		case "1":
	        				return "???-???";
	        				break; 	
	            		case "2":
	            			return "???-???";
	            			break;       
	            		case "3":
	            			return "???-???";
	            			break;   
	            		case "4":
	            			return "???-???(????????????)";
	            			break;                 		
                		default :
                			return "??????";
                			break;
                	}
                }},
                {key: "lc_stime", label: "?????? ????????????", width: 140, align: "center", sortable: true, editor:"text"},
                {key: "lc_etime", label: "?????? ????????????", width: 140, align: "center", sortable: true, editor:"text"},                
                {key: "sat_stime", label: "??????????????? ????????????", width: 150, align: "center", sortable: true, editor:"text"},
                {key: "sat_etime", label: "??????????????? ????????????", width: 150, align: "center", sortable: true, editor:"text"},                
                {key: "sun_stime", label: "??????????????? ????????????", width: 150, align: "center", sortable: true, editor:"text"},
                {key: "sun_etime", label: "??????????????? ????????????", width: 150, align: "center", sortable: true, editor:"text"},
                {key: "hl_stime", label: "???????????? ????????????", width: 150, align: "center", sortable: true, editor:"text"},
                {key: "hl_etime", label: "???????????? ????????????", width: 150, align: "center", sortable: true, editor:"text"},                                
                {key: "crt_dt", label: "????????????", width: 180, align: "center", sortable: true,
                	formatter: function() {
                		var crdt = "";
                		if(this.item.crt_dt != null)
                		{
                			crdt = this.item.crt_dt.substr(0,4) + "-" + this.item.crt_dt.substr(4,2) + "-" + this.item.crt_dt.substr(6,2) + 
                			" " + this.item.crt_dt.substr(8,2) + ":" + this.item.crt_dt.substr(10,2) + ":" + this.item.crt_dt.substr(12,2)
                		}
                		return crdt;
                }},
                {key: "crt_by", label: "?????????", width: 150, align: "center", sortable: true},
                {key: "upt_dt", label: "????????????", width: 180, align: "center", sortable: true, 
                	formatter: function() {
                		var updt = "";
                		if(this.item.upt_dt != null)
                		{
                			updt = this.item.upt_dt.substr(0,4) + "-" + this.item.upt_dt.substr(4,2) + "-" + this.item.upt_dt.substr(6,2) +
                			" " + this.item.upt_dt.substr(8,2) + ":" + this.item.upt_dt.substr(10,2) + ":" + this.item.upt_dt.substr(12,2)
                		}
                		return updt;
                }},
                {key: "upt_by", label: "?????????", width: 150, align: "center", sortable: true}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
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
                return this.dnis;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true, wr_stime:"000000", wr_etime:"000000", lc_stime:"000000", lc_etime:"000000", sat_stime:"000000", sat_etime:"000000", sun_stime:"000000", sun_etime:"000000", hl_stime:"000000", hl_etime:"000000"}, "last");
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
    	this.target.exportExcel("????????????_??????.xls");
    }
});