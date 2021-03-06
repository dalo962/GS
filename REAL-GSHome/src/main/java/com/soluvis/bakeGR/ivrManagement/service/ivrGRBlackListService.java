package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRBlackList;

public interface ivrGRBlackListService {
		
	public List<ivrGRBlackList> BlackListGet(Map<String,Object> params);
	
	public int BlackListIst(Map<String,Object> params);
	
	public int BlackListUdt(Map<String,Object> params);
	
	public int BlackListDel(Map<String,Object> params);
	
	public List<ivrGRBlackList> RecGet(Map<String,Object> params);
}
