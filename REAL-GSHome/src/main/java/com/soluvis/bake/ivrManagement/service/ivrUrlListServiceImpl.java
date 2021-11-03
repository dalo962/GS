package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.ivrManagement.domain.ivrUrlList;
import com.soluvis.bake.ivrManagement.mapper.ivrUrlListMapper;

@Service
public class ivrUrlListServiceImpl implements ivrUrlListService{
	
	@Autowired
	private ivrUrlListMapper ivrUrlListMapper;
	
	@Override
	public List<ivrUrlList> UrlListGet(Map<String,Object> params)
	{		
		return ivrUrlListMapper.UrlListGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlListIst(Map<String,Object> params)
	{		
		return ivrUrlListMapper.UrlListIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlListUdt(Map<String,Object> params)
	{		
		return ivrUrlListMapper.UrlListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlListDel(Map<String,Object> params)
	{		
		return ivrUrlListMapper.UrlListDel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlFileUdt(Map<String,Object> params)
	{		
		return ivrUrlListMapper.UrlFileUdt(params);
	}
	
	
	@Override
	public List<ivrUrlList> IvrUrlGet(Map<String,Object> params)
	{		
		return ivrUrlListMapper.IvrUrlGet(params);
	}
}

