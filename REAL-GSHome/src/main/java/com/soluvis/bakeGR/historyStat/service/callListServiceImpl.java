package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.historyStat.mapper.callListMapper;

@Service
public class callListServiceImpl implements callListService{
	
	@Autowired
	private callListMapper callListMapper;
	
	@Override
	public List<Map<String,Object>> callListSel(Map<String,Object> params)
	{		
		return callListMapper.callListSel(params);
	}
	
}

