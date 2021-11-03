package com.soluvis.bake.common.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.soluvis.bake.common.domain.menuManager;

public interface menuManagerService {

	public List<menuManager> menuMngSel(Map<String,Object> params);
	
	public List<menuManager> menuMngGrpSel(Map<String,Object> params);
	
	public List<Long> loginMenuidSel(Map<String,Object> params);
	
	public int menuMngUdt(@Param("use_yn") String use_yn, @Param("menu_id") String menu_id, @Param("user_id") String user_id);
	
	public int menuMngIst(@Param("user_id") String user_id);
	
	public int menuMngGrpIst(@Param("grp_auth_cd") String grp_auth_cd, @Param("menu_id") String menu_id);
	
	public int menuMngDel(@Param("user_id") String user_id);
		
	public int menuMngGrpDel(@Param("grp_auth_cd") String grp_auth_cd, @Param("menu_id") String menu_id);
	
	public int menuMngidDel(@Param("menu_id") long menu_id);
	
	
	public List<Map<String,Object>> grpcheck(Map<String,Object> params);	
	public List<Map<String,Object>> menucheck(Map<String,Object> params);
	
	public int GrpIst(Map<String,Object> params);
	public int MenuIst(Map<String,Object> params);
	
	public int MenuDel(Map<String,Object> params);
	
	
	public int LastLoginDateUpdate(@Param("ip") String ip, @Param("user_id") String user_id);
}
