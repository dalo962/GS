package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnisTimeList;
import com.soluvis.bakeGR.ivrManagement.mapper.ivrGRDnisTimeListMapper;

@Service
public class ivrGRDnisTimeListServiceImpl implements ivrGRDnisTimeListService{
	
	@Autowired
	private ivrGRDnisTimeListMapper ivrGRDnisListMapper;
	
	@Override
	public List<ivrGRDnisTimeList> DnisListGet(Map<String,Object> params)
	{		
		return ivrGRDnisListMapper.DnisListGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListIst(Map<String,Object> params)
	{		
		return ivrGRDnisListMapper.DnisListIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListUdt(Map<String,Object> params)
	{		
		return ivrGRDnisListMapper.DnisListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListDel(Map<String,Object> params)
	{		
		return ivrGRDnisListMapper.DnisListDel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DnisListDelUdt(Map<String,Object> params)
	{		
		return ivrGRDnisListMapper.DnisListDelUdt(params);
	}
}

