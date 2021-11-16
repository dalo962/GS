package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

public interface agProdtStatService {
		
	public List<Map<String,Object>> agProdtSel(Map<String,Object> params);
	
	public List<Map<String,Object>> agProdtSelSum(Map<String,Object> params);
}
