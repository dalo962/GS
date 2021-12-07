package com.soluvis.bake.system;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import com.chequer.axboot.core.utils.CookieUtils;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.user.UserService;
import com.soluvis.bake.system.logging.AXBootLogbackMdcFilter;
import com.soluvis.bake.system.security.AXBootAuthenticationEntryPoint;
import com.soluvis.bake.system.security.AXBootAuthenticationFilter;
import com.soluvis.bake.system.security.AXBootLoginFilter;
import com.soluvis.bake.system.security.AXBootTokenAuthenticationService;
import com.soluvis.bake.system.security.AXBootUserDetailsService;

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, proxyTargetClass = true)
@Configuration
public class AXBootSecurityConfig extends WebSecurityConfigurerAdapter {

    public static final String LOGIN_API = "/api/login";
    public static final String LOGOUT_API = "/api/logout";
    public static final String LOGIN_PAGE = "/jsp/login.jsp";
    public static final String START_PAGE = "/jsp/main.jsp";
    public static final String EXIT_PAGE = "/jsp/exit.jsp";
    public static final String ACCESS_DENIED_PAGE = "/jsp/common/not-authorized.jsp?errorCode=401";
    public static final String SESSION_DENIED_PAGE = "/jsp/common/session-expired.jsp?errorCode=401";
    public static final String ROLE = "ASP_ACCESS";

    public static final String[] ignorePages = new String[]{
            "/resources/**",
            "/axboot.config.js",
            "/assets/**",
            "/jsp/common/**",
            "/jsp/setup/**",
            "/swagger/**",
            "/api-docs/**",
            "/setup/**",
            "/h2-console/**",
            "/health",
            "/api/v1/aes/**",
            "/jsp/exit.jsp",
            "/gr/api/ivr/ivrBlackList/FromIVR**"
    };

    @Inject
    private AXBootUserDetailsService userDetailsService;

    @Inject
    private UserService userService;

    @Inject
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Inject
    private AXBootTokenAuthenticationService tokenAuthenticationService;


    public AXBootSecurityConfig() {
        super(true);
    }

    @Override
    public void configure(WebSecurity webSecurity) throws Exception {
        webSecurity.ignoring().antMatchers(ignorePages);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .anonymous()
                .and()

                .authorizeRequests().anyRequest().hasRole(ROLE)
                .antMatchers(HttpMethod.POST, LOGIN_API).permitAll()
                .antMatchers(START_PAGE).permitAll()
                .and()

                .formLogin().loginPage(START_PAGE).permitAll()
                .loginPage(LOGIN_PAGE).permitAll()
                .and()

                //.logout().logoutUrl(LOGOUT_API).deleteCookies(GlobalConstants.ADMIN_AUTH_TOKEN_KEY, GlobalConstants.LAST_NAVIGATED_PAGE).logoutSuccessHandler(new LogoutSuccessHandler(EXIT_PAGE))
                .logout().logoutUrl(LOGOUT_API).deleteCookies(GlobalConstants.ADMIN_AUTH_TOKEN_KEY, GlobalConstants.LAST_NAVIGATED_PAGE).logoutSuccessHandler(new LogoutSuccessHandler(LOGIN_PAGE))
                .and()

                .exceptionHandling().authenticationEntryPoint(new AXBootAuthenticationEntryPoint())
                .and()

                .addFilterBefore(new AXBootLoginFilter(LOGIN_API, tokenAuthenticationService, userService, authenticationManager(), new AXBootAuthenticationEntryPoint()), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new AXBootAuthenticationFilter(tokenAuthenticationService), UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(new AXBootLogbackMdcFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(bCryptPasswordEncoder);
        daoAuthenticationProvider.setHideUserNotFoundExceptions(false);
        return daoAuthenticationProvider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Override
    protected AXBootUserDetailsService userDetailsService() {
        return userDetailsService;
    }

    class LogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {

        public LogoutSuccessHandler(String defaultTargetURL) {
            this.setDefaultTargetUrl(defaultTargetURL);
        }

        @Override
        public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
            CookieUtils.deleteCookie(GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
            CookieUtils.deleteCookie(GlobalConstants.LAST_NAVIGATED_PAGE);
            request.getSession().invalidate();
            super.onLogoutSuccess(request, response, authentication);
        }
    }
}
