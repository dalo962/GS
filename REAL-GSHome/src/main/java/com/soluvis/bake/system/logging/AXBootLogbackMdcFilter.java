package com.soluvis.bake.system.logging;


import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
//import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;

import com.chequer.axboot.core.utils.HttpUtils;
import com.chequer.axboot.core.utils.MDCUtil;
import com.chequer.axboot.core.utils.RequestUtils;
import com.soluvis.bake.system.utils.SessionUtils;

public class AXBootLogbackMdcFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (!HttpUtils.isMultipartFormData((HttpServletRequest) request)) {
            RequestUtils requestWrapper = RequestUtils.of(request);

            MDCUtil.setJsonValue(MDCUtil.HEADER_MAP_MDC, requestWrapper.getRequestHeaderMap());
            MDCUtil.setJsonValue(MDCUtil.USER_INFO_MDC, SessionUtils.getCurrentMdcLoginUser((HttpServletRequest) request));
            MDCUtil.set(MDCUtil.PARAMETER_BODY_MDC, requestWrapper.getRequestBodyJson((HttpServletRequest) request));
            MDCUtil.set(MDCUtil.REQUEST_URI_MDC, requestWrapper.getRequestUri());
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

   }
}
