package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.management.domain.skillGrpMng;

public interface skillGrpMngService {

	public List<skillGrpMng> selectSkillList(Map<String,Object> params);
	
	public List<skillGrpMng> selectSkillGrpList(Map<String,Object> params);
	
	public void saveSkillGrp(String user_cd, String user_name, List<skillGrpMng> skillGrps);
	
//	public List<SkillGrpMng> selectSkillOrg(Map<String,Object> params);
//	
//	public List<SkillGrpMng> selectSkillDetail(Map<String,Object> params);
	
	public List<skillGrpMng> selectSkGrpSk(Map<String,Object> params);
		
	public void saveSkillGrpAll(String user_cd, String user_name, List<skillGrpMng> skillGrps);
}
