package com.soluvis.bake.systemManager.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.systemManager.domain.progManager;

public interface progManagerService {
	
	public List<progManager> progListSel();
	
	public List<progManager> histSel(Map<String,Object> params);
	
	public List<progManager> histTarget(Map<String,Object> params);
	
	
	public List<progManager> penSel(Map<String,Object> params);

	public int penIst(Map<String,Object> params);
	
	
	public int winkDataAgg(Map<String,Object> params);
	
	public int axastruct(Map<String,Object> params);
}
