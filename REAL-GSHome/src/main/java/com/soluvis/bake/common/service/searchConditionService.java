package com.soluvis.bake.common.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.common.domain.searchCondition;

public interface searchConditionService {

	List<searchCondition> skillOrg(Map<String, Object> params);

	List<searchCondition> company(Map<String,Object> params);
	
	List<searchCondition> channel(Map<String,Object> params);

	List<searchCondition> skill(Map<String, Object> params);
	
	List<searchCondition> skillRt(Map<String, Object> params);
	
	List<searchCondition> skillGrp(Map<String, Object> params);
	
	List<searchCondition> part(Map<String,Object> params);

	List<searchCondition> team(Map<String, Object> params);
	
	List<searchCondition> agent(Map<String, Object> params);
	
	List<searchCondition> dnis(Map<String, Object> params);
	
	List<searchCondition> agentCfg(Map<String, Object> params);

	List<searchCondition> agentGrp(Map<String, Object> params);
	
	List<searchCondition> sockInfo(Map<String,Object> params);
	
	List<searchCondition> codeSelect(Map<String,Object> params);
	
	List<searchCondition> groupcdSelect(Map<String,Object> params);
	
	
	List<searchCondition> dispcompany(Map<String,Object> params);
	
	List<searchCondition> dispchannel(Map<String,Object> params);
	
	List<searchCondition> disppart(Map<String,Object> params);
	
	List<searchCondition> dispteam(Map<String,Object> params);
	
	
	List<searchCondition> systemSelectGrp(Map<String,Object> params);
}
