package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soluvis.bake.ivrManagement.domain.ivrEmerMent;
import com.soluvis.bake.ivrManagement.mapper.ivrEmerMentMapper;

@Service
public class ivrEmerMentServiceImpl implements ivrEmerMentService{

	@Autowired
	private ivrEmerMentMapper ivrEmerMentMapper;

	@Override
	public List<ivrEmerMent> EmerMentGet(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrEmerMentMapper.EmerMentGet(params);
	}

	@Override
	public List<ivrEmerMent> EmerMentExist(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrEmerMentMapper.EmerMentExist(params);
	}

	@Override
	public int EmerMentIst(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrEmerMentMapper.EmerMentIst(params);
	}

	@Override
	public int EmerMentUdt(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrEmerMentMapper.EmerMentUdt(params);
	}

	@Override
	public int EmerMentDel(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrEmerMentMapper.EmerMentDel(params);
	}

	@Override
	public List<ivrEmerMent> EmerMentTTS(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return ivrEmerMentMapper.EmerMentTTS(params);
	}
}

