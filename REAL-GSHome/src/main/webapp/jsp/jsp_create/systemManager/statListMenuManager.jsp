<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/systemManager/statListMenuManager.js?version=1'/>"></script>
    </jsp:attribute>
    <jsp:attribute name="header">
        <h2 class="title">
            <i class="cqc-list"></i>
          	 메뉴별 통계 항목 설정
        </h2>
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons>
            <button type="button" class="btn btn-default" data-page-btn="save">저장</button>
            <button type="button" class="btn btn-default" data-page-btn="close">닫기</button>            
        </ax:page-buttons>
	
        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
					<ax:tr>
                    	<ax:td label='메뉴 선택' width="50%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="menuSelect" data-ax5select-config="{}"></div>							
							</div>	
                    	</ax:td>	
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>
	
        <ax:split-layout name="ax1" orientation="horizontal">
            <ax:split-panel width="*" style="*">
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 100%;"></div>
            </ax:split-panel>            
        </ax:split-layout>
    </jsp:body>
</ax:layout>
