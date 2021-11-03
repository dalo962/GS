package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.management.domain.skillLvlChnMain;

public interface skillLvlChnMainService {
	
	public List<skillLvlChnMain> selectDispSkill(Map<String,Object> params);
	
	public List<skillLvlChnMain> selectSkill(Map<String,Object> params);
	
	public List<skillLvlChnMain> selectAgtSkill(Map<String,Object> params);
	
	public void saveAgtSkill(String user_cd, String user_name, List<skillLvlChnMain> skillGrps);
	
	public List<skillLvlChnMain> selectAgtTab(Map<String,Object> params);
}
