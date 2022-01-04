var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "POST",
            url: "/api/mng/ctiMapAgentOrg/selectAgentDetail",
            cache : false,
            data: JSON.stringify(caller.searchView.getData()),
            callback: function (res) {
            	console.log("PAGE_SEARCH selectAgentOrg callback " );
            	caller.treeView01.treeSearch();
                caller.gridView01.setData(res);
                caller.formView01.clear();
            }
        });
        
        return false;
    },
    PAGE_SAVE: function (caller, act, data) {
        //var formData = caller.gridView01.getData();
    	var treeObj = {
            list: caller.treeView01.getData(),
            deletedList: caller.treeView01.getDeletedList()
        };
        
        var gridObj = {
                list: caller.gridView01.getData(),
                deletedList: caller.gridView01.getData("deleted")
            };
        
        var formData = caller.formView01.getData();
        if($("#__modified__").val()){
        	formData.__modified__ = true;
        }else{
        	formData.__modified__ = false;
        }
        gridObj.list.push(formData);
        //console.log("formData.id : " + formData.id + " / formData.name : " + formData.name + " / formData.__modified__ : " + formData.__modified__);

        axboot
            .call({
                type: "POST",
                url: "/api/mng/ctiMapAgentOrg/saveAgentOrg",
                cache : false,
                data: JSON.stringify(treeObj),
                callback: function (res) {
                    caller.treeView01.clearDeletedList();
                }
            })
            .call({
                type: "POST",
                url: "/api/mng/ctiMapAgentOrg/saveAgentDetail",
                cache : false,
                data: JSON.stringify(gridObj),
                callback: function (res) {
                    //caller.treeView01.clearDeletedList();
                }
            })
            .done(function () {
                	caller.treeView01.treeSearch();
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            });
    },
    PAGE_EXCEL: function (caller, act, data){
    	caller.gridView01.exportExcel();
    },
    TREEITEM_CLICK: function (caller, act, data) {
        if(data.__created__){
            if (confirm(LANG("ax.script.menu.save.confirm"))) {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            }
            return;
        }

    	var form_mod = $("#__modified__").val();
    	var grid_mod = caller.gridView01.getData("modified");
        if(form_mod == "true" || grid_mod.length > 0){
            if (confirm("수정된 정보가 존재합니다. 저장 후 선택 가능합니다.\n저장하시겠습니까?")) {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            }
            return;
        }

        caller.formView01.clear();
    	caller.searchView.setData(data);
        
        axboot.ajax({
            type: "POST",
            url: "/api/mng/ctiMapAgentOrg/selectAgent",
            cache : false,
            data: JSON.stringify(data),
            callback: function (res) {
            	caller.formView01.setData(res.list[0]);
            }
        });
        
        axboot.ajax({
            type: "POST",
            url: "/api/mng/ctiMapAgentOrg/selectAgentDetail",
            cache : false,
            data: JSON.stringify(data),
            callback: function (res) {
                caller.gridView01.setData(res);
            }
        });
        
    },
    TREE_ROOTNODE_ADD: function (caller, act, data) {
        //caller.treeView01.addRootNode();
   	 	axboot.modal.open({
            modalType: "CTI_COMP_MODAL",
            //param: param,
            sendData: function () {
                return {"data":$.extend({}, data)};
            },
            callback: function (data) {
                this.close();
            }
        });
    },
    ITEM_DEL: function (caller, act, data) {
        caller.gridView01.delRow("selected");
        
    }
});
var CODE = {};
var info = {};

