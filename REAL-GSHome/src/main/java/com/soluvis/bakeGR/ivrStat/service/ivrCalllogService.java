package com.soluvis.bakeGR.ivrStat.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrBlackList;

public interface ivrCalllogService {
		
	public List<Map<String, Object>> CalllogGet(Map<String,Object> params);
	
}
