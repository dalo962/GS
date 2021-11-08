package com.soluvis.bakeRt.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.ivrManagement.domain.ivrBlackList;

@Repository
public interface ivrBlackListMapper extends MyBatisMapper{	

	// 조회
	List<ivrBlackList> BlackListGet(Map<String,Object> params);
	// 추가
	int BlackListIst(Map<String,Object> params);
	// 수정
	int BlackListUdt(Map<String,Object> params);
	// 삭제
	int BlackListDel(Map<String,Object> params);
}
