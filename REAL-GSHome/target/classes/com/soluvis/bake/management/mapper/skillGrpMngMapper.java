package com.soluvis.bake.management.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.management.domain.skillGrpMng;

@Repository
public interface skillGrpMngMapper extends MyBatisMapper{	
	
	List<skillGrpMng> selectSkillList(Map<String,Object> params);
	
	List<skillGrpMng> selectSkillGrpList(Map<String,Object> params);
	
	void insertSkillGrpOrg(skillGrpMng params);
	
	void insertSkillGrpOrgToOrg(skillGrpMng params);
	
	void insertSkillGrp(skillGrpMng params);
	
	void updateSkillGrpOrg(skillGrpMng params);
	
	void updateSkillGrp(skillGrpMng params);
	
	void deleteSkillGrpOrg(skillGrpMng params);
	
	void deleteSkillGrpOrgToOrg(skillGrpMng params);
	
	void deleteSkillGrp(skillGrpMng params);
	
	String newOrgId();
	
	void insertGrpHist(skillGrpMng params);
	
	List<skillGrpMng> selectSkGrpSk(Map<String,Object> params);
	
}
