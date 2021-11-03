package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.management.domain.skillLvlSummary;

public interface skillLvlSummaryService {

	public List<skillLvlSummary> selectSummary(Map<String,Object> params);
	
	public List<skillLvlSummary> selectSkList(Map<String,Object> params);
	
	public List<skillLvlSummary> selectAgList(Map<String,Object> params);
}
