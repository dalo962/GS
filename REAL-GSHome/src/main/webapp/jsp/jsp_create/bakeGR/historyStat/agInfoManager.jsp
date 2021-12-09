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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/bakeGR/historyStat/agInfoManager.js?version=1'/>"></script>
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons><button type="button" class="btn btn-fn1" data-page-btn="sample"> 템플릿 다운로드 </button></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl dpt_statmode login_his" minWidth="300px">
                	<ax:tr>
						<ax:td label="Excel업로드" labelWidth="150px" width="50%">
                       	    <input type="file" id="excel" class="from-control" style="width:50%"/>
                       	    <spen style="display:table-cell; text-align:left; padding-left:10px; padding-top:4px; vertical-align:middle;">※ 엑셀 재업로드는 파일 이름이 다른 파일이여야 하며,<br>&nbsp;&nbsp;&nbsp;파일 내용은 엑셀파일의 처음 Sheet1의 대한 내용만 읽습니다.</spen>
                       	</ax:td>
                    </ax:tr> 
                    <div class="H10"></div>
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
                        <ax:td label='상담사명' width="25%" labelWidth="100px">
							<div class="form-group">
								<input type="text" id="selText" name="selText" class="form-control" placeholder="입력(;으로구분)">								
							</div>	
                    	</ax:td>
                    	<ax:td label='직책' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="depSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    	<ax:td label='상담스킬그룹' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="skSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>     	
                    </ax:tr>
                    <ax:tr>
                    	<ax:td label='재직구분' width="25%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="workynSelect" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    	<ax:td label='입사기간' width="25%" labelWidth="100px">                    		
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
            <div class="H10"></div>
            	<b>※</b><b style="color:#FF0000">빨간색</b><b>으로 표기된 항목은 수정할 수 없습니다.</b>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="">
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>
