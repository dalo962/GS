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
import com.soluvis.bake.management.domain.skillLvlChnGrp;
import com.soluvis.bake.management.service.skillLvlChnGrpService;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.utils.JWTSessionHandler;

/** 
 * @author gihyunpark
 * @desc   상담사 스킬 관리(그룹)을 조회한다.
 */
@Controller
@RequestMapping(value = "/api/mng/skillLvlChnGrp")
public class skillLvlChnGrpController extends commController {

    @Inject
    private skillLvlChnGrpService skillLvlChnGrpService;

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    @RequestMapping(value="/selectDispSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectDispSkill(@Valid @RequestBody skillLvlChnGrp reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		
		logger.info("skillLvlChnGrpService.selectDispSkill Query Start...");
		List<skillLvlChnGrp> search = skillLvlChnGrpService.selectDispSkill(map);
		
		return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectSkillGrp", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkillGrp(@Valid @RequestBody skillLvlChnGrp reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		String tmpSkillGrpId = reqParam.getSkillGrpId().toString();
		String skillGrpId = "";
		String skillGrpName = reqParam.getSkillGrpName().toString();
		
		if(tmpSkillGrpId != null && !"".equals(tmpSkillGrpId))
		{
			skillGrpId = "'" + tmpSkillGrpId.replace(";", "','") + "'";
		}

		skillGrpName = skillGrpName.trim().toUpperCase();
		
		map.put("compId", reqParam.getCompId()); 
		map.put("skillGrpId", skillGrpId); 
		map.put("skillGrpName", skillGrpName);
		
		logger.info("skillLvlChnGrpService.selectSkillGrp Query Start...");
		List<skillLvlChnGrp> search = skillLvlChnGrpService.selectSkillGrp(map);
		
		return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectAgtSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgtSkill(@Valid @RequestBody skillLvlChnGrp reqParam, HttpServletRequest request) throws Exception {    	
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId());
		
		String tmpPartId = reqParam.getPartId().toString();
		String tmpTeamId = reqParam.getTeamId().toString();
		String partId = "";
		String teamId = "";
		if(tmpPartId != null && !"".equals(tmpPartId)){
			partId = "'" + tmpPartId.replace(";", "','") + "'";
		}
		
		if(tmpTeamId != null && !"".equals(tmpTeamId)){
			teamId = "'" + tmpTeamId.replace(";", "','") + "'";
		}		
		
		String protect = reqParam.getProtect();
		
		String tmpAgtSelText = reqParam.getAgtSelText();
		String agtSelText = "";
		if(tmpAgtSelText != null && !"".equals(tmpAgtSelText)){
			agtSelText = "'" + tmpAgtSelText.replace(";", "','") + "'";
		}
		
		String tmpdefaultGrp = reqParam.getDefaultGrp();		
		String defaultGrp = "";
		if(tmpdefaultGrp != null && !"".equals(tmpdefaultGrp)){
			defaultGrp = "'" + tmpdefaultGrp.replace(";", "','") + "'";
		}
		
		String tmpapplyGrp = reqParam.getApplyGrp();
		String applyGrp = "";		
		if(tmpapplyGrp != null && !"".equals(tmpapplyGrp)){
			applyGrp = "'" + tmpapplyGrp.replace(";", "','") + "'";
		}
				
		String modifyGrp = reqParam.getModifyGrp();
		
		String dispSkillId = reqParam.getDispSkillId();
		
		map.put("partId", partId);
		map.put("teamId", teamId);
		
		String teamName = reqParam.getTeamName();		
		map.put("teamName", teamName);
		
		map.put("protect", protect);
		map.put("agtSelText", agtSelText);
		
		String employeeid = reqParam.getEmployeeid();
		map.put("employeeid", employeeid);
		
		map.put("defaultGrp", defaultGrp);
		map.put("applyGrp", applyGrp);
		map.put("modifyGrp", modifyGrp);
		
		map.put("dispSkillId", dispSkillId);
		
		String defaultGrpName = reqParam.getDefaultGrpName().toUpperCase();
		map.put("defaultGrpName", defaultGrpName);
		
		if("Y".equals(reqParam.getLoginCheck()))
		{
			map.put("loginCheck", 1);
		}
		else
		{
			map.put("loginCheck", 0);
		}
		
		logger.info("skillLvlChnGrpService.selectAgtSkill Query Start...");
		List<skillLvlChnGrp> search = skillLvlChnGrpService.selectAgtSkill(map);
		
		return Responses.ListResponse.of(search);
    }
    
    // 스킬 그룹 등록
    @RequestMapping(value="/skillGrpAddCheck", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skillGrpAddCheck(@Valid @RequestBody skillLvlChnGrp reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
				
		if("".equals(reqParam.getGrpid()) || reqParam.getGrpid() == null)
		{
			map.put("id", "");
		}
		else
		{
			map.put("id", reqParam.getGrpid());
		}
			
		if("".equals(reqParam.getGrpname()) || reqParam.getGrpname() == null)
		{
			map.put("name", "");
		}
		else
		{
			map.put("name", reqParam.getGrpname());
		}
		
		logger.info("skillLvlChnGrpService.selectSkgStruct Query Start...");
		List<skillLvlChnGrp> search = skillLvlChnGrpService.selectSkgStruct(map);
		
		return Responses.ListResponse.of(search);
    }

    
	@RequestMapping(value = "/saveAgtSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveAgtSkill(@Valid @RequestBody List<skillLvlChnGrp> skillLvlChnGrp, HttpServletRequest request, HttpServletResponse response) throws Exception {
        //System.out.println("[skillLvlChnGrpController][saveSkillGrp]");
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd();//user.getEmployee_id();
        String user_name = user.getUserNm();
        
        logger.info("skillLvlChnGrpService.saveAgtSkill Query Start...");
        skillLvlChnGrpService.saveAgtSkill(user_cd, user_name, skillLvlChnGrp);
        
    	return ok();
    }    
}
