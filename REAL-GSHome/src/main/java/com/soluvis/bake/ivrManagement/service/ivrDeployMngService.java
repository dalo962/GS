package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrDeployFile;
import com.soluvis.bake.ivrManagement.domain.ivrDeployMng;

public interface ivrDeployMngService {
		
	public List<ivrDeployMng> DeployMngGet(Map<String,Object> params);
	
	public List<ivrDeployMng> DeployMngGetUuid(Map<String,Object> params);
	
	public List<Map<String,Object>> DeployMngCodeCheck(Map<String,Object> params);	
	
	public int DeployMngIst(Map<String,Object> params);
	
	public int DeployMngUdt(Map<String,Object> params);
	public int DeployMngUdtResult(Map<String,Object> params);
	
	public int DeployMngDel(Map<String,Object> params);
	
	public List<ivrDeployFile> DeployFileGet(Map<String,Object> params);
	
	public int DeployFileIst(Map<String,Object> params);
	
	public int DeployFileUdt(Map<String,Object> params);
	
	public int DeployFileDel(Map<String,Object> params);
}
