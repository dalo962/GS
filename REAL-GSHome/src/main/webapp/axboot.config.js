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
            "MENU_MANAGER": {
                width: 700,
                height: 800,
                iframe: {
                	url: "/jsp/jsp_create/common/menuManager.jsp"
                },
                header: false
            },
            "HELP_LIST": {
            	width: 1750,
                height: 888,
                iframe: {
                	url: "/jsp/jsp_create/common/helpList.jsp"
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
            "DEPART_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/departmentStatModal.jsp"
                },
                header: false
            },
            "WORK_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/workStatModal.jsp"
                },
                header: false
            },
            "COM_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/combineStatModal.jsp"
                },
                header: false
            },
            "TIME_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/timetoStatModal.jsp"
                },
                header: false
            },
            "WORKCALL_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/workCallStatModal.jsp"
                },
                header: false
            },
            "AGENTCALL_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/agentCallStatModal.jsp"
                },
                header: false
            },
            "AGENTSTATUS_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/agentStatusStatModal.jsp"
                },
                header: false
            },
            "INCALLS_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/incallsNumStatModal.jsp"
                },
                header: false
            },
            "CALLTRACE_INFO_MODAL": {
                width: 1650,
                height: 800,
                iframe: {
                    url: "/jsp/jsp_create/historyStat/callTraceTab.jsp"
                },
                header: false
            },
            "WIZARD_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/reportWizardModal.jsp"
                },
                header: false
            },
            "IVR_ARSTREE_MODAL": {
                width: 1300,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/outsideStat/ivrArsTreeSub.jsp"
                },
                header: false
            },
            "IVR_TRACE_MODAL": {
                width: 1650,
                height: 800,
                iframe: {
                    url: "/jsp/jsp_create/outsideStat/ivrTraceSub.jsp"
                },
                header: false
            },
            "WZ_DEPART_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/temp/WdepartmentStatModal.jsp"
                },
                header: false
            },
            "WZ_WORK_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/temp/WworkStatModal.jsp"
                },
                header: false
            },
            "WZ_COM_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/temp/WcombineStatModal.jsp"
                },
                header: false
            },
            "WZ_TIME_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/temp/WtimetoStatModal.jsp"
                },
                header: false
            },
            "WZ_WORKCALL_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/temp/WworkCallStatModal.jsp"
                },
                header: false
            },
            "WZ_AGENTCALL_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/temp/WagentCallStatModal.jsp"
                },
                header: false
            },
            "WZ_AGENTSTATUS_FACTOR_MODAL": {
                width: 500,
                height: 500,
                iframe: {
                    url: "/jsp/jsp_create/management/temp/WagentStatusStatModal.jsp"
                },
                header: false
            },
            "DEPART_RT_FACTOR_MODAL": {
                width: 690,
                height: 600,
                iframe: {
                    url: "/jsp/jsp_create/realStat/departRTStateModal.jsp"
                },
                header: false
            },
            "AGENT_RT_FACTOR_MODAL": {
                width: 650,
                height: 600,
                iframe: {
                    url: "/jsp/jsp_create/realStat/agentRTStateModal.jsp"
                },
                header: false
            },
            "DASH_MAJOR_MODAL": {
                width: 650,
                height: 650,
                iframe: {
                    url: "/jsp/jsp_create/realStat/dashboardRTModal.jsp"
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
            "CHART_SETTING_MODAL": {
                width: 650,
                height: 600,
                iframe: {
                    url: "/jsp/jsp_create/test/chartStatModal.jsp"
                },
                header: false
            },
            "RECODING_MODAL": {
                width: 580,
                height: 380,
                iframe: {
                    url: "/jsp/jsp_create/test/recModal.jsp"
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