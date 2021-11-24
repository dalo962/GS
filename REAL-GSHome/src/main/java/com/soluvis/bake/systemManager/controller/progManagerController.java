package com.soluvis.bake.systemManager.controller;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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
import com.soluvis.bake.common.controller.SqlSafeUtil;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.bake.systemManager.domain.progManager;
import com.soluvis.bake.systemManager.service.progManagerService;

/** 
 * @author gihyunpark
 * @desc   스토어 프로시저에 대한 결과를 확인하며 수동 배치를 실행한다
 */
@Controller
@RequestMapping(value = "/api/progMng")
public class progManagerController extends commController{
	
	@Inject
	private progManagerService progMngService;	
		
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	/** 
	 * @desc 스토어프로시져 목록과 전체를 조회하여 세팅한다
	 */ 
	@RequestMapping(value="/procLst", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody List<progManager> procLst(@Valid HttpServletRequest request) throws Exception {
		int chk = 1;
		List<progManager> search = null;
				
		if(chk > 0)
		{
			search = progMngService.progListSel();
		}
		
		return search;
	}
	
	@RequestMapping(value="/pensel", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody List<progManager> pensel(@Valid HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		map.put("agg_time", "");
		map.put("agg_gubun", "");
		map.put("agg_flag", "");
		
		int chk = 1;
		List<progManager> search = null;
				
		if(chk > 0)
		{
			search = progMngService.penSel(map);
		}
		return search;
	}
	
	/** 
	 * @desc 프로시저에 대한 실행경과 목록을 가져온다
	 */
	@RequestMapping(value="/progMngSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<progManager> progMngSearch(@Valid HttpServletRequest request, String startDate, String endDate, String statgubun, String exp) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		if("ALL".equals(statgubun))
		{
			statgubun = "";
		}
		if(startDate == null)
		{
			startDate = "";
		}
		if(endDate == null)
		{
			endDate = "";
		}
		if("ALL".equals(exp))
		{
			exp = "";
		}
		//System.out.println(exp);
		
		map.put("statgubun",statgubun);
		map.put("s_day", SqlSafeUtil.getSqlInjectionSafe(startDate));
		map.put("e_day", SqlSafeUtil.getSqlInjectionSafe(endDate));
		map.put("exp", SqlSafeUtil.getSqlInjectionSafe(exp));
		
		int chk = 1;
		List<progManager> search = null;
				
		if(chk > 0)
		{
			search = progMngService.histSel(map);
		}
		return search;
	}
	
	/** 
	 * @desc 프로시저에 대한 실행경과 시간 목록을 가져온다
	 */
	@RequestMapping(value="/targetTimeSel", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<progManager> targetTimeSel(@Valid HttpServletRequest request, String startDate, String endDate, String targettable, String statgubun) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("targettable", SqlSafeUtil.getSqlInjectionSafe(targettable));
		map.put("statgubun",statgubun);
		map.put("s_day", SqlSafeUtil.getSqlInjectionSafe(startDate));
		map.put("e_day", SqlSafeUtil.getSqlInjectionSafe(endDate));

		int chk = 1;
		List<progManager> search = null;
				
		if(chk > 0)
		{
			search = progMngService.histTarget(map);
		}
		
		return search;
	}
	
	/** 
	 * @desc 프로시저에 대한 예약값을 insert한다(선택)
	 */
	@RequestMapping(value = "/proPend", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse proPend(@Valid @RequestBody List<progManager> prog, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		List<progManager> search = null;
		
		if("system".equals(cid))
		{
			return ok("system");
		}
		
		int chk = 1;
		if(chk > 0)
		{
			for (progManager pg : prog)
			{	
				if(AXBootTypes.DataStatus.ORIGIN.equals(pg.getDataStatus()) || AXBootTypes.DataStatus.CREATED.equals(pg.getDataStatus()))
				{
					map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(pg.getTargettime()));
					map.put("agg_gubun", pg.getStatgubun());
					
					if("10(5MIN)".equals(pg.getStatgubun()) || "20(15MIN)".equals(pg.getStatgubun()) || "30(1HOUR)".equals(pg.getStatgubun()) || "31(1DAY)".equals(pg.getStatgubun()) || "40(1DAY)".equals(pg.getStatgubun()) || "50(1MONTH)".equals(pg.getStatgubun()))
					{
						map.put("agg_flag", "R");
					}				
					
					search = progMngService.penSel(map);
					
					if(search.size() > 0)
					{
						return ok("Fail");
					}
					map.put("created_by", SqlSafeUtil.getSqlInjectionSafe(cid));
	
					//int result = progMngService.penIst(map);
					progMngService.penIst(map);
				}			
			}		
		}
		return ok();
	}
	
	@RequestMapping(value="/proPend2", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody int proPend2(@Valid HttpServletRequest request, String targettime1, String targettime2, String statgubun) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
				
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
				
		String targettable = "R";
		String targetbcs = "L";
		
		int result = -1;
		List<progManager> search = null;
		
		if("system".equals(cid))
		{
			result = -2;
			return result; 
		}
			
		Calendar scal = Calendar.getInstance();
		Calendar ecal = Calendar.getInstance();
		
		int chk = 1;
		if(chk > 0)
		{
			if("10(5MIN)".equals(statgubun))
			{
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
				
				Date sdt = sdf.parse(targettime1);
				Date edt = sdf.parse(targettime2);
				
				scal.setTime(sdt);
				ecal.setTime(edt);
				
				long re = (edt.getTime() - sdt.getTime())/1000/60;
				long gab = re / 5;
				
				for(int i=0; i <= gab; i++)
				{								
					if(i == 0)
					{
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(targettime1));
					}
					else
					{
						scal.add(Calendar.MINUTE, 5);
						Date d3 = scal.getTime();
						String first = sdf.format(d3);
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(first));
					}				
					map.put("agg_gubun", statgubun);				
					map.put("agg_flag", SqlSafeUtil.getSqlInjectionSafe(targettable));
					search = progMngService.penSel(map);
							
					if(search.size() > 0)
					{
						return result;
					}
					map.put("created_by", SqlSafeUtil.getSqlInjectionSafe(cid));
	
					result = progMngService.penIst(map);
				}
			}
			else if("20(15MIN)".equals(statgubun))
			{
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
				
				Date sdt = sdf.parse(targettime1);
				Date edt = sdf.parse(targettime2);
				
				scal.setTime(sdt);
				ecal.setTime(edt);
				
				long re = (edt.getTime() - sdt.getTime())/1000/60;
				long gab = re / 15;
				
				for(int i=0; i <= gab; i++)
				{								
					if(i == 0)
					{
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(targettime1));
					}
					else
					{
						scal.add(Calendar.MINUTE, 15);
						Date d3 = scal.getTime();
						String first = sdf.format(d3);
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(first));
					}				
					map.put("agg_gubun", statgubun);				
					map.put("agg_flag", SqlSafeUtil.getSqlInjectionSafe(targettable));
					search = progMngService.penSel(map);
							
					if(search.size() > 0)
					{
						return result;
					}
					map.put("created_by", SqlSafeUtil.getSqlInjectionSafe(cid));
	
					result = progMngService.penIst(map);
				}
			}
			else if("30(1HOUR)".equals(statgubun))
			{
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHH");
				
				Date sdt = sdf.parse(targettime1);
				Date edt = sdf.parse(targettime2);
				
				scal.setTime(sdt);
				ecal.setTime(edt);
				
				long re = (edt.getTime() - sdt.getTime())/1000/60/60;
				long gab = re / 1;
				
				for(int i=0; i <= gab; i++)
				{								
					if(i == 0)
					{
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(targettime1));
					}
					else
					{
						scal.add(Calendar.HOUR, 1);
						Date d3 = scal.getTime();
						String first = sdf.format(d3);
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(first));
					}				
					map.put("agg_gubun", statgubun);				
					map.put("agg_flag", SqlSafeUtil.getSqlInjectionSafe(targettable));
					search = progMngService.penSel(map);
							
