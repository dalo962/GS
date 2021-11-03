package com.soluvis.bake.common.controller;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.AXBootTypes;
import com.soluvis.bake.common.domain.menuManager;
import com.soluvis.bake.common.service.menuManagerService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.domain.user.User;
import com.soluvis.bake.system.domain.user.auth.menu.AuthGroupMenu;
import com.soluvis.bake.system.utils.SessionUtils;

/** 
 * @author gihyunpark
 * @desc   메뉴설정 및 계정,권한 수정에 따른 설정 변경(AX_MENU_M테이블에 중메뉴는 MULTI_LANGUAGE가 NULL이여야 한다)
 */
@Controller
@RequestMapping(value = "/api/menuMng")
public class menuManagerController extends commController{
	
	@Inject
	private menuManagerService menuMngService;
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	/** 
	 * @desc 조회조건으로 현재 세션의 계정값을 가져와 MAP에 대입하여 계정에 따른 메뉴 설정화면을 조회	 
	 */ 
	@RequestMapping(value="/menuMngSearch", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody List<menuManager> menuManagerSearch(@Valid HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		loginUser = SessionUtils.getCurrentMdcLoginUser(request); 
		String user_cd = loginUser.getSessionUser().getUserCd(); 
		String menu_grp_cd = loginUser.getSessionUser().getMenuGrpCd();
		map.put("user_id", user_cd); 
		map.put("menu_grp_cd", menu_grp_cd);
		List<menuManager> search = menuMngService.menuMngSel(map); 
		
		return search;
	}
	
	/** 
	 * @dese 현재 로그인된 계정정보를 가져와 수정된 항목 만큼 반복하여 설정여부를 수정 
	 */
	@RequestMapping(value="/menuMngSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse menuManagerSave(@Valid @RequestBody List<menuManager> mst, HttpServletRequest request) throws Exception {	
		loginUser = SessionUtils.getCurrentMdcLoginUser(request); 
		String cid = loginUser.getSessionUser().getUserCd(); 
		
		// 수정된 배열순 만큼 반복
		for (menuManager mn : mst)
		{
			if(AXBootTypes.DataStatus.MODIFIED.equals(mn.getDataStatus())) 
			{			
				String use_yn = mn.getUse_yn(); 
				String menu_id = mn.getMenu_id();
				//int result = menuMngService.menuMngUdt(use_yn, menu_id, cid);
				menuMngService.menuMngUdt(use_yn, menu_id, cid);
				//System.out.println("menuManagerSave 결과 ==>" + result);
			}
		}		
		return ok();
	}		

	/** 
	 * @desc 권한그룹이 변경될 경우 해당 권한 그룹으로 바꾼 후 메뉴에 대한 목록도 수정
	 */
	@RequestMapping(value="/menuMngGrpSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse menuManagerGrpSave(@Valid @RequestBody List<AuthGroupMenu> authGroupMenuList) throws Exception {
		for (AuthGroupMenu authGroupMenu : authGroupMenuList) { 
			Map<String, Object> map = new HashMap<String, Object>();	
        	String getGrpAuthCd = authGroupMenu.getGrpAuthCd();
            String menu_id = authGroupMenu.getMenuId().toString();
            map.put("grp_auth_cd", getGrpAuthCd);	
            map.put("menu_id", menu_id);
    		List<menuManager> mn = menuMngService.menuMngGrpSel(map);
    		//int result = -1;
    		
            if (authGroupMenu.getUseYn() == AXBootTypes.Used.NO) {
                //result = menuMngService.menuMngGrpDel(getGrpAuthCd, menu_id);
            	menuMngService.menuMngGrpDel(getGrpAuthCd, menu_id);
            } else {
                if(mn.size() == 0)
                {
                	//result = menuMngService.menuMngGrpIst(getGrpAuthCd, menu_id);
                	menuMngService.menuMngGrpIst(getGrpAuthCd, menu_id);
                }
            } 
            //System.out.println("menuManagerGrpSave 결과 ==>" + result);
        }
		return ok();
	}
	
	/** 
	 * @desc 계정이 변경되는 경우 일괄적으로 삭제후 다시 삽입하여 수정, 계정이 삭제되는 경우 삽입을 해도 계정이 없으므로 삽입되지 않음
	 */
	@RequestMapping(value="/menuMngUserSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse menuManagerUserSave(@Valid @RequestBody List<User> users) throws Exception {
		for (User user : users) {
        	String user_id = user.getUserCd();

            //int delresult = menuMngService.menuMngDel(user_id);
        	menuMngService.menuMngDel(user_id);
            //System.out.println("menuManagerUserSave 결과 ==>" + delresult);
            //int istresult = menuMngService.menuMngIst(user_id);
        	menuMngService.menuMngIst(user_id);
            //System.out.println("menuManagerUserSave 결과 ==>" + istresult);         
        }
		return ok();
    }
}
