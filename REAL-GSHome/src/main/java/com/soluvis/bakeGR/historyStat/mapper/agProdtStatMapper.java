package com.soluvis.bakeGR.historyStat.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;

@Repository
public interface agProdtStatMapper extends MyBatisMapper{	

	// 스킬 통화 통계 조회
	List<Map<String,Object>> agProdtSel(Map<String,Object> params);
	// 스킬 대기 분포 조회
	List<Map<String,Object>> agProdtSelSum(Map<String,Object> params);
}
