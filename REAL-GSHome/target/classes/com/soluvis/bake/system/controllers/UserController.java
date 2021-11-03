package com.soluvis.bake.system.controllers;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.parameter.RequestParams;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.domain.user.User;
import com.soluvis.bake.system.domain.user.UserService;
import com.soluvis.bake.system.utils.SessionUtils;

@Controller
@RequestMapping(value = "/api/v1/users")
public class UserController extends commController {

    @Inject
    private UserService userService;
    
    MDCLoginUser loginUser;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.ListResponse list(RequestParams<User> requestParams) {
        List<User> users = userService.get(requestParams);
        return Responses.ListResponse.of(users);
    }

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON, params = "userCd")
    public User get(RequestParams requestParams) {
        return userService.getUser(requestParams);
    }

    @RequestMapping(method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse save(@Valid @RequestBody List<User> users) throws Exception {
        userService.saveUser(users);
        return ok();
    }
    
    @RequestMapping(value="del", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse del(@Valid @RequestBody List<User> users, HttpServletRequest request) throws Exception {
    	// 현재 로그인중인 계정은 삭제안되게 함
    	loginUser = SessionUtils.getCurrentMdcLoginUser(request); 
    	String user_cd = loginUser.getSessionUser().getUserCd(); 
		if(user_cd.equals(users.get(0).getUserCd()))
		{
			return ok("Fail");
		}
		// 여기까지
        userService.deluser(users);
        return ok();
    }
    
}
