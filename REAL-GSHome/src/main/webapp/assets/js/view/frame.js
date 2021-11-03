var fnObj = {};
var info = {};
var sockInfo = {};

var agent = navigator.userAgent.toLowerCase();

var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {

        return false;
    },
    TOGGLE_ASIDE: function (caller, act, data) {
        caller.frameView.toggleAside();
    },
    MENU_OPEN: function (caller, act, data) {
        caller.tabView.open(data);
    },
    TOGGLE_FULLSCREEN: function (caller, act, data) {
        caller.frameView.toggleFullScreen();
    }
});


// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {

    axboot.def["DEFAULT_TAB_LIST"][0].progNm = "HOME";
    axboot.def["DEFAULT_TAB_LIST"][0].menuNm = "HOME";   

    
    var convertMenuItems = function(list){
        var _list = [];
        list.forEach(function (m) {
            var item = $.extend({}, m);
            if(item.hasChildren = (item.children && item.children.length)){
                item.children = convertMenuItems(item.children);
            }
            if(item.multiLanguageJson && item.multiLanguageJson[SCRIPT_SESSION.details.language]){
                item.name = item.multiLanguageJson[SCRIPT_SESSION.details.language];
            }
            _list.push(item);
        });
        return _list;
    };
    this.menuItems = convertMenuItems(TOP_MENU_DATA);
    this.menuItems[0].open = true;

    this.topMenuView.initView();
    this.frameView.initView();
    this.tabView.initView();
    this.activityTimerView.initView();
    
    //alert(COL("ax.admin.server.location"));
    //plugins.min.js
    //# sourceMappingURL=plugins.min.js.map 

    // 인터넷 브라우져 확인
    if(agent.indexOf("chrome") == -1) 
    {
    	alert("Internet Brower Chrome에 최적화 되어 있습니다.\n타 Brower에서는 비정상적으로 동작할 수 있습니다.");
    	return;
    }
    
    axboot.ajax({
        type: "POST",
        url: "/api/mng/searchCondition/sockInfo",
        cache : false,
        data: JSON.stringify($.extend({}, info)),
        callback: function (res) {
            //var socketInfo = [];
            res.list.forEach(function (n) {
            	sockInfo[n.code] = n.name;
            });
        }
    });    
};

fnObj.pageResize = function () {
    this.tabView.resize();
};

//==== 뷰들 시작
/**
 * frameView
 */
fnObj.util = {
    convertList2Tree: function (_list, _childrenKey) {
        _list = JSON.parse(JSON.stringify(_list));

        var childKey = "_id";
        var parentKey = "_pid";
        var childrenKey = _childrenKey || "children";
        var firstItemLabel = ' <i class="cqc-chevron-down"></i>';
        var seq = 0;
        var hashDigit = 3;
        var tree = [];
        var pointer = {};
        for (var i = 0, l = _list.length; i < l; i++) {
            pointer[_list[i][childKey]] = i;
            if (_list[i][parentKey] == "__root__") {
                var item = _list[i];
                item.pHash = ax5.util.setDigit("0", hashDigit);
                item.hash = ax5.util.setDigit("0", hashDigit) + "_" + ax5.util.setDigit(seq, hashDigit);

                var pushItem = {
                    name: item.label,
                    label: item.label + firstItemLabel,
                    pHash: ax5.util.setDigit("0", hashDigit),
                    hash: ax5.util.setDigit("0", hashDigit) + "_" + ax5.util.setDigit(seq, hashDigit),
                    data: {
                        label: item.label,
                        url: item.url,
                        target: item.target,
                        id: item._id
                    },
                    __subTreeLength: 0
                };
                pushItem[childrenKey] = [];

                tree.push(pushItem);
                seq++;
            }
        }
        for (var i = 0, l = _list.length; i < l; i++) {
            if (_list[i][parentKey] != "__root__") {
                var item = _list[i];

                var pItem = _list[pointer[item[parentKey]]];
                var pHash = pItem["hash"];
                var pHashs = pHash.split(/_/g);
                var pTree = tree;
                var pTreeItem;
                var __subTreeLength = (typeof pItem.__subTreeLength !== "undefined") ? pItem.__subTreeLength : 0;

                pHashs.forEach(function (T, idx) {
                    if (idx > 0) {
                        pTreeItem = pTree[Number(T)];
                        pTree = pTree[Number(T)][childrenKey];
                    }
                });

                item[childrenKey] = [];
                item["pHash"] = pHash;
                item["hash"] = pHash + "_" + ax5.util.setDigit(__subTreeLength, hashDigit);

                var pushItem = {
                    name: item.label,
                    label: item.label,
                    pHash: pHash,
                    hash: pHash + "_" + ax5.util.setDigit(__subTreeLength, hashDigit),
                    data: {
                        label: item.label,
                        url: item.url,
                        target: item.target,
                        id: item._id
                    }
                };
                pushItem[childrenKey] = [];
                pTree.push(pushItem);

                if (typeof pItem.__subTreeLength === "undefined") pItem.__subTreeLength = 1;
                else pItem.__subTreeLength++;

                pTreeItem.__subTreeLength = pItem.__subTreeLength;
            }
        }
        return tree;
    }
};

