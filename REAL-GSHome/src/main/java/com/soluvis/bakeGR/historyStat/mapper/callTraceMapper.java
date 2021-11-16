package com.soluvis.bakeGR.historyStat.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;

@Repository
public interface callTraceMapper extends MyBatisMapper{	

	// 상세 내역 조회
	List<Map<String,Object>> callTrSel(Map<String,Object> params);
	
	List<Map<String,Object>> connidfsts(Map<String,Object> params);
	
	List<Map<String,Object>> callTrTbSel(Map<String,Object> params);
	
	
	List<Map<String,Object>> sessionidget(Map<String,Object> params);
}
