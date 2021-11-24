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

import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.controller.SQLInjectionSafe;
import com.soluvis.bake.common.controller.SqlSafeUtil;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bakeGR.historyStat.service.callTraceService;

/** 
 * @author gihyunpark
 * @desc   call에 대한 상세내역을 조회한다
 */
@Controller
@RequestMapping(value = "/gr/api/hist/callTr")
public class callTraceController extends commController{
	
	@Inject
	private callTraceService callTrService;	
		
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	/** 
	 * @desc call호에 대한 내역을 조회한다
	 */ 
	@RequestMapping(value="/callTrSearch", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> callTrSearch(@Valid @SQLInjectionSafe @RequestBody Map<String,Object> params, HttpServletRequest request) throws Exception {		
		//센터
		if("".equals(params.get("comSelect")))
		{
			params.put("center", "");
		}
		else
		{
			params.put("center", SqlSafeUtil.getSqlInjectionSafe(params.get("comSelect").toString()));
		}	

		//그룹
		if("".equals(params.get("deptSelect")))
		{
			params.put("dept_name", "");
		}
		else
		{
			params.put("dept_name", SqlSafeUtil.getSqlInjectionSafe(params.get("deptSelect").toString()));
		}	
		
		//팀
		if("".equals(params.get("teamSelect")))
		{
			params.put("team_name", "");
		}
		else
		{
			params.put("team_name", SqlSafeUtil.getSqlInjectionSafe(params.get("teamSelect").toString()));
		}
		
		String[] anilst = {};
		StringBuffer anibf = new StringBuffer(512);
		StringBuffer anitobf = new StringBuffer(512);
		String ani = "";
		String amo = "";
		String anito = "";
		//String anitomo = "";
		if("".equals(params.get("callText")))
		{
			params.put("ani", "");
		}
		else
		{
			String callText = SqlSafeUtil.getSqlInjectionSafe(params.get("callText").toString());
			callText = callText.replace("'", ";");
			callText = callText.replace("\"", ";");
			callText = callText.replace("(", ";");
			callText = callText.replace(")", ";");
			callText = callText.replace("--", ";");
			callText = callText.replace("#", ";");
			callText = callText.replace("=", ";");
			callText = callText.replace(",", ";");
			
			//anilst = params.get("callText").toString().split(";");
			anilst = callText.toString().split(";");
			for(int i = 0; i < anilst.length; i ++)
			{
				if("0".equals(anilst[i].toString().substring(0,1)))
				{
					//anitomo = anilst[i].toString().substring(1,anilst[i].toString().length());
					//anitomo = Encryption.encryptANI(anitomo);
					//anitobf.append("'" + anitomo + "',");
					anitobf.append("'" + anilst[i].toString().substring(1,anilst[i].toString().length()) + "',");					
				}
				else
				{
					//anitomo = "0" + anilst[i].toString();
					//anitomo = Encryption.encryptANI(anitomo);
					//anitobf.append("'" + anitomo + "',");
					anitobf.append("'" + "0" + anilst[i].toString() + "',");
				}
				//amo = Encryption.encryptANI(anilst[i].toString()); // 암호화
				amo = anilst[i].toString();				
				anibf.append("'" + amo.toString() + "',");
			}						
			ani = anibf.toString().substring(0, anibf.toString().length() - 1);
			anito = anitobf.toString().substring(0, anitobf.toString().length() - 1);
			params.put("ani", ani + "," + anito);
		}
		
		String[] aglst = {};
		StringBuffer agbf = new StringBuffer(512);
		String ag = "";
		if("".equals(params.get("agidText")))
		{
			params.put("agentid", "");
		}
		else
		{
			String agidText = SqlSafeUtil.getSqlInjectionSafe(params.get("agidText").toString());
			agidText = agidText.replace("'", ";");
			agidText = agidText.replace("\"", ";");
			agidText = agidText.replace("(", ";");
			agidText = agidText.replace(")", ";");
			agidText = agidText.replace("--", ";");
			agidText = agidText.replace("#", ";");
			agidText = agidText.replace("=", ";");
			agidText = agidText.replace(",", ";");
			
			//aglst = params.get("agidText").toString().split(";");
			aglst = agidText.toString().split(";");
			for(int j = 0; j < aglst.length; j ++)
			{
				agbf.append("'" + aglst[j].toString() + "',");
			}
			ag = agbf.toString().substring(0, agbf.toString().length() - 1);
			params.put("agentid", ag);
		}
		
		String[] conlst = {};
		StringBuffer conbf = new StringBuffer(512);
		String con = "";
		if("".equals(params.get("connidText")))
		{
			params.put("connid", "");
		}
		else
		{
			String connidText = SqlSafeUtil.getSqlInjectionSafe(params.get("connidText").toString());
			connidText = connidText.replace("'", ";");
			connidText = connidText.replace("\"", ";");
			connidText = connidText.replace("(", ";");
			connidText = connidText.replace(")", ";");
			connidText = connidText.replace("--", ";");
			connidText = connidText.replace("#", ";");
			connidText = connidText.replace("=", ";");
			connidText = connidText.replace(",", ";");
			
			//conlst = params.get("connidText").toString().split(";");
			conlst = connidText.toString().split(";");
			for(int j = 0; j < conlst.length; j ++)
			{
				conbf.append("'" + conlst[j].toString() + "',");
			}
			con = conbf.toString().substring(0, conbf.toString().length() - 1);
			params.put("connid", con);
		}
		
		params.put("s_day", SqlSafeUtil.getSqlInjectionSafe(params.get("startDate").toString().replace("-", "") + params.get("startTime").toString() + "00"));
		params.put("e_day", SqlSafeUtil.getSqlInjectionSafe(params.get("endDate").toString().replace("-", "") + params.get("endTime").toString() + "59"));		
		
		List<Map<String,Object>> search = callTrService.callTrSel(params);		

		return search;
	}	
	
	/** 
	 * @desc call호에 대한 상세내역을 조회한다
	 */ 
	@RequestMapping(value="/callTrSearchTab", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> callTrSearchTab(@Valid @SQLInjectionSafe HttpServletRequest request, String connid) throws Exception {
		Map<String,Object> params = RequestUtil.getParameterMap(request);			
		params.put("connidfst", SqlSafeUtil.getSqlInjectionSafe(connid));
		
		List<Map<String,Object>> connidsearch = callTrService.connidfsts(params);
		
		int connidsearchsize = connidsearch.size();
		StringBuffer connsbf = new StringBuffer(512);
		String conns = "";
		for(int i = 0; i < connidsearchsize; i++)
		{
			connsbf.append("'" + connidsearch.get(i).get("CONNID") + "',");
		}

		if(connsbf.length() > 0)
		{
			conns = connsbf.toString().substring(0, connsbf.toString().length() - 1);
		}
		else
		{
			conns = "'unknown'";
		}
		
		params.put("connid", conns);
		
		List<Map<String,Object>> search = callTrService.callTrTbSel(params);

		return search;
	}
	
	
	@RequestMapping(value="/sessionidget", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> sessionidget(@Valid @SQLInjectionSafe HttpServletRequest request, String connid) throws Exception {
		Map<String,Object> params = RequestUtil.getParameterMap(request);			
		params.put("conn_id", SqlSafeUtil.getSqlInjectionSafe(connid));
		
		List<Map<String,Object>> search = callTrService.sessionidget(params);
		
		return search;
	}
}

