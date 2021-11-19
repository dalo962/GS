package com.soluvis.bakeGR.ivrStat.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.ivrManagement.domain.ivrBlackList;

@Repository
public interface ivrDNISStatMapper extends MyBatisMapper{	

	// 조회
	List<Map<String, Object>> DNISStatGet(Map<String,Object> params);
}
