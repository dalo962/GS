package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployFile;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployMng;

public interface ivrGRDeployMngService {
		
	public List<ivrGRDeployMng> DeployMngGet(Map<String,Object> params);
	
	public List<ivrGRDeployMng> DeployMngGetUuid(Map<String,Object> params);
	
	public List<Map<String,Object>> DeployMngCodeCheck(Map<String,Object> params);	
	
	public int DeployMngIst(Map<String,Object> params);
	
	public int DeployMngUdt(Map<String,Object> params);
	public int DeployMngUdtResult(Map<String,Object> params);
	
	public int DeployMngDel(Map<String,Object> params);
	
	public List<ivrGRDeployFile> DeployFileGet(Map<String,Object> params);
	
	public int DeployFileIst(Map<String,Object> params);
	
	public int DeployFileUdt(Map<String,Object> params);
	
	public int DeployFileDel(Map<String,Object> params);
}
