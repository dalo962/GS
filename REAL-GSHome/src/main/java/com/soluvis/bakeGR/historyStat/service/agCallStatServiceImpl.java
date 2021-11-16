package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.agCallStatMapper;

@Service
public class agCallStatServiceImpl implements agCallStatService{
	
	@Autowired
	private agCallStatMapper agCallStatMapper;
	
	@Override
	public List<Map<String,Object>> agCallSel(Map<String,Object> params)
	{		
		return agCallStatMapper.agCallSel(params);
	}
	
	@Override
	public List<Map<String,Object>> agCallSelSum(Map<String,Object> params)
	{		
		return agCallStatMapper.agCallSelSum(params);
	}
}

