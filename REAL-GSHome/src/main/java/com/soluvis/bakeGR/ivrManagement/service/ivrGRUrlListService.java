package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;

public interface ivrGRUrlListService {
		
	public List<ivrGRUrlList> UrlListGet(Map<String,Object> params);
	
	public int UrlListIst(Map<String,Object> params);
	
	public int UrlListUdt(Map<String,Object> params);
	
	public int UrlListDel(Map<String,Object> params);
	
	public int UrlFileUdt(Map<String,Object> params);
	
	
	public List<ivrGRUrlList> IvrUrlGet(Map<String,Object> params);
}
