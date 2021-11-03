package com.soluvis.bake.systemManager.controller;

import java.util.ArrayList;
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
import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.utils.CookieUtils;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.utils.JWTSessionHandler;
import com.soluvis.bake.systemManager.domain.ctiMapSkillOrg;
import com.soluvis.bake.systemManager.domain.ctiMapSkillOrgVO;
import com.soluvis.bake.systemManager.service.ctiMapSkillOrgService;


@Controller
@RequestMapping(value = "/api/mng/ctiMapSkillOrg")
public class ctiMapSkillOrgController extends commController {

    @Inject
    private ctiMapSkillOrgService ctiMapSkillOrgService;

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    @RequestMapping(value="/selectSkillOrg", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkillOrg(@Valid @RequestBody ctiMapSkillOrg reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		map.put("chnId", reqParam.getChnId());
		map.put("id", reqParam.getId());
		map.put("skillName", reqParam.getSkillName());
		if(reqParam.getSkillName() != null)
		{
			if(!("".equals(reqParam.getSkillName().toString())))
			{
				reqParam.setSkillName(reqParam.getSkillName().toString().replace("'", ""));
				reqParam.setSkillName(reqParam.getSkillName().toString().replace("\"", ""));
				reqParam.setSkillName(reqParam.getSkillName().toString().replace("(", ""));
				reqParam.setSkillName(reqParam.getSkillName().toString().replace(")", ""));
				reqParam.setSkillName(reqParam.getSkillName().toString().replace("--", ""));
				reqParam.setSkillName(reqParam.getSkillName().toString().replace("#", ""));
				reqParam.setSkillName(reqParam.getSkillName().toString().replace("=", ""));
				reqParam.setSkillName(reqParam.getSkillName().toString().replace(",", ""));
				map.put("skillName", reqParam.getSkillName());
			}
			else
				map.put("skillName", reqParam.getSkillName());
		}

		logger.info("ctiMapSkillOrgService.selectSkillOrg Query Start...");
		List<ctiMapSkillOrg> search = ctiMapSkillOrgService.selectSkillOrg(map);
		
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkill(@Valid @RequestBody ctiMapSkillOrg reqParam, HttpServletRequest request) throws Exception {    	
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("orgLevel", reqParam.getOrgLevel());
		map.put("id", reqParam.getId());
		List<ctiMapSkillOrg> search = new ArrayList<>();
		
		if(reqParam.getDataStatus() != AXBootTypes.DataStatus.CREATED){	
			logger.info("ctiMapSkillOrgService.selectSkill Query Start...");
			search = ctiMapSkillOrgService.selectSkill(map);			
		} else {
			return null;
		}
		
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectSkillDetail", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectSkillDetail(@Valid @RequestBody ctiMapSkillOrg reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		map.put("chnId", reqParam.getChnId());
		map.put("orgLevel", reqParam.getOrgLevel());
		map.put("id", reqParam.getId());
		map.put("skillName", reqParam.getSkillName());
		List<ctiMapSkillOrg> search = new ArrayList<>();
		
		if(reqParam.getDataStatus() != AXBootTypes.DataStatus.CREATED){
			logger.info("ctiMapSkillOrgService.selectSkillDetail Query Start...");
			search = ctiMapSkillOrgService.selectSkillDetail(map);			
		} else {
			return null;
		}
		
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/saveSkillOrg", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveSkillOrg(@Valid @RequestBody ctiMapSkillOrgVO skillOrgVO, HttpServletRequest request, HttpServletResponse response) throws Exception {
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
    	//System.out.println(user);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd(); //user.getEmployee_id();
        String user_name = user.getUserNm();
        
        logger.info("ctiMapSkillOrgService.processSkillOrg Query Start...");
        ctiMapSkillOrgService.processSkillOrg(user_cd, user_name, skillOrgVO);
		
    	return ok();
    }
    

    @RequestMapping(value="/saveSkillDetail", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveSkillDetail(@Valid @RequestBody ctiMapSkillOrgVO skillOrgVO, HttpServletRequest request, HttpServletResponse response) throws Exception {
//    	System.out.println("[CtiMapSkillOrgService] [saveSkillDetail] reqParam.compId : " + reqParam.getCompId());
//		Map<String, Object> map = new HashMap<String, Object>(); 
//		map.put("compId", reqParam.getCompId());
//		List<CtiMapSkillOrg> search = ctiMapSkillOrgService.saveSkillDetail(map);
//        return Responses.ListResponse.of(search);
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd(); //user.getEmployee_id();
        String user_name = user.getUserNm();

        logger.info("ctiMapSkillOrgService.processSkillDetail Query Start...");
        ctiMapSkillOrgService.processSkillDetail(user_cd, user_name, skillOrgVO);

    	return ok();
    }
    
}
