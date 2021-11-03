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
import com.soluvis.bake.systemManager.domain.ctiMapAgentOrg;
import com.soluvis.bake.systemManager.domain.ctiMapAgentOrgVO;
import com.soluvis.bake.systemManager.service.ctiMapAgentOrgService;


@Controller
@RequestMapping(value = "/api/mng/ctiMapAgentOrg")
public class ctiMapAgentOrgController extends commController {

    @Inject
    private ctiMapAgentOrgService ctiMapAgentOrgService;
    
    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    @RequestMapping(value="/selectAgentOrg", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgentOrg(@Valid @RequestBody ctiMapAgentOrg reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		map.put("partId", reqParam.getPartId());
		map.put("id", reqParam.getId());
		map.put("agroupName", reqParam.getAgroupName());
		if(reqParam.getAgroupName() != null)
		{
			if(!("".equals(reqParam.getAgroupName().toString())))
			{
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace("'", ""));
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace("\"", ""));
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace("(", ""));
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace(")", ""));
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace("--", ""));
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace("#", ""));
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace("=", ""));
				reqParam.setAgroupName(reqParam.getAgroupName().toString().replace(",", ""));
				map.put("agroupName", reqParam.getAgroupName());
			}
			else
			map.put("agroupName", reqParam.getAgroupName());
		}
		
		logger.info("ctiMapAgentOrgService.selectAgentOrg Query Start...");
		List<ctiMapAgentOrg> search = ctiMapAgentOrgService.selectAgentOrg(map);
		
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectAgent", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgent(@Valid @RequestBody ctiMapAgentOrg reqParam, HttpServletRequest request) throws Exception {    	
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("orgLevel", reqParam.getOrgLevel());
		map.put("id", reqParam.getId());
		List<ctiMapAgentOrg> search = new ArrayList<>();
		
		if(reqParam.getDataStatus() != AXBootTypes.DataStatus.CREATED){
			logger.info("ctiMapAgentOrgService.selectAgent Query Start...");
			search = ctiMapAgentOrgService.selectAgent(map);			
		} else {
			return null;
		}
		
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/selectAgentDetail", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectAgentDetail(@Valid @RequestBody ctiMapAgentOrg reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		map.put("partId", reqParam.getPartId());
		map.put("orgLevel", reqParam.getOrgLevel());
		map.put("id", reqParam.getId());
		map.put("agroupName", reqParam.getAgroupName());
		List<ctiMapAgentOrg> search = new ArrayList<>();
		
		if(reqParam.getDataStatus() != AXBootTypes.DataStatus.CREATED){
			logger.info("ctiMapAgentOrgService.selectAgentDetail Query Start...");
			search = ctiMapAgentOrgService.selectAgentDetail(map);			
		} else {
			return null;
		}
		
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/saveAgentOrg", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveAgentOrg(@Valid @RequestBody ctiMapAgentOrgVO agentOrgVO, HttpServletRequest request, HttpServletResponse response) throws Exception {
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd(); //user.getEmployee_id();
        String user_name = user.getUserNm();
        
        logger.info("ctiMapAgentOrgService.processAgentOrg Query Start...");
        ctiMapAgentOrgService.processAgentOrg(user_cd, user_name, agentOrgVO);
		
    	return ok();
    }
    

    @RequestMapping(value="/saveAgentDetail", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveAgentDetail(@Valid @RequestBody ctiMapAgentOrgVO agentOrgVO, HttpServletRequest request, HttpServletResponse response) throws Exception {
//    	System.out.println("[CtiMapAgentOrgService] [saveAgentDetail] reqParam.compId : " + reqParam.getCompId());
//		Map<String, Object> map = new HashMap<String, Object>(); 
//		map.put("compId", reqParam.getCompId());
//		List<CtiMapAgentOrg> search = ctiMapAgentOrgService.saveAgentDetail(map);
//        return Responses.ListResponse.of(search);
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd(); //user.getEmployee_id();
        String user_name = user.getUserNm();
        
        logger.info("ctiMapAgentOrgService.processAgentDetail Query Start...");
        ctiMapAgentOrgService.processAgentDetail(user_cd, user_name, agentOrgVO);

    	return ok();
    }
    
}
