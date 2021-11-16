package com.soluvis.bakeGR.historyStat.controller;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.soluvis.bake.common.controller.SQLInjectionSafe;
import com.soluvis.bake.common.controller.SqlSafeUtil;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bakeGR.historyStat.service.agLogStatService;

/** 
 * @author gihyunpark
 * @desc   로그인 이력에 대한 내역을 조회한다
 */
@Controller
@RequestMapping(value = "/gr/api/hist/agLog")
public class agLogStatController extends commController{
	
	@Inject
	private agLogStatService agLogStatService;	
		
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	/** 
	 * @desc 포기호에 대한 상세내역을 조회한다
	 */ 
	@RequestMapping(value="/agLogSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> abanSearch(@Valid @SQLInjectionSafe HttpServletRequest request) throws Exception {
		Map<String,Object> params = RequestUtil.getParameterMap(request);			
		if("ALL".equals(params.get("comSelect")))
		{
			params.put("center", "");
		}
		else
		{
			params.put("center", SqlSafeUtil.getSqlInjectionSafe(params.get("comSelect").toString()));
		}
		//
		if("ALL".equals(params.get("deptSelect")))
		{
			params.put("grp", "");
		}
		else
		{
			params.put("grp", SqlSafeUtil.getSqlInjectionSafe(params.get("deptSelect").toString()));
		}
		//
		if("ALL".equals(params.get("teamSelect")))
		{
			params.put("team", "");
		}
		else
		{
			params.put("team", SqlSafeUtil.getSqlInjectionSafe(params.get("teamSelect").toString()));
		}
		//
		if(params.get("check") != null)
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
			if("id".equals(params.get("check")))
			{
				if("".equals(params.get("selText")))
				{
					params.put("id", "");
				}
				else
				{
					aglst = rep.toString().split(";");
					for(int j = 0; j < aglst.length; j ++)
					{
						agbf.append("'" + aglst[j].toString() + "',");
					}
					ag = agbf.toString().substring(0, agbf.toString().length() - 1);
					params.put("id", ag);
				}
				params.put("name", "");
			}
			else
			{
				if("".equals(params.get("selText")))
				{
					params.put("name", "");
				}
				else
				{
					aglst = rep.toString().split(";");
					for(int j = 0; j < aglst.length; j ++)
					{
						agbf.append("'" + aglst[j].toString() + "',");
					}
					ag = agbf.toString().substring(0, agbf.toString().length() - 1);
					params.put("name", ag);
				}
				params.put("id", "");
			}
		}
		else
		{
			params.put("id", "");
			params.put("name", "");
		}

		String[] agslst = {};
		StringBuffer agsbf = new StringBuffer(512);
		String ags = "";
		if("".equals(params.get("agentSelect")))
		{
			params.put("names", "");
		}
		else
		{
			SqlSafeUtil.getSqlInjectionSafe(params.get("agentSelect").toString());
			agslst = params.get("agentSelect").toString().split(";");
			for(int j = 0; j < agslst.length; j ++)
			{
				agsbf.append("'" + agslst[j].toString() + "',");
			}
			ags = agsbf.toString().substring(0, agsbf.toString().length() - 1);
			params.put("names", ags);
		}
		params.put("s_day", SqlSafeUtil.getSqlInjectionSafe(params.get("startDate").toString()));
		params.put("e_day", SqlSafeUtil.getSqlInjectionSafe(params.get("endDate").toString()));
		
		List<Map<String,Object>> search = agLogStatService.agLogSel(params);

		return search;
	}	
}

