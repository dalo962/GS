package com.soluvis.bake.management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.management.domain.skillLvlChnGrp;
import com.soluvis.bake.management.mapper.skillLvlChnGrpMapper;
import com.soluvis.bake.system.domain.BaseService;

@Service
public class skillLvlChnGrpServiceImpl extends BaseService<skillLvlChnGrp, Long> implements skillLvlChnGrpService{

	@Inject
	private skillLvlChnGrpMapper skillLvlChnGrpMapper;
	
	//@Autowired
	//private SqlSessionFactory sqlSessionFactory;

	@Override
	public List<skillLvlChnGrp> selectDispSkill(Map<String,Object> params) {		
		return skillLvlChnGrpMapper.selectDispSkill(params);
	}

	@Override
	public List<skillLvlChnGrp> selectSkillGrp(Map<String,Object> params) {		
		return skillLvlChnGrpMapper.selectSkillGrp(params);
	}

	@Override
	public List<skillLvlChnGrp> selectAgtSkill(Map<String,Object> params) {
		
		return skillLvlChnGrpMapper.selectAgtSkill(params); 
	}
	
	@Override
	public List<skillLvlChnGrp> selectAgtSkillCnt(Map<String,Object> params) {
		
		return skillLvlChnGrpMapper.selectAgtSkillCnt(params); 
	}
	
	@Override
	public List<skillLvlChnGrp> selectSkgStruct(Map<String,Object> params) {		
		return skillLvlChnGrpMapper.selectSkgStruct(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int udtDaGroup(Map<String,Object> params)
	{		
		return skillLvlChnGrpMapper.udtDaGroup(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int udtDGroup(Map<String,Object> params)
	{		
		return skillLvlChnGrpMapper.udtDGroup(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int udtAGroup(Map<String,Object> params)
	{		
		return skillLvlChnGrpMapper.udtAGroup(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int udtPGroup(Map<String,Object> params)
	{		
		return skillLvlChnGrpMapper.udtPGroup(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveAgtSkill(String user_cd, String user_name, List<skillLvlChnGrp> agtList){ 
		agtList.forEach(m -> {
			//SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
			
			Map<String, Object> map = new HashMap<String, Object>(); 

			m.setUserCd(user_cd);
			m.setUserNm(user_name);

			m.setWorkNm(user_name + "(" + user_cd + ")");
			m.setMenuGb("상담사 스킬 관리(그룹)");
			
			m.setWorkAgId(m.getAgtLogId());
			m.setWorkAgNm(m.getAgtName());
			m.setWorkAgEmId(m.getEmployeeid());
			
			m.setWorkGp(m.getGrpname());
			
			if("".equals(m.getWorkRemark()) || m.getWorkRemark() == null)
			{
				m.setWorkRemark("");
			}
			else
			{
				m.setWorkRemark(m.getWorkRemark());
			}
			
			if("대표그룹등록".equals(m.getRegGb()))
			{
				m.setWorkGb("I");
				
				map.put("dbid", m.getAgtDbid());
				
				String workInfo = "";
				//if(("".equals(m.getDefaultGrp()) || m.getDefaultGrp() == null) && ("".equals(m.getApplyGrp()) || m.getApplyGrp() == null))
				//{
					workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 대표그룹/현재그룹을 " + m.getGrpname() + "(으)로 " + m.getRegGb() + " " +  m.getSuss();
					
				map.put("dgroup", m.getGrpid());
				map.put("agroup", m.getGrpid());
				
				if("성공".equals(m.getSuss())) 
				{
					skillLvlChnGrpMapper.udtDaGroup(map);
				}
				/*
				}
				else
				{
					workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 대표그룹을 " + m.getDefaultGrp() + " 에서 " + m.getGrpname() + "(으)로 " + m.getRegGb();
					 
					map.put("dgroup", m.getGrpid());
						
					skillLvlChnGrpMapper.udtDGroup(map);
				}*/
				m.setWorkInfo(workInfo);
			}
			
			else if("스킬변경".equals(m.getRegGb()))
			{
				m.setWorkGb("U");
				
				String workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 현재그룹을 " + m.getApplyGrp() + " 에서 " + m.getGrpname() + "(으)로 " + m.getRegGb() + " " +  m.getSuss();  
				m.setWorkInfo(workInfo);
				
				map.put("dbid", m.getAgtDbid());
				map.put("agroup", m.getGrpid());
					
				if("성공".equals(m.getSuss())) 
				{
					skillLvlChnGrpMapper.udtAGroup(map);
				}
			}
			
			else if("스킬원복".equals(m.getRegGb()))
			{
				m.setWorkGb("U");
				
				String workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 현재그룹을 " + m.getApplyGrp() + " 에서 " + m.getGrpname() + "(으)로 " + m.getRegGb() + " " +  m.getSuss(); 
				m.setWorkInfo(workInfo);
				
				map.put("dbid", m.getAgtDbid());
				map.put("agroup", m.getGrpid());

				if("성공".equals(m.getSuss())) 
				{
					skillLvlChnGrpMapper.udtAGroup(map);
				}
			}
			
			else if("자율부여".equals(m.getRegGb()))
			{
				m.setWorkGb("U");
				
				String workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 현재그룹을 " + m.getApplyGrp() + " 에서 " + m.getGrpname() + "(으)로 " + m.getRegGb() + " " +  m.getSuss();  
				m.setWorkInfo(workInfo);
				
				map.put("dbid", m.getAgtDbid());
				map.put("agroup", m.getGrpid());
				map.put("pskill", "O");
						
				if("성공".equals(m.getSuss())) 
				{
					skillLvlChnGrpMapper.udtPGroup(map);
				}
			}
			
			else if("자율원복".equals(m.getRegGb()))
			{
				m.setWorkGb("U");
				
				String workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 현재그룹을 " + m.getApplyGrp() + " 에서 " + m.getGrpname() + "(으)로 " + m.getRegGb() + " " +  m.getSuss(); 
				m.setWorkInfo(workInfo);
				
				map.put("dbid", m.getAgtDbid());
				map.put("agroup", m.getGrpid());
				map.put("pskill", "X");
				
				if("성공".equals(m.getSuss())) 
				{
					skillLvlChnGrpMapper.udtPGroup(map);
				}
			}
				
			// 화면 구분 값 추가되어야 함.			
			skillLvlChnGrpMapper.insertAgtSkillHist(m);
			skillLvlChnGrpMapper.insertGrpHist(m);
			
			//sqlSession.insert("com.soluvis.bake.management.mapper.skillLvlChnGrpMapper.insertAgtSkillHist", m);
			//sqlSession.insert("com.soluvis.bake.management.mapper.skillLvlChnGrpMapper.insertGrpHist", m);
			//sqlSession.commit();
		});
	}
}