package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

public interface skCallStatService {
		
	public List<Map<String,Object>> skCallSel(Map<String,Object> params);
	
	public List<Map<String,Object>> skCallSelSum(Map<String,Object> params);
}