var flgnum = 1;

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
    
    $("input[type=text]").keypress(function(e){
		if(e.keyCode == 13){
			ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
		}
	});
    
	_this.pageButtonView.initView();
	_this.searchView.initView();
	_this.treeView01.initView();
	_this.gridView01.initView();
    _this.formView01.initView();

	 
	axboot.ajax({
    	type: "POST",
	    url: "/api/statLstMng/userAuthLst",
	    cache : false,
	    data: "",
	    callback: function (res) {
	    	res.forEach(function (n){
	    		info.grpcd = n.grp_auth_cd;
	    		info.comcd = n.company_cd;
	    		info.cencd = n.center_cd;
	    		info.teamcd = n.team_cd;
	    		info.chncd = n.chn_cd;
	    		info.dispyn = n.disp_use_yn;
	    	});
		    /* 소속 리스트조회 후 셋팅하는 부분 */ 
			axboot.ajax({
			    type: "POST",
			    url: "/api/mng/searchCondition/company",
			    cache : false,
			    data: JSON.stringify($.extend({}, info)),
			    callback: function (res) {
			        var resultSet = [];
			        res.list.forEach(function (n) {
			        	resultSet.push({
			                value: n.id, text: n.name,
			            });
			        });
			        $("[data-ax5select='selCompany']").ax5select({
				        theme: 'primary',
				        onStateChanged: function () {
				        	_this.searchView.partSearch();
				        },
				        options: resultSet,
			        });
			        _this.searchView.partSearch();
			    	_this.treeView01.treeSearch();
			    }
			});
	    }
    });
};

fnObj.pageResize = function () {

};


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "save": function () {
            	axDialog.confirm({
            		title:"확인",
                    msg: "저장하시겠습니까?" // 여기까지 추가한 소스
                }, function () {
                    if (this.key == "ok") {
                        ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
                    }
                });
            },
            "excel": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_EXCEL);
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
    },
    setData: function (data){
    	$("[data-ax5select='selCompany']").ax5select("setValue", data.compId);
    },
    getData: function () {
        var data = {}; 
        
        var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        var partId = $("[data-ax5select='selPart']").ax5select("getValue")[0].value;
        var id = $("[data-ax5select='selTeam']").ax5select("getValue")[0].value;
        var agroupName = $("#agroupName").val();
        //console.log("compId :" + compId + "partId : " + partId + "id : " + id + "agroupName : " + agroupName);
        
        data.compId = compId;
        data.partId = partId;
        data.id = id;
        data.agroupName = agroupName;
        if (id != null && id !="" && id != "undefined"){
        	data.orgLevel = '2';
        }
        return $.extend({}, data)
    },
    partSearch: function(){

    	//console.log("compId : " + $("[data-ax5select='selCompany']").ax5select("getValue")[0].value);
        var data = {}; 
        data.grpcd = info.grpcd;
        data.dispyn = info.dispyn;
        data.cencd = info.cencd;
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/part",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002"){
                    resultSet.push({value:"", text:"전체"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name,
                    });
                });
                $("[data-ax5select='selPart']").ax5select({
        	        theme: 'primary',
    		        onStateChanged: function () {
    		        	fnObj.searchView.teamSearch();
    		        },
        	        options: resultSet,
                });
	        	$("[data-ax5select='selPart']").ax5select("setValue", $("#partId").val());
                fnObj.searchView.teamSearch();
            }
        });
    },
    teamSearch: function(){
    	//console.log("compId : " + $("[data-ax5select='selCompany']").ax5select("getValue")[0].value);
    	//console.log("partId : " + $("[data-ax5select='selPart']").ax5select("getValue")[0].value);
        var data = {}; 
        data.grpcd = info.grpcd;
        data.dispyn = info.dispyn;
        data.teamcd = info.teamcd;
        data.compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        data.partId = $("[data-ax5select='selPart']").ax5select("getValue")[0].value;
	    axboot.ajax({
            type: "POST",
            url: "/api/mng/searchCondition/team",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
                var resultSet = [];
                if(data.grpcd == "S0001" || data.grpcd == "S0002"){
                    resultSet.push({value:"", text:"전체"});                	
                }
                res.list.forEach(function (n) {
                	resultSet.push({
                        value: n.id, text: n.name,
                    });
                });
                $("[data-ax5select='selTeam']").ax5select({
        	        theme: 'primary',
    		        onStateChanged: function () {
//    		        	fnObj.searchView.agentSearch();
    		        },
        	        options: resultSet,
                });
	        	$("[data-ax5select='selTeam']").ax5select("setValue", $("#id").val());
//	        	fnObj.searchView.agentSearch();
            }
        });
    }
});


