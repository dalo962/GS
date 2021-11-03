package com.soluvis.bake.system.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.ApiStatus;
import com.chequer.axboot.core.utils.ContextUtil;
import com.chequer.axboot.core.utils.CookieUtils;
import com.chequer.axboot.core.utils.HttpUtils;
import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.RequestUtils;
import com.soluvis.bake.system.AXBootSecurityConfig;
import com.soluvis.bake.system.code.GlobalConstants;

public class AXBootAuthenticationEntryPoint extends BasicAuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
    	CookieUtils.deleteCookie(request, response, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
        
    	RequestUtils requestUtils = RequestUtils.of(request);

        ApiResponse apiResponse;

        if (authException instanceof BadCredentialsException) {
            apiResponse = ApiResponse.error(ApiStatus.SYSTEM_ERROR, "사용자 정보를 확인하세요.");
        } else if (authException instanceof UsernameNotFoundException) {
            apiResponse = ApiResponse.error(ApiStatus.SYSTEM_ERROR, "존재하지 않는 사용자입니다.");
        } else {
            /* 기존부분주석
        	String SSO_LOGINID = (String)request.getHeader("SSO_LOGINID");
            //System.out.println("SSO_LOGINID : " + SSO_LOGINID);
            //System.out.println("authException : " + authException.getMessage());
            if( SSO_LOGINID != null && !SSO_LOGINID.equals("")){
				apiResponse = ApiResponse.redirect(ContextUtil.getPagePath(AXBootSecurityConfig.ACCESS_DENIED_PAGE));
        	}else{
        		apiResponse=  ApiResponse.redirect(ContextUtil.getPagePath(AXBootSecurityConfig.SESSION_DENIED_PAGE));             
        	}
        	*/
        	apiResponse=  ApiResponse.redirect(ContextUtil.getPagePath(AXBootSecurityConfig.LOGIN_PAGE));
        }
        /* 기존부분주석
        if (requestUtils.isAjax()) {
            response.setContentType(HttpUtils.getJsonContentType(request));
            response.getWriter().write(JsonUtils.toJson(apiResponse));
            response.getWriter().flush();
        } else {
            String SSO_LOGINID = (String)request.getHeader("SSO_LOGINID");
            
            if( SSO_LOGINID != null && !SSO_LOGINID.equals("")){
            	response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.START_PAGE));   
        	}else{
                response.setContentType("text/html; charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.println("<script language='javascript'>alert('로그인 정보가 존재하지 않습니다. 포털을 통해 접속하시기 바랍니다.');");
                out.println("location.href = '" + ContextUtil.getPagePath(AXBootSecurityConfig.ACCESS_DENIED_PAGE) + "';</script>");
                out.flush();
        	}
        */
            /*
        	if(request.getServletPath().equals("/jsp/main")){
                String SSO_LOGINID = (String)request.getHeader("SSO_LOGINID");
                
                if( SSO_LOGINID != null && !SSO_LOGINID.equals("")){
                	response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.START_PAGE));   
            	}else{
                    response.setContentType("text/html; charset=UTF-8");
                    PrintWriter out = response.getWriter();
                    out.println("<script language='javascript'>alert('로그인 정보가 존재하지 않습니다. 포털을 통해 접속하시기 바랍니다.');");
                    out.println("location.href = '" + ContextUtil.getPagePath(AXBootSecurityConfig.EXIT_PAGE) + "';</script>");
                    out.flush();
            	}
        	}else {
            	response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.ACCESS_DENIED_PAGE));   
        	}
        	*/
        //} 기존부분주석
        if (requestUtils.isAjax()) {
            response.setContentType(HttpUtils.getJsonContentType(request));
            response.getWriter().write(JsonUtils.toJson(apiResponse));
            response.getWriter().flush();
        } else {
            response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.LOGIN_PAGE));
        }
    }
}

