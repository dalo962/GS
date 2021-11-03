package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrUrlList;

public interface ivrUrlListService {
		
	public List<ivrUrlList> UrlListGet(Map<String,Object> params);
	
	public int UrlListIst(Map<String,Object> params);
	
	public int UrlListUdt(Map<String,Object> params);
	
	public int UrlListDel(Map<String,Object> params);
	
	public int UrlFileUdt(Map<String,Object> params);
	
	
	public List<ivrUrlList> IvrUrlGet(Map<String,Object> params);
}
