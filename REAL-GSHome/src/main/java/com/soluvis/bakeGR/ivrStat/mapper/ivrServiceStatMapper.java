package com.soluvis.bakeGR.ivrStat.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.ivrManagement.domain.ivrBlackList;

@Repository
public interface ivrServiceStatMapper extends MyBatisMapper{	

	// 조회
	List<Map<String, Object>> ServiceStatGet(Map<String,Object> params);
}
