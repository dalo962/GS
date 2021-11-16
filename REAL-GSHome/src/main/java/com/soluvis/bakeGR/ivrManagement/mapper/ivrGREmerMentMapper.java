package com.soluvis.bakeGR.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGREmerMent;

@Repository
public interface ivrGREmerMentMapper extends MyBatisMapper{	

	// 조회
	List<ivrGREmerMent> EmerMentGet(Map<String,Object> params);
	// 확인
	List<ivrGREmerMent> EmerMentExist(Map<String,Object> params);
	// 추가
	int EmerMentIst(Map<String,Object> params);
	// 수정
	int EmerMentUdt(Map<String,Object> params);
	// 삭제
	int EmerMentDel(Map<String,Object> params);
}
