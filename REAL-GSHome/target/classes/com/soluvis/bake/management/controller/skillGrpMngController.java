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
import com.soluvis.bake.management.domain.skillGrpMng;
import com.soluvis.bake.management.domain.skillLvlChnMain;
import com.soluvis.bake.management.service.skillGrpMngService;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.utils.JWTSessionHandler;

/** 
 * @author gihyunpark
 * @desc   스킬 그룹 관리를 조회한다.
 */
@Controller
@RequestMapping(value = "/api/mng/skillGrpMng")
public class skillGrpMngController extends commController {

    @Inject
    private skillGrpMngService skillGrpMngService;

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    MDCLoginUser loginUser;
    
    /** 
	 * @desc 스킬 그룹 관리 스킬 목록을 조회한다(왼쪽)
	 */
    @RequestMapping(value="/selectSkillList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkillList(@Valid @RequestBody skillGrpMng reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 

		String compSkId = reqParam.getCompSkId();
		
		String tmpChnSkId = reqParam.getChnSkId().toString();
		String chnSkId = "";
		
		if(tmpChnSkId != null && !"".equals(tmpChnSkId)){
			chnSkId = "'" + tmpChnSkId.replace(";", "','") + "'";
		}
				
		String tmpSkillSkId = reqParam.getSkillSkId().toString();		
		String skillSkId = "";
		
		if(tmpSkillSkId != null && !"".equals(tmpSkillSkId)){
			skillSkId = "'" + tmpSkillSkId.replace(";", "','") + "'";
		}		
		
		String skillName = reqParam.getSkillName().trim();
		
		map.put("compId", compSkId); 
		map.put("chnId", chnSkId); 
		map.put("skillId", skillSkId); 		
		map.put("skillName", skillName); 
		
		logger.info("skillGrpMngService.selectSkillList Query Start...");
		List<skillGrpMng> search = skillGrpMngService.selectSkillList(map);
		
		return Responses.ListResponse.of(search);
    }

    /** 
	 * @desc 스킬 그룹 관리 그룹 목록을 조회한다(으론쪽)
	 */
    @RequestMapping(value="/selectSkillGrpList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkillGrpList(@Valid @RequestBody skillGrpMng reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		String compGrpId = reqParam.getCompGrpId();
		
		String tmpChnGrpId = reqParam.getChnGrpId().toString();
		String chnGrpId = "";
		
		if(tmpChnGrpId != null && !"".equals(tmpChnGrpId)){
			chnGrpId = "'" + tmpChnGrpId.replace(";", "','") + "'";
		}
				
		String tmpSkillGrpId = reqParam.getSkillGrpId().toString();		
		String skillGrpId = "";
		
		if(tmpSkillGrpId != null && !"".equals(tmpSkillGrpId)){
			skillGrpId = "'" + tmpSkillGrpId.replace(";", "','") + "'";
		}	
		
		String tmpSkGrpId = reqParam.getSkGrpId().toString();		
		String skGrpId = "";
		
		if(tmpSkGrpId != null && !"".equals(tmpSkGrpId)){
			skGrpId = "'" + tmpSkGrpId.replace(";", "','") + "'";
		}	
		
		String skillGrpName = reqParam.getSkillGrpName().trim();
		
		String skGrpName = reqParam.getSkGrpName().trim();
		
		map.put("compId", compGrpId); 
		map.put("chnId", chnGrpId); 
		map.put("skillId", skillGrpId); 
		map.put("skillGrpName", skillGrpName);
		
		map.put("skillGrpId", skGrpId);
		map.put("skGrpName", skGrpName.toUpperCase());
		
		logger.info("skillGrpMngService.selectSkillGrpList Query Start...");
		List<skillGrpMng> search = skillGrpMngService.selectSkillGrpList(map);
		
		return Responses.ListResponse.of(search);
    }
    
    /** 
	 * @desc 스킬 그룹 관리 그룹 목록을 저장한다
	 */
	@RequestMapping(value = "/saveSkillGrp", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveSkillGrp(@Valid @RequestBody List<skillGrpMng> skillGrps, HttpServletRequest request, HttpServletResponse response) throws Exception {
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd();//user.getEmployee_id();
        String user_name = user.getUserNm();
        
        logger.info("skillGrpMngService.selectSkillGrpList Query Start...");
        skillGrpMngService.saveSkillGrp(user_cd, user_name, skillGrps);
        
    	return ok();
    }    
	
	
	
	@RequestMapping(value="/selectSkGrpSk", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkGrpSk(@Valid @RequestBody skillLvlChnMain reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		String grpid = reqParam.getSkGrpId();
	
		map.put("grpid", grpid);  
		
		logger.info("skillGrpMngService.selectSkGrpSk Query Start...");
		List<skillGrpMng> search = skillGrpMngService.selectSkGrpSk(map);
		
		return Responses.ListResponse.of(search);
    }
	
	
	/** 
	 * @desc 스킬그룹의 스킬을 일괄 변경
	 */
	@RequestMapping(value = "/saveSkGrpSk", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveSkGrpSk(@Valid @RequestBody List<skillGrpMng> skillGrps, HttpServletRequest request) throws Exception {	
		final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd();//user.getEmployee_id();
        String user_name = user.getUserNm();
        
        logger.info("skillGrpMngService.saveSkillGrpAll Query Start...");
        skillGrpMngService.saveSkillGrpAll(user_cd, user_name, skillGrps);
    	return ok();		
	}
}
