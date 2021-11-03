package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.management.domain.grpModHistory;

public interface grpModHistoryService {

	public List<grpModHistory> selectHisGrpList(Map<String,Object> params);
	
	public List<grpModHistory> selectHisList(Map<String,Object> params);
}
