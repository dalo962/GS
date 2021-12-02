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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/bakeGR/historyStat/skWaitStat.js?version=1'/>"></script>
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons>			
			<p class="chkeck"><input type="checkbox" id="cb_sat">토요일 제외</p>
			<p class="chkeck"><input type="checkbox" id="cb_hol">휴일 제외</p>
			<p class="chkeck"><input type="checkbox" id="cb_hdt">휴일 만</p>
		</ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl dpt_statmode" minWidth="300px">
					<ax:tr>
						<ax:td label='센터' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="comSelect" data-ax5select-config="{}"></div>					
							</div>	
                    	</ax:td>
                    	<ax:td label='스킬' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="skSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    </ax:tr>
                    <ax:tr>
                    	<ax:td label='단위' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="interval" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
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
