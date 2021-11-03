package com.soluvis.bake.management.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.management.domain.grpModHistory;

@Repository
public interface grpModHistoryMapper extends MyBatisMapper{	
	
	// 스킬 그룹 목록
	List<grpModHistory> selectHisGrpList(Map<String,Object> params);
	// 스킬 변경 이력 조회
	List<grpModHistory> selectHisList(Map<String,Object> params);	
	// 스킬 변경 이력 추가
	void insertHis(Map<String,Object> params);
}
