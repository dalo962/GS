package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.management.domain.skillLvlChnMain;
import com.soluvis.bake.management.mapper.skillLvlChnMainMapper;
import com.soluvis.bake.system.domain.BaseService;

@Service
public class skillLvlChnMainServiceImpl extends BaseService<skillLvlChnMain, Long> implements skillLvlChnMainService{

	@Inject
	private skillLvlChnMainMapper skillLvlChnMainMapper;
	
	//@Autowired
	//private SqlSessionFactory sqlSessionFactory;
	
	@Override
	public List<skillLvlChnMain> selectDispSkill(Map<String,Object> params) {	
		return skillLvlChnMainMapper.selectDispSkill(params);
	}

	@Override
	public List<skillLvlChnMain> selectSkill(Map<String,Object> params) {	
		return skillLvlChnMainMapper.selectSkill(params);
	}

	@Override
	public List<skillLvlChnMain> selectAgtSkill(Map<String,Object> params) {
		
		return skillLvlChnMainMapper.selectAgtSkill(params); 
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveAgtSkill(String user_cd, String user_name, List<skillLvlChnMain> agtList){ 
		agtList.forEach(m -> {
			//SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
			
			m.setUserCd(user_cd);
			m.setUserNm(user_name);

			m.setWorkNm(user_name + "(" + user_cd + ")");
			m.setMenuGb("상담사 스킬 관리(기본)");
			
			m.setWorkAgId(m.getAgtLogId());
			m.setWorkAgNm(m.getAgtName());
			m.setWorkAgEmId(m.getEmployeeid());
			
			String workInfo = "";
			if("삭제".equals(m.getRegGb()))
			{
				m.setWorkGb("D");
				//workInfo = m.getPartName() + " 부서 " + m.getTeamName() + " 팀 상담사 스킬 " + m.getLevelName() + "("+ m.getSkillLevel() + ")(을)를 " + m.getRegGb();
				workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 스킬 " + m.getSkillName() + "(" + m.getLevelName() + ") (을)를 " + m.getRegGb() + " " +  m.getSuss();
			}
			else if("변경".equals(m.getRegGb()))
			{
				m.setWorkGb("I");
				//workInfo = m.getPartName() + " 부서 " + m.getTeamName() + " 팀 상담사 스킬  " + m.getLevelName() + "("+ m.getSkillLevel() + ")(으)로 " + m.getRegGb();
				workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 스킬 " + m.getSkillName() + "(" + m.getOldskLvl() + ") (을)를 (" + m.getLevelName() + ") (으)로 " + m.getRegGb() + " " +  m.getSuss();
			}
			else
			{
				m.setWorkGb("I");
				workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 스킬 " + m.getSkillName() + "(" + m.getLevelName() + ") (으)로 " + m.getRegGb() + " " +  m.getSuss();
			}
			m.setWorkInfo(workInfo);
			
			// 화면 구분 값 추가되어야 함.			
			skillLvlChnMainMapper.insertAgtSkillHist(m);
			skillLvlChnMainMapper.insertGrpHist(m);
			
			//sqlSession.insert("com.soluvis.bake.management.mapper.skillLvlChnMainMapper.insertAgtSkillHist", m);
			//sqlSession.insert("com.soluvis.bake.management.mapper.skillLvlChnMainMapper.insertGrpHist", m);
			//sqlSession.commit();
		});
	}
	
	@Override
	public List<skillLvlChnMain> selectAgtTab(Map<String,Object> params) {
		
		return skillLvlChnMainMapper.selectAgtTab(params); 
	}
}