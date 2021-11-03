package com.soluvis.bake.common.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.common.domain.menuManager;
import com.soluvis.bake.common.mapper.menuManagerMapper;

@Service
public class menuManagerServiceImpl implements menuManagerService{

	@Inject
	private menuManagerMapper menuMngMapper;
	
	@Override
	public List<menuManager> menuMngSel(Map<String, Object> params) {
		return menuMngMapper.menuMngSel(params);
	}

	@Override
	public List<menuManager> menuMngGrpSel(Map<String, Object> params) {
		return menuMngMapper.menuMngGrpSel(params);
	}
	
	@Override
	public List<Long> loginMenuidSel(Map<String,Object> params){
		return menuMngMapper.loginMenuidSel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int menuMngUdt(@Param("use_yn") String use_yn, @Param("menu_id") String menu_id, @Param("user_id") String user_id) 
	{
		return menuMngMapper.menuMngUdt(use_yn, menu_id, user_id);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int menuMngIst(@Param("user_id") String user_id) 
	{
		return menuMngMapper.menuMngIst(user_id);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int menuMngGrpIst(@Param("grp_auth_cd") String grp_auth_cd, @Param("menu_id") String menu_id)
	{
		return menuMngMapper.menuMngGrpIst(grp_auth_cd, menu_id);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int menuMngDel(@Param("user_id") String user_id) 
	{
		return menuMngMapper.menuMngDel(user_id);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int menuMngGrpDel(@Param("grp_auth_cd") String grp_auth_cd, @Param("menu_id") String menu_id)
	{
		return menuMngMapper.menuMngGrpDel(grp_auth_cd, menu_id);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int menuMngidDel(@Param("menu_id") long menu_id)
	{
		return menuMngMapper.menuMngidDel(menu_id);
	}
	
	
	@Override
	public List<Map<String, Object>> grpcheck(Map<String, Object> params) {
		return menuMngMapper.grpcheck(params);
	}
	@Override
	public List<Map<String, Object>> menucheck(Map<String, Object> params) {
		return menuMngMapper.menucheck(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int GrpIst(Map<String, Object> params)
	{
		return menuMngMapper.GrpIst(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int MenuIst(Map<String, Object> params)
	{
		return menuMngMapper.MenuIst(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int MenuDel(Map<String, Object> params)
	{
		return menuMngMapper.MenuDel(params);
	}
	
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int LastLoginDateUpdate(@Param("ip") String ip, @Param("user_id") String user_id)
	{
		return menuMngMapper.LastLoginDateUpdate(ip, user_id);
	}
}
