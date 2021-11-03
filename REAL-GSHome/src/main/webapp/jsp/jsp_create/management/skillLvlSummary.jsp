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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/management/skillLvlSummary.js?version=1'/>"></script>        
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="900px">
                    <ax:tr>
                        <ax:td label='ax.stat.common.search.company' width="22%">
                            <div class="form-group">
								<div id="selCompany" name="selCompany" data-ax5select="selCompany" data-ax5select-config="{}"></div>
							</div>		
                        </ax:td>
						<ax:td label='ax.stat.common.search.skillGrp' width="22%">
								<div class="form-group">
									<div class="form-group"style="float:left;width:50%;">
										<div id="selSkillGrp" name="selSkillGrp" data-ax5select="selSkillGrp" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:50%;">
										<input type="text" id="selGrpName" name="selGrpName" class="form-control" placeholder="입력">
									</div>
								</div>
	                     </ax:td>
	                     <ax:td label='로그인 여부' width="22%">
                            <div class="form-group">
								<input type="checkbox" id="loginCheck"/>
							</div>		
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
        </div>
        <div class="H10"></div> 

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="height:96%;">
            	<div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>            
        </ax:split-layout>           
    </jsp:body>
</ax:layout>