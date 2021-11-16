package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

public interface agCallStatService {
		
	public List<Map<String,Object>> agCallSel(Map<String,Object> params);
	
	public List<Map<String,Object>> agCallSelSum(Map<String,Object> params);
}