fnObj.frameView = axboot.viewExtend({
    initView: function () {
        this.target = $("#ax-frame-root");
        this.asideHandle = $("#ax-aside-handel");
        this.aside = $("#ax-frame-aside");
        this.asideHandle.on("click", function () {
            ACTIONS.dispatch(ACTIONS.TOGGLE_ASIDE);
        });

        this.fullScreenHandle = $("#ax-fullscreen-handel");
        this.fullScreenHandle.on("click", function () {
            ACTIONS.dispatch(ACTIONS.TOGGLE_FULLSCREEN);
        });

        if (this.aside.get(0)) {
            this.asideView.initView();
            this.asideView.print();
        }
    },
    toggleAside: function () {
        this.target.toggleClass("show-aside");
    },
    toggleFullScreen: function () {
        if (this.target.hasClass("full-screen")) {
            this.target.removeClass("full-screen");
        } else {
            this.target.addClass("full-screen");
            this.target.removeClass("show-aside");
        }

    },
    asideView: axboot.viewExtend({
        initView: function () {
            this.tmpl = $('[data-tmpl="ax-frame-aside"]').html();
        },
        print: function () {
            var menuItems = fnObj.menuItems;
            this.openedIndex = 0;

            fnObj.frameView.aside
                .html(ax5.mustache.render(this.tmpl, {items: menuItems}))
                .on("click", '[data-label-index]', function () {
                    var index = this.getAttribute("data-label-index");
                    if (menuItems[index].children && menuItems[index].children.length) {
                        fnObj.frameView.asideView.open(index);
                    } else {
                        if (menuItems[index].program) {
                            ACTIONS.dispatch(ACTIONS.MENU_OPEN, $.extend({}, menuItems[index].program, {menuId: menuItems[index].menuId, menuNm: menuItems[index].menuNm}));
                        }
                    }
                });

            menuItems.forEach(function (n, nidx) {
                var $treeTarget = fnObj.frameView.aside.find('[data-tree-holder-index="' + nidx + '"]');
                if ($treeTarget.get(0)) {
                    var treeTargetId = $treeTarget.get(0).id;
                    $.fn.zTree.init(
                        $treeTarget,
                        {
                            view: {
                                dblClickExpand: false
                            },
                            callback: {
                                onClick: function (event, treeId, treeNode, clickFlag) {
                                    var zTree = $.fn.zTree.getZTreeObj(treeTargetId);
                                    zTree.expandNode(treeNode);

                                    if (treeNode.program) {

                                        var menuNm = treeNode.menuNm;
                                        if(treeNode.multiLanguageJson && treeNode.multiLanguageJson[SCRIPT_SESSION.details.language]){
                                            menuNm = treeNode.multiLanguageJson[SCRIPT_SESSION.details.language];
                                        }

                                        ACTIONS.dispatch(ACTIONS.MENU_OPEN, $.extend({}, treeNode.program, {menuId: treeNode.menuId, menuNm: menuNm}));
                                    }
                                }
                            }
                        },
                        n.children
                    );
                }
            });
        },
        open: function (_index) {
            if (this.openedIndex != _index) {

                fnObj.frameView.aside.find('[data-label-index="' + this.openedIndex + '"]').removeClass("opend");
                fnObj.frameView.aside.find('[data-tree-body-index="' + this.openedIndex + '"]').removeClass("opend");

                fnObj.frameView.aside.find('[data-label-index="' + _index + '"]').addClass("opend");
                fnObj.frameView.aside.find('[data-tree-body-index="' + _index + '"]').addClass("opend");

                this.openedIndex = _index;
            }
        }
    })
});

/**
 * topMenuView
 */
fnObj.topMenuView = axboot.viewExtend({
    initView: function () {
        this.target = $("#ax-top-menu");

        var menuItems = fnObj.menuItems;
        menuItems.forEach(function (n) {
            if(n.hasChildren) {
                n.name += ' <i class="cqc-chevron-down"></i>';
            }
        });

        this.menu = new ax5.ui.menu({
            theme: 'axboot',
            direction: "top",
            offset: {left: 0, top: -1},
            position: "absolute",
            icons: {
                'arrow': '<i class="cqc-chevron-right"></i>'
            },
            columnKeys: {
                label: 'name',
                items: 'children'
            },
            items: menuItems
        });

        this.menu.attach(this.target);
        this.menu.onClick = function () {
            if (this.program) {
                var menuNm = this.menuNm;
                if(this.multiLanguageJson && this.multiLanguageJson[SCRIPT_SESSION.details.language]){
                    menuNm = this.multiLanguageJson[SCRIPT_SESSION.details.language];
                }
                ACTIONS.dispatch(ACTIONS.MENU_OPEN, $.extend({}, this.program, {menuId: this.menuId, menuNm: menuNm}));
            }
        };
        this.menu.onStateChanged = function () {
            if (this.state == 'close') {
                //console.log(this.self.getCheckValue());
            }
        };
    }
});

/**
 * tabView
 */
fnObj.tabView = axboot.viewExtend({
    target: null,
    frameTarget: null,
    limitCount: 6,
    list: axboot.def["DEFAULT_TAB_LIST"],
    initView: function () {
        this.target = $("#ax-frame-header-tab-container");
        this.frameTarget = $("#content-frame-container");
        this.print();

        var menu = new ax5.ui.menu({
            position: "absolute", // default position is "fixed"
            theme: "primary",
            icons: {
                'arrow': '▸'
            },
            items: [
                //{icon: '<i class="cqc-ccw"></i>', label: '현재 탭 새로고침', action: "reload"},
                {icon: '<i class="cqc-cancel3"></i>', label: '현재탭 닫기', action: "close"},
                {icon: '<i class="cqc-cancel"></i>', label: '현재탭 제외하고 닫기', action: "closeAnother"},
                //{icon: '<i class="cqc-cancel"></i>', label: '모든탭 닫기', action: "closeAll"}
            ]
        });

        menu.onClick = function () {
            switch (this.action) {
                case "reload":
                    fnObj.tabView.list.forEach(function (_item, idx) {
                        if (_item.status == "on") {
                            window["frame-item-" + _item.menuId].location.reload();
                            return false;
                        }
                    });
                    break;
                case "close":
                    fnObj.tabView.list.forEach(function (_item, idx) {
                        if (_item.status == "on") {
                            if (idx == 0) {
                                alert("마지막 탭은 닫을 수 없습니다.");
                                return false;
                            }
                            fnObj.tabView.close(_item.menuId);
                            return false;
                        }
                    });
                    break;
                case "closeAnother":
                    fnObj.tabView.list.forEach(function (_item, idx) {
                        //if (idx > 0 && _item.status != "on") {
                    	if (_item.status != "on") {
                            fnObj.tabView.close(_item.menuId);
                        }
                    });
                    //fnObj.tabView.open(fnObj.tabView.list[0]);
                    break;
                case "closeAll":
                    fnObj.tabView.list.forEach(function (_item, idx) {
                        if (idx > 0) {
                            fnObj.tabView.close(_item.menuId);
                        }
                    });
                    fnObj.tabView.open(fnObj.tabView.list[0]);
                    break;
                default:
                    return false;
            }
        };

        this.target.on("contextmenu", '.tab-item', function (e) {
            menu.popup(e);
            ax5.util.stopEvent(e);
        });
    },
    _getItem: function (item) {
        var po = [];
        po.push('<div class="tab-item ' + item.status + '" data-tab-id="' + item.menuId + '">');
        po.push('<span data-toggle="tooltip" data-placement="bottom" title=\'' + item.menuNm + '\'>', item.menuNm, '</span>');
        if (!item.fixed) po.push('<i class="cqc-cancel3" data-tab-close="true" data-tab-id="' + item.menuId + '"></i>');
        po.push('</div>');
        return po.join('');
    },
    _getFrame: function (item) {
        var po = [];
        po.push('<iframe class="frame-item ' + item.status + '" data-tab-id="' + item.menuId + '" name="frame-item-' + item.menuId + '" src="' + item.url + '" frameborder="0" framespacing="0" allowFullScreen="true"></iframe>');
        return po.join('');
    },
    print: function () {
        var _this = this;

        var po = [], fo = [], active_item;

        po.push('<div class="tab-item-holder">');
        po.push('<div class="tab-item-menu" data-tab-id=""></div>');
        this.list.forEach(function (_item, idx) {
            po.push(_this._getItem(_item));
            fo.push(_this._getFrame(_item));
            if (_item.status == "on") {
                active_item = _item;
            }
        });
        po.push('<div class="tab-item-addon" data-tab-id=""></div>');
        po.push('</div>');

        this.target.html(po.join(''));
        this.frameTarget.html(fo.join(''));
        this.targetHolder = this.target.find(".tab-item-holder");
        // event bind
        this.bindEvent();

        if (active_item) {
            //topMenu.setHighLightOriginID(active_item.menuId || "");
        }
    },
    open: function (item) {
        var _item;
		console.log("Open Menu: ["+item.menuId + "]" + item.id); 
		//먼저 자기 자신 외에 다른 창은 웹소캣 다 끊어야함.
        var findedIndex = ax5.util.search(this.list, function () {
            this.status = '';
            return this.menuId == item.menuId;
        });
        this.target.find('.tab-item').removeClass("on");
        this.frameTarget.find('.frame-item').removeClass("on");

		
		var _this = this;
        this.list.forEach(function (_menuItem) {
            var $iframe = _this.frameTarget.find('[data-tab-id="' + _menuItem.menuId + '"]'), // iframe jQuery Object
            iframeObject = $iframe.get(0);
            //idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
            //20201228 ie, chrome 비교
            idoc = "";
            if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1))
            {
            	idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
            }
            else
            {
            	idoc = (iframeObject.contentWindow) ? iframeObject.contentWindow : iframeObject.contentWindow.document;
            }
            
            // 20210318 메뉴로 이동할때
            if(_menuItem.menuId == item.menuId)
            {
	            if(idoc.frames.fnObj){
		            if(idoc.frames.fnObj.pageVisible){
		                //idoc.frames.fnObj.pageVisible(_menuItem.status);
		            	idoc.frames.fnObj.pageVisible("on");
		            }
	            }
            }
            else
            {
            	if(idoc.frames.fnObj){
		            if(idoc.frames.fnObj.pageVisible){
		                //idoc.frames.fnObj.pageVisible(_menuItem.status);
		            	idoc.frames.fnObj.pageVisible("");
		            }
	            }
            }            
        });
		
        if (findedIndex < 0) {
            this.list.push({
                menuId: item.menuId,
                id: item.id,
                progNm: item.progNm,
                menuNm: item.menuNm,
                progPh: item.progPh,
                url: CONTEXT_PATH + item.progPh + "?menuId=" + item.menuId,
                status: "on"
            });
            _item = this.list[this.list.length - 1];
            this.targetHolder.find(".tab-item-addon").before(this._getItem(_item));
            this.frameTarget.append(this._getFrame(_item));
        }
        else {
            _item = this.list[findedIndex];
            this.target.find('[data-tab-id="' + _item.menuId + '"]').addClass("on");
            this.frameTarget.find('[data-tab-id="' + _item.menuId + '"]').addClass("on");
            //window["frame-item-" + _item.menuId].location.reload();
        }

        if (_item) {
            //topMenu.setHighLightOriginID(_item.menuId || "");
        }

        if (this.list.length > this.limitCount) {
        	//alert("메뉴는 5개 이상 열수 없습니다.")
        	axToast.push("메뉴는 6개 이상 열수 없습니다."); 
            this.close(this.list[0].menuId);
        }        
        this.bindEvent();
        this.resize();
        if(this.list[0].menuNm == "HOME")
        {
        	this.close(this.list[0].menuId);
        }
        
    },
    click: function (id, e) {
    	
		var _this = this;
		console.log("Click Menu: [" + id + "]");
        //먼저 자기 자신 외에 다른 창은 웹소캣 다 끊어야함.
        this.list.forEach(function (_item) {
        	console.log(" >> list Menu: [" + _item.menuId + "]" + _item.id);
        	if (_item.menuId != id) {
        		var $iframe = _this.frameTarget.find('[data-tab-id="' + _item.menuId + '"]'), // iframe jQuery Object
                iframeObject = $iframe.get(0);
                //idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
        		//20201228 ie, chrome 비교
        		idoc = "";
        		if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1))
                {
                	idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
                }
                else
                {
                	idoc = (iframeObject.contentWindow) ? iframeObject.contentWindow : iframeObject.contentWindow.document;
                }
                if(idoc.frames.fnObj){
	        		if(idoc.frames.fnObj.pageVisible){
	        			console.log(" >> Menu: [" + _item.menuId + "] pageVisible(X)");
	                    idoc.frames.fnObj.pageVisible("");
	                }
                }
        	}
        });
		
        this.list.forEach(function (_item) {
			var $iframe = _this.frameTarget.find('[data-tab-id="' + _item.menuId + '"]'), // iframe jQuery Object
            iframeObject = $iframe.get(0);
            //idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
			//20201228 ie, chrome 비교
			idoc = "";
			if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1))
            {
            	idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
            }
            else
            {
            	idoc = (iframeObject.contentWindow) ? iframeObject.contentWindow : iframeObject.contentWindow.document;
            }
            
            if (_item.menuId == id) {
                _item.status = 'on';
                if(idoc.frames.fnObj){
					if(idoc.frames.fnObj.pageVisible){
	                    //idoc.frames.fnObj.pageVisible(_item.status);
						console.log(" >> Menu: [" + _item.menuId + "] pageVisible(on)");
						idoc.frames.fnObj.pageVisible("on");
					}
                }
                if (event.shiftKey) {

                    window.open(_item.url);
                }

                if (_item) {
                    //topMenu.setHighLightOriginID(_item.menuId || "");
                }
            }
            else _item.status = '';
        });
        this.target.find('.tab-item').removeClass("on");
        this.frameTarget.find('.frame-item').removeClass("on");

        this.target.find('[data-tab-id="' + id + '"]').addClass("on");
        this.frameTarget.find('[data-tab-id="' + id + '"]').addClass("on");
    },
    close: function (menuId) {
    	console.log("Close Menu: [" + menuId + "]");
        var newList = [], removeItem;
        this.list.forEach(function (_item) {
            if (_item.menuId != menuId) newList.push(_item);
            else removeItem = _item;
        });
        if (newList.length == 0) {
            alert("마지막 탭을 닫을 수 없습니다");
            return false;
        }
        this.list = newList;
        this.target.find('[data-tab-id="' + menuId + '"]').remove();

        // 프레임 제거
        (function () {
            var $iframe = this.frameTarget.find('[data-tab-id="' + menuId + '"]'), // iframe jQuery Object
                iframeObject = $iframe.get(0),
                idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;

            $(idoc.body).children().each(function () {
                $(this).remove();
            });
            idoc.innerHTML = "";
            $iframe
                .attr('src', 'about:blank')
                .remove();

            // force garbarge collection for IE only
            window.CollectGarbage && window.CollectGarbage();
        }).call(this);

        if (removeItem.status == 'on') {
            var lastIndex = this.list.length - 1;
            this.list[lastIndex].status = 'on';
            this.target.find('[data-tab-id="' + this.list[lastIndex].menuId + '"]').addClass("on");
            this.frameTarget.find('[data-tab-id="' + this.list[lastIndex].menuId + '"]').addClass("on");
        }

        // check status = "on"
        var hasStatusOn = false;
        this.list.forEach(function (_item) {
            if (_item.status == "on") hasStatusOn = true;
        });
        if (!hasStatusOn) {
            var lastIndex = this.list.length - 1;
            this.list[lastIndex].status = 'on';
            this.target.find('[data-tab-id="' + this.list[lastIndex].menuId + '"]').addClass("on");
            this.frameTarget.find('[data-tab-id="' + this.list[lastIndex].menuId + '"]').addClass("on");
        }

        this.target.find('.tooltip').remove();
        this.resize();
        
        var lastIndex = this.list.length - 1;
        
    	var $iframe = this.frameTarget.find('[data-tab-id="' + this.list[lastIndex].menuId + '"]'), // iframe jQuery Object
        iframeObject = $iframe.get(0);
        //idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
    	//20201228 ie, chrome 비교
    	idoc = "";
    	if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1))
        {
        	idoc = (iframeObject.contentDocument) ? iframeObject.contentDocument : iframeObject.contentWindow.document;
        }
        else
        {
        	idoc = (iframeObject.contentWindow) ? iframeObject.contentWindow : iframeObject.contentWindow.document;
        }
        
        if(typeof idoc.frames.fnObj !== "undefined"){
			if(idoc.frames.fnObj.pageVisible){
	            //idoc.frames.fnObj.pageVisible('on');
				console.log(" >> Menu: [" + this.list[lastIndex].id + "] pageVisible(on)");
				idoc.frames.fnObj.pageVisible("on");
			}
        }
        
    },
    bindEvent: function () {
        var _this = this;
        this.target.find('.tab-item').unbind("click").bind("click", function (e) {
            if (e.target.tagName == "I") {
                _this.close(this.getAttribute("data-tab-id"));
            }
            else {
                _this.click(this.getAttribute("data-tab-id"), e);
            }
        });

        this.target.find('[data-toggle="tooltip"]').tooltip();
    },
    resize: function () {
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout((function () {
            var ctWidth = this.target.width();
            var tabsWidth = this.targetHolder.outerWidth();

            if (ctWidth < tabsWidth) {
                this.targetHolder.css({width: "100%"});
                this.target.find('.tab-item').css({'min-width': 'auto', width: (ctWidth / this.list.length) - 4});
            }
            else {
                this.targetHolder.css({width: "auto"});
                this.target.find('.tab-item').css({'min-width': '120px', width: "auto"});
                tabsWidth = this.targetHolder.outerWidth();
                if (ctWidth < tabsWidth) {
                    this.targetHolder.css({width: "100%"});
                    this.target.find('.tab-item').css({'min-width': 'auto', width: (ctWidth / this.list.length) - 4});
                }
            }
        }).bind(this), 100);

    }
});

/**
 * activityTimerView
 */
fnObj.activityTimerView = axboot.viewExtend({
    initView: function () {
        this.$target = $("#account-activity-timer");
        /*
         $(document.body).on("click", function () {
         fnObj.activityTimerView.update();
         });
         */
        this.update();
        setInterval(function () {
            fnObj.activityTimerView.print();
        }, 1000);
    },
    update: function () {
        this.initTime = (new Date()).getTime();
    },
    print: function () {
        var now = (new Date()).getTime(),
            D_Milli = (1000 * 60) * 60,
            M_Milli = (1000 * 60),
            S_Milli = 1000;

        var diffNum = (now - this.initTime);
        var displayTime = [];
        var hh, mi, ss;

        if (diffNum > D_Milli) {
            hh = Math.floor(diffNum / D_Milli);
            displayTime.push(ax5.util.setDigit(hh, 2) + ":");
            diffNum -= hh * D_Milli;
        }
        if (diffNum > M_Milli) {
            mi = Math.floor(diffNum / M_Milli);
            displayTime.push(ax5.util.setDigit(mi, 2) + ":");
            diffNum -= mi * M_Milli;
        } else {
            displayTime.push("00:");
        }
        if (diffNum > S_Milli) {
            ss = Math.floor(diffNum / S_Milli);
            displayTime.push(ax5.util.setDigit(ss, 2));
        } else {
            displayTime.push("00");
        }

        this.$target.html(displayTime.join(""));
    }
});
