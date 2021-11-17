package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnis;

public interface ivrGRDnisService {
		
	public List<ivrGRDnis> DnisGet(Map<String,Object> params);
	
	public int DnisIst(Map<String,Object> params);
	
	public int DnisUdt(Map<String,Object> params);
	
	public int DnisDel(Map<String,Object> params);
}
