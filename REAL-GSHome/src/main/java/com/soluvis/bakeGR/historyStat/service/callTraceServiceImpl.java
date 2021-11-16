package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.callTraceMapper;

@Service
public class callTraceServiceImpl implements callTraceService{
	
	@Autowired
	private callTraceMapper callTrMapper;
	
	@Override
	public List<Map<String,Object>> callTrSel(Map<String,Object> params)
	{		
		return callTrMapper.callTrSel(params);
	}
	
	@Override
	public List<Map<String,Object>> connidfsts(Map<String,Object> params)
	{
		return callTrMapper.connidfsts(params);
	}
	
	@Override
	public List<Map<String,Object>> callTrTbSel(Map<String,Object> params)
	{		
		return callTrMapper.callTrTbSel(params);
	}
	
	
	@Override
	public List<Map<String,Object>> sessionidget(Map<String,Object> params)
	{		
		return callTrMapper.sessionidget(params);
	}
}

