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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/management/skillGrpTab.js?version=1'/>"></script>
    </jsp:attribute>
    <jsp:attribute name="header">
        <h2 class="title">
            <i class="cqc-list"></i>
          	  	<b id="skgnm"></b>
        </h2>
    </jsp:attribute>
    
    <jsp:body>
		<ax:page-buttons>
			<button type="button" class="btn btn-default" data-page-btn="save">저장</button>
            <button type="button" class="btn btn-default" data-page-btn="close">닫기</button>            
        </ax:page-buttons>


				
        <ax:split-layout name="ax1" orientation="vertical">
        	<div class="ax-button-group">
					<div class="right" width:"100%" >
						<label>스킬 레벨 : &nbsp;
							<input type="radio" name="chkLvl" id="1" value="1" checked="true"> 1 &nbsp;
							<input type="radio" name="chkLvl" id="2" value="2"> 2 &nbsp;
							<input type="radio" name="chkLvl" id="3" value="3"> 3 &nbsp;
							<input type="radio" name="chkLvl" id="9" value="9"> 9 &nbsp;
							<input type="radio" name="chkLvl" id="99" value="99"> 분배 제외
						</label>
					</div>	
				</div>
        	<ax:split-panel width="*" style="height:88%;">
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height:300px;"></div>
            </ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>