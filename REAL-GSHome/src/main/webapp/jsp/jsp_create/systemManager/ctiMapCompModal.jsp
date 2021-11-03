<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" />
        <ax:script-lang key="ax.admin" var="COL" />
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/systemManager/ctiMapCompModal.js?version=1' />"></script>
    </jsp:attribute>
    
    <jsp:attribute name="header">
        <h2 class="title">
            <i class="cqc-list"></i>
          	 소속 추가 변경
        </h2>
    </jsp:attribute>
    
    <jsp:body>

		<ax:page-buttons>
            <button type="button" class="btn btn-default" data-page-btn="save">저장</button>
            <button type="button" class="btn btn-default" data-page-btn="excel">엑셀</button>
            <button type="button" class="btn btn-default" data-page-btn="close">닫기</button>            
        </ax:page-buttons>
 
        <div role="page-header">            
            <div class="H10"></div>
        </div>

        <div class="ax-button-group">
            <div class="right">
		        <button type="button" class="btn btn-default" data-grid-view-01-btn="add"><i class="cqc-circle-with-plus"></i>행추가</button>      
		        <button type="button" class="btn btn-default" data-grid-view-01-btn="del"><i class="cqc-circle-with-minus"></i>행삭제</button>
	        </div>
        </div>
        <div data-ax5grid="grid-view-01" data-fit-height-content="form-view-01" style="height: 300px;"></div>

    </jsp:body>
</ax:layout>