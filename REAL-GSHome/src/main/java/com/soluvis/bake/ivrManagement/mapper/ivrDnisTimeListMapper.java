package com.soluvis.bake.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.ivrManagement.domain.ivrDnisTimeList;

@Repository
public interface ivrDnisTimeListMapper extends MyBatisMapper{	

	// 조회
	List<ivrDnisTimeList> DnisListGet(Map<String,Object> params);
	// 추가
	int DnisListIst(Map<String,Object> params);
	// 수정
	int DnisListUdt(Map<String,Object> params);
	// 삭제
	int DnisListDel(Map<String,Object> params);
	
	int DnisListDelUdt(Map<String,Object> params);
}
