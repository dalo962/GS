package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.ivrManagement.mapper.ivrUrlListMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;
import com.soluvis.bakeGR.ivrManagement.mapper.ivrGRUrlListMapper;

@Service
public class ivrGRUrlListServiceImpl implements ivrGRUrlListService{
	
	@Autowired
	private ivrGRUrlListMapper ivrGRUrlListMapper;
	
	@Override
	public List<ivrGRUrlList> UrlListGet(Map<String,Object> params)
	{		
		return ivrGRUrlListMapper.UrlListGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlListIst(Map<String,Object> params)
	{		
		return ivrGRUrlListMapper.UrlListIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlListUdt(Map<String,Object> params)
	{		
		return ivrGRUrlListMapper.UrlListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlListDel(Map<String,Object> params)
	{		
		return ivrGRUrlListMapper.UrlListDel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int UrlFileUdt(Map<String,Object> params)
	{		
		return ivrGRUrlListMapper.UrlFileUdt(params);
	}
	
	
	@Override
	public List<ivrGRUrlList> IvrUrlGet(Map<String,Object> params)
	{		
		return ivrGRUrlListMapper.IvrUrlGet(params);
	}
}

