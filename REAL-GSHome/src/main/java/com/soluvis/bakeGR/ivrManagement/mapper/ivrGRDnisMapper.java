package com.soluvis.bakeGR.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnis;

@Repository
public interface ivrGRDnisMapper extends MyBatisMapper{	

	// 조회
	List<ivrGRDnis> DnisGet(Map<String,Object> params);
	// 추가
	int DnisIst(Map<String,Object> params);
	// 수정
	int DnisUdt(Map<String,Object> params);
	// 삭제
	int DnisDel(Map<String,Object> params);
}
