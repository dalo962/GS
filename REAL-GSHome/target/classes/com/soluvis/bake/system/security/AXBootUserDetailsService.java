package com.soluvis.bake.system.security;

import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import javax.inject.Inject;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.utils.DateTimeUtils;
import com.soluvis.bake.common.service.menuManagerService;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.domain.user.User;
import com.soluvis.bake.system.domain.user.UserService;
import com.soluvis.bake.system.domain.user.auth.UserAuth;
import com.soluvis.bake.system.domain.user.auth.UserAuthService;
import com.soluvis.bake.system.domain.user.role.UserRole;
import com.soluvis.bake.system.domain.user.role.UserRoleService;

@Service
public class AXBootUserDetailsService implements UserDetailsService {

    @Inject
    private UserService userService;

    @Inject
    private UserRoleService userRoleService;

    @Inject
    private UserAuthService userAuthService;
    
    @Inject
    private menuManagerService menuMngService;

    @Override
    public final SessionUser loadUserByUsername(String userCd) throws UsernameNotFoundException {
        User user = userService.findOne(userCd);

        if (user == null) {
            throw new UsernameNotFoundException("사용자 정보를 확인하세요.");
        }
        
        if (user.getUseYn() == AXBootTypes.Used.NO) {
            throw new UsernameNotFoundException("존재하지 않는 사용자 입니다.");
        }

        if (user.getDelYn() == AXBootTypes.Deleted.YES) {
            throw new UsernameNotFoundException("존재하지 않는 사용자 입니다.");
        }

        List<UserRole> userRoleList = userRoleService.findByUserCd(userCd);

        List<UserAuth> userAuthList = userAuthService.findByUserCd(userCd);

        SessionUser sessionUser = new SessionUser();
        sessionUser.setUserCd(user.getUserCd());
        sessionUser.setUserNm(user.getUserNm());        
        sessionUser.setUserPs(user.getUserPs());
        sessionUser.setMenuGrpCd(user.getMenuGrpCd());
        //sessionUser.setEmployee_id(user.getEmployee_id());

        userRoleList.forEach(r -> sessionUser.addAuthority(r.getRoleCd()));
        userAuthList.forEach(a -> sessionUser.addAuthGroup(a.getGrpAuthCd()));

        String[] localeString = user.getLocale().split("_");

        Locale locale = new Locale(localeString[0], localeString[1]);

        final Calendar cal = Calendar.getInstance();
        final TimeZone timeZone = cal.getTimeZone();

        sessionUser.setTimeZone(timeZone.getID());
        sessionUser.setDateFormat(DateTimeUtils.dateFormatFromLocale(locale));
        sessionUser.setTimeFormat(DateTimeUtils.timeFormatFromLocale(locale));
        sessionUser.setLocale(locale);
        
        String ip = RequestUtil.getUserIp().toString();
        if(ip == null || "".equals(ip))
        {
        	ip = "0.0.0.0";
        }
        menuMngService.LastLoginDateUpdate(ip, user.getUserCd());
        
        return sessionUser;
    }
}
