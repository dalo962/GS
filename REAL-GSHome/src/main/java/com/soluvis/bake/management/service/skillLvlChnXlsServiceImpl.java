package com.soluvis.bake.management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.management.domain.skillLvlChnXls;
import com.soluvis.bake.management.mapper.skillLvlChnXlsMapper;
import com.soluvis.bake.system.domain.BaseService;

@Service
public class skillLvlChnXlsServiceImpl extends BaseService<skillLvlChnXls, Long> implements skillLvlChnXlsService{

	@Inject
	private skillLvlChnXlsMapper skillLvlChnXlsMapper;
	
	//@Autowired
	//private SqlSessionFactory sqlSessionFactory;
	
	@Override
	public List<skillLvlChnXls> selectDispSkill(Map<String,Object> params) {	
		return skillLvlChnXlsMapper.selectDispSkill(params);
	}
	
	@Override
	public List<skillLvlChnXls> selectAgCheck(Map<String,Object> params) {	
		return skillLvlChnXlsMapper.selectAgCheck(params);
	}
	
	@Override
	public List<skillLvlChnXls> selectSgCheck(Map<String,Object> params) {	
		return skillLvlChnXlsMapper.selectSgCheck(params);
	}

	@Override
	public List<skillLvlChnXls> selectSkgStruct(Map<String,Object> params) {	
		return skillLvlChnXlsMapper.selectSkgStruct(params);
	}

	@Override
	public List<skillLvlChnXls> skillAgtDelCheck(Map<String,Object> params) {	
		return skillLvlChnXlsMapper.skillAgtDelCheck(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int udtDaGroup(Map<String,Object> params)
	{		
		return skillLvlChnXlsMapper.udtDaGroup(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int udtDGroup(Map<String,Object> params)
	{		
		return skillLvlChnXlsMapper.udtDGroup(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveAgtSkill(String user_cd, String user_name, List<skillLvlChnXls> agtList){ 
		agtList.forEach(m -> {
			//SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
			
			Map<String, Object> map = new HashMap<String, Object>(); 
			
			m.setUserCd(user_cd);
			m.setUserNm(user_name);

			m.setWorkNm(user_name + "(" + user_cd + ")");
			m.setMenuGb("상담사 스킬 일괄등록");
			
			m.setWorkAgId(m.getAgtLogId());
			m.setWorkAgNm(m.getAgtName());
			m.setWorkAgEmId(m.getEmployeeid());
			
			m.setWorkGp(m.getGrpname());

			if("일괄등록".equals(m.getRegGb()))
			{
				m.setWorkGb("I");
				
				String workInfo = m.getPartName() + " " + m.getTeamName() + " 상담사의 대표스킬그룹을 " + m.getGrpname() + "(으)로 " + m.getRegGb() + " " +  m.getSuss();  
				m.setWorkInfo(workInfo);
				
				// 스킬그룹등록
				map.put("dbid", m.getAgtDbid());
				//if("".equals(m.getApplyGrp()) || m.getApplyGrp() == null)
				//{
				map.put("dgroup", m.getGrpid());
				map.put("agroup", m.getGrpid());
					
				if("성공".equals(m.getSuss())) 
				{
					skillLvlChnXlsMapper.udtDaGroup(map);
				}
				/*}
				else
				{
					map.put("dgroup", m.getGrpid());
					
					skillLvlChnXlsMapper.udtDGroup(map);
				}*/
			}			
			// 화면 구분 값 추가되어야 함.						
			skillLvlChnXlsMapper.insertAgtSkillHist(m);
			skillLvlChnXlsMapper.insertGrpHist(m);
			
			//sqlSession.insert("com.soluvis.bake.management.mapper.skillLvlChnXlsMapper.insertAgtSkillHist", m);
			//sqlSession.insert("com.soluvis.bake.management.mapper.skillLvlChnXlsMapper.insertGrpHist", m);
			//sqlSession.commit();
		});
	}
}