<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="system-auth-user-version" value="1.0.0"/>
<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" var="LANG" />
        <ax:script-lang key="ax.admin" var="COL" />
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-auth-user.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <!-- 검색바 -->
        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                    	<ax:td label='소속' width="18%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="comSelectWhere" data-ax5select-config="{}"></div>					
							</div>	
                    	</ax:td>
                    	<ax:td label='권한' width="18%" labelWidth="100px">
							<div class="form-group">
								<div data-ax5select="gunhanSelectWhere" data-ax5select-config="{}"></div>
							</div>		
                    	</ax:td>
                    	<ax:td label="이름/사번" width="300px">
                            <input type="text" name="filter" id="filter" class="form-control" value="" placeholder="<ax:lang id="ax.admin.input.search"/>"/>
                        </ax:td> 
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="40%" style="padding-right: 10px;">

                <!-- 목록 -->
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>
                            <ax:lang id="ax.admin.user.title"/>
                        </h2>
                    </div>
                    <div class="right"></div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel width="*" style="padding-left: 10px;" scroll="scroll">
				<div class="sys_auth_user">
	                <!-- 폼 -->
	                <div class="ax-button-group" role="panel-header">
	                    <div class="left">
	                        <h2><i class="cqc-news"></i>
	                            <ax:lang id="ax.admin.user.information"/>
	                            <h6>※ 권한 변경 시 재로그인[로그아웃] 필요</h6>
	                        </h2>	                        
	                    </div>
	                    <div class="right">
	                        <button type="button" class="btn btn-default" data-form-view-01-btn="form-clear">
	                            <i class="cqc-erase"></i>
	                            		초기화
	                            <!--<ax:lang id="ax.admin.clear"/>-->
	                        </button>
	                        <button type="button" class="btn btn-default" data-form-view-01-btn="form-delete">
	                            <i class="cqc-circle-with-minus"></i>
	                            <ax:lang id="ax.admin.delete"/>
	                        </button>
	                    </div>
	                </div>
	
	                <ax:form name="formView01">
	                	<input type="hidden" name="compId" id="compId" value=""/>
	                    
	                    <ax:tbl clazz="ax-form-tbl" minWidth="500px">
	                        <ax:tr labelWidth="120px">	                            
	                            <ax:td label="ax.admin.user.id" width="300px">
	                                <input type="text" id="userCd" name="userCd" data-ax-path="userCd" placeholder="사용자아이디(필수)" maxlength="100" title="아이디" class="av-required form-control W150" value=""/>
	                            </ax:td>
	                            <ax:td label="ax.admin.user.password" width="250px">
	                                <input type="password" id="userPs" name="userPs" data-ax-path="userPs" placeholder="사용자패스워드(초기 생성시 필수)" maxlength="128" class="form-control W120" value=""/>
	                            </ax:td>
	                        </ax:tr>
	                        <ax:tr labelWidth="120px">	                            
								<ax:td label="ax.admin.user.name" width="300px">
	                                <input type="text" id="userNm" name="userNm" data-ax-path="userNm" placeholder="사용자명(필수)" maxlength="15" title="이름" class="av-required form-control W120" value=""/>
	                            </ax:td>
	                            <ax:td label="소속" width="250px">
	                                <div class="form-group">
										<div id="company_cd" name="company_cd" data-ax5select="comSelect" data-ax5select-config="{}"></div>							
									</div>
								</ax:td>
	                        </ax:tr>
							<ax:tr labelWidth="120px">
	                            <ax:td label="ax.admin.user.email" width="300px">
	                                <input type="text" name="email" data-ax-path="email" maxlength="50" title="이메일" placeholder="abc@abc.com" class="av-email form-control" value=""/>
	                            </ax:td>
	                            <ax:td label="ax.admin.user.hp" width="250px">
	                                <input type="text" name="hpNo" data-ax-path="hpNo" maxlength="15" placeholder="010-1234-5678(번호만 입력)" class="av-phone form-control W120" data-ax5formatter="phone" value=""/>
	                            </ax:td>
	                        </ax:tr>
	                    </ax:tbl>
	
	                    <div class="H5"></div>
	                    <div class="ax-button-group sm">
	                        <div class="left">
	                            <h3><ax:lang id="ax.admin.user.menu.group.setting"/></h3>
	                        </div>
	                    </div>
	                    <ax:tbl clazz="ax-form-tbl">
	                        <ax:tr>
	                            <ax:td label="ax.admin.user.menu.group" width="250px">
	                                <ax:common-code groupCd="MENU_GROUP" dataPath="menuGrpCd"/>
	                            </ax:td>
	                        </ax:tr>
	                    </ax:tbl>
	
	                    <div class="H5"></div>
	                    <div class="ax-button-group sm">
	                        <div class="left">
	                            <h3><ax:lang id="ax.admin.user.auth.group.setting"/></h3>                            
	                        </div>
	                    </div>
	                    <ax:tbl clazz="ax-form-tbl">
	                        <ax:tr>
	                            <ax:td label="ax.admin.user.auth.group" width="100%">
	                                <ax:common-code groupCd="AUTH_GROUP" id="grpauthcd" dataPath="grpAuthCd" name="grpAuthCd" type="radio"/>
	                            </ax:td>
	                        </ax:tr>
	                    </ax:tbl>

	                    <div id="gird" data-ax5grid="grid-view-02" style="height: 300px; display:none"></div>
	
	                </ax:form>
				</div>
            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>