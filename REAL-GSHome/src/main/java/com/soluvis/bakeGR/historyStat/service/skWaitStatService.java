package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

public interface skWaitStatService {
		
	public List<Map<String,Object>> skWaitSel(Map<String,Object> params);
	
	public List<Map<String,Object>> skWaitSelSum(Map<String,Object> params);
}
