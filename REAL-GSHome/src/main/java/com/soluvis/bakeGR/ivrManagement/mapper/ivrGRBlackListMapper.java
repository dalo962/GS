package com.soluvis.bakeGR.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRBlackList;

@Repository
public interface ivrGRBlackListMapper extends MyBatisMapper{	

	// 조회
	List<ivrGRBlackList> BlackListGet(Map<String,Object> params);
	// 추가
	int BlackListIst(Map<String,Object> params);
	// 수정
	int BlackListUdt(Map<String,Object> params);
	// 삭제
	int BlackListDel(Map<String,Object> params);
}
