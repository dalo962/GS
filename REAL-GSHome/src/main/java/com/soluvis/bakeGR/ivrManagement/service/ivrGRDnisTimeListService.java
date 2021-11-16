package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnisTimeList;

public interface ivrGRDnisTimeListService {
		
	public List<ivrGRDnisTimeList> DnisListGet(Map<String,Object> params);
	
	public int DnisListIst(Map<String,Object> params);
	
	public int DnisListUdt(Map<String,Object> params);
	
	public int DnisListDel(Map<String,Object> params);
	
	public int DnisListDelUdt(Map<String,Object> params);
}
