package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.agSkillStatMapper;

@Service
public class agSkillStatServiceImpl implements agSkillStatService{
	
	@Autowired
	private agSkillStatMapper agSkillStatMapper;
	
	@Override
	public List<Map<String,Object>> agSkillSel(Map<String,Object> params)
	{		
		return agSkillStatMapper.agSkillSel(params);
	}
	
	@Override
	public List<Map<String,Object>> agSkillSelSum(Map<String,Object> params)
	{		
		return agSkillStatMapper.agSkillSelSum(params);
	}
}

