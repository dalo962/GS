package com.soluvis.bake.common.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.soluvis.bake.common.domain.searchCondition;
import com.soluvis.bake.common.mapper.searchConditionMapper;
import com.soluvis.bake.system.domain.BaseService;

@Service
public class searchConditionServiceImpl extends BaseService<searchCondition, Long> implements searchConditionService{

	@Inject
	private searchConditionMapper searchConditionMapper;
	
	@Override
	public List<searchCondition> sockInfo(Map<String,Object> params) {		
		return searchConditionMapper.sockInfo(params);
	}
	
	@Override
	public List<searchCondition> skillOrg(Map<String, Object> params) {	
		return searchConditionMapper.skillOrg(params);
	}
	
	@Override
	public List<searchCondition> company(Map<String, Object> params) {	
		return searchConditionMapper.company(params);
	}

	@Override
	public List<searchCondition> channel(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [channel] params : " + params.toString());
		return searchConditionMapper.channel(params);
	}

	@Override
	public List<searchCondition> skill(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [skill] params : " + params.toString());
		return searchConditionMapper.skill(params);
	}
	

	@Override
	public List<searchCondition> skillRt(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [skill] params : " + params.toString());
		return searchConditionMapper.skillRt(params);
	}
	
	@Override
	public List<searchCondition> skillGrp(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [skillGrp] params : " + params.toString());
		return searchConditionMapper.skillGrp(params);
	}

	@Override
	public List<searchCondition> part(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [part] params : " + params.toString());
		return searchConditionMapper.part(params);
	}

	@Override
	public List<searchCondition> team(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [team] params : " + params.toString());
		return searchConditionMapper.team(params);
	}

	@Override
	public List<searchCondition> agent(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agent] params : " + params.toString());
		return searchConditionMapper.agent(params);
	}
	
	@Override
	public List<searchCondition> dnis(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agent] params : " + params.toString());
		return searchConditionMapper.dnis(params);
	}
	
	@Override
	public List<searchCondition> agentCfg(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentCfg] params : " + params.toString());
		return searchConditionMapper.agentCfg(params);
	}

	@Override
	public List<searchCondition> agentGrp(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.agentGrp(params);
	}
	
	@Override
	public List<searchCondition> codeSelect(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.codeSelect(params);
	}
	
	
	@Override
	public List<searchCondition> groupcdSelect(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.groupcdSelect(params);
	}
	
	
	@Override
	public List<searchCondition> dispcompany(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.dispcompany(params);
	}
	
	
	@Override
	public List<searchCondition> dispchannel(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.dispchannel(params);
	}
	
	@Override
	public List<searchCondition> disppart(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.disppart(params);
	}
	
	@Override
	public List<searchCondition> dispteam(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.dispteam(params);
	}
	
	
	@Override
	public List<searchCondition> systemSelectGrp(Map<String, Object> params) {
		
		//System.out.println("[searchConditionServiceImpl] [agentGrp] params : " + params.toString());
		return searchConditionMapper.systemSelectGrp(params);
	}
}