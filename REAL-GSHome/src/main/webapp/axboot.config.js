(function () {
    if (axboot && axboot.def) {

        axboot.def["DEFAULT_TAB_LIST"] = [
        	{menuId: "00-dashboard", id: "dashboard", progNm: '대시보드', menuNm: '대시보드', progPh: '/jsp/dashboard.jsp', url: '/jsp/dashboard.jsp?progCd=dashboard', status: "on", fixed: false},        	
        ];

        axboot.def["API"] = {
            "users": "/api/v1/users",
            "commonCodes": "/api/v1/commonCodes",
            "programs": "/api/v1/programs",
            "menu": "/api/v2/menu",
            "manual": "/api/v1/manual",
            "errorLogs": "/api/v1/errorLogs",
            "files": "/api/v1/files",
            "samples": "/api/v1/samples",
        };

        axboot.def["MODAL"] = {
            "ZIPCODE": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/common/zipcode.jsp"
                }
            },
            "SAMPLE-MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/_samples/modal.jsp"
                },
                header: false
            },
            "COMMON_CODE_MODAL": {
                width: 600,
                height: 400,
                iframe: {
                    url: "/jsp/system/system-config-common-code-modal.jsp"
                },
                header: false
            },
            "STAT_MENU_MANAGER": {
                width: 700,
                height: 800,
                iframe: {
                	url: "/jsp/jsp_create/systemManager/statListMenuManager.jsp"
                },
                header: false
            },
            "SKCALL_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/bakeGR/historyStat/skCallStatTab.jsp"
                },
                header: false
            },
            "SKWAIT_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/bakeGR/historyStat/skWaitStatTab.jsp"
                },
                header: false
            },
            "AGCALL_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/bakeGR/historyStat/agCallStatTab.jsp"
                },
                header: false
            },
            "AGPRODT_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/bakeGR/historyStat/agProdtStatTab.jsp"
                },
                header: false
            },
            "AGSKILL_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/bakeGR/historyStat/agSkillStatTab.jsp"
                },
                header: false
            },
            "CALLTRACE_INFO_MODAL": {
                width: 1650,
                height: 800,
                iframe: {
                    url: "/jsp/jsp_create/bakeGR/historyStat/callTraceTab.jsp"
                },
                header: false
            },
			"CTI_COMP_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/systemManager/ctiMapCompModal.jsp"
                },
                header: false
            },
            "SKSUMMARY_INFO_MODAL": {
                width: 1110,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/skillLvlSummaryTab.jsp"
                },
                header: false
            },
            "SKMAIN_INFO_MODAL": {
                width: 750,
                height: 450,
                iframe: {
                    url: "/jsp/jsp_create/management/skillLvlChnMainTab.jsp"
                },
                header: false
            },
            "SKGMAIN_INFO_MODAL": {
                width: 650,
                height: 450,
                iframe: {
                    url: "/jsp/jsp_create/management/skillGrpTab.jsp"
                },
                header: false
            },
            "USER_UP_MODAL": {
                width: 350,
                height: 290,
                iframe: {
                	url: "/jsp/userUpdate.jsp"
                },
                header: false
            }
        };
    }


    var preDefineUrls = {
        "manual_downloadForm": "/api/v1/manual/excel/downloadForm",
        "manual_viewer": "/jsp/system/system-help-manual-view.jsp"
    };
    axboot.getURL = function (url) {
        if (ax5.util.isArray(url)) {
            if (url[0] in preDefineUrls) {
                url[0] = preDefineUrls[url[0]];
            }
            return url.join('/');

        } else {
            return url;
        }
    }


})();