<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="HOME"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="axbody_class" value="dashboard"/>


<ax:layout name="base">
    <jsp:attribute name="css">    		
    	<style>
    		.ax-body.dashboard #ax-base-root .ax-base-title {display:none;}
    	</style>
    </jsp:attribute>
    <jsp:attribute name="script">

    </jsp:attribute>

    <jsp:body>
    	<div id="wrap_main">
			<div class="visual">
				<div class="visual_txt">
					<!--  <h1><span>GS홈쇼핑</span></h1>
					<p><span>IVR 관리 System</span></p>-->
				</div>
			</div>

		</div>
    </jsp:body>
</ax:layout>