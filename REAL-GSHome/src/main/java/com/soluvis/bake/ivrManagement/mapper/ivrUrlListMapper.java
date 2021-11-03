package com.soluvis.bake.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.ivrManagement.domain.ivrUrlList;

@Repository
public interface ivrUrlListMapper extends MyBatisMapper{	

	// 조회
	List<ivrUrlList> UrlListGet(Map<String,Object> params);
	// 추가
	int UrlListIst(Map<String,Object> params);
	// 수정
	int UrlListUdt(Map<String,Object> params);
	// 삭제
	int UrlListDel(Map<String,Object> params);
	// 파일 업로드 여부
	int UrlFileUdt(Map<String,Object> params);
	
	// 동기화 코드값 조회
	List<ivrUrlList> IvrUrlGet(Map<String,Object> params);
}
