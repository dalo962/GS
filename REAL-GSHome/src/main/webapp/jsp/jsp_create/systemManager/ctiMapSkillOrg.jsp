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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/systemManager/ctiMapSkillOrg.js?version=1' />"></script>
        <!-- excel 
        <script type="text/javascript" src="<c:url value='/assets/plugins-fix/tableExport.jquery.plugin-master/libs/js-xlsx/xlsx.core.min.js'/>"></script>
        <script type="text/javascript" src="<c:url value='/assets/plugins-fix/tableExport.jquery.plugin-master/libs/FileSaver/FileSaver.min.js'/>"></script>
        --> 
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
                        <ax:td label='ax.stat.common.search.channel' width="22%">
                        	<div class="form-group">
								<div id="selChannel" name="selChannel" data-ax5select="selChannel" data-ax5select-config="{}"></div>
							</div>	
                        </ax:td>
                        <ax:td label='ax.stat.common.search.skill' width="22%">
                        	<div class="form-group">
								<div id="selSkill" name="selSkill" data-ax5select="selSkill" data-ax5select-config="{}"></div>
							</div>	
                        </ax:td>
                        <ax:td label='ax.stat.common.search.ctiskill' width="22%">
                        	<input type="text" id="txtSkillName" name="txtSkillName" data-ax-path="txtSkillName" maxlength="50" class="av-required form-control W200" value="">
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            
            <div class="H10"></div>
        </div>


        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="300" style="padding-right: 10px;">

                <div class="ax-button-group" data-fit-height-aside="tree-view-01">
                    <div class="left">
                        <h2>
                            <i class="cqc-list"></i>
                            <ax:lang id="ax.management.ctiskillorg.title"/> </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-tree-view-01-btn="add"><i class="cqc-circle-with-plus"></i>소속 추가/변경</button>
                    </div>
                </div>

                <div data-z-tree="tree-view-01" data-fit-height-content="tree-view-01" style="height: 300px;" class="ztree"></div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel width="*" style="padding-left: 10px;" id="split-panel-form">

                <div data-fit-height-aside="form-view-01">
                
                    <div class="ax-button-group">
                        <div class="left">
                            <h2>
                                <i class="cqc-news"></i>
                                <ax:lang id="ax.management.ctiorg.cti"/> </h2>
                        </div>
                        <div class="right">

                        </div>
                    </div>

                    <ax:form name="formView01">
                    	<input type="hidden" name="compId" id="compId" value=""/>
                    	<input type="hidden" name="chnId" id="chnId" value=""/>
                    	<input type="hidden" name="id" id="id" value=""/>
                    	<input type="hidden" name="__modified__" id="__modified__" value=""/>
                        <ax:tbl clazz="ax-form-tbl" minWidth="500px">
                            <ax:tr labelWidth="150px">
                                <ax:td label="ax.management.ctiorg.company" width="48%">
                                    <input type="text" id="compName" name="compName" data-ax-path="compName" class="form-control" value="" readonly="readonly"/>
                                </ax:td>
                                <ax:td label="ax.management.ctiskillorg.skill.channel" width="52%">
                                    <input type="text" id="chnName" name="chnName"  data-ax-path="chnName" class="form-control" value="" readonly="readonly"/>
                                </ax:td>
                            </ax:tr>
                            <ax:tr labelWidth="150px">
                                <ax:td label="ax.management.ctiorg.skillDbid" width="48%">
                                    <input type="text" id="skillDbid" name="skillDbid"  data-ax-path="skillDbid" class="form-control" value=""/>
                                </ax:td>
                                <ax:td label="ax.management.ctiorg.skillName" width="52%">
                                    <input type="text" id="skillName" name="skillName"  data-ax-path="skillName" class="form-control" value=""/>
                                </ax:td>
                            </ax:tr>
                            <ax:tr labelWidth="150px">
                                <ax:td label="ax.management.ctiorg.dgroupDbid" width="48%">
                                    <input type="text" id="agroupDbid" name="agroupDbid"  data-ax-path="agroupDbid" class="form-control" value=""/>
                                </ax:td>
                                <ax:td label="ax.management.ctiorg.agroupName" width="52%">
                                    <input type="text" id="agroupName" name="agroupName"  data-ax-path="agroupName" class="form-control" value=""/>
                                </ax:td>
                            </ax:tr>
                        </ax:tbl>
                    </ax:form>
                
                    <div class="H20"></div>
                    <!-- 목록 -->
                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="cqc-list"></i>
                                <ax:lang id="ax.management.ctiskillorg.skill.detail"/> </h2>
                        </div>
                        <div class="right">
	                        <button type="button" class="btn btn-default" data-grid-view-01-btn="delete"><i class="cqc-circle-with-minus"></i> <ax:lang id="ax.admin.delete"/></button>
                        </div>
                    </div>
                </div>

                <div data-ax5grid="grid-view-01" data-fit-height-content="form-view-01" style="height: 300px;"></div>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>