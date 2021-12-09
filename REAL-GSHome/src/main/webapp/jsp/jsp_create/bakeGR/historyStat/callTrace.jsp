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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/bakeGR/historyStat/callTrace.js?version=1'/>"></script>
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons>
			<!--<button type="button" class="btn btn-fn1" data-page-btn="ivr"><i class="cqc-magnifier"></i> IvrTrace상세</button>-->
		</ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl dpt_statmode call_trace" minWidth="300px">
                    <ax:tr>
						<ax:td label='센터' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="comSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    	<ax:td label='브랜드' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="deptSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    	<ax:td label='팀' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="teamSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>                    	
                    </ax:tr>
                    <ax:tr>                    
                    	<ax:td label='기간' width="25%" labelWidth="100px">                    		
							<div class="input-group" data-ax5picker="date">
	                            <input type="text" name="startDate" id="startDate" class="form-control" placeholder="yyyy-mm-dd">
	                            <span class="input-group-addon"><i class="cqc-calendar"></i></span>
		                        <span class="input-group-addon space_text">~</span>  
	                            <input type="text" name="endDate" id="endDate" class="form-control" placeholder="yyyy-mm-dd">
	                            <span class="input-group-addon"><i class="cqc-calendar"></i></span>
	                        </div>
                        </ax:td>	
                        <ax:td id='ti_div' label='시간' width="25%" labelWidth="100px">
                        	<div class="input-group time_group">
                        	<div id="startTime" data-ax5select="startTime" style="width: 100px;"></div>
                        	<span class="input-group-addon">~</span>
                        	<div id="endTime" data-ax5select="endTime" style="width: 100px;"></div>
                    		</div>
                    	</ax:td>
                    	<ax:td label='상담사명' width="25%" labelWidth="100px">
							<div class="form-group">
								<input type="text" id="agidText" name="agidText" class="form-control" placeholder="입력(;으로구분)">						
							</div>	
                    	</ax:td>              	
                    </ax:tr>
                    <ax:tr>                    	
            			<ax:td label='CONNID' width="25%" labelWidth="100px">
							<div class="form-group">
								<input type="text" id="connidText" name="connidText" class="form-control" placeholder="입력(;으로구분)">						
							</div>	
                    	</ax:td>
                    	<ax:td label='전화번호' width="25%" labelWidth="100px">
							<div class="form-group">
								<input type="text" id="callText" name="callText" class="form-control" placeholder="입력(;으로구분)">						
							</div>	
                    	</ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="">
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>
