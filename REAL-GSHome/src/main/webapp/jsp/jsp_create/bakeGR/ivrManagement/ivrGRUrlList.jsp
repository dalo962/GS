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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/bakeGR/ivrManagement/ivrGRUrlList.js?version=1'/>"></script>
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons></ax:page-buttons>

		<div role="page-header">
            <ax:form name="searchView0">                    
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                	<ax:tr>
						<ax:td label='센터' width="25%" labelWidth="100px">
							<div class="form-group">
								<div id="comSel" data-ax5select="comSelect" data-ax5select-config="{}"></div>					
							</div>	
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
                        <h2><i class="cqc-list"></i>URL 목록</h2>
                    </div>
                    -->
                    <div class="right">     
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="add"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.add"/></button>                                                                 
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="delete"><i class="cqc-circle-with-minus"></i> <ax:lang id="ax.admin.delete"/></button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="save"><i class="cqc-save"></i> <ax:lang id="ax.admin.save"/></button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="file">근무시간 동기화</button>
                        <!--  <button type="button" class="btn btn-default" data-grid-view-01-btn="reset">콜 초기화(DR)</button>-->
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>
