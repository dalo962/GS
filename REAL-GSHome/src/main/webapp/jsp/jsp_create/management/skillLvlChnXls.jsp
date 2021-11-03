<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
	<jsp:attribute name="css">
        <link rel="stylesheet" type="text/css" href="<c:url value='/assets/css/grid-color.css'/>"/>
    </jsp:attribute>
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" />
        <ax:script-lang key="ax.admin" var="COL" />
		<script type="text/javascript" src="<c:url value='/assets/js/common/xlsx.full.min.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/bytebuffer.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/winker_const_gs.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/winker_api_gs.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/winker_com.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/management/skillLvlChnXls.js?version=1' />"></script>
    </jsp:attribute>
    <jsp:body>
    
        <ax:page-buttons></ax:page-buttons>
        <div role="page-header">
            <ax:form name="searchView0">                    
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">                    	
					<ax:tr>
						<ax:td label="File업로드" labelWidth="150px" width="50%">
                       	    <input type="file" id="excel" class="from-control" style="width:50%"/>
                       	    <spen style="display:table-cell; text-align:left; padding-left:10px; padding-top:4px; vertical-align:middle;">※ 엑셀 재업로드는 파일 이름이 다른 파일이여야 합니다.<br>&nbsp;&nbsp;&nbsp;파일 내용은 Sheet1에 대한 내용만 읽습니다.</spen>
                       	</ax:td>
                    </ax:tr>                    
                </ax:tbl>
            </ax:form>
            <!-- <div class="H10"></div> -->
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="height:98%;">    
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <!--  
                    <div class="left">
                        <h2><i class="cqc-list"></i>블랙컨슈머 목록</h2>
                    </div>
                    -->
                    <div class="left"> <h5 id="jresult" style="color:black;"><b>*정합성 검사 결과:</b></h5> </div>                    
                    <div class="right"> 
                    	<b id="goingCnt" style="color:blue;width:50%">*총 대상 상담사 0명 중 0명 스킬 그룹 변경</b>                   	
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="sample"> 템플릿 다운로드 </button>     
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="check"> 정합성 검사 </button>
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="save"> 적용 </button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
		</ax:split-layout>
    </jsp:body>
</ax:layout>