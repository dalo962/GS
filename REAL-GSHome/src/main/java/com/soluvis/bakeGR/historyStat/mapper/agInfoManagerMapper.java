package com.soluvis.bakeGR.historyStat.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.historyStat.domain.agInfoManager;

@Repository
public interface agInfoManagerMapper extends MyBatisMapper{	

	// 직책 리스트
	List<agInfoManager> agInfoDepSel();	
	// 상담사 정보 관리 조회
	List<agInfoManager> agInfoSel(Map<String,Object> params);
	// 상담사 정보 수정
	int agInfoUdt(Map<String,Object> params);
}
