package com.soluvis.bakeGR.ivrManagement.controller;

import java.text.SimpleDateFormat;
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
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnis;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRDnisService;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRUrlListService;

/** 
 * @author gihyunpark
 * @desc   ivr 블랙컨슈머 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrDnis")
public class ivrGRDnisController extends commController{
	
	@Inject
	private ivrGRDnisService ivrGRDnisService;	
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc 대표번호 목록을 조회한다
	 */
	@RequestMapping(value="/DnisSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRDnis> DnisSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<ivrGRDnis> search = null;		
		
		try
		{
			logger.info("ivrGRDnisService.DnisGet Query Start...");			
			search = ivrGRDnisService.DnisGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
	
	
	/** 
	 * @desc 대표번호 목록을 수정한다
	 */
	@RequestMapping(value = "/DnisSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse DnisSave(@Valid @RequestBody List<ivrGRDnis> hlLst, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRDnis> search = null;
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		int result = 0; 
		int sqlrst = 0;
		String msg = "success";
		
		try
		{
			for (ivrGRDnis hl : hlLst)
			{
				map.put("dnis", hl.getDnis());
								
				if(AXBootTypes.DataStatus.CREATED.equals(hl.getDataStatus()))
				{		
					search = ivrGRDnisService.DnisGet(map);
					int searchSize = search.size();
					
					if(searchSize == 0)
					{
						map.put("dnis_useyn", hl.getDnis_useyn());
						map.put("dnis_name", hl.getDnis_name());
						map.put("crt_dt", sdf.format(new Date()));
						map.put("crt_by", cid);
						
						logger.info("ivrGRDnisService.DnisIst Query Start...");
						sqlrst = ivrGRDnisService.DnisIst(map);
					}
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(hl.getDataStatus()))
				{
					map.put("dnis_useyn", hl.getDnis_useyn());
					map.put("dnis_name", hl.getDnis_name());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrGRDnisService.DnisUdt Query Start...");
					sqlrst = ivrGRDnisService.DnisUdt(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(hl.getDataStatus()))
				{
					logger.info("ivrGRDnisService.DnisDel Query Start...");
					sqlrst = ivrGRDnisService.DnisDel(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}			
			}
		}
		catch(Exception e)
		{
			System.out.println(e.getStackTrace());
			logger.error(e.toString());
		}
		return ok(msg);		
	}	
	
	/** 
	 * @desc 사용중인 대표번호 목록을 조회한다
	 */
	@RequestMapping(value="/DnisSearchY", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRDnis> DnisSearchY(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<ivrGRDnis> search = null;		
		
		try
		{
			map.put("dnis_useyn", "1");
			logger.info("ivrGRDnisService.DnisGet Query Start...");			
			search = ivrGRDnisService.DnisGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
}

