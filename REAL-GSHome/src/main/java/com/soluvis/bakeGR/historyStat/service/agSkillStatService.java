package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

public interface agSkillStatService {
		
	public List<Map<String,Object>> agSkillSel(Map<String,Object> params);
	
	public List<Map<String,Object>> agSkillSelSum(Map<String,Object> params);
}
