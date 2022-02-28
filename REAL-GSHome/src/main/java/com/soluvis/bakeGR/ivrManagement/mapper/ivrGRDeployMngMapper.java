package com.soluvis.bakeGR.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployFile;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployMng;

@Repository
public interface ivrGRDeployMngMapper extends MyBatisMapper{	

	// 조회
	List<ivrGRDeployMng> DeployMngGet(Map<String,Object> params);
	// 삭제 불가능한 UUID 조회
	List<ivrGRDeployMng> DeployMngGetUuid(Map<String,Object> params);
	// 공통코드 조회
	List<Map<String,Object>> DeployMngCodeCheck(Map<String,Object> params);	
	// 추가
	int DeployMngIst(Map<String,Object> params);
	// 수정
	int DeployMngUdt(Map<String,Object> params);
	int DeployMngUdtResult(Map<String,Object> params);
	// 삭제
	int DeployMngDel(Map<String,Object> params);
	
	// 조회
	List<ivrGRDeployFile> DeployFileGet(Map<String,Object> params);
	// 추가
	int DeployFileIst(Map<String,Object> params);
	// 수정
	int DeployFileUdt(Map<String,Object> params);
	// 삭제
	int DeployFileDel(Map<String,Object> params);
}
