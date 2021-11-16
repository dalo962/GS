package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.agProdtStatMapper;

@Service
public class agProdtStatServiceImpl implements agProdtStatService{
	
	@Autowired
	private agProdtStatMapper agProdtStatMapper;
	
	@Override
	public List<Map<String,Object>> agProdtSel(Map<String,Object> params)
	{		
		return agProdtStatMapper.agProdtSel(params);
	}
	
	@Override
	public List<Map<String,Object>> agProdtSelSum(Map<String,Object> params)
	{		
		return agProdtStatMapper.agProdtSelSum(params);
	}
}

