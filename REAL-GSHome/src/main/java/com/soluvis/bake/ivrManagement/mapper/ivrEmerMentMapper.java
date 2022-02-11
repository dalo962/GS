package com.soluvis.bake.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.ivrManagement.domain.ivrEmerMent;

@Repository
public interface ivrEmerMentMapper extends MyBatisMapper{

	// 조회
	List<ivrEmerMent> EmerMentGet(Map<String,Object> params);
	// 확인
	List<ivrEmerMent> EmerMentExist(Map<String,Object> params);
	// 추가
	int EmerMentIst(Map<String,Object> params);
	// 수정
	int EmerMentUdt(Map<String,Object> params);
	// 삭제
	int EmerMentDel(Map<String,Object> params);
	// TTS 정보 조회
	List<ivrEmerMent> EmerMentTTS(Map<String,Object> params);
}