/**
 * treeView
 */
fnObj.treeView01 = axboot.viewExtend(axboot.treeView, {
    param: {},
    deletedList: [],
    newCount: 0,
    addRootNode: function () {
        var _this = this;
        var nodes = _this.target.zTree.getSelectedNodes();
        var treeNode = nodes[0];

        // root
        treeNode = _this.target.zTree.addNodes(null, {
            id: "_isnew_" + (++_this.newCount),
            pId: 0,
            name: "New Item",
            __created__: true,
            //menuGrpCd: _this.param.menuGrpCd
        });

        if (treeNode) {
            _this.target.zTree.editName(treeNode[0]);
        }
        fnObj.treeView01.deselectNode();
    },
    initView: function () {
        var _this = this;

        $('[data-tree-view-01-btn]').click(function () {
            var _act = this.getAttribute("data-tree-view-01-btn");
            switch (_act) {
                case "add":
                    ACTIONS.dispatch(ACTIONS.TREE_ROOTNODE_ADD); 
                    break;
                case "delete":
                    //ACTIONS.dispatch(ACTIONS.ITEM_DEL);
                    break;
            }
        });

        this.target = axboot.treeBuilder($('[data-z-tree="tree-view-01"]'), {
            view: {
                dblClickExpand: false,
                addHoverDom: function (treeId, treeNode) {
//                    console.log("addHoverDom + orgLevel : " + treeNode.orgLevel + " / parentId : " + treeNode.parentId);
                    var sObj = $("#" + treeNode.tId + "_span");
                    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                        + "' title='add node' onfocus='this.blur();'></span>";
                    sObj.after(addStr);
                    var btn = $("#addBtn_" + treeNode.tId);
                    if (btn) {
                        btn.bind("click", function () {
                            _this.target.zTree.addNodes(
                                treeNode,
                                {
                                    id: "_isnew_" + (++_this.newCount),
                                    pId: treeNode.id,
                                    name: "New Item",
                                    //orgLevel: String(parseInt(treeNode.orgLevel)+1),
                                    parentId: treeNode.id,
                                    __created__: true,
                                    //menuGrpCd: _this.param.menuGrpCd
                                }
                            );
                            //console.log("orgLevel : " + treeNode.orgLevel + " / parentId : " + treeNode.parentId);
                            _this.target.zTree.selectNode(treeNode.children[treeNode.children.length - 1]);
                            _this.target.editName();
                            fnObj.treeView01.deselectNode();
                            return false;
                        });
                    }
                },
                removeHoverDom: function (treeId, treeNode) {
                	var btn = $("#addBtn_" + treeNode.tId).unbind().remove();
                    
                }
            },
            edit: {
                enable: true,
                editNameSelectAll: true
            },
            callback: {
                beforeDrag: function (treeId, treeNodes) {
                	if(typeof treeNodes != "undefined"){
                        treeNodes.forEach(function (n) {
                        	//console.log("treeView01 beforeDrag id : " + n.id);
                        	n.__modified__ = true; 
                        });
                		return true;
                	}
                	return false;
                },
                onClick: function (e, treeId, treeNode, isCancel) {
                	//console.log(e.toString() + " / treeId : " + treeId + '/ treeNode.compId : ' + treeNode.compId+ '/ treeNode.partId : ' + treeNode.partId + '/ treeNode.id : ' + treeNode.id);
                    ACTIONS.dispatch(ACTIONS.TREEITEM_CLICK, treeNode);
                },
                onRename: function (e, treeId, treeNode, isCancel) {
                	if(!isCancel){
                        treeNode.__modified__ = true;                		
                	}
                },
                onRemove: function (e, treeId, treeNode, isCancel) {
                    treeNode.__deleted__ = true;
                    _this.deletedList.push(treeNode);
                    fnObj.treeView01.deselectNode();
                }
            }
        }, []);
    },
    treeSearch: function (){
    	var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
    	
    	var partId = "";
    	if(flgnum == 1)
    	{
    		partId = "";
    		flgnum = 0;
    	}
    	else
    	{
    		partId = $("[data-ax5select='selPart']").ax5select("getValue")[0].value;
    	}
    	
        var data = {}; 
        data.compId = compId;
        data.partId = partId;
        axboot.ajax({
            type: "POST",
            url: "/api/mng/ctiMapAgentOrg/selectAgentOrg",
            cache : false,
            data: JSON.stringify($.extend({}, data)),
            callback: function (res) {
            	fnObj.treeView01.setData("", res.list, "");
            }
        });
    },
    setData: function (_searchData, _tree, _data) {
        this.param = $.extend({}, _searchData);
        this.target.setData(_tree);
        if (_data && typeof _data.id != "undefined") {
            // selectNode
            (function (_tree, _keyName, _key) {
                var nodes = _tree.getNodes();
                var findNode = function (_arr) {
                    var i = _arr.length;
                    while (i--) {
                        if (_arr[i][_keyName] == _key) {
                            _tree.selectNode(_arr[i]);
                        }
                        if (_arr[i].children && _arr[i].children.length > 0) {
                            findNode(_arr[i].children);
                        }
                    }
                };
                findNode(nodes);
            })(this.target.zTree, "id", _data.id);
        }
    },
    getData: function () {
        var _this = this;
        var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        var tree = this.target.getData();

        var convertList = function (_tree) {
            var _newTree = [];
            var tempCompSort = "";
            _tree.forEach(function (n, nidx) {
                var item = {};
                var tempParentId = "";
                var tempCompId = "";
                var tempSort = "";
                if(n.getParentNode() != null && typeof n.getParentNode() != "undefined"){
                	tempParentId = n.getParentNode().id;
                	//console.log("[parent] id : " + tempParentId + " / name = " + n.getParentNode().name);
                	//console.log("[child ] id : " + n.id + " / name = " + n.name);

                }else{
                	tempParentId = null;
                }
                
                if(n.level == "0"){
                	tempCompId = n.id;
                	if(n.__created__){
                    	tempSort = Number(tempCompSort) + Number(nidx);
                	}else{
                        if(nidx == "0"){
                        	tempCompSort = n.sort
                        }
                    	tempSort = n.sort;
                	}
                }else{
                	tempCompId = compId;
                	tempSort = nidx;
                }
                
                if (n.__created__ || n.__modified__) {
                	item = {
                			__created__: n.__created__,
                			__modified__: n.__modified__,
                            id: n.id,
                            name: n.name,
                            compId: tempCompId,
                            parentId: tempParentId,
                            preParentId : n.parentId,
                            sort: tempSort,
                            preSort: n.sort,
                            orgLevel: n.level,
                            preOrgLevel: n.orgLevel,
                            multiLanguageJson: n.multiLanguageJson
                	};
                } else {
                    item = {
                            id: n.id,
                            name: n.name,
                            compId: tempCompId,
                            parentId: tempParentId,
                            preParentId : n.parentId,
                            sort: tempSort,
                            preSort: n.sort,
                            orgLevel: n.level,
                            preOrgLevel: n.orgLevel,
                            multiLanguageJson: n.multiLanguageJson
                    };
                }
                if (n.children && n.children.length) {
                    item.children = convertList(n.children);
                }
                _newTree.push(item);
            });
            return _newTree;
        };
        var newTree = convertList(tree);
        return newTree;
    },
    getDeletedList: function () {
        var _this = this;
        var compId = $("[data-ax5select='selCompany']").ax5select("getValue")[0].value;
        var tree = _this.deletedList;

        var convertList = function (_tree) {
            var _newTree = [];
            _tree.forEach(function (n, nidx) {
            	if(!n.__created__){
	                var tempCompId = "";
	                if(n.level == "0"){
	                	tempCompId = n.id;
	                }else{
	                	tempCompId = compId;
	                }
	                var item = {};
	                item = {
	                    id: n.id,
	                    name: n.name,
	                    compId:tempCompId,
	                    parentId : n.parentId,
	                    preParentId : n.parentId,
	                    sort: nidx,
	                    orgLevel: n.level,
	                    multiLanguageJson: n.multiLanguageJson
	                };
	                if (n.children && n.children.length) {
	                    item.children = convertList(n.children);
	                }
	                _newTree.push(item);
            	}
            });
            return _newTree;
        };
        var newTree = convertList(tree);
        return newTree;
        //return this.deletedList;
    },
    clearDeletedList: function () {
        this.deletedList = [];
        return true;
    },
    updateNode: function (data) {
        var treeNodes = this.target.getSelectedNodes();
        if (treeNodes[0]) {
            treeNodes[0].progCd = data.progCd;
        }
    },
    deselectNode: function () {
        ACTIONS.dispatch(ACTIONS.TREEITEM_DESELECTE);
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
            sortable: true,
            multipleSelect: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
            	// 그냥 키로 생성만 안해주면 화면에 안보이고 데이터는 가지고 있는다.
                {key: "compName", label: "소속", width: 150, align: "center"},
                {key: "partName", label: "센터", width: 250, align: "center"},
                {key: "name", label: "업무 팀", width: 300, align: "center"},
                {key: "agroupDbid", label: "CTI AG DBID", width: 100, align: "center", editor: "text"},
                {key: "agroupName", label: "CTI 그룹명", width: 250, align: "center", editor: "text"}
                /// --> 이것들을 list로 담아서  [PUT] "/api/v2/menu/auth"
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex);
                }
            }
        });

        axboot.buttonClick(this, "data-grid-view-01-btn", {
            "delete": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_DEL); 
            }
        });
    },
    getData: function (_type) {
        var _list = this.target.getList(_type);
        return _list;
    },
    exportExcel: function () {
    	this.target.exportExcel("상담사팀_CTI_매핑.xls");
    	//this.target.exportExcelXlsx("상담사그룹 CTI매핑");
    }
});


