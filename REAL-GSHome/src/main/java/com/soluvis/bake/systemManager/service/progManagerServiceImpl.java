package com.soluvis.bake.systemManager.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.systemManager.domain.progManager;
import com.soluvis.bake.systemManager.mapper.progManagerMapper;

@Service
public class progManagerServiceImpl implements progManagerService{
	
	@Autowired
	private progManagerMapper progMngMapper;
	
	@Override
	public List<progManager> progListSel()
	{		
		return progMngMapper.progListSel();
	}
	
	@Override
	public List<progManager> histSel(Map<String,Object> params)
	{		
		return progMngMapper.histSel(params);
	}
	
	@Override
	public List<progManager> histTarget(Map<String,Object> params)
	{		
		return progMngMapper.histTarget(params);
	}
	
	
	@Override
	public List<progManager> penSel(Map<String,Object> params)
	{		
		return progMngMapper.penSel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int penIst(Map<String,Object> params)
	{		
		return progMngMapper.penIst(params);
	}
	
	
	@Override
	public int ivrretry(Map<String,Object> params)
	{		
		return progMngMapper.ivrretry(params);
	}
	
	@Override
	public int winkDataAgg(Map<String,Object> params)
	{		
		return progMngMapper.winkDataAgg(params);
	}
	
	@Override
	public int axastruct(Map<String,Object> params)
	{		
		return progMngMapper.axastruct(params);
	}
}

