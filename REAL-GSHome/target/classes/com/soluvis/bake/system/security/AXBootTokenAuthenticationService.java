package com.soluvis.bake.system.security;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.utils.ContextUtil;
import com.chequer.axboot.core.utils.CookieUtils;
import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import com.chequer.axboot.core.utils.PhaseUtils;
import com.chequer.axboot.core.utils.RequestUtils;
import com.chequer.axboot.core.vo.ScriptSessionVO;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.program.Program;
import com.soluvis.bake.system.domain.program.menu.Menu;
import com.soluvis.bake.system.domain.program.menu.MenuService;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.domain.user.auth.menu.AuthGroupMenu;
import com.soluvis.bake.system.domain.user.auth.menu.AuthGroupMenuService;
import com.soluvis.bake.system.utils.JWTSessionHandler;
//위자드 수정시 여기!
@Service
public class AXBootTokenAuthenticationService {

    private final JWTSessionHandler jwtSessionHandler;

    //@Inject
    //private ProgramService programService;

    @Inject
    private AuthGroupMenuService authGroupMenuService;

    @Inject
    private MenuService menuService;
   

    public AXBootTokenAuthenticationService() {
        jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    }

    public int tokenExpiry() {
        if (PhaseUtils.isProduction()) {
            //return 60 * 50;
        	return -1;
        } else {
            //return 3600;
        	return -1;
        }
    }

    public void addAuthentication(HttpServletResponse response, AXBootUserAuthentication authentication) throws IOException {
        final SessionUser user = authentication.getDetails();
        setUserEnvironments(user, response);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    public void setUserEnvironments(SessionUser user, HttpServletResponse response) throws IOException {
        String token = jwtSessionHandler.createTokenForUser(user);
        CookieUtils.addCookie(response, GlobalConstants.ADMIN_AUTH_TOKEN_KEY, token, tokenExpiry());
    }

    public Authentication getAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException {
        RequestUtils requestUtils = RequestUtils.of(request);
        final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
        final String progCd = FilenameUtils.getBaseName(request.getServletPath());
        final Long menuId = requestUtils.getLong("menuId");
        final String requestUri = request.getRequestURI();
        final String language = requestUtils.getString(GlobalConstants.LANGUAGE_PARAMETER_KEY, "");

        if (StringUtils.isNotEmpty(language)) {
            CookieUtils.addCookie(response, GlobalConstants.LANGUAGE_PARAMETER_KEY, language);
        }

        if (token == null) {
            return deleteCookieAndReturnNullAuthentication(request, response);
        }

        SessionUser user = jwtSessionHandler.parseUserFromToken(token);

        if (user == null) {
            return deleteCookieAndReturnNullAuthentication(request, response);
        }

        if (!requestUri.startsWith(ContextUtil.getBaseApiPath())) {
            if (menuId > 0) {
                Menu menu = menuService.findOne(menuId);
                
                if (menu != null) {
                    Program program = menu.getProgram();

                    if (program != null) {
                        requestUtils.setAttribute("program", program);
                        requestUtils.setAttribute("pageName", menu.getLocalizedMenuName(request));
                        requestUtils.setAttribute("pageRemark", program.getRemark());

                        if (program.getAuthCheck().equals(AXBootTypes.Used.YES.getLabel())) {
                            AuthGroupMenu authGroupMenu = authGroupMenuService.getCurrentAuthGroupMenu(menuId, user);
                            if (authGroupMenu == null) {
                                throw new AccessDeniedException("Access is denied");
                            }
                            requestUtils.setAttribute("authGroupMenu", authGroupMenu);
                        }
                    }
                }
            }
            
            ScriptSessionVO scriptSessionVO = ModelMapperUtils.map(user, ScriptSessionVO.class);
            scriptSessionVO.setDateFormat(scriptSessionVO.getDateFormat().toUpperCase());
            scriptSessionVO.getDetails().put("language", RequestUtils.getLocale(request).getLanguage());
            requestUtils.setAttribute("loginUser", user);
            requestUtils.setAttribute("scriptSession", JsonUtils.toJson(scriptSessionVO));
            //System.out.println(progCd);
            if ("bake".equals(progCd)) {
            	//권한에 대한 계정별 메뉴 id를 불러온다.
                //List<Menu> menuList = menuService.getAuthorizedMenuList(user.getMenuGrpCd(), user.getAuthGroupList());
            	List<Menu> menuList = menuService.getAuthorizedMenuList(user.getUserCd(), user.getMenuGrpCd(), user.getAuthGroupList());
                requestUtils.setAttribute("menuJson", JsonUtils.toJson(menuList));
            }
        }

        setUserEnvironments(user, response);

        return new AXBootUserAuthentication(user);
    }

    private Authentication deleteCookieAndReturnNullAuthentication(HttpServletRequest request, HttpServletResponse response) {
        CookieUtils.deleteCookie(request, response, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
        ScriptSessionVO scriptSessionVO = ScriptSessionVO.noLoginSession();
        request.setAttribute("scriptSession", JsonUtils.toJson(scriptSessionVO));
        return null;
    }
}
