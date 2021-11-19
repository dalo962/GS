package com.soluvis.bakeGR.ivrStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bakeGR.ivrStat.mapper.ivrDNISStatMapper;

@Service
public class ivrDNISStatServiceImpl implements ivrDNISStatService{
	
	@Autowired
	private ivrDNISStatMapper ivrDNISStatMapper;
	
	@Override
	public List<Map<String, Object>> DNISStatGet(Map<String,Object> params)
	{		
		return ivrDNISStatMapper.DNISStatGet(params);
	}

}

