package com.soluvis.bakeGR.ivrStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bakeGR.ivrStat.mapper.ivrServiceStatMapper;

@Service
public class ivrServiceStatServiceImpl implements ivrServiceStatService{
	
	@Autowired
	private ivrServiceStatMapper ivrServiceStatMapper;
	
	@Override
	public List<Map<String, Object>> ServiceStatGet(Map<String,Object> params)
	{		
		return ivrServiceStatMapper.ServiceStatGet(params);
	}

}

