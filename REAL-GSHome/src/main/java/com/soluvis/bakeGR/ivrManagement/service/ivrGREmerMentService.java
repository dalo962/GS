package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGREmerMent;

public interface ivrGREmerMentService {
		
	public List<ivrGREmerMent> EmerMentGet(Map<String,Object> params);
	
	public List<ivrGREmerMent> EmerMentExist(Map<String,Object> params);
	
	public int EmerMentIst(Map<String,Object> params);
	
	public int EmerMentUdt(Map<String,Object> params);
	
	public int EmerMentDel(Map<String,Object> params);
}
