package com.soluvis.bake.management.controller;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.utils.CookieUtils;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.management.domain.skillLvlChnXls;
import com.soluvis.bake.management.service.skillLvlChnXlsService;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.domain.user.SessionUser;
import com.soluvis.bake.system.utils.JWTSessionHandler;
import com.soluvis.bake.system.utils.SessionUtils;

/** 
 * @author gihyunpark
 * @desc   상담사 스킬 관리(기본)을 조회한다.
 */
@Controller
@RequestMapping(value = "/api/mng/skillLvlChnXls")
public class skillLvlChnXlsController extends commController {

    @Inject
    private skillLvlChnXlsService skillLvlChnXlsService;

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
   	MDCLoginUser loginUser;
   	
   	@RequestMapping(value="/selectDispSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse selectDispSkill(@Valid @RequestBody skillLvlChnXls reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		
		logger.info("skillLvlChnXlsService.selectDispSkill Query Start...");
		List<skillLvlChnXls> search = skillLvlChnXlsService.selectDispSkill(map);
		
		return Responses.ListResponse.of(search);
    }
   	
    @RequestMapping(value = "/agentCheck", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody List<skillLvlChnXls> agentCheck(@Valid @RequestBody List<skillLvlChnXls> alist, HttpServletRequest request) throws Exception {	
    	Map<String,Object> map = new HashMap<String,Object>();	
    	List<skillLvlChnXls> agchk = null;
    	List<skillLvlChnXls> sklist = null;
    	int agchksize = 0;
    	int i = 0;
    	
		StringBuffer sdbidbf = new StringBuffer(1024);
		sdbidbf.append("");
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		//String cid = loginUser.getSessionUser().getUserCd();		
		
		for (skillLvlChnXls ac : alist)
		{
			logger.info("skillLvlChnXlsService.agentCheck Query Start...");
			
			if(AXBootTypes.DataStatus.ORIGIN.equals(ac.getDataStatus()))
			{				
				map.put("last_name", ac.getLogid().trim());
				map.put("fisrt_name", ac.getFirst_name().trim());	
				//map.put("partNm", ac.getPartName().trim());	
				
				agchk = skillLvlChnXlsService.selectAgCheck(map);
				agchksize = agchk.size();
				
				if(agchksize > 0 && "GS홈쇼핑".equals(agchk.get(0).getName()))
				{
					if("X".equals(agchk.get(0).getProtect_skill()))
					{
						alist.get(i).setPartName(agchk.get(0).getPartName());
						
						alist.get(i).setCompId(agchk.get(0).getId());					
						alist.get(i).setTeamName(agchk.get(0).getTeamName());
						
						alist.get(i).setAgtDbid(agchk.get(0).getAgtDbid());
						alist.get(i).setEmployee_id(agchk.get(0).getAgtId());
						
						alist.get(i).setDefaultGrp(agchk.get(0).getDefaultGrp());
						alist.get(i).setDefaultGrp_nm(agchk.get(0).getDefaultGrp_nm());
						
						alist.get(i).setApplyGrp(agchk.get(0).getApplyGrp());
						alist.get(i).setApplyGrp_nm(agchk.get(0).getApplyGrp_nm());
						
						map.put("dbid", agchk.get(0).getAgtDbid().trim());					
						sklist = skillLvlChnXlsService.skillAgtDelCheck(map);
						int sklistsize = sklist.size();
						
						if(sklistsize > 0)
						{
							sdbidbf.setLength(0);
							for(int s=0; s < sklistsize; s++)
							{
								sdbidbf.append(sklist.get(s).getSkillId() + ";");
							}					
							alist.get(i).setSkillList(sdbidbf.toString().substring(0, sdbidbf.length() - 1));
						}
						else
						{
							alist.get(i).setSkillList("undefined");
						}
						
						map.put("compName", ac.getSkgroup().trim());
						map.put("compId", agchk.get(0).getId().trim());
						
						agchk = skillLvlChnXlsService.selectSgCheck(map);
						agchksize = agchk.size();
						
						if(agchksize > 0)
						{
							if(!"자율근무".equals(agchk.get(0).getName()))
							{
								alist.get(i).setId(agchk.get(0).getId());
								
								map.put("id", agchk.get(0).getId().trim());
								map.put("name", agchk.get(0).getName().trim());
								
								agchk = skillLvlChnXlsService.selectSkgStruct(map);
								agchksize = agchk.size();
								
								if(agchksize > 0)
								{
									alist.get(i).setCheckyn("적합");
									i++;
								}
								else
								{
									alist.get(i).setCheckyn("부적합(스킬그룹에 스킬이 존재하지 않음)");
									i++;
								}
							}
							else
							{
								alist.get(i).setCheckyn("부적합(자율근무 스킬그룹으로 변경할 수 없음)");
								i++;
							}
						}
						else
						{
							alist.get(i).setCheckyn("부적합(존재하지 않는 스킬그룹)");
							i++;
						}
					}
					else
					{
						alist.get(i).setCheckyn("부적합(자율근무가 부여된 상담사)");
						i++;
					}
				}
				else
				{
					//alist.get(i).setCheckyn("부적합(존재하지 않거나 소속되지 않은 센터/상담사)");
					alist.get(i).setCheckyn("부적합(존재하지 않는 상담사)");
					i++;
				}
			}			
		}		
		return alist;
	}
    
    
    // 스킬 그룹 등록
    @RequestMapping(value="/skillGrpAddCheck", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skillGrpAddCheck(@Valid @RequestBody skillLvlChnXls reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
				
		if("".equals(reqParam.getGrpid()) || reqParam.getGrpid() == null)
		{
			map.put("id", "");
		}
		else
		{
			map.put("id", reqParam.getGrpid());
		}
			
		if("".equals(reqParam.getGrpname()) || reqParam.getGrpname() == null)
		{
			map.put("name", "");
		}
		else
		{
			map.put("name", reqParam.getGrpname());
		}
		
		logger.info("skillLvlChnXlsService.selectSkgStruct Query Start...");
		List<skillLvlChnXls> search = skillLvlChnXlsService.selectSkgStruct(map);
		
		return Responses.ListResponse.of(search);
    }
        
	@RequestMapping(value = "/saveAgtSkill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse saveAgtSkill(@Valid @RequestBody List<skillLvlChnXls> skillLvlChnXls, HttpServletRequest request, HttpServletResponse response) throws Exception {
    	final String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
    	final JWTSessionHandler jwtSessionHandler = new JWTSessionHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    	SessionUser user = jwtSessionHandler.parseUserFromToken(token);
        if (user == null) {
            return handleBadRequestException(null);
        }
        String user_cd = user.getUserCd();
        String user_name = user.getUserNm();
        
        logger.info("skillLvlChnXlsService.saveAgtSkill Query Start...");
        skillLvlChnXlsService.saveAgtSkill(user_cd, user_name, skillLvlChnXls);
        
    	return ok();
    }    
}
