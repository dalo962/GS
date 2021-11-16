package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.skWaitStatMapper;

@Service
public class skWaitStatServiceImpl implements skWaitStatService{
	
	@Autowired
	private skWaitStatMapper skWaitStatMapper;
	
	@Override
	public List<Map<String,Object>> skWaitSel(Map<String,Object> params)
	{		
		return skWaitStatMapper.skWaitSel(params);
	}
	
	@Override
	public List<Map<String,Object>> skWaitSelSum(Map<String,Object> params)
	{		
		return skWaitStatMapper.skWaitSelSum(params);
	}
}

