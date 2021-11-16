package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.skCallStatMapper;

@Service
public class skCallStatServiceImpl implements skCallStatService{
	
	@Autowired
	private skCallStatMapper skCallStatMapper;
	
	@Override
	public List<Map<String,Object>> skCallSel(Map<String,Object> params)
	{		
		return skCallStatMapper.skCallSel(params);
	}
	
	@Override
	public List<Map<String,Object>> skCallSelSum(Map<String,Object> params)
	{		
		return skCallStatMapper.skCallSelSum(params);
	}
}

