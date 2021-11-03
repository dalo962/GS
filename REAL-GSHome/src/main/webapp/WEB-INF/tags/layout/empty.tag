<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ tag import="com.chequer.axboot.core.utils.ContextUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>${config.title}</title>

    <link rel="shortcut icon" href="<c:url value='/assets/favicon.ico'/>" type="image/x-icon"/>
    <link rel="icon" href="<c:url value='/assets/icon.png'/>" type="image/x-icon"/>
    <c:forEach var="css" items="${config.extendedCss}">
        <link rel="stylesheet" type="text/css" href="<c:url value='${css}'/>"/></c:forEach>
    <!--[if lt IE 10]><c:forEach var="css" items="${config.extendedCssforIE9}">
        <link rel="stylesheet" type="text/css" href="<c:url value='${css}'/>"/></c:forEach>
    <![endif]-->

    <script type="text/javascript">
        var CONTEXT_PATH = "<%=ContextUtil.getContext()%>";
        var SCRIPT_SESSION = (function(json){return json;})(${scriptSession});
    </script>
    <script type="text/javascript" src="<c:url value='/assets/js/plugins.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/assets/js/axboot/dist/axboot.js' />"></script>
    <script type="text/javascript" src="<c:url value='/axboot.config.js' />"></script>
    <style>
    	#ax-base-root:-webkit-full-screen {
			width: 100%;
			height: 100%;
			background-color: #ECF0F5;   
		}
    </style>
    <jsp:invoke fragment="css"/>
    <jsp:invoke fragment="js"/>
</head>
<body class="ax-body ${axbody_class}">
<div id="ax-base-root" data-root-container="true">
	<div class="ax-base-title" role="page-title">
        
    </div>
    <div class="ax-base-content">
        <jsp:doBody/>
    </div>
</div>
<jsp:invoke fragment="script"/>
</body>
</html>