package com.soluvis.bakeGR.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;

@Repository
public interface ivrGRUrlListMapper extends MyBatisMapper{	

	// 조회
	List<ivrGRUrlList> UrlListGet(Map<String,Object> params);
	// 추가
	int UrlListIst(Map<String,Object> params);
	// 수정
	int UrlListUdt(Map<String,Object> params);
	// 삭제
	int UrlListDel(Map<String,Object> params);
	// 파일 업로드 여부
	int UrlFileUdt(Map<String,Object> params);
	
	// 동기화 코드값 조회
	List<ivrGRUrlList> IvrUrlGet(Map<String,Object> params);
}
