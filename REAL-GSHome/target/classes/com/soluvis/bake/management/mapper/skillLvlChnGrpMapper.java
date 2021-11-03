package com.soluvis.bake.management.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.management.domain.skillLvlChnGrp;

@Repository
public interface skillLvlChnGrpMapper extends MyBatisMapper{
	
	List<skillLvlChnGrp> selectDispSkill(Map<String,Object> params);	
	
	List<skillLvlChnGrp> selectSkillGrp(Map<String,Object> params);
	
	List<skillLvlChnGrp> selectAgtSkill(Map<String,Object> params);
	
	List<skillLvlChnGrp> selectAgtSkillCnt(Map<String,Object> params);
	
	void insertAgtSkillHist(skillLvlChnGrp params);
	
	void insertGrpHist(skillLvlChnGrp params);
	
	List<skillLvlChnGrp> selectSkgStruct(Map<String,Object> params);
	
	int udtDaGroup(Map<String,Object> params);
	
	int udtDGroup(Map<String,Object> params);
	
	int udtAGroup(Map<String,Object> params);
	
	int udtPGroup(Map<String,Object> params);
}
