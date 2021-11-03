<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="com.soluvis.bake.system.domain.init.DatabaseInitService" %>
<%@ page import="com.chequer.axboot.core.context.AppContextManager" %>
<%@ page import="com.soluvis.bake.system.utils.SessionUtils" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
	boolean initialized = true;

    String lastNavigatedPage = null;

    if (SessionUtils.isLoggedIn()) {
        //lastNavigatedPage = "/jsp/callview.jsp";
    	lastNavigatedPage = "/jsp/bake.jsp";
    }

    if (initialized) {
        request.setAttribute("redirect", lastNavigatedPage);
    } else {
        request.setAttribute("redirect", "/setup");
    }%>
<c:if test="${redirect!=null}">
    <c:redirect url="${redirect}"/>
</c:if>

<ax:set key="axbody_class" value="login"/>

<ax:layout name="empty">
    <jsp:attribute name="script">
        <script type="text/javascript">
            var fnObj = {
                pageStart: function () {
					window.open('','_self').self.close();
                }
            };
        </script>
    </jsp:attribute>


    <jsp:body>
        <form name="exitForm" class="" method="post" onsubmit="return fnObj.pageStart();" autocomplete="off">

        </form>
    </jsp:body>

</ax:layout>