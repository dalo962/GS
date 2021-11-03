<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="com.soluvis.bake.system.domain.init.DatabaseInitService" %>
<%@ page import="com.chequer.axboot.core.context.AppContextManager" %>
<%@ page import="com.soluvis.bake.system.utils.SessionUtils" %>
<%@ page import="com.chequer.axboot.core.utils.CookieUtils" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
	boolean initialized = true;

    String lastNavigatedPage = null;

    if (SessionUtils.isLoggedIn()) {
        //lastNavigatedPage = "/jsp/callview.jsp";
        lastNavigatedPage = "/jsp/bake.jsp";
        CookieUtils.deleteCookie(lastNavigatedPage);
        session.invalidate();
        
    }

    if (initialized) {
        request.setAttribute("redirect", lastNavigatedPage);
    } else {
        request.setAttribute("redirect", "/setup");
    }
    
%>
	
<c:if test="${redirect!=null}">
    <c:redirect url="${redirect}"/>
</c:if>

<ax:set key="axbody_class" value="baseStyle"/>
<ax:layout name="empty">
    <jsp:attribute name="js">
        <script>
            axboot.requireSession('${config.sessionCookie}');
        </script>
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/dist/good-words.js' />"></script>
    </jsp:attribute>
    
    <jsp:attribute name="script">
        <script type="text/javascript">
            var fnObj = {
                pageStart: function () {
                    $("#good_words").html(goodWords.get());
                    fnObj.login();
                },
                login: function () {
                    axboot.ajax({
                        method: "POST",
                        cache: false,
                        url: "/api/login",
                        data: JSON.stringify({
                            "userCd": '',
                            "userPs": ''
                        }),
                        callback: function (res) {
                            if (res && res.error) {
                                if (res.error.message == "Unauthorized") {
                                    alert("로그인에 실패 하였습니다. 계정정보를 확인하세요");
                                }
                                else {
                                    alert(res.error.message);
                                }
                                return;
                            }
                            else {
                                location.reload();
                            }
                        },
                        options: {
                            nomask: false, apiType: "login"                        	
                        }
                    });
                    return false;
                }
            };
        </script>
    </jsp:attribute>

    <jsp:body>
    </jsp:body>

</ax:layout>