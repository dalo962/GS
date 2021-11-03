package com.soluvis.bake.system.domain.user;

import java.time.Clock;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import com.soluvis.bake.system.domain.BaseService;
import com.soluvis.bake.system.domain.user.auth.UserAuth;
import com.soluvis.bake.system.domain.user.auth.UserAuthService;
import com.soluvis.bake.system.domain.user.role.UserRole;
import com.soluvis.bake.system.domain.user.role.UserRoleService;



@Service
public class UserService extends BaseService<User, String> {

    private UserRepository userRepository;

    @Inject
    private UserAuthService userAuthService;

    @Inject
    private UserRoleService userRoleService;

    @Inject
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Inject
    public UserService(UserRepository userRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }    
    
    /*
     * 2017.10.31 강대석
     */
    //String[] arrMedn = new String[]{"incalls"};	
	//String[] arrSkill = new String[]{"depart", "work", "combine", "timeto"};	
	//String[] arrAgent = new String[]{"workCall", "agentCall", "agentStatus"};
    
    //------------------------------------------------------------------------------
    
    @Transactional
    public void saveUser(List<User> users) throws Exception {
        if (isNotEmpty(users)) {
            for (User user : users) {
            	//user.setUserPs("1234");
            	//user.setUserPs(user.getEmployee_id());            	
            	
                delete(qUserRole).where(qUserRole.userCd.eq(user.getUserCd())).execute();
                delete(qUserAuth).where(qUserAuth.userCd.eq(user.getUserCd())).execute();

                String password = bCryptPasswordEncoder.encode(user.getUserPs());               
                User originalUser = userRepository.findOne(user.getUserCd());
                                                                
                if (originalUser != null) {
                    if (isNotEmpty(user.getUserPs())) {
                        user.setPasswordUpdateDate(Instant.now(Clock.systemUTC()));
                        user.setUserPs(password);
                    } else {
                        user.setUserPs(originalUser.getUserPs());
                    }
                } else {
                    user.setPasswordUpdateDate(Instant.now(Clock.systemUTC()));
                    user.setUserPs(password);
                }
                 
                save(user);

                for (UserAuth userAuth : user.getAuthList()) {
                    userAuth.setUserCd(user.getUserCd());
                }

                for (UserRole userRole : user.getRoleList()) {
                    userRole.setUserCd(user.getUserCd());
                }

                userAuthService.save(user.getAuthList());
                userRoleService.save(user.getRoleList());
                
            } 
        }
    }

    /** 
	 * @desc 계정 삭제할때 항목,메뉴,wizard에 대한 계정도 같이 삭제
	 */
    @Transactional
    public void deluser(List<User> users) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>();
    	
        if (isNotEmpty(users)) {
            for (User user : users) {
                delete(qUserRole).where(qUserRole.userCd.eq(user.getUserCd())).execute();
                delete(qUserAuth).where(qUserAuth.userCd.eq(user.getUserCd())).execute();
                delete(qUser).where(qUser.userCd.eq(user.getUserCd())).execute();
            }
        }
    }
    
    
    public User getUser(RequestParams requestParams) {
        User user = get(requestParams).stream().findAny().orElse(null);

        if (user != null) {
            user.setAuthList(userAuthService.get(requestParams));
            user.setRoleList(userRoleService.get(requestParams));
        }

        return user;
    }

    public List<User> get(RequestParams requestParams) {
        String userCd = requestParams.getString("userCd");
        String filter = requestParams.getString("filter");

        String comCd = requestParams.getString("comCd");
        
        String grpCd = requestParams.getString("grpCd");
        
        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(userCd)) {
            builder.and(qUser.userCd.eq(userCd));
        }       
        
        if (isNotEmpty(comCd)) {
            builder.and(qUser.company_cd.eq(comCd));
        }  
                
        if (isNotEmpty(grpCd)) {
            builder.and(qUser.userauth.grpAuthCd.eq(grpCd));            
        }
        
        //List<User> list = select().from(qUser).where(builder).orderBy(qUser.userNm.asc()).fetch();
        List<User> list = select()
						.from(qUser)
	        			.innerJoin(qUser.userauth).fetchJoin()
	        			.where(builder)
	        			.orderBy(qUser.userNm.asc())
	        			.fetch();  
			
        if (isNotEmpty(filter)) {
            list = filter(list, filter);
        }
        return list;
    }
}
