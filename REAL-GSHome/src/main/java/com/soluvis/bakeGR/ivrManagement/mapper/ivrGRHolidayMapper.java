package com.soluvis.bakeGR.ivrManagement.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRHoliday;

@Repository
public interface ivrGRHolidayMapper extends MyBatisMapper{	

	// 조회
	List<ivrGRHoliday> HolidayGet(Map<String,Object> params);
	// 추가
	int HolidayIst(Map<String,Object> params);
	// 수정
	int HolidayUdt(Map<String,Object> params);
	// 삭제
	int HolidayDel(Map<String,Object> params);
}
