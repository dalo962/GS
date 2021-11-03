package com.soluvis.bake.management.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.management.domain.skillLvlChnXls;

@Repository
public interface skillLvlChnXlsMapper extends MyBatisMapper{
	
	List<skillLvlChnXls> selectDispSkill(Map<String,Object> params);	
	
	List<skillLvlChnXls> selectAgCheck(Map<String,Object> params);	
	
	List<skillLvlChnXls> selectSgCheck(Map<String,Object> params);
	
	List<skillLvlChnXls> selectSkgStruct(Map<String,Object> params);
	
	List<skillLvlChnXls> skillAgtDelCheck(Map<String,Object> params);
	
	int udtDaGroup(Map<String,Object> params);
	
	int udtDGroup(Map<String,Object> params);
	
	void insertAgtSkillHist(skillLvlChnXls params);
	
	void insertGrpHist(skillLvlChnXls params);
}
