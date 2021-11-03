package com.soluvis.bake.systemManager.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.systemManager.domain.ctiMapAgentOrg;

@Repository
public interface ctiMapAgentOrgMapper extends MyBatisMapper{	
	
	List<ctiMapAgentOrg> selectAgentOrg(Map<String,Object> params);

	void insertAgentOrg(ctiMapAgentOrg param);
	
	void updateAgentOrg(ctiMapAgentOrg param);
	
	void deleteAgentOrg(ctiMapAgentOrg param);
	
	void insertAgentOrgToOrg(ctiMapAgentOrg param);
	
	void updateAgentOrgToOrg(ctiMapAgentOrg param);
	
	void deleteAgentOrgToOrg(ctiMapAgentOrg param);
	
	List<ctiMapAgentOrg> selectAgent(Map<String,Object> params);
	
	List<ctiMapAgentOrg> selectAgentDetail(Map<String,Object> params);
	
	void insertAgentDetail(List<ctiMapAgentOrg> params);
	
	void updateAgentDetail(ctiMapAgentOrg param);

	void deleteAgentDetail(ctiMapAgentOrg param);

	String newOrgId();
	
	void insertGrpHist(ctiMapAgentOrg params);

}
