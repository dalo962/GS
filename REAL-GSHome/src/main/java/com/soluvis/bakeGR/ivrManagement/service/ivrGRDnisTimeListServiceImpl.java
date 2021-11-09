package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.ivrManagement.domain.ivrBlackList;
import com.soluvis.bake.ivrManagement.mapper.ivrBlackListMapper;

@Service
public class ivrGRDnisTimeListServiceImpl implements ivrGRBlackListService{
	
	@Autowired
	private ivrBlackListMapper ivrBlackListMapper;
	
	@Override
	public List<ivrBlackList> BlackListGet(Map<String,Object> params)
	{		
		return ivrBlackListMapper.BlackListGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int BlackListIst(Map<String,Object> params)
	{		
		return ivrBlackListMapper.BlackListIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int BlackListUdt(Map<String,Object> params)
	{		
		return ivrBlackListMapper.BlackListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int BlackListDel(Map<String,Object> params)
	{		
		return ivrBlackListMapper.BlackListDel(params);
	}
}

