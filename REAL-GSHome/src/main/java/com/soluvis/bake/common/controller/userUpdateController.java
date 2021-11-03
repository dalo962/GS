package com.soluvis.bake.common.controller;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.domain.userUpdate;
import com.soluvis.bake.common.service.userUpdateService;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;

@Controller
@RequestMapping(value = "/api/v2/userUp")
public class userUpdateController extends BaseController{
	
	@Inject
	private userUpdateService userUp;
		
	@Inject
    private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	@RequestMapping(value= "/setting", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody userUpdate settting(HttpServletRequest request, Model model) {
		Map<String, Object> map = new HashMap<String, Object>();
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String user_cd = loginUser.getSessionUser().getUserCd();
		map.put("user_cd", user_cd);
		userUpdate ma = userUp.userinfo(map);
					
		return ma;
	  }
	
	@RequestMapping(value= "/Save", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody int userPwdSave(HttpServletRequest request) {
		Map<String,Object> params = RequestUtil.getParameterMap(request);
		String user_cd = SessionUtils.getCurrentLoginUserCd();	
		String user_ps = params.get("npwd").toString().trim();
		user_ps = bCryptPasswordEncoder.encode(user_ps);
		params.put("user_ps", user_ps);
		params.put("user_cd", user_cd);
		int result = userUp.userup(params);
					
		return result;
	  }
}
