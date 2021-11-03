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
	    <script type="text/javascript" src="<c:url value='/assets/plugins/ax5ui-grid-skill/dist/ax5grid.js' />"></script>
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/management/skillGrpMng.js?version=1' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>
        
        <div role="page-header">
        </div>    
		<ax:split-layout name="ax1" orientation="vertical" style="height:100%">
			<ax:split-panel width="475" style="padding-right: 10px; height:75%;">
	            <ax:form name="searchView">
	                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
	                	<ax:tr>
	                        <ax:td label='ax.stat.common.search.company' width="100%">
	                        	<div class="form-group">
									<div id="selSkCompany" name="selSkCompany" data-ax5select="selSkCompany" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>	                        
	                    </ax:tr>
	                    <ax:tr>
	                        <ax:td label='ax.stat.common.search.channel' width="100%">
	                        	<div class="form-group">
									<div id="selSkChannel" name="selSkChannel" data-ax5select="selSkChannel" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>	                        
	                    </ax:tr>
						<ax:tr>
							<ax:td label='ax.stat.common.search.skill' width="100%">
								<div class="form-group">
									<div class="form-group"style="float:left;width:70%;">
										<div id="selSkSkill" name="selSkSkill" data-ax5select="selSkSkill" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:30%;">
										<input type="text" id="selSkillName" name="selSkillName" class="form-control" placeholder="입력">
									</div>
								</div>
	                        </ax:td>
                    	</ax:tr>
	                </ax:tbl>
	            </ax:form>
 
 				<div class="ax-button-group">
					<div class="right"> <button type="button" class="btn btn-default" data-grid-view-01-btn="sk_excel"><i class="cqc-file-excel-o"></i> 엑셀</button> </div>							
				</div>
				<div data-ax5grid="grid-view-skill" data-fit-height-content="form-view-01" style="height: 300px;"></div>
			</ax:split-panel> 
			
			<ax:split-panel width="5%" style="padding-right: 10px;">
					<div style="position: absolute; text-align: center; transform: translate(-50%, -50%); left: 50%; top: 50%; ">
		           		<!-- 여기에 버튼이 두개 생겨야 해요 -->
		           		<button type="button" class="btn btn-default" data-grid-view-01-btn="skillAdd" style="width:100%;height:200%"><i class="cqc-circle-with-plus"></i>추가</button>
		           		<div class="H20"></div>
		           		<button type="button" class="btn btn-default" data-grid-view-01-btn="skillDel" style="width:100%;height:200%"><i class="cqc-circle-with-minus"></i>삭제</button>
		           	</div>
           	</ax:split-panel>           	
           	
			<ax:split-panel width="1280" style="padding-left: 10px; height:75%;">
	            <ax:form name="searchViewSkill">
	                <ax:tbl clazz="ax-search-tbl" minWidth="1400px">
	                    <ax:tr>
                        	<ax:td label='ax.stat.common.search.company' width="40%">
                            	<div class="form-group">
									<div id="selGrpCompany" name="selGrpCompany" data-ax5select="selGrpCompany" data-ax5select-config="{}"></div>
								</div>		
                        	</ax:td>
                        	<ax:td label='ax.stat.common.search.channel' width="35%">
                        		<div class="form-group">
									<div id="selGrpChannel" name="selGrpChannel" data-ax5select="selGrpChannel" data-ax5select-config="{}"></div>
								</div>	
                        	</ax:td>                        	
                    	</ax:tr>
                    	<ax:tr>
                    		<ax:td label='ax.stat.common.search.skill' width="40%">
								<div class="form-group">
									<div class="form-group"style="float:left;width:70%;">
										<div id="selGrpSkill" name="selGrpSkill" data-ax5select="selGrpSkill" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:30%;">
										<input type="text" id="selGrpSkillName" name="selGrpSkillName" class="form-control" placeholder="입력">
									</div>
								</div>
	                        </ax:td>
                        	<ax:td label='ax.stat.common.search.skillGrp' width="35%">
                        		<div class="form-group">
									<div class="form-group"style="float:left;width:70%;">
										<div id="selSkillGrp" name="selSkillGrp" data-ax5select="selSkillGrp" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:30%;">
										<input type="text" id="selGrpName" name="selGrpName" class="form-control" placeholder="입력">
									</div>
								</div>
                        	</ax:td>
                    	</ax:tr>
	                </ax:tbl>
	            </ax:form>
				
				<div class="H40"></div>
				<div class="ax-button-group">
	            	<div class="left"><h5 style="color:red;"><b>*자율근무 스킬그룹에 대한 명칭 수정 및 그룹 삭제는 할 수 없습니다.</b></h5></div>
	            	<div class="right">
	             		<button type="button" class="btn btn-default" data-grid-view-01-btn="grpAdd"><i class="cqc-circle-with-plus"></i>그룹추가</button>
	             		<button type="button" class="btn btn-default" data-grid-view-01-btn="grpDel"><i class="cqc-circle-with-minus"></i>그룹삭제</button>
	             		<button type="button" class="btn btn-default" data-grid-view-01-btn="skg_excel"><i class="cqc-file-excel-o"></i> 엑셀</button> 
	            	</div>
	           	</div>	           		           	
				<div data-ax5grid="grid-view-skillGrp" data-fit-height-content="form-view-02" style="height: 300px;"></div>
			</ax:split-panel>
		</ax:split-layout>
    </jsp:body>
</ax:layout>