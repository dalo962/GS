package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployFile;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployMng;
import com.soluvis.bakeGR.ivrManagement.mapper.ivrGRDeployMngMapper;

@Service
public class ivrGRDeployMngServiceImpl implements ivrGRDeployMngService{
	
	@Autowired
	private ivrGRDeployMngMapper ivrGRDeployMngMapper;
	
	@Override
	public List<ivrGRDeployMng> DeployMngGet(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployMngGet(params);
	}
	
	@Override
	public List<ivrGRDeployMng> DeployMngGetUuid(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployMngGetUuid(params);
	}
	
	@Override
	public List<Map<String,Object>> DeployMngCodeCheck(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployMngCodeCheck(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngIst(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployMngIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngUdt(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployMngUdt(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngUdtResult(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployMngUdtResult(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployMngDel(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployMngDel(params);
	}
	
	@Override
	public List<ivrGRDeployFile> DeployFileGet(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployFileGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployFileIst(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployFileIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployFileUdt(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployFileUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int DeployFileDel(Map<String,Object> params)
	{		
		return ivrGRDeployMngMapper.DeployFileDel(params);
	}
}

