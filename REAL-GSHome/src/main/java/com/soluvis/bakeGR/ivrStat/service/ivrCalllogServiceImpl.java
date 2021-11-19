package com.soluvis.bakeGR.ivrStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bakeGR.ivrStat.mapper.ivrCalllogMapper;

@Service
public class ivrCalllogServiceImpl implements ivrCalllogService{
	
	@Autowired
	private ivrCalllogMapper ivrCalllogMapper;
	
	@Override
	public List<Map<String, Object>> CalllogGet(Map<String,Object> params)
	{		
		return ivrCalllogMapper.CalllogGet(params);
	}

}

