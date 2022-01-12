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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/systemManager/progManager.js?version=1'/>"></script>
    </jsp:attribute>
    <jsp:body>
		<ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="300px">
					<ax:tr>
						<ax:td label='조회주기선택' width="22%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="proSelect" data-ax5select-config="{}"></div>							
							</div>	
                    	</ax:td>
                    	<ax:td label='기간' width="25%" labelWidth="100px">                    		
							<div class="input-group" data-ax5picker="date">
	                            <input type="text" name="startDate" id="startDate" class="form-control" placeholder="yyyy-mm-dd">
	                            <span class="input-group-addon">~</span>
	                            <input type="text" name="endDate" id="endDate" class="form-control" placeholder="yyyy-mm-dd">
	                            <span class="input-group-addon"><i class="cqc-calendar"></i></span>
	                        </div>
                        </ax:td>
                        <ax:td label='상태' width="22%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="state" data-ax5select-config="{}"></div>							
							</div>	
                    	</ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>

        <ax:split-layout name="ax1" orientation="horizontal">
            <ax:split-panel height="30%" style="padding-bottom: 10px;">

                <div class="ax-button-group" data-fit-height-aside="left-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>실행 시간 목록</h2>
                    </div>
                    <div class="right">
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="addtime">
                             	직접입력예약
                        </button>
                    	<button type="button" class="btn btn-default" data-grid-view-01-btn="start">
                             	선택예약
                        </button>
                        <!--  <button type="button" class="btn btn-default" data-grid-view-01-btn="startll">
                             	예약확인
                        </button>-->
                    </div>
                </div>

				<div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 100%;"></div>
				
            </ax:split-panel>
            <ax:splitter></ax:splitter> 
            <ax:split-panel height="70%" style="padding-bottom: 10px; height:84%;">
            	<ax:form name="searchView0">
					<ax:tbl id="hover" clazz="ax-search-tbl" minWidth="500px">
						<ax:tr>
							<ax:td label='시간입력' width="19%" labelWidth="100px">
								<div class="form-group">
									<input type="text" id="selText1" name="selText1" class="form-control">						
								</div>	
							</ax:td>
							<ax:td label='~' width="16%" labelWidth="30px">
								<div class="form-group">
									<input type="text" id="selText2" name="selText2" class="form-control">						
								</div>	
							</ax:td>
							<ax:td label='주기선택' width="17%" labelWidth="100px">
								<div class="form-group">
									<div data-ax5select="gubun" data-ax5select-config="{}"></div>							
								</div>	
							</ax:td>
						</ax:tr>
					</ax:tbl>
				</ax:form>
                <div class="ax-button-group" data-fit-height-aside="left-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>실행 결과 목록</h2>
                    </div>
                </div>
				<div data-ax5grid="grid-view-02" data-fit-height-content="grid-view-02" style="height: 100%;"></div>
            </ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>
