package com.soluvis.bake.systemManager.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.systemManager.domain.ctiMapAgentOrg;
import com.soluvis.bake.systemManager.domain.ctiMapAgentOrgVO;

public interface ctiMapAgentOrgService {

	public List<ctiMapAgentOrg> selectAgentOrg(Map<String,Object> params);
	
	public List<ctiMapAgentOrg> selectAgent(Map<String,Object> params);
	
	public List<ctiMapAgentOrg> selectAgentDetail(Map<String,Object> params);

	public void processAgentOrg(String user_cd, String user_name, ctiMapAgentOrgVO agentOrgVO);

	public void processAgentDetail(String user_cd, String user_name, ctiMapAgentOrgVO agentOrgVO);
}
