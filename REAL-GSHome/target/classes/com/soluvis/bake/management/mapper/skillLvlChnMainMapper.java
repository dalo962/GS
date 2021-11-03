package com.soluvis.bake.management.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.management.domain.skillLvlChnMain;

@Repository
public interface skillLvlChnMainMapper extends MyBatisMapper{
	
	List<skillLvlChnMain> selectDispSkill(Map<String,Object> params);	
	
	List<skillLvlChnMain> selectSkill(Map<String,Object> params);
	
	List<skillLvlChnMain> selectAgtSkill(Map<String,Object> params);
	
	void insertAgtSkillHist(skillLvlChnMain params);
	
	void insertGrpHist(skillLvlChnMain params);
	
	List<skillLvlChnMain> selectAgtTab(Map<String,Object> params);
}
