package com.soluvis.bake.common.mapper;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.common.domain.userUpdate;

@Repository
public interface userUpdateMapper extends MyBatisMapper{
		
	userUpdate userinfo(Map<String,Object> params);
	userUpdate userpsck(Map<String,Object> params);
	int userup(Map<String,Object> params);
}
