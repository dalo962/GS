package com.soluvis.bake.systemManager.mapper;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.systemManager.domain.ctiMapCompModal;

@Repository
public interface ctiMapCompModalMapper extends MyBatisMapper{	
	void insertCompOrg(ctiMapCompModal params);
	
	void updateCompOrg(ctiMapCompModal param);

	void deleteCompOrg(ctiMapCompModal param);
	
	void deleteSkillOrg(ctiMapCompModal param);
	
	void deleteCompOrgToOrg(ctiMapCompModal param);
	
	void deleteSkillOrgToOrg(ctiMapCompModal param);
	
	String newOrgId();
	
	void insertHist(ctiMapCompModal params);

}
