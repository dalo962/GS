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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/ivrManagement/ivrDeployMngHistory.js?version=2'/>"></script>
        <style>
		.grid-cell-pink {
			background:#FFC1C1;
		}
		.grid-cell-apricot {
			background:#FFE0C1;
		}
		.grid-cell-blue {
			background:#C1FFFF;
		}
		.grid-cell-green {
			background:#C1FFC1;
		}
		
		.grid-cell-red {
			background:#DC143C;
		}
		.grid-cell-lightblue {
			background:#4AA8D8;
		}
		.grid-cell-orange {
			background:#E97426;
		}
		.ax-mask .ax-mask-content .ax-mask-body.deploymng:before {content:''; position:absolute; top:0%; left:50%; right:50%; bottom:0%; margin-top:200px; margin-left:-110px; border-radius:6px; width:220px; height:220px;background:#fff url(/assets/images/sfmi/loading1.gif) no-repeat center center; z-index:10;}
		</style>  
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons></ax:page-buttons>
        <div role="page-header">
            <ax:form name="searchView0"> 
            	<ax:tbl clazz="ax-search-tbl" minWidth="500px">
                	<ax:tr>
                    	<ax:td label='기간' width="25%" labelWidth="150px">                    		
							<div class="input-group" data-ax5picker="date">
	                            <input type="text" name="startDate" id="startDate" class="form-control" placeholder="yyyy-mm-dd">
	                        	<span class="input-group-addon"><i class="cqc-calendar"></i></span>
		                        <span class="input-group-addon space_text">~</span>
	                            <input type="text" name="endDate" id="endDate" class="form-control" placeholder="yyyy-mm-dd">
	                            <span class="input-group-addon"><i class="cqc-calendar"></i></span>
	                        </div>
                        </ax:td>
                        <ax:td label='단계' width="25%" labelWidth="150px">
							<div class="form-group">
								<div id="stepSel" data-ax5select="stepSelect" data-ax5select-config="{}"></div>					
							</div>	
                    	</ax:td>
                    	<ax:td label='파일명' width="25%" labelWidth="150px">
							<div class="form-group">
								<input type="text" name="fileTxt" id="fileTxt" class="form-control">		
							</div>	
                    	</ax:td>
                	</ax:tr>
                </ax:tbl>
            	
            </ax:form>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="height:98%;">    
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="right">    
                        <button type="button" class="btn btn-danger" data-grid-view-01-btn="rollback"><i class="cqc-cw"></i> 원복</button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
        </ax:split-layout>
        
	</jsp:body>
</ax:layout>
