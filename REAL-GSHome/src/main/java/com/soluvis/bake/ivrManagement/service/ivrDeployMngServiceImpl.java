package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.ivrManagement.domain.ivrDeployFile;
import com.soluvis.bake.ivrManagement.domain.ivrDeployMng;
import com.soluvis.bake.ivrManagement.mapper.ivrDeployMngMapper;

@Service
public class ivrDeployMngServiceImpl implements ivrDeployMngService{
	
	@Autowired
	private ivrDeployMngMapper ivrDeployMngMapper;
	
	@Override
	public List<ivrDeployMng> DeployMngGet(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployMngGet(params);
	}
	
	@Override
	public List<ivrDeployMng> DeployMngGetUuid(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployMngGetUuid(params);
	}
	
	@Override
	public List<Map<String,Object>> DeployMngCodeCheck(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployMngCodeCheck(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngIst(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployMngIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngUdt(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployMngUdt(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngUdtResult(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployMngUdtResult(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngDel(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployMngDel(params);
	}
	
	@Override
	public List<ivrDeployFile> DeployFileGet(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployFileGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployFileIst(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployFileIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployFileUdt(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployFileUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployFileDel(Map<String,Object> params)
	{		
		return ivrDeployMngMapper.DeployFileDel(params);
	}
}