					if(search.size() > 0)
					{
						return result;
					}
					map.put("created_by", SqlSafeUtil.getSqlInjectionSafe(cid));
	
					result = progMngService.penIst(map);
				}
			}
			else if("31(1DAY)".equals(statgubun) || "40(1DAY)".equals(statgubun))
			{
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
				
				Date sdt = sdf.parse(targettime1);
				Date edt = sdf.parse(targettime2);
				
				scal.setTime(sdt);
				ecal.setTime(edt);
				
				long re = (edt.getTime() - sdt.getTime())/1000/60/60/24;
				long gab = re / 1;
				
				for(int i=0; i <= gab; i++)
				{								
					if(i == 0)
					{
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(targettime1));
					}
					else
					{
						scal.add(Calendar.DAY_OF_MONTH, 1);
						Date d3 = scal.getTime();
						String first = sdf.format(d3);
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(first));
					}				
					map.put("agg_gubun", statgubun);				
					map.put("agg_flag", SqlSafeUtil.getSqlInjectionSafe(targettable));
					search = progMngService.penSel(map);
							
					if(search.size() > 0)
					{
						return result;
					}
					map.put("created_by", SqlSafeUtil.getSqlInjectionSafe(cid));
	
					result = progMngService.penIst(map);
				}
			}
			else if("50(1MONTH)".equals(statgubun))
			{
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
				
				Date sdt = sdf.parse(targettime1);
				Date edt = sdf.parse(targettime2);
				
				scal.setTime(sdt);
				ecal.setTime(edt);
				
				long re = (edt.getTime() - sdt.getTime())/1000/60/60/24/30;
				long gab = re / 1;
				
				for(int i=0; i <= gab; i++)
				{								
					if(i == 0)
					{
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(targettime1));
					}
					else
					{
						scal.add(Calendar.MONTH, 1);
						Date d3 = scal.getTime();
						String first = sdf.format(d3);
						map.put("agg_time", SqlSafeUtil.getSqlInjectionSafe(first));
					}				
					map.put("agg_gubun", statgubun);				
					map.put("agg_flag", SqlSafeUtil.getSqlInjectionSafe(targettable));
					search = progMngService.penSel(map);
							
					if(search.size() > 0)
					{
						return result;
					}
					map.put("created_by", SqlSafeUtil.getSqlInjectionSafe(cid));
	
					result = progMngService.penIst(map);
				}
			}
			else if("WINK2->WINK1".equals(statgubun))
			{
				map.put("targettime1", SqlSafeUtil.getSqlInjectionSafe(targettime1));
				map.put("targettime2", SqlSafeUtil.getSqlInjectionSafe(targettime2));
				
				result = progMngService.winkDataAgg(map);
				result = 0;
			}
			else if("AX_A_STRUCT".equals(statgubun))
			{
				map.put("targettime1", SqlSafeUtil.getSqlInjectionSafe(targettime1));
				
				result = progMngService.axastruct(map);
				result = 0;
			}	
		}
		return result; 
	}
}

