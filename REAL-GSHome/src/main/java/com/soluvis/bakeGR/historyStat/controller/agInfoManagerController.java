package com.soluvis.bakeGR.historyStat.controller;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.controller.SQLInjectionSafe;
import com.soluvis.bake.common.controller.SqlSafeUtil;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bakeGR.historyStat.domain.agInfoManager;
import com.soluvis.bakeGR.historyStat.service.agInfoManagerService;

/** 
 * @author gihyunpark
 * @desc   상담사 정보관리를 조회한다
 */
@Controller
@RequestMapping(value = "/gr/api/hist/agInfo")
public class agInfoManagerController extends commController{
	
	@Inject
	private agInfoManagerService agInfoManagerService;	
		
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	/** 
	 * @desc 상담사 정보를 조회한다
	 */ 
	@RequestMapping(value="/agInfoDepSel", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<agInfoManager> agInfoDepSel(@Valid @SQLInjectionSafe HttpServletRequest request) throws Exception {
		List<agInfoManager> search = agInfoManagerService.agInfoDepSel();
		
		return search;
	}
	/** 
	 * @desc 상담사 정보를 조회한다
	 */ 
	@RequestMapping(value="/agInfoSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<agInfoManager> agInfoSearch(@Valid @SQLInjectionSafe HttpServletRequest request) throws Exception {
		Map<String,Object> params = RequestUtil.getParameterMap(request);
		params.put("compid", params.get("comSelect"));
		params.put("deptid", "");		
		params.put("teamid", "");
		params.put("agent_name", "");
		params.put("dep", "");
		params.put("sk", "");		
		params.put("workyn", "");		
		
		if(!"".equals(params.get("deptSelect")))
		{
			params.put("deptid", params.get("deptSelect"));
		}
		
		if(!"".equals(params.get("teamSelect")))
		{
			params.put("teamid", params.get("teamSelect"));
		}
		
		if(params.get("selText") != null && !"".equals(params.get("selText")))
		{
			String rep = SqlSafeUtil.getSqlInjectionSafe(params.get("selText").toString());
			rep = rep.toString().replace("'", ";");
			rep = rep.toString().replace("\"", ";");
			rep = rep.toString().replace("(", ";");
			rep = rep.toString().replace(")", ";");
			rep = rep.toString().replace("--", ";");
			rep = rep.toString().replace("#", ";");
			rep = rep.toString().replace("=", ";");
			rep = rep.toString().replace(",", ";");
			
			String[] aglst = {};
			StringBuffer agbf = new StringBuffer(512);
			String ag = "";
			
			aglst = rep.toString().split(";");
			for(int j = 0; j < aglst.length; j ++)
			{
				agbf.append("'" + aglst[j].toString() + "',");
			}
			ag = agbf.toString().substring(0, agbf.toString().length() - 1);
			params.put("agent_name", ag);
		}
		
		if(!"".equals(params.get("depSelect")))
		{
			params.put("dep", params.get("depSelect"));
		}
		
		if(!"전체".equals(params.get("skSelect")))
		{
			params.put("sk", params.get("skSelect"));
		}
		
		if(!"".equals(params.get("workynSelect")))
		{
			params.put("workyn", params.get("workynSelect"));
		}
		
		params.put("s_day", SqlSafeUtil.getSqlInjectionSafe(params.get("startDate").toString().replaceAll("-", "")));
		params.put("e_day", SqlSafeUtil.getSqlInjectionSafe(params.get("endDate").toString().replaceAll("-", "")));
		
		List<agInfoManager> search = agInfoManagerService.agInfoSel(params);
		
		if(search.size() > 0)
		{
			String joindt = "";
			String leavedt = "";
			for(int i=0; i < search.size(); i++)
			{
				if(!"".equals(search.get(i).getJoin_date()) && null != search.get(i).getJoin_date())
				{
					joindt = search.get(i).getJoin_date().toString().substring(0, 4) + "-" + search.get(i).getJoin_date().toString().substring(4, 6) + "-" + search.get(i).getJoin_date().toString().substring(6, 8);
					
					search.get(i).setJoin_date(joindt); 
				}
				
				if(!"".equals(search.get(i).getLeave_date()) && null != search.get(i).getLeave_date())
				{
					leavedt = search.get(i).getLeave_date().toString().substring(0, 4) + "-" + search.get(i).getLeave_date().toString().substring(4, 6) + "-" + search.get(i).getLeave_date().toString().substring(6, 8);
					
					search.get(i).setLeave_date(leavedt); 
				}
			}
		}
		
		return search;
	}
	
	/** 
	 * @desc 상담사 정보를 수정한다
	 */
	@RequestMapping(value = "/agInfoUpdate", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse agInfoSearch(@Valid @RequestBody List<agInfoManager> info, HttpServletRequest request) throws Exception {	
		Map<String,Object> params = RequestUtil.getParameterMap(request);
		
		for (agInfoManager io : info)
		{			
			if(AXBootTypes.DataStatus.MODIFIED.equals(io.getDataStatus()))
			{
				if(io.getDep_nm() == null || "".equals(io.getDep_nm())) 
				{ params.put("dep_nm", ""); } 
				else { params.put("dep_nm", io.getDep_nm()); };
				
				if(io.getJoin_date() == null || "".equals(io.getJoin_date())) 
				{ params.put("join_date", ""); } 
				else { params.put("join_date", io.getJoin_date().replaceAll("-", "")); };
				
				if(io.getWork_time() == null || "".equals(io.getWork_time())) 
				{ params.put("work_time", ""); } 
				else { params.put("work_time", io.getWork_time()); };
				
				if(io.getWork() == null || "".equals(io.getWork())) 
				{ params.put("work", ""); } 
				else { params.put("work", io.getWork()); };
				
				if(io.getAge() == null || "".equals(io.getAge())) 
				{ params.put("age", ""); } 
				else { params.put("age", io.getAge()); };
				
				if(io.getMey_yn() == null || "".equals(io.getMey_yn())) 
				{ params.put("mey_yn", ""); } 
				else { params.put("mey_yn", io.getMey_yn()); };
				
				if(io.getGender() == null || "".equals(io.getGender())) 
				{ params.put("gender", ""); } 
				else { params.put("gender", io.getGender()); };
				
				if(io.getWork_yn() == null || "".equals(io.getWork_yn())) 
				{ params.put("work_yn", ""); } 
				else { params.put("work_yn", io.getWork_yn()); };
				
				if(io.getLeave_date() == null || "".equals(io.getLeave_date())) 
				{ params.put("leave_date", ""); } 
				else { params.put("leave_date", io.getLeave_date().replaceAll("-", "")); };
				
				params.put("agent_id", io.getAgent_id());
				//System.out.println(params);
				
				agInfoManagerService.agInfoUdt(params);
			}
		}		
		return ok();		
	}	
}

