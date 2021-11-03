package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrDnisTimeList;

public interface ivrDnisTimeListService {
		
	public List<ivrDnisTimeList> DnisListGet(Map<String,Object> params);
	
	public int DnisListIst(Map<String,Object> params);
	
	public int DnisListUdt(Map<String,Object> params);
	
	public int DnisListDel(Map<String,Object> params);
	
	public int DnisListDelUdt(Map<String,Object> params);
}
