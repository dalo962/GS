package com.soluvis.bake.common.service;

import java.util.Map;

import com.soluvis.bake.common.domain.userUpdate;

public interface userUpdateService {
		
	public userUpdate userinfo(Map<String,Object> params);
	public userUpdate userpsck(Map<String,Object> params);
	public int userup(Map<String,Object> params);
}
