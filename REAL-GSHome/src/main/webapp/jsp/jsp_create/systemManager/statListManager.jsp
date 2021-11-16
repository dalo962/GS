<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" />
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/systemManager/statListManager.js?version=1'/>"></script>
        <!-- excel 
        <script type="text/javascript" src="<c:url value='/assets/plugins-fix/tableExport.jquery.plugin-master/libs/js-xlsx/xlsx.core.min.js'/>"></script>
        <script type="text/javascript" src="<c:url value='/assets/plugins-fix/tableExport.jquery.plugin-master/libs/FileSaver/FileSaver.min.js'/>"></script>
        --> 
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="300px">
					<ax:tr>
                    	<ax:td label='누적타입' width="20%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="selSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    	<ax:td id='disp' label='화면설정' width="20%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="dispSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="">

                <!-- 목록 -->
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>통계 항목 목록</h2>
                    </div>
                    <div class="right">     
                    	<button id="mbtn" type="button" class="btn btn-default" data-grid-view-01-btn="modal">메뉴별 항목 설정</button>
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="add"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.add"/></button>                                                                 
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="delete"><i class="cqc-circle-with-minus"></i> <ax:lang id="ax.admin.delete"/></button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="save"><i class="cqc-save"></i> <ax:lang id="ax.admin.save"/></button>                        
                    </div>
                </div>
                <div id="gird" data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>
