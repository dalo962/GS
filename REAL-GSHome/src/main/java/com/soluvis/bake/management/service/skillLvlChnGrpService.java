package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.management.domain.skillLvlChnGrp;

public interface skillLvlChnGrpService {
	
	public List<skillLvlChnGrp> selectDispSkill(Map<String,Object> params);
	
	public List<skillLvlChnGrp> selectSkillGrp(Map<String,Object> params);
	
	public List<skillLvlChnGrp> selectAgtSkill(Map<String,Object> params);
	
	public List<skillLvlChnGrp> selectAgtSkillCnt(Map<String,Object> params);
	
	public void saveAgtSkill(String user_cd, String user_name, List<skillLvlChnGrp> skillGrps);
	
	public List<skillLvlChnGrp> selectSkgStruct(Map<String,Object> params);
	
	public int udtDaGroup(Map<String,Object> params);
	
	public int udtDGroup(Map<String,Object> params);
	
	public int udtAGroup(Map<String,Object> params);
	
	public int udtPGroup(Map<String,Object> params);
}
