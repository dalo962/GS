package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.historyStat.domain.agInfoManager;

public interface agInfoManagerService {
		
	public List<agInfoManager> agInfoDepSel();	
	
	public List<agInfoManager> skInfoDepSel();
	
	public List<agInfoManager> InfoCodeSel(Map<String,Object> params);
	
	public List<agInfoManager> agInfoSel(Map<String,Object> params);
	
	public int agInfoUdt(Map<String,Object> params);
}
