package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRHoliday;

public interface ivrGRHolidayService {
		
	public List<ivrGRHoliday> HolidayGet(Map<String,Object> params);
	
	public int HolidayIst(Map<String,Object> params);
	
	public int HolidayUdt(Map<String,Object> params);
	
	public int HolidayDel(Map<String,Object> params);
}
