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
        <script type="text/javascript" src="<c:url value='/assets/js/common/xlsx.full.min.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/ivrManagement/ivrBlackList.js?version=2'/>"></script>        
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">                    
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">                    	
					<ax:tr>
						<ax:td label="Excel업로드" labelWidth="150px" width="50%">
                       	    <input type="file" id="excel" class="from-control" style="width:50%"/>
                       	    <spen style="display:table-cell; text-align:left; padding-left:10px; padding-top:4px; vertical-align:middle;">※ 엑셀 재업로드는 파일 이름이 다른 파일이여야 하며,<br>&nbsp;&nbsp;&nbsp;사용유무는 Y, 사용 이외엔 미사용으로 구분됩니다. 파일 내용은 엑셀파일의 처음 Sheet의 대한 내용만 읽습니다.</spen>
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
                    <div class="right">     
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="add"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.add"/></button>                                                                 
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="delete"><i class="cqc-circle-with-minus"></i> <ax:lang id="ax.admin.delete"/></button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="save"><i class="cqc-save"></i> <ax:lang id="ax.admin.save"/></button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>
