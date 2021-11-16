package com.soluvis.bake.systemManager.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.systemManager.domain.statListManager;

@Repository
public interface statListManagerMapper extends MyBatisMapper{	

	// 통계 구분 리스트 조회
	List<statListManager> statTypeListSel();
	// skill 항목 조회
	List<statListManager> skillListSel(Map<String,Object> params);
	// agent 항목 조회
	List<statListManager> agentListSel(Map<String,Object> params);
	// skill 항목 추가
	int skillListIst(Map<String,Object> params);
	// agent 항목 추가
	int agentListIst(Map<String,Object> params);
	// skill 항목 수정
	int skillListUdt(Map<String,Object> params);
	// agent 항목 수정
	int agentListUdt(Map<String,Object> params);
	// skill 항목 삭제
	int skillListDel(Map<String,Object> params);
	// agent 항목 삭제
	int agentListDel(Map<String,Object> params);
		
	// 유저 리스트 조회
	List<statListManager> userList();
	// 유저 항목관리 테이블 항목 추가
	int userFacIst(Map<String,Object> params);
	// 유저 항목관리 테이블 항목 삭제
	int userFacDel(Map<String,Object> params);
	// 유저 계정삭제시 같이 삭제해준다
	int userDel(@Param("user_id") String user_id);
	// 유저 팩터리스트 조회
	List<statListManager> userFacSel(Map<String,Object> params);
	// 유저 항목관리 테이블 사용여부 항목 수정
	int userFacUdt(Map<String,Object> params);

	
	// modal창 조회
	List<statListManager> skillListSelmodal(Map<String,Object> params);
	List<statListManager> agentListSelmodal(Map<String,Object> params);
	// modal창 사용여부 수정
	int skillListUdtmodal(Map<String,Object> params);
	int agentListUdtmodal(Map<String,Object> params);
	
	// 사용자 권한 및 코드 조회 테이블
	List<statListManager> userAuthSel(Map<String,Object> params);
	
	List<statListManager> selectHistoryTime(Map<String,Object> params);
	
	List<statListManager> userAuthLst(Map<String,Object> params);
	
	// 처음 특정 사용자가 세팅한대로 세팅
	int userFacIstSetting(Map<String,Object> params);
}
