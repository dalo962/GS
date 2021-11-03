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
import com.soluvis.bake.management.domain.grpModHistory;
import com.soluvis.bake.management.service.grpModHistoryService;

/** 
 * @author gihyunpark
 * @desc   스킬 변경 이력을 조회한다.
 */
@Controller
@RequestMapping(value = "/api/mng/grpModHis")
public class grpModHistoryController extends commController {

    @Inject
    private grpModHistoryService grpModHistoryService;

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

    /** 
	 * @desc 스킬그룹 목록을 조회한다.(삭제된거까지 다)
	 */
    @RequestMapping(value="/selectHisGrpList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectHisGrpList(@Valid @RequestBody grpModHistory reqParam, HttpServletRequest request) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>(); 
		
    	logger.info("grpModHistoryService.selectHisGrpList Query Start...");
		List<grpModHistory> search = grpModHistoryService.selectHisGrpList(map);
		
		return Responses.ListResponse.of(search);
    } 
    
    /** 
	 * @desc 스킬 변경 이력을 조회한다.
	 */
    @RequestMapping(value="/selectHisList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgtList(@Valid @RequestBody grpModHistory reqParam, HttpServletRequest request) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>(); 
		
		String strDate = "";
		String endDate = "";
		strDate = reqParam.getStrDate();
		endDate = reqParam.getEndDate();
		
		if(strDate == null) strDate = "";
		if(endDate == null) endDate = "";
		
		map.put("compId", reqParam.getCompId()); 
		
		if("전체".equals(reqParam.getDeptNm()))
		{
			map.put("deptNm", "");
		}
		else
		{
			map.put("deptNm", reqParam.getDeptNm());
		}

		if("전체".equals(reqParam.getTeamNm()))
		{
			map.put("teamNm", "");
		}
		else
		{
			map.put("teamNm", reqParam.getTeamNm());
		}
		
		map.put("teamNm2", reqParam.getTeamNm2());
		
		String agId = "";
		if(reqParam.getAgId() != null && !"".equals(reqParam.getAgId()))
		{
			agId = "'" + reqParam.getAgId().toString().replace(";", "','") + "'";
		}
		
		map.put("agId", agId);
		

		map.put("agEmId", reqParam.getAgEmId());		
		map.put("agNm", reqParam.getAgNm());
				
		if("전체".equals(reqParam.getGrpNm()))
		{
			map.put("grpNm", "");
		}
		else
		{
			map.put("grpNm", reqParam.getGrpNm());
		}
		
		map.put("grpNm2", reqParam.getGrpNm2().toUpperCase());
		
		map.put("menuGb", reqParam.getMenuGb());
		
		if("".equals(reqParam.getMenuGb()))
		{			
			if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()))
			{
				map.put("sysadm", 1);
			}
			else
			{
				map.put("sysadm", 0);
			}
		}
		
		map.put("strDate", strDate);
		map.put("endDate", endDate);
		
		logger.info("grpModHistoryService.selectHisList Query Start...");
		List<grpModHistory> search = grpModHistoryService.selectHisList(map);
		
		return Responses.ListResponse.of(search);
    }  
}
