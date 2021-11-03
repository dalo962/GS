<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ tag import="com.soluvis.bake.system.utils.CommonCodeUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.ContextUtil" %>
<%@ tag import="com.chequer.axboot.core.utils.PhaseUtils" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    String commonCodeJson = CommonCodeUtils.getAllByJson();
    boolean isDevelopmentMode = PhaseUtils.isDevelopmentMode();
    request.setAttribute("isDevelopmentMode", isDevelopmentMode);
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>${config.title}</title>
    <link rel="shortcut icon" href="<c:url value='/assets/favicon.ico'/>" type="image/x-icon"/>
    <link rel="icon" href="<c:url value='/assets/icon.png'/>" type="image/x-icon"/>

    <c:forEach var="css" items="${config.extendedCss}">
        <link rel="stylesheet" type="text/css" href="<c:url value='${css}'/>"/>
    </c:forEach>
    <!--[if lt IE 10]>
    <c:forEach var="css" items="${config.extendedCssforIE9}">
        <link rel="stylesheet" type="text/css" href="<c:url value='${css}'/>"/>
    </c:forEach>
    <![endif]-->

    <script type="text/javascript">
        var CONTEXT_PATH = "<%=ContextUtil.getContext()%>";
        var TOP_MENU_DATA = (function (json) {
            return json;
        })(${menuJson});
        var COMMON_CODE = (function (json) {
            return json;
        })(<%=commonCodeJson%>);
        var SCRIPT_SESSION = (function (json) {
            return json;
        })(${scriptSession});
        
        function MODAL_OPEN() {
        	axboot.modal.open({
            	modalType: "USER_UP_MODAL",
                param: "",
                sendData: function () {
                    return {
                    };
                },
                callback: function (data) {
                    caller.formView01.setEtc3Value({
                        key: data.key,
                        value: data.value
                    });
                    this.close();
                }
            });
        }
        
        function MENU_MANAGER_OPEN() {
        	axboot.modal.open({
            	modalType: "MENU_MANAGER",
                param: "",
                sendData: function () {
                    return {
                    };
                },
                header:{
                	title: "메뉴 설정"
                }
            });
        }
        
        function HELP_LIST_OPEN() {
        	var url = "/jsp/jsp_create/common/helpList.jsp";
        	var name = "도움말";
        	var width = 2500;
        	var height = 900;
        	window.open(url, name, 'top=' + ((screen.availHeight- height)/2 - 40) + ', left=' + (screen.availWidth - width) / 2 + ', width='+width+', height=' + height+',resizable=yes, directories=no, scrollbars=no');
        	/*axboot.modal.open({
            	modalType: "HELP_LIST",
                param: "",
                sendData: function () {
                    return {
                    };
                },
                header:{
                	title: "도움말"
                }
            });*/
        }
        
        function LOGOUT() {
        	//var rtnVal = confirm('지금 보고 있는 웹 페이지 창을 닫으려고 합니다.\n이 창을 닫으시겠습니까?');
        	var rtnVal = confirm('로그아웃 하시겠습니까?');
        	if(rtnVal){
            	location.href = '${pageContext.request.contextPath}/api/logout';
        	} else {
        		return;
        	}
        }
    </script>

    <script type="text/javascript" src="<c:url value='/assets/js/plugins.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/assets/js/axboot/dist/axboot.js' />"></script>
    <script type="text/javascript" src="<c:url value='/axboot.config.js' />"></script>
    
    <!-- winker api start -->
    <!-- 
    <script type="text/javascript" src="<c:url value='/assets/js/winker/bytebuffer.js' />"></script>
    <script type="text/javascript" src="<c:url value='/assets/js/winker/winker_const.js' />"></script>
    <script type="text/javascript" src="<c:url value='/assets/js/winker/winker_api.js' />"></script>
    <script type="text/javascript" src="<c:url value='/assets/js/winker/winker_customize.js' />"></script>
     --> 
    <!-- winker api end -->
    
    <jsp:invoke fragment="css"/>
    <jsp:invoke fragment="js"/>
