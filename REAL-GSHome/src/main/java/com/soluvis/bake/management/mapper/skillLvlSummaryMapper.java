package com.soluvis.bake.management.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.management.domain.skillLvlSummary;

@Repository
public interface skillLvlSummaryMapper extends MyBatisMapper{	
	
	// 스킬 그룹 요약을 조회
	List<skillLvlSummary> selectSummary(Map<String,Object> params);
	// 스킬 목록 불러오기
	List<skillLvlSummary> selectSkList(Map<String,Object> params);
	// 상담사 목록 불러오기
	List<skillLvlSummary> selectAgList(Map<String,Object> params);
}
