package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.ivrManagement.domain.ivrDnisTimeList;
import com.soluvis.bake.ivrManagement.mapper.ivrDnisTimeListMapper;

@Service
public class ivrDnisTimeListServiceImpl implements ivrDnisTimeListService{
	
	@Autowired
	private ivrDnisTimeListMapper ivrDnisListMapper;
	
	@Override
	public List<ivrDnisTimeList> DnisListGet(Map<String,Object> params)
	{		
		return ivrDnisListMapper.DnisListGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListIst(Map<String,Object> params)
	{		
		return ivrDnisListMapper.DnisListIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListUdt(Map<String,Object> params)
	{		
		return ivrDnisListMapper.DnisListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListDel(Map<String,Object> params)
	{		
		return ivrDnisListMapper.DnisListDel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListDelUdt(Map<String,Object> params)
	{		
		return ivrDnisListMapper.DnisListDelUdt(params);
	}
}

