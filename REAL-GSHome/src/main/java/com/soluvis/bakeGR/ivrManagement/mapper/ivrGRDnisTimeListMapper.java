package com.soluvis.bakeGR.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnisTimeList;

@Repository
public interface ivrGRDnisTimeListMapper extends MyBatisMapper{	

	// 조회
	List<ivrGRDnisTimeList> DnisListGet(Map<String,Object> params);
	// 추가
	int DnisListIst(Map<String,Object> params);
	// 수정
	int DnisListUdt(Map<String,Object> params);
	// 삭제
	int DnisListDel(Map<String,Object> params);
	
	int DnisListDelUdt(Map<String,Object> params);
}
