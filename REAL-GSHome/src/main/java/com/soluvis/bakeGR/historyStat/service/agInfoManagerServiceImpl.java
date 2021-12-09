package com.soluvis.bakeGR.historyStat.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bakeGR.historyStat.domain.agInfoManager;
import com.soluvis.bakeGR.historyStat.mapper.agInfoManagerMapper;

@Service
public class agInfoManagerServiceImpl implements agInfoManagerService{
	
	@Autowired
	private agInfoManagerMapper agInfoManagerMapper;
	
	@Override
	public List<agInfoManager> agInfoDepSel()
	{		
		return agInfoManagerMapper.agInfoDepSel();
	}
	
	@Override
	public List<agInfoManager> skInfoDepSel()
	{		
		return agInfoManagerMapper.skInfoDepSel();
	}
	
	@Override
	public List<agInfoManager> agInfoSel(Map<String,Object> params)
	{		
		return agInfoManagerMapper.agInfoSel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int agInfoUdt(Map<String,Object> params)
	{		
		return agInfoManagerMapper.agInfoUdt(params);
	}
}

