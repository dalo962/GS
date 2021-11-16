package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

public interface callTraceService {
		
	public List<Map<String,Object>> callTrSel(Map<String,Object> params);
	
	public List<Map<String,Object>> connidfsts(Map<String,Object> params);
	
	public List<Map<String,Object>> callTrTbSel(Map<String,Object> params);
	
	
	public List<Map<String,Object>> sessionidget(Map<String,Object> params);
}
