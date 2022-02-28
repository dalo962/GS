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
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/ivrManagement/ivrDeployMngSimple.js?version=2'/>"></script>      
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
		<ax:page-buttons><button type="button" class="btn btn-info" data-page-btn="upload" style="padding-left:10px;">업로드 </button></ax:page-buttons>
        <div role="page-header">
            <ax:form name="searchView0"> 
            	<ax:tbl clazz="ax-search-tbl" minWidth="500px">                    	
					<ax:tr>
						<ax:td label="파일업로드" labelWidth="150px" width="50%">
                       	    <input type="file" id="fileupload" class="from-control" style="width:50%" multiple="multiple"/>
                       	    <spen id="fileupload_text" style="display:table-cell; text-align:left; padding-left:10px; padding-top:4px; vertical-align:middle;">※ 파일리스트</spen>
                       	</ax:td>
                    </ax:tr>
                    <ax:tr>
                    	<ax:td label='디렉토리' width="25%" labelWidth="150px">
							<div class="form-group">
								<input type="text" name="dirTxt" id="dirTxt" class="form-control">		
							</div>
						</ax:td>
						<ax:td label='사유' width="25%" labelWidth="150px">
							<div class="form-group">
								<input type="text" name="discTxt" id="discTxt" class="form-control">		
							</div>
						</ax:td>
						<ax:td>
							<div class="form-group">
								<button type="button" class="btn btn-primary"" data-grid-view-01-btn="dirInsert" style="margin-top: 7px;"><i class="cqc-forward"></i> 작성</button>		
							</div>
						</ax:td>
                    </ax:tr>                   
                </ax:tbl>   
            </ax:form>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="height:98%;">    
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                	<div class="left">
                		<h5><b>※ 배포 프로세스 - 업로드 > 작성 > 배포 > 완료 순으로 진행.</b></h5>
               		</div>
                    <div class="right">    
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="delete"><i class="cqc-circle-with-minus"></i> <ax:lang id="ax.admin.delete"/></button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="save"><i class="cqc-save"></i> <ax:lang id="ax.admin.save"/></button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
                <form class="dummy-form" style="display:none;" method="post" enctype="multipart/form-data"></form>
            </ax:split-panel>
            
            <ax:split-panel width="5%" style="padding-right: 10px;">
            		<div style="position: absolute; text-align: center; transform: translate(-50%, -50%); left: 50%; top: 50%; ">
		           		<button type="button" class="btn btn-primary" data-grid-view-01-btn="deploy" style="width:100%;height:30px;border:1px;"><i class="cqc-forward"></i> 배포</button>
		           		<div class="H20"></div>
		           		<button type="button" class="btn btn-danger" data-grid-view-01-btn="rollback" style="width:100%;height:30px;border:1px;"><i class="cqc-cw"></i> 원복</button>
		           		<div class="H20"></div>
		           		<div class="H20"></div>
		           		<button type="button" class="btn btn-primary" data-grid-view-01-btn="complete" style="width:100%;height:30px;border:1px;"><i class="cqc-checkmark"></i> 완료</button>
		           	</div>
           	</ax:split-panel>
        </ax:split-layout>
	</jsp:body>
</ax:layout>
