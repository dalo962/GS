package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.agLogStatMapper;

@Service
public class agLogStatServiceImpl implements agLogStatService{
	
	@Autowired
	private agLogStatMapper agLogStatMapper;
	
	@Override
	public List<Map<String,Object>> agLogSel(Map<String,Object> params)
	{		
		return agLogStatMapper.agLogSel(params);
	}
}

