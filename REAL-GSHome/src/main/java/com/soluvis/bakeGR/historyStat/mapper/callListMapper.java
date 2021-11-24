package com.soluvis.bakeGR.historyStat.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;

@Repository
public interface callListMapper extends MyBatisMapper{	

	// 상세 내역 조회
	List<Map<String,Object>> callListSel(Map<String,Object> params);
}
