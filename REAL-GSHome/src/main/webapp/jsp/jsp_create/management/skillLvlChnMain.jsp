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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/management/skillLvlChnMain.js?version=1' />"></script>
    </jsp:attribute>
    <jsp:body>
    
        <ax:page-buttons></ax:page-buttons>
        <div role="page-header">
        </div>    
		<ax:split-layout name="ax1" orientation="vertical" style="height:100%">			
			<ax:split-panel width="*" style="padding-right: 10px; height:75%;">
	            <ax:form name="searchView">
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
	                        <ax:td label='ax.stat.common.search.team' width="34%">
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
	                    	<ax:td label='ax.stat.common.search.agent' width="32%" labelWidth="100px">
								<div class="form-group">
									<div data-ax5select="agentSelect" data-ax5select-config="{}"></div>
								</div>
	                    	</ax:td>
	                    	<ax:td label='시스템사번' width="32%" >
								<div class="form-group">
									<input type="text" id="selText" name="selText" class="form-control" placeholder="입력(;으로 구분)">
								</div>
	                    	</ax:td>
	                    	<ax:td label='인사사번' width="34%" >
								<div class="form-group">
									<input type="text" id="selemText" name="selemText" class="form-control" placeholder="입력">
								</div>
	                    	</ax:td>
	                    </ax:tr>
	                    <ax:tr>
	                        <ax:td label='ax.stat.common.search.skillLvl' width="32%">
	                        	<div class="form-group">
									<div id="selSkillLevel" name="selSkillLevel" data-ax5select="selSkillLevel" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>
	                        <ax:td label='ax.stat.common.search.skill' width="32%">
	                        	<div class="form-group">
									<div id="selDispSkill" name="selDispSkill" data-ax5select="selDispSkill" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>
	                        <ax:td label='ax.stat.common.search.skillGrp' width="34%">
								<div class="form-group">
									<div class="form-group"style="float:left;width:70%;">
										<div id="selSkillGrp" name="selSkillGrp" data-ax5select="selSkillGrp" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:30%;">
										<input type="text" id="selSkGrpName" name="selSkGrpName" class="form-control" placeholder="입력">
									</div>
								</div>
	                        </ax:td>
	                    </ax:tr>
	                </ax:tbl>
	            </ax:form>
	 
				<div class="ax-button-group">
					<div class="left"> <h2 id="personCnt" style="color:black;">(0명)</h2> </div>
					<div class="right"> <p class="chkeck"><input type="checkbox" id="loginCheck">로그인 여부 &nbsp;
					<button type="button" class="btn btn-default" data-grid-view-01-btn="agt_select"><i class="cqc-magnifier"></i> 조회</button>
					<button type="button" class="btn btn-default" data-grid-view-01-btn="agt_excel"><i class="cqc-file-excel-o"></i> 엑셀</button></p></div>
				</div>						
				<div data-ax5grid="grid-view-agt" data-fit-height-content="form-view-02" class="grid-view-agt"></div>
			</ax:split-panel>
			
			<ax:split-panel width="5%" style="padding-right: 10px;">
					<div style="position: absolute; text-align: center; transform: translate(-50%, -50%); left: 50%; top: 50%; ">
		           		<!-- 여기에 버튼이 두개 생겨야 해요 -->
		           		<button type="button" class="btn btn-default" data-grid-view-01-btn="skillAdd" style="width:100%;height:200%"><i class="cqc-circle-with-plus"></i>등록</button>
		           		<div class="H20"></div>
		           		<button type="button" class="btn btn-default" data-grid-view-01-btn="skillDel" style="width:100%;height:200%"><i class="cqc-circle-with-minus"></i>삭제</button>
		           	</div>
           	</ax:split-panel>
           	
			<ax:split-panel width="470" style="padding-left: 10px; height:75%;">
	            <ax:form name="searchViewSkill">
	                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
	                    <ax:tr>
	                        <ax:td label='매체' width="100%">
	                        	<div class="form-group">
									<div id="selChannel" name="selChannel" data-ax5select="selChannel" data-ax5select-config="{}"></div>
								</div>	
	                        </ax:td>
	                    </ax:tr>
	                    <ax:tr>
	                        <ax:td label='ax.stat.common.search.skill' width="100%">
								<div class="form-group">
									<div class="form-group"style="float:left;width:70%;">
										<div id="selSkill" name="selSkill" data-ax5select="selSkill" data-ax5select-config="{}"></div>
									</div>
									<div class="form-group" style="float:left;width:30%;">
										<input type="text" id="txtSkillName" name="txtSkillName" class="form-control" placeholder="입력">
									</div>
								</div>
	                        </ax:td>
	                    </ax:tr>               
	                </ax:tbl>
	            </ax:form>

				<div class="H42"></div>
				<div class="ax-button-group">
					<div class="right" width:"100%" >
						<label>스킬 레벨 : &nbsp;
							<input type="radio" name="chkLvl" id="1" value="1" checked="true"> 1 &nbsp;
							<input type="radio" name="chkLvl" id="2" value="2"> 2 &nbsp;
							<input type="radio" name="chkLvl" id="3" value="3"> 3 &nbsp;
							<input type="radio" name="chkLvl" id="9" value="9"> 9 &nbsp;
							<input type="radio" name="chkLvl" id="99" value="99"> 분배 제외 &nbsp;
						</label>
						<button type="button" class="btn btn-default" data-grid-view-01-btn="sk_select"><i class="cqc-magnifier"></i> 조회</button>
						<button type="button" class="btn btn-default" data-grid-view-01-btn="sk_excel"><i class="cqc-file-excel-o"></i> 엑셀</button>
					</div>	
				</div>
				<div data-ax5grid="grid-view-skill" data-fit-height-content="form-view-01" class="grid-view-skill"></div>
			</ax:split-panel>
		</ax:split-layout>
    </jsp:body>
</ax:layout>