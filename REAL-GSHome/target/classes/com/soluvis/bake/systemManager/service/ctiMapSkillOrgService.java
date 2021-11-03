package com.soluvis.bake.systemManager.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.systemManager.domain.ctiMapSkillOrg;
import com.soluvis.bake.systemManager.domain.ctiMapSkillOrgVO;

public interface ctiMapSkillOrgService {

	public List<ctiMapSkillOrg> selectSkillOrg(Map<String,Object> params);
	
	public List<ctiMapSkillOrg> selectSkill(Map<String,Object> params);
	
	public List<ctiMapSkillOrg> selectSkillDetail(Map<String,Object> params);

	public void processSkillOrg(String user_cd, String user_name, ctiMapSkillOrgVO skillOrgVO);

	public void processSkillDetail(String user_cd, String user_name, ctiMapSkillOrgVO skillOrgVO);
}
