package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnis;
import com.soluvis.bakeGR.ivrManagement.mapper.ivrGRDnisMapper;

@Service
public class ivrGRDnisServiceImpl implements ivrGRDnisService{
	
	@Autowired
	private ivrGRDnisMapper ivrGRDnisMapper;

	@Override
	public List<ivrGRDnis> DnisGet(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRDnisMapper.DnisGet(params);
	}

	@Override
	public int DnisIst(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRDnisMapper.DnisIst(params);
	}

	@Override
	public int DnisUdt(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRDnisMapper.DnisUdt(params);
	}

	@Override
	public int DnisDel(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGRDnisMapper.DnisDel(params);
	}
}

