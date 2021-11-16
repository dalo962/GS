<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<style>
.table-bill{width:100%;border-collapse:collapse;}
.table-bill td,.table-bill th{line-height:1.4em;padding:6px 10px 4px;text-align:center;vertical-align:middle}
.table-bill thead{border-bottom:2px solid #e7e7e7;background-color:#353942}
.table-bill tbody{border-bottom:2px solid #e7e7e7;background-color:#ffffff;}
.table-bill thead th{font-size:12px;font-weight:700;word-break:keep-all;color:#fff}
.table-bill tfoot{border-bottom:2px solid #e7e7e7;background-color:#fafafa}
.table-bill tbody tr th{font-weight:700;height:40px;}
.table-bill td,.table-bill th{font-size:12px;font-weight:400;height:35px;word-break:normal;border:1px solid #e1e8f2;}
.table-bill tbody tr:hover {background-color: #f9f9f9}
</style>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="baseStyle"/>

<ax:layout name="modal">
    <jsp:attribute name="script">   
    	<script src="/assets/plugins-fix/jquery-ui-1.12.1/jquery-ui-1.12.1/jquery-ui.js"></script>
        <ax:script-lang key="ax.script" />        
        <script type="text/javascript" src="<c:url value='/assets/js/view/js_create/bakeGR/historyStat/skWaitStatTab.js?version=1' />"></script>        
    </jsp:attribute>
    <jsp:attribute name="header">
        <h2 class="title">
            <i class="cqc-list"></i>
          	 항목설정
        </h2>
    </jsp:attribute>
    <jsp:body>
        <ax:page-buttons>
            <button type="button" class="btn btn-default" data-page-btn="save">저장</button>
            <button type="button" class="btn btn-default" data-page-btn="close">닫기</button>            
        </ax:page-buttons>
        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="overflow:auto">
            	<table id="sortable_table" class="table-bill">
            		<thead><tr><th>번호</th><th>그룹</th><th>항목</th><th>사용여부 <input type="checkbox" checked="checked" id="checkAll" onclick="checkAll();" /></th></tr></thead>
            		<tbody id="sortable_tbody"></tbody>
            	</table>
            </ax:split-panel>
        </ax:split-layout>
    </jsp:body>
</ax:layout>