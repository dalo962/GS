package com.soluvis.bake.system.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.utils.ContextUtil;
import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.RequestUtils;
import com.soluvis.bake.system.AXBootSecurityConfig;
import com.soluvis.bake.system.utils.HttpUtils;

public class AXBootAuthenticationFilter extends GenericFilterBean {

    private final AXBootTokenAuthenticationService tokenAuthenticationService;

    public AXBootAuthenticationFilter(AXBootTokenAuthenticationService adminTokenAuthenticationService) {
        this.tokenAuthenticationService = adminTokenAuthenticationService;
    }
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        try {
            SecurityContextHolder.getContext().setAuthentication(tokenAuthenticationService.getAuthentication((HttpServletRequest) req, (HttpServletResponse) res));
            chain.doFilter(req, res);
        } catch (AccessDeniedException e) {
            HttpServletRequest request = (HttpServletRequest) req;
            HttpServletResponse response = (HttpServletResponse) res;

            RequestUtils requestUtils = RequestUtils.of(request);

            if (requestUtils.isAjax()) {
                ApiResponse apiResponse = new ApiResponse();
                apiResponse.setMessage("접근권한이 없습니다");

                response.setContentType(HttpUtils.getJsonContentType(request));
                response.getWriter().write(JsonUtils.toJson(apiResponse));
                response.getWriter().flush();
            } else {
                response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.ACCESS_DENIED_PAGE));
            }
        }
    }
    /* 기존부분주석
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    	RereadableRequestWrapper rereadableRequestWrapper = new RereadableRequestWrapper((HttpServletRequest) req);
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        String SSO_LOGINID = (String)request.getHeader("SSO_LOGINID");
        //String SSO_LOGINID = "gihyunpark";
                
        if( SSO_LOGINID != null && !SSO_LOGINID.equals("")){
            try {
            	//System.out.println("check : " + tokenAuthenticationService.getAuthentication((HttpServletRequest) req, (HttpServletResponse) res));
                SecurityContextHolder.getContext().setAuthentication(tokenAuthenticationService.getAuthentication((HttpServletRequest) req, (HttpServletResponse) res));
                
                chain.doFilter(rereadableRequestWrapper, res);
            } catch (AccessDeniedException e) {
                RequestUtils requestUtils = RequestUtils.of(request);

                if (requestUtils.isAjax()) {
                    ApiResponse apiResponse = new ApiResponse();
                    apiResponse.setMessage("접근권한이 없습니다");

                    response.setContentType(HttpUtils.getJsonContentType(request));
                    response.getWriter().write(JsonUtils.toJson(apiResponse));
                    response.getWriter().flush();
                } else {
                	//System.out.println("AccessDeniedException : " + e.getMessage());
                    response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.ACCESS_DENIED_PAGE));
                }
            }
        }else {
            CookieUtils.deleteCookie(GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
            CookieUtils.deleteCookie(GlobalConstants.LAST_NAVIGATED_PAGE);
            request.getSession().invalidate();
            
            try {
                SecurityContextHolder.getContext().setAuthentication(null);
                chain.doFilter(rereadableRequestWrapper, res);
            } catch (AccessDeniedException e) {
                RequestUtils requestUtils = RequestUtils.of(request);

                if (requestUtils.isAjax()) {
                    ApiResponse apiResponse = new ApiResponse();
            		apiResponse =  ApiResponse.redirect(ContextUtil.getPagePath(AXBootSecurityConfig.SESSION_DENIED_PAGE));   
                    apiResponse.setMessage("세션이 종료되었습니다."); 

                    response.setContentType(HttpUtils.getJsonContentType(request));
                    response.getWriter().write(JsonUtils.toJson(apiResponse));
                    response.getWriter().flush();
                } else {
                	response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.SESSION_DENIED_PAGE));
                }
            }

        }
    }*/
}
