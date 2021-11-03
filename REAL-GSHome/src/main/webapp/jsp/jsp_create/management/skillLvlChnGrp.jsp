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
	    <script type="text/javascript" src="<c:url value='/assets/plugins/ax5ui-select/dist/ax5select.js' />"></script>
	    <script type="text/javascript" src="<c:url value='/assets/plugins/ax5ui-grid/dist/ax5grid.js' />"></script>	    
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/bytebuffer.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/winker_const_gs.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/winker_api_gs.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/common/winker_com.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/management/skillLvlChnGrp.js?version=1' />"></script>
    </jsp:attribute>
    <jsp:body>
		
        <ax:page-buttons>
        	<button type="button" class="btn btn-info" data-page-btn="save"><i class="cqc-save"></i> 대표그룹등록</button>
        </ax:page-buttons>

        <div role="page-header">
        </div> 
       	<ax:split-layout name="ax1" orientation="vertical" style="height:100%">
       		<ax:split-panel width="*" style="padding-right: 10px; height:69%;">
	            <ax:form name="searchView0">
	                <ax:tbl clazz="ax-search-tbl" minWidth="900px">
	                    <ax:tr>
	                        <ax:td label='ax.stat.common.search.company' width="32%">
	                            <div class="form-group">
									<div id="selCompany" name="selCompany" data-ax5select="selCompany" data-ax5select-config="{}"></div>
								</div>		
	                        </ax:td>
	                        <ax:td label='ax.stat.common.search.part' width="32%">
	                        	<div class="form-group">
									<div id="selPart" name="selPart" data-ax5select="selPart" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>
	                        <ax:td label='ax.stat.common.search.team' width="36%">
	                        	<div class="form-group">
									<div class="form-group"style="float:left;width:70%;">
										<div id="selTeam" name="selTeam" data-ax5select="selTeam" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:30%;">
										<input type="text" id="selTeamName" name="selTeamName" class="form-control" placeholder="입력">
									</div>
								</div>	
	                        </ax:td>
	                    </ax:tr>
	                    <ax:tr>
	                    	<ax:td label='자율 여부' width="32%">
	                        	<div class="form-group">
									<div id="selProtect" name="selProtect" data-ax5select="selProtect" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>
	                    	<ax:td label='시스템사번' width="32%" >
	                    		<div class="form-group" width:"100%" style="float:left; width:100%">
									<input type="text" id="selText" name="selText" class="form-control" placeholder="입력(;으로 구분)">
								</div>
	                    	</ax:td>	  
	                    	<ax:td label='인사사번' width="36%" >
								<div class="form-group">
									<input type="text" id="selemText" name="selemText" class="form-control" placeholder="입력">
								</div>
	                    	</ax:td>                  	
	                    </ax:tr>
	                    <ax:tr>
		                    <ax:td label='대표 그룹' width="32%">
		                    	<div class="form-group">
									<div class="form-group"style="float:left;width:65%;">
										<div id="selDefaultGrp" name="selDefaultGrp" data-ax5select="selDefaultGrp" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:35%;">
										<input type="text" id="selDefaultGrpText" name="selDefaultGrpText" class="form-control" placeholder="입력">
									</div>
								</div>
		                    </ax:td>
	                        <ax:td label='현재 그룹' width="32%">
	                        	<div class="form-group">
									<div id="selApplyGrp" name="selApplyGrp" data-ax5select="selApplyGrp" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>	
	                        <ax:td label='그룹 변경 여부' width="36%">
	                        	<div class="form-group">
									<div id="selModifyGrp" name="selModifyGrp" data-ax5select="selModifyGrp" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>                        
	                    </ax:tr>
	                    <ax:tr>
		                    <ax:td label='변경 사유' width="40%" >
	                    		<div class="form-group" width:"100%" style="float:left; width:290%">
									<input type="text" id="selTextRemark" name="selTextRemark" class="form-control" placeholder="입력">
								</div>
	                    	</ax:td>
	                    </ax:tr>
	                </ax:tbl>
	            </ax:form>
                     
				<div class="ax-button-group">
					<div class="left"> <h2 id="goingCnt" style="color:blue;width:70%">*총 대상 상담사 0명 중 0명 스킬 그룹 변경</h2> <h2 id="personCnt" style="color:black;width:30%">(0명)</h2> </div> 				
					<div class="right"> <p class="chkeck"><input type="checkbox" id="loginCheck">로그인 여부 &nbsp; 
					<button type="button" class="btn btn-default" data-grid-view-01-btn="agt_select"><i class="cqc-magnifier"></i> 조회</button>
					<button type="button" class="btn btn-default" data-grid-view-01-btn="agt_excel"><i class="cqc-file-excel-o"></i> 엑셀</button></p></div>							
				</div>
           		<div data-ax5grid="grid-view-agtGrp" data-fit-height-content="form-view-02"></div>
           	</ax:split-panel> 
           	
           	<ax:split-panel width="450" style="padding-right: 10px; height:69%;">
	            <ax:form name="searchViewSkill">
	                <ax:tbl clazz="ax-search-tbl" minWidth="900px">
	                    <ax:tr>
	                         <ax:td label='ax.stat.common.search.skillGrp' width="100%">
								<div class="form-group">
									<div class="form-group"style="float:left;width:50%;">
										<div id="selSkillGrp" name="selSkillGrp" data-ax5select="selSkillGrp" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:50%;">
										<input type="text" id="txtSkillName" name="txtSkillName" class="form-control" placeholder="입력">
									</div>
								</div>
	                        </ax:td>
	                    </ax:tr>
	                </ax:tbl>
	            </ax:form>
	            
           		<div class="H76"></div>
           		<div class="ax-button-group">
           			<div class="right">
           				<button type="button" class="btn btn-default" data-grid-view-01-btn="sk_select"><i class="cqc-magnifier"></i> 조회</button>
						<button type="button" class="btn btn-default" data-grid-view-01-btn="sk_excel"><i class="cqc-file-excel-o"></i> 엑셀</button>
					</div>
				</div> 
           		<div class="ax-button-group">
					<div class="right">
						<button type="button" class="btn btn-default" data-grid-view-01-btn="skGrpMod" style="background:black;"><i class="cqc-circle-with-plus"></i>스킬변경</button>
						<button type="button" class="btn btn-default" data-grid-view-01-btn="skGrpDel" style="background:black;"><i class="cqc-circle-with-minus"></i>스킬원복</button>
						<button type="button" class="btn btn-default" data-grid-view-01-btn="skProAdd"><i class="cqc-circle-with-plus"></i>자율부여</button>
						<button type="button" class="btn btn-default" data-grid-view-01-btn="skProDel"><i class="cqc-circle-with-minus"></i>자율원복</button>			
					</div>
				</div>     
				<h5 align="right" style="color:black;">*자율부여는 자율근무 스킬그룹의 스킬로 수정됩니다.</h5>
				<div class="H9"></div>		
           		<div data-ax5grid="grid-view-skill" data-fit-height-content="form-view-01" class="grid-view-skill"></div>
           	</ax:split-panel>
       	</ax:split-layout>
    </jsp:body>
</ax:layout>