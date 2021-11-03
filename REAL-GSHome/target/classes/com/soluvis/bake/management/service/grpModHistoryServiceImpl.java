package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.soluvis.bake.management.domain.grpModHistory;
import com.soluvis.bake.management.mapper.grpModHistoryMapper;
import com.soluvis.bake.system.domain.BaseService;

@Service
public class grpModHistoryServiceImpl extends BaseService<grpModHistory, Long> implements grpModHistoryService{

	@Inject
	private grpModHistoryMapper grpModHistoryMapper;

	@Override
	public List<grpModHistory> selectHisGrpList(Map<String,Object> params) {	
		List<grpModHistory> retunValue = grpModHistoryMapper.selectHisGrpList(params);
		return retunValue;
	}
	
	@Override
	public List<grpModHistory> selectHisList(Map<String,Object> params) {	
		List<grpModHistory> retunValue = grpModHistoryMapper.selectHisList(params);
		return retunValue;
	}
}