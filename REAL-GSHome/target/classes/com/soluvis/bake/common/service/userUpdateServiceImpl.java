package com.soluvis.bake.common.service;

import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.common.domain.userUpdate;
import com.soluvis.bake.common.mapper.userUpdateMapper;

@Service
public class userUpdateServiceImpl implements userUpdateService{
	
	@Inject
	private userUpdateMapper userUpdateMapper;
	
	@Override
	public userUpdate userinfo(Map<String,Object> params) {
		return userUpdateMapper.userinfo(params);
	}

	@Override
	public userUpdate userpsck(Map<String,Object> params) {
		return userUpdateMapper.userpsck(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int userup(Map<String, Object> params) {
		return userUpdateMapper.userup(params);
	}
}