</head>
<body class="ax-body ${axbody_class}" onselectstart="return false;">
<div id="ax-frame-root" class="<c:if test="${config.layout.leftSideMenu eq 'visible'}">show-aside</c:if>" data-root-container="true">
    <jsp:doBody/>

    <div class="ax-frame-header-tool">
        <div class="ax-split-col" style="height: 100%;">
            <div class="ax-split-panel text-align-left">

            </div>
            <div class="ax-split-panel text-align-right">

                <div class="ax-split-col ax-frame-user-info">
                <%-- <div class="ax-split-panel">
                        <a href="/?language=en">English</a> / <a href="/?language=ko">한국어</a>
                    </div>
                    <div class="panel-split"></div>
                    <c:if test="${isDevelopmentMode}">
                        <!-- 개발자 툴 연결 아이콘 -->
                        <div class="ax-split-panel">
                            <a href="#ax" onclick="window.open('/jsp/system/system-dev-tools.jsp');"><i class="cqc-tools"></i> <ax:lang id="ax.devtools"/></a>
                        </div>
                        <div class="panel-split"></div> 
                    </c:if> --%>                    
					
                    <div class="ax-split-panel login_info">
                        <!--  <a href="#ax" onclick="fcObj.open_user_info();"><ax:lang id="ax.admin.login.status.message" args="${loginUser.userNm}"/></a> -->                        
                        <a href="#ax" onclick="MODAL_OPEN();"><span>${loginUser.userNm}</span></a>님이 로그인 하였습니다. 
                        <!-- <span> ${loginUser.userNm}</span>님이 로그인 하였습니다. -->
                    </div>
					<div class="ax-split-panel logout">
                        <a href="#ax" class="ax-frame-logout" onclick="LOGOUT();">
                            <i class="cqc-log-out"></i>
                            <ax:lang id="ax.admin.logout"/>
                        </a>
                    </div>
                    <!--  
                    <div class="ax-split-panel">
                    	<a href="#ax" onclick="MENU_MANAGER_OPEN();">메뉴 설정</a>
                    </div>

                    <div class="ax-split-panel">
                    	<a href="#ax" onclick="HELP_LIST_OPEN();">도움말</a>
                    </div>
					-->                    
                </div>
            </div>
        </div>
    </div>

    <div class="ax-frame-header">
        <div class="ax-split-col" style="height: 100%;">
            <c:if test="${config.layout.leftSideMenu eq 'visible'}">
                <div class="ax-split-panel cell-aside-handle" id="ax-aside-handel">
                    <i class="cqc-menu"></i>
                </div>
            </c:if>
            <c:if test="${config.layout.leftSideMenu ne 'visible'}">
                <div class="ax-split-panel">&nbsp;</div>
            </c:if>
            <div class="ax-split-panel cell-logo">
                <a href="${pageContext.request.contextPath}/jsp/bake.jsp">
                    <img src="${pageContext.request.contextPath}${config.logo.header}" width="100%"/>
                </a>
            </div>
            <div id="ax-top-menu" class="ax-split-panel ax-split-flex"></div>
            <div class="ax-split-panel cell-aside-handle" id="ax-fullscreen-handel">
                <i class="cqc-expand icon-closed"></i>
                <i class="cqc-collapse icon-opened"></i>
            </div>
        </div>
    </div>

    <div class="ax-frame-header-tab">
        <div id="ax-frame-header-tab-container"></div>
    </div>

    <c:if test="${config.layout.leftSideMenu eq 'visible'}">
        <div class="ax-frame-aside" id="ax-frame-aside"></div>
        <script type="text/html" data-tmpl="ax-frame-aside">
            <div class="ax-frame-aside-menu-holder">
                <div style="height: 10px;"></div>
                {{#items}}
                <a class="aside-menu-item aside-menu-item-label{{#hasChildren}} {{#open}}opend{{/open}}{{/hasChildren}}" data-label-index="{{@i}}">{{{name}}}</a>
                {{#hasChildren}}
                <div class="aside-menu-item aside-menu-item-tree-body {{#open}}opend{{/open}}" data-tree-body-index="{{@i}}">
                    <div class="tree-holder ztree" id="aside-menu-{{@i}}" data-tree-holder-index="{{@i}}"></div>
                </div>
                {{/hasChildren}}
                {{/items}}
            </div>
        </script>
    </c:if>

    <div class="ax-frame-foot">
        <div class="ax-split-col" style="height: 100%;">
            <div class="ax-split-panel text-align-left"> ${config.copyrights} </div>
            <div class="ax-split-panel text-align-right">
               <b id="account-activity-timer">00</b> ago.
            </div>
        </div>
    </div>

</div>
<jsp:invoke fragment="script"/>
</body>
</html>