package com.soluvis.bakeGR.ivrStat.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrBlackList;

public interface ivrServiceStatService {
		
	public List<Map<String, Object>> ServiceStatGet(Map<String,Object> params);
	
}
