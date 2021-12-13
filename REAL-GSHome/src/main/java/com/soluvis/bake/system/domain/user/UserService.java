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
import com.soluvis.bake.common.service.menuManagerService;
import com.soluvis.bake.system.domain.BaseService;
import com.soluvis.bake.system.domain.user.auth.UserAuth;
import com.soluvis.bake.system.domain.user.auth.UserAuthService;
import com.soluvis.bake.system.domain.user.role.UserRole;
import com.soluvis.bake.system.domain.user.role.UserRoleService;
import com.soluvis.bake.systemManager.domain.statListManager;
import com.soluvis.bake.systemManager.service.statListManagerService;



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
    String[] arrSkill = new String[]{"skCall", "skWait"};	
	String[] arrAgent = new String[]{"agCall", "agProdt", "agSkill"};
    
  	@Inject
    private statListManagerService statLstMngService; // UserFactor 생성시 Factor 참조
  	
  	@Inject
    private menuManagerService mstService; // 메뉴 참조
  	
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
                
                // 유저 생성시 팩터를 추가해 준다
	            Map<String, Object> map = new HashMap<String, Object>();
	            Map<String, Object> seq = new HashMap<String, Object>();
	                                
	            map.put("user_id", user.getUserCd());
	            map.put("stat_gubun","");
	            map.put("dispname","");
	            List<statListManager> userChk = statLstMngService.userFacSel(map);
	            
	            // 초기 데이터가 없음
	            if(userChk.size() == 0)
	            {
	            	// setting이라는 계정만 타게금 아니면 세팅한대로
	            	if("setting".equals(user.getUserCd()))
	            	{
			            seq.put("seq", "");
			            seq.put("dispname", "");
			            seq.put("useyn", "");
			            List<statListManager> skillLst = statLstMngService.skillListSelmodal(seq);
			            List<statListManager> agentLst = statLstMngService.agentListSelmodal(seq);
			            
			            int skillLstsize = skillLst.size();
			            if(skillLstsize != 0)
			            {                	
			            	for(int i = 0; i < skillLstsize; i++)
			            	{
			            		map.put("user_cd", user.getUserCd());
			            		map.put("stat_gubun", "SKILL");
			            		map.put("stat_seq", skillLst.get(i).getSeq());
			            		map.put("stat_yn", skillLst.get(i).getUse_yn());
			            		map.put("dispname", skillLst.get(i).getDispname());
			            		
			            		statLstMngService.userFacIst(map);
			            	}                	
			            }
			            int agentLstsize = agentLst.size();
			            if(agentLstsize != 0)
			            {                	
			            	for(int i = 0; i < agentLstsize; i++)
			            	{
			            		map.put("user_cd", user.getUserCd());
			            		map.put("stat_gubun", "AGENT");
			            		map.put("stat_seq", agentLst.get(i).getSeq());
			            		map.put("stat_yn", agentLst.get(i).getUse_yn());
			            		map.put("dispname", agentLst.get(i).getDispname());
			            		
			            		statLstMngService.userFacIst(map);
			            	}
			            }
	            	}
	            	else
	            	{
	            		map.put("user_cd", user.getUserCd());
	            		statLstMngService.userFacIstSetting(map);
	            	}
	            }     
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
                
                //그냥 사용자 다 지운다
                statLstMngService.userDel(user.getUserCd());
                mstService.menuMngDel(user.getUserCd());       
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
