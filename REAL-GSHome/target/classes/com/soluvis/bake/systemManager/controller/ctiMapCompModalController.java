package com.soluvis.bake.systemManager.controller;

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

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.utils.CookieUtils;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.utils.JWTSessionHandler;
import com.soluvis.bake.systemManager.domain.ctiMapCompModalVO;
import com.soluvis.bake.systemManager.service.ctiMapCompModalService;


@Controller
@RequestMapping(value = "/api/mng/ctiMapComp")
public class ctiMapCompModalController extends commController {

    @Inject
    private ctiMapCompModalService ctiMapCompModalService;    

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    @RequestMapping(value="/save", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveAgentDetail(@Valid @RequestBody ctiMapCompModalVO ctiMapCompVO, HttpServletRequest request, HttpServletResponse response) throws Exception {
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd(); //user.getEmployee_id();
        String user_name = user.getUserNm();
        
        logger.info("ctiMapCompModalService.processCompany Query Start...");
        ctiMapCompModalService.processCompany(user_cd, user_name, ctiMapCompVO);
        
    	return ok();
    }
    
}
