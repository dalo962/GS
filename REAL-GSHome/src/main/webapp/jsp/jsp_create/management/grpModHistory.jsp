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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/management/grpModHistory.js?version=1' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="900px">
                    <ax:tr>
                        <ax:td label='ax.stat.common.search.company' width="20%">
                            <div class="form-group">
								<div id="selCompany" name="selCompany" data-ax5select="selCompany" data-ax5select-config="{}"></div>
							</div>		
                        </ax:td>
                        <ax:td label='ax.stat.common.search.part' width="20%" labelWidth="100px">
							<div class="form-group">
								<div id="deptSelect" name="deptSelect" data-ax5select="deptSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    	<ax:td label='ax.stat.common.search.team' width="30%" labelWidth="100px">
	                       	<div class="form-group">
								<div class="form-group"style="float:left;width:50%;">
									<div id="teamSelect" name="teamSelect" data-ax5select="teamSelect" data-ax5select-config="{}"></div>
								</div>
								<div class="form-group" style="float:left;width:50%;">
									<input type="text" id="txtTeamName" name="txtTeamName" class="form-control" placeholder="입력">
								</div>
							</div>	
                    	</ax:td>
                        <ax:td label='시스템사번' width="20%" labelWidth="100px">
							<div class="form-group" style="float:left;width:100%">
								<input type="text" id="selText" name="selText" class="form-control" placeholder="입력(;으로 구분)">
							</div>
                    	</ax:td> 
                    </ax:tr>
                    <ax:tr>
                    	<ax:td label='인사사번' width="20%" >
							<div class="form-group">
								<input type="text" id="selEmText" name="selEmText" class="form-control" placeholder="입력">
							</div>
	                    </ax:td>
                    	<ax:td label='상담사명' width="20%" >
							<div class="form-group">
								<input type="text" id="selAnmText" name="selAnmText" class="form-control" placeholder="입력">
							</div>
	                    </ax:td>
	                    <ax:td label='ax.stat.common.search.skillGrp' width="30%">
							<div class="form-group">
								<div class="form-group"style="float:left;width:50%;">
									<div id="selSkillGrp" name="selSkillGrp" data-ax5select="selSkillGrp" data-ax5select-config="{}"></div>
								</div>
								<div class="form-group" style="float:left;width:50%;">
									<input type="text" id="selSkillGrpName" name="selSkillGrpName" class="form-control" placeholder="입력">
								</div>
							</div>
	                    </ax:td>
                        <ax:td label='화면구분' width="20%">
                            <div class="form-group">
								<div id="selMenu" name="selMenu" data-ax5select="selMenu" data-ax5select-config="{}"></div>
							</div>		
                        </ax:td>
                    </ax:tr>
                    <ax:tr>
                    	<ax:td label='기간' width="23%" labelWidth="100px">                    		
							<div class="input-group" data-ax5picker="date">
	                            <input type="text" name="startDate" id="startDate" class="form-control" placeholder="yyyy-mm-dd">
	                        	<span class="input-group-addon"><i class="cqc-calendar"></i></span>
	                     	   <span class="input-group-addon space_text">~</span>
	                            <input type="text" name="endDate" id="endDate" class="form-control" placeholder="yyyy-mm-dd">
	                            <span class="input-group-addon"><i class="cqc-calendar"></i></span>
	                        </div>
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
        </div>
        <div class="H10"></div> 

        <ax:split-layout name="ax1" orientation="horizontal">
            <ax:split-panel width="*" style="height:96%;">
            	<div id="grid" data-ax5grid="grid-view-01" data-fit-height-content="form-view-01" style="height: 300px;" class="grid-view-01"></div>
            </ax:split-panel>            
        </ax:split-layout>           
    </jsp:body>
</ax:layout>