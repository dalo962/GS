package com.soluvis.bakeGR.historyStat.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;

@Repository
public interface agLogStatMapper extends MyBatisMapper{	

	// 로그인 상세 내역 조회
	List<Map<String,Object>> agLogSel(Map<String,Object> params);
}
