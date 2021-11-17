package com.soluvis.bakeGR.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bakeGR.ivrManagement.domain.ivrGREmerMent;
import com.soluvis.bakeGR.ivrManagement.mapper.ivrGREmerMentMapper;

@Service
public class ivrGREmerMentServiceImpl implements ivrGREmerMentService{
	
	@Autowired
	private ivrGREmerMentMapper ivrGREmerMentMapper;

	@Override
	public List<ivrGREmerMent> EmerMentGet(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGREmerMentMapper.EmerMentGet(params);
	}

	@Override
	public List<ivrGREmerMent> EmerMentExist(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGREmerMentMapper.EmerMentExist(params);
	}

	@Override
	public int EmerMentIst(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGREmerMentMapper.EmerMentIst(params);
	}

	@Override
	public int EmerMentUdt(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGREmerMentMapper.EmerMentUdt(params);
	}

	@Override
	public int EmerMentDel(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGREmerMentMapper.EmerMentDel(params);
	}
	
	@Override
	public List<ivrGREmerMent> EmerMentTTS(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrGREmerMentMapper.EmerMentTTS(params);
	}
}

