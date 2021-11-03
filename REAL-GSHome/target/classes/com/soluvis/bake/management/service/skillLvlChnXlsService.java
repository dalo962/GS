package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.management.domain.skillLvlChnXls;

public interface skillLvlChnXlsService {
	
	public List<skillLvlChnXls> selectDispSkill(Map<String,Object> params);	
	
	public List<skillLvlChnXls> selectAgCheck(Map<String,Object> params);	
	
	public List<skillLvlChnXls> selectSgCheck(Map<String,Object> params);
	
	public List<skillLvlChnXls> selectSkgStruct(Map<String,Object> params);
	
	public List<skillLvlChnXls> skillAgtDelCheck(Map<String,Object> params);
	
	public int udtDaGroup(Map<String,Object> params);
	
	public int udtDGroup(Map<String,Object> params);
	
	public void saveAgtSkill(String user_cd, String user_name, List<skillLvlChnXls> skillGrps);
	
}
