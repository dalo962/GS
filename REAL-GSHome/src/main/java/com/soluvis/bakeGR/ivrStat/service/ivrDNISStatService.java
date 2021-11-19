package com.soluvis.bakeGR.ivrStat.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrBlackList;

public interface ivrDNISStatService {
		
	public List<Map<String, Object>> DNISStatGet(Map<String,Object> params);
	
}
