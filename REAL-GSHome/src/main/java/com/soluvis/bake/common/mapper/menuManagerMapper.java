package com.soluvis.bake.common.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.common.domain.menuManager;

@Repository
public interface menuManagerMapper extends MyBatisMapper{

	// 계정에 따른 메뉴 설정화면 조회
	List<menuManager> menuMngSel(Map<String,Object> params);
	
	// 메뉴에 대한 권한이 변경될 경우 값 유무 확인
	List<menuManager> menuMngGrpSel(Map<String,Object> params);
	
	// 로그인시 메뉴id에 대한 정보 쿼리
	List<Long> loginMenuidSel(Map<String,Object> params);
	
	// 메뉴 설정 화면에 대한 update
	int menuMngUdt(@Param("use_yn") String use_yn, @Param("menu_id") String menu_id, @Param("user_id") String user_id);
	
	// 계정이 추가될 경우 or 계정 권한이 변경될 경우
	int menuMngIst(@Param("user_id") String user_id);
	
	// 메뉴에 대한 권한이 추가되었을때의 insert
	int menuMngGrpIst(@Param("grp_auth_cd") String grp_auth_cd, @Param("menu_id") String menu_id);
	
	// 계정이 삭제될 경우 or menuist전 delete
	int menuMngDel(@Param("user_id") String user_id);
	
	// 메뉴에 대한 권한이 삭제되었을때의 delete
	int menuMngGrpDel(@Param("grp_auth_cd") String grp_auth_cd, @Param("menu_id") String menu_id);
	
	// 메뉴가 삭제될 경우 같이 삭제
	int menuMngidDel(@Param("menu_id") long menu_id);
	
	// 사용자등록 권한, 스킬등록 권한
	List<Map<String,Object>> grpcheck(Map<String,Object> params);	
	List<Map<String,Object>> menucheck(Map<String,Object> params);
	
	int GrpIst(Map<String,Object> params);
	int MenuIst(Map<String,Object> params);
	
	int MenuDel(Map<String,Object> params);
	
	// 로그인할때 ip와 마지막 로그인날짜를 업데이트
	int LastLoginDateUpdate(@Param("ip") String ip, @Param("user_id") String user_id);
	
}
