package com.soluvis.bakeRt.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrBlackList;

public interface ivrEmergencyMentService {
		
	public List<ivrBlackList> BlackListGet(Map<String,Object> params);
	
	public int BlackListIst(Map<String,Object> params);
	
	public int BlackListUdt(Map<String,Object> params);
	
	public int BlackListDel(Map<String,Object> params);
}
