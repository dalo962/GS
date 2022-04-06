package com.soluvis.bake.systemManager.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.systemManager.domain.progManager;

@Repository
public interface progManagerMapper extends MyBatisMapper{	

	// 프로그램 리스트 조회
	List<progManager> progListSel();
	// 프로그램 결과 조회
	List<progManager> histSel(Map<String,Object> params);
	// 프로그램 시간 조회
	List<progManager> histTarget(Map<String,Object> params);
	
	// 예약 테이블 조회 중복값 찾기
	List<progManager> penSel(Map<String,Object> params);
	// 예약 테이블 추가
	int penIst(Map<String,Object> params);
	
	
	int ivrretry(Map<String,Object> params);

	int winkDataAgg(Map<String,Object> params);
	
	int axastruct(Map<String,Object> params);
}