/**
 * formView01
 */
fnObj.formView01 = axboot.viewExtend(axboot.formView, {
    getDefaultData: function () {
        return $.extend({}, axboot.formView.defaultData, {});
    },
    initView: function () {
        var _this = this;
        this.target = $("#formView01");
        this.model = new ax5.ui.binder();
        this.model.setModel(this.getDefaultData(), this.target);
        this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
        this.initEvent();
        
        $("input:text").change(function(){
        	fnObj.formView01.updateData();
        });
        
        this.target.on("click", function(){
        	if($("#compId").val() == ""){
        		alert("수정할 항목을 먼저 선택하여 주세요.");
        	}
        });
        
        this.target.on("change keyup", function(){
        	if($("#compId").val() == ""){
        		alert("수정할 항목을 먼저 선택하여 주세요.");
        	}else{
        		$("#__modified__").val(true);
        	}
        });
        
    },
    initEvent: function () {
        var _this = this;
    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
        return data;
    },
    setData: function (data) {
    	if(typeof data !="undefined"){
	    	if(data.orgLevel < 2){
	    		$("#compId").val(data.compId);
	    		$("#partId").val(data.partId);
	        	this.model.setModel(data);
	    	}else{
	    		this.clear();
	    		$("#compId").val(data.compId);
	    		$("#partId").val(data.partId);
	    		$("#id").val(data.id);
	        	this.model.setModel(data);
	    	}
    	}
    },
    updateData: function () {
    	if($("#compId").val() == ""){
    		alert("수정할 항목을 먼저 선택하여 주세요.");
    	}else {
        	$("#__modified__").val(true);
    	}
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
		$("#partId").val("");
		$("#id").val("");
    	$("#__modified__").val("");
        this.model.setModel(this.getDefaultData());
    }
});