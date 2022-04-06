package com.soluvis.bake.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.ivrManagement.domain.ivrArsDiscount;

@Repository
public interface ivrArsDiscountMapper extends MyBatisMapper{	

	// 조회
	List<ivrArsDiscount> ArsDcListGet(Map<String,Object> params);
	// 추가
	int ArsDcListIst(Map<String,Object> params);
	// 수정
	int ArsDcListUdt(Map<String,Object> params);
	// 삭제
	int ArsDcListDel(Map<String,Object> params);
}
