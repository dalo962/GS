package com.soluvis.bake.management.controller;

import java.text.SimpleDateFormat;
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

import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.management.domain.skillLvlSummary;
import com.soluvis.bake.management.service.skillLvlSummaryService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;

/** 
 * @author gihyunpark
 * @desc   스킬 그룹 요약을 조회한다.
 */
@Controller
@RequestMapping(value = "/api/mng/skillLvlSummary")
public class skillLvlSummaryController extends commController {

	@Inject
	private skillLvlSummaryService skillLvlSummaryService;
    
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

	MDCLoginUser loginUser;
	
	/** 
	 * @desc 스킬 그룹 요약 목록을 조회한다
	 */
    @RequestMapping(value="/selectSummaryList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSummaryList(@Valid @RequestBody skillLvlSummary reqParam, HttpServletRequest request) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>(); 
    	map.put("compId", reqParam.getCompId());
    	map.put("gpName", reqParam.getGpName().toUpperCase());
    	
    	String[] gplist = {};
		StringBuffer gpbf = new StringBuffer(512);
		String gp = "";
		if("".equals(reqParam.getGpId()))
		{
			map.put("gpId", "");
		}
		else
		{
			gplist = reqParam.getGpId().toString().split(";");
			for(int j = 0; j < gplist.length; j ++)
			{
				gpbf.append(gplist[j].toString() + ",");
			}
			gp = gpbf.toString().substring(0, gpbf.toString().length() - 1);
			map.put("gpId", gp);
		}
    	
		String[] sklist = {};
		StringBuffer skbf = new StringBuffer(512);
		String sk = "";
		if("".equals(reqParam.getSkId()))
		{
			map.put("skId", "");
		}
		else
		{
			sklist = reqParam.getSkId().toString().split(";");
			for(int j = 0; j < sklist.length; j ++)
			{
				skbf.append(sklist[j].toString() + ",");
			}
			sk = skbf.toString().substring(0, skbf.toString().length() - 1);
			map.put("skId", sk);
		}
		
		if("Y".equals(reqParam.getLoginCheck()))
		{
			map.put("loginchk", 1);
		}
		else
		{
			map.put("loginchk", 0);
		}
		
		logger.info("skillLvlSummaryService.selectSummary Query Start...");
    	List<skillLvlSummary> search = skillLvlSummaryService.selectSummary(map);
    	
		return Responses.ListResponse.of(search);
    }  
    
    /** 
	 * @desc 각 소속 별로 스킬을 세팅한다
	 */
    @RequestMapping(value="/selectSkList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkList(@Valid @RequestBody skillLvlSummary reqParam, HttpServletRequest request) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>(); 
    	map.put("compId", reqParam.getCompId());
    	
    	logger.info("skillLvlSummaryService.selectSkList Query Start...");
    	List<skillLvlSummary> search = skillLvlSummaryService.selectSkList(map);
    	
		return Responses.ListResponse.of(search);
    } 
    
    /** 
	 * @desc 인원 클릭시 상담사 모록을 조회한다
	 */
    @RequestMapping(value="/selectAgList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgList(@Valid @RequestBody skillLvlSummary reqParam, HttpServletRequest request) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>(); 
    	map.put("gpId", reqParam.getGpId());
    	
    	if("Y".equals(reqParam.getLoginCheck()))
		{
			map.put("loginCheck", 1);
		}
		else
		{
			map.put("loginCheck", 0);
		}
    	
    	logger.info("skillLvlSummaryService.selectAgList Query Start...");
    	List<skillLvlSummary> search = skillLvlSummaryService.selectAgList(map);
    	
		return Responses.ListResponse.of(search);
    } 
}
