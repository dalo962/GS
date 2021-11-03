package com.soluvis.bake.management.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.utils.CookieUtils;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.management.domain.skillLvlChnMain;
import com.soluvis.bake.management.service.skillLvlChnMainService;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.utils.JWTSessionHandler;

/** 
 * @author gihyunpark
 * @desc   상담사 스킬 관리(기본)을 조회한다.
 */
@Controller
@RequestMapping(value = "/api/mng/skillLvlChnMain")
public class skillLvlChnMainController extends commController {

    @Inject
    private skillLvlChnMainService skillLvlChnMainService;

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    @RequestMapping(value="/selectDispSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectDispSkill(@Valid @RequestBody skillLvlChnMain reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		String tmpChnId = reqParam.getChnId().toString();
		String chnId = "";
		
		if(tmpChnId != null && !"".equals(tmpChnId))
		{
			chnId = "'" + tmpChnId.replace(";", "','") + "'";
		}
		map.put("compId", reqParam.getCompId());  
		map.put("chnId", chnId);
		
		logger.info("skillLvlChnMainService.selectDispSkill Query Start...");
		List<skillLvlChnMain> search = skillLvlChnMainService.selectDispSkill(map);
		
		return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkill(@Valid @RequestBody skillLvlChnMain reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 

		String tmpChnId = reqParam.getChnId().toString();
		String tmpSkillId = reqParam.getSkillId().toString();
		String skillName = reqParam.getSkillSelText().toString();
		String chnId = "";
		String skillId = "";
		
		if(tmpChnId != null && !"".equals(tmpChnId))
		{
			chnId = "'" + tmpChnId.replace(";", "','") + "'";
		}
						
		if(tmpSkillId != null && !"".equals(tmpSkillId))
		{
			skillId = "'" + tmpSkillId.replace(";", "','") + "'";
		}
		
		skillName = skillName.trim();

		map.put("compId", reqParam.getCompId()); 
		map.put("chnId", chnId); 
		map.put("skillId", skillId); 
		map.put("skillName", skillName);
			
		logger.info("skillLvlChnMainService.selectSkill Query Start...");
		List<skillLvlChnMain> search = skillLvlChnMainService.selectSkill(map);
		
		return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectAgtSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgtSkill(@Valid @RequestBody skillLvlChnMain reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 

		String tmpPartId = reqParam.getPartId().toString();
		String tmpTeamId = reqParam.getTeamId().toString();
		String partId = "";
		String teamId = "";
		
		if(tmpPartId != null && !"".equals(tmpPartId))
		{
			partId = "'" + tmpPartId.replace(";", "','") + "'";
		}
		
		if(tmpTeamId != null && !"".equals(tmpTeamId))
		{
			teamId = "'" + tmpTeamId.replace(";", "','") + "'";
		}
		
		String teamName = reqParam.getTeamName();
		
		String tmpAgtSelText = reqParam.getAgtSelText().toString();
		String tmpAgtList = reqParam.getAgtList().toString();

		String agtLogId = "";
		String agtLogName = "";
		
		if(tmpAgtList != null && !"".equals(tmpAgtList))
		{
			agtLogId = "'" + tmpAgtList.replace(";", "','") + "'";
		}
		
		if(tmpAgtSelText != null && !"".equals(tmpAgtSelText))
		{
			agtLogName = "'" + tmpAgtSelText.replace(";", "','") + "'";
		}
		
		String employeeid = reqParam.getEmployeeid();
		
		map.put("compId", reqParam.getCompId()); 
		map.put("partId", partId);
		map.put("teamId", teamId);
		map.put("teamName", teamName);
		
		map.put("agtLogId", agtLogId);
		
		map.put("agtLogName", agtLogName);
		
		map.put("agtId", employeeid);
		
		String agtSklLvl = reqParam.getSkillLevel();
		map.put("agtSklLvl", agtSklLvl);
		
		String dispSkillId = reqParam.getDispSkillId();
		map.put("dispSkillId", dispSkillId); 
				
		String skGrpId = reqParam.getSkGrpId();
		map.put("skGrpId", skGrpId); 
		
		String skGrpName = reqParam.getSkGrpName().toUpperCase();
		map.put("skGrpName", skGrpName);
		
		if("Y".equals(reqParam.getLoginCheck()))
		{
			map.put("loginCheck", 1);
		}
		else
		{
			map.put("loginCheck", 0);
		}
				
		logger.info("skillLvlChnMainService.selectAgtSkill Query Start...");
		List<skillLvlChnMain> search = skillLvlChnMainService.selectAgtSkill(map);
		
		return Responses.ListResponse.of(search);
    }
    
	@RequestMapping(value = "/saveAgtSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveAgtSkill(@Valid @RequestBody List<skillLvlChnMain> skillLvlChnMain, HttpServletRequest request, HttpServletResponse response) throws Exception {
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd();
        String user_name = user.getUserNm();
        
        logger.info("skillLvlChnMainService.saveAgtSkill Query Start...");
        skillLvlChnMainService.saveAgtSkill(user_cd, user_name, skillLvlChnMain);
        
    	return ok();
    }    
	
	
	@RequestMapping(value="/selectAgtTab", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgtTab(@Valid @RequestBody skillLvlChnMain reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		String logid = reqParam.getLogid().toString();
		String first_name = reqParam.getFirst_name().toString();
	
		map.put("logid", logid);  
		map.put("first_name", first_name);
		
		logger.info("skillLvlChnMainService.selectAgtTab Query Start...");
		List<skillLvlChnMain> search = skillLvlChnMainService.selectAgtTab(map);
		
		return Responses.ListResponse.of(search);
    }
}
