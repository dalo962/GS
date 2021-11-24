package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRBlackList;
import com.soluvis.bakeGR.ivrManagement.mapper.ivrGRBlackListMapper;

@Service
public class ivrGRBlackListServiceImpl implements ivrGRBlackListService{
	
	@Autowired
	private ivrGRBlackListMapper ivrGRBlackListMapper;
	
	@Override
	public List<ivrGRBlackList> BlackListGet(Map<String,Object> params)
	{		
		return ivrGRBlackListMapper.BlackListGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int BlackListIst(Map<String,Object> params)
	{		
		return ivrGRBlackListMapper.BlackListIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int BlackListUdt(Map<String,Object> params)
	{		
		return ivrGRBlackListMapper.BlackListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int BlackListDel(Map<String,Object> params)
	{		
		return ivrGRBlackListMapper.BlackListDel(params);
	}

	@Override
	public List<ivrGRBlackList> RecGet(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRBlackListMapper.RecGet(params);
	}
}

