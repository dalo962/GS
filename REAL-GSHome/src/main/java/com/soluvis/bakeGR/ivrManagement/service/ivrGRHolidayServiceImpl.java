package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRHoliday;
import com.soluvis.bakeGR.ivrManagement.mapper.ivrGRHolidayMapper;

@Service
public class ivrGRHolidayServiceImpl implements ivrGRHolidayService{
	
	@Autowired
	private ivrGRHolidayMapper ivrGRHolidayMapper;

	@Override
	public List<ivrGRHoliday> HolidayGet(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRHolidayMapper.HolidayGet(params);
	}

	@Override
	public int HolidayIst(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRHolidayMapper.HolidayIst(params);
	}

	@Override
	public int HolidayUdt(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRHolidayMapper.HolidayUdt(params);
	}

	@Override
	public int HolidayDel(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRHolidayMapper.HolidayDel(params);
	}
}

