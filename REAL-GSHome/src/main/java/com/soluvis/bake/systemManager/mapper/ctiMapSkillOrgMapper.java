package com.soluvis.bake.systemManager.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.systemManager.domain.ctiMapSkillOrg;

@Repository
public interface ctiMapSkillOrgMapper extends MyBatisMapper{	
	
	List<ctiMapSkillOrg> selectSkillOrg(Map<String,Object> params);

	void insertSkillOrg(ctiMapSkillOrg param);
	
	void updateSkillOrg(ctiMapSkillOrg param);
	
	void deleteSkillOrg(ctiMapSkillOrg param);
	
	void insertSkillOrgToOrg(ctiMapSkillOrg param);
	
	void updateSkillOrgToOrg(ctiMapSkillOrg param);
	
	void deleteSkillOrgToOrg(ctiMapSkillOrg param);
	
	List<ctiMapSkillOrg> selectSkill(Map<String,Object> params);
	
	List<ctiMapSkillOrg> selectSkillDetail(Map<String,Object> params);
	
	void insertSkillDetail(List<ctiMapSkillOrg> params);
	
	void updateSkillDetail(ctiMapSkillOrg param);

	void deleteSkillDetail(ctiMapSkillOrg param);
	
	void deleteSkillGrp(ctiMapSkillOrg param);

	String newOrgId();
	
	void insertGrpHist(ctiMapSkillOrg params);
	
}
