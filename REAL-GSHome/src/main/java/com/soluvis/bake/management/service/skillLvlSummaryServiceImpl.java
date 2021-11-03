package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bake.management.domain.skillLvlSummary;
import com.soluvis.bake.management.mapper.skillLvlSummaryMapper;

@Service
public class skillLvlSummaryServiceImpl implements skillLvlSummaryService{

	@Autowired
	private skillLvlSummaryMapper skillLvlSummaryMapper;

	@Override
	public List<skillLvlSummary> selectSummary(Map<String,Object> params) 
	{	
		return skillLvlSummaryMapper.selectSummary(params);
	}

	@Override
	public List<skillLvlSummary> selectSkList(Map<String,Object> params) 
	{	
		return skillLvlSummaryMapper.selectSkList(params);
	}
	
	@Override
	public List<skillLvlSummary> selectAgList(Map<String,Object> params) 
	{	
		return skillLvlSummaryMapper.selectAgList(params);
	}
}