package com.soluvis.bake.management.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chequer.axboot.core.code.AXBootTypes;
import com.soluvis.bake.management.domain.skillGrpMng;
import com.soluvis.bake.management.mapper.skillGrpMngMapper;
import com.soluvis.bake.system.domain.BaseService;

@Service
public class skillGrpMngServiceImpl extends BaseService<skillGrpMng, Long> implements skillGrpMngService{

	@Inject
	private skillGrpMngMapper skillGrpMngMapper;

	@Override
	public List<skillGrpMng> selectSkillList(Map<String,Object> params) {		
		return skillGrpMngMapper.selectSkillList(params);
	}

	@Override
	public List<skillGrpMng> selectSkillGrpList(Map<String,Object> params) {
		
		return skillGrpMngMapper.selectSkillGrpList(params); 
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveSkillGrp(String user_cd, String user_name, List<skillGrpMng> skillGrps){ 
		skillGrps.forEach(m -> {
			m.setUserCd(user_cd);
			m.setUserNm(user_name);
			if("1".equals(m.getOrgLevel()))
			{
				m.setPid(m.getCompId());
				m.setName(m.getSkillGrpName().toUpperCase());
			}
			else if("2".equals(m.getOrgLevel()))
			{
				m.setName(m.getSkillName());
			}
			
			if(m.getDataStatus() == AXBootTypes.DataStatus.CREATED) 
			{
				if("1".equals(m.getOrgLevel()))
				{
					String newId = skillGrpMngMapper.newOrgId();
					String oldId = m.getId();
					m.setId(newId);
					for (skillGrpMng x:skillGrps){
						if(x.getPid().equals(oldId) && "2".equals(x.getOrgLevel())){
							x.setPid(newId);
							x.setUserCd(user_cd);
							x.setUserNm(user_name);
						}
					}
					skillGrpMngMapper.insertSkillGrpOrg(m);
					skillGrpMngMapper.insertSkillGrpOrgToOrg(m);
					
					m.setWorkNm(user_name + "(" + user_cd + ")");
					m.setWorkGb("I");
					m.setMenuGb("스킬 그룹 관리");
					m.setWorkGroup(m.getSkillGrpName().toUpperCase());
					String workInfo = "스킬 그룹 추가";
					m.setWorkInfo(workInfo);
					skillGrpMngMapper.insertGrpHist(m);
				}
				else 
				{
					// 그룹추가시 임의로 부여했던 코드가 tmp로 시작, 해당구문은 js에 있음.
					boolean updateChk = false;
					for (skillGrpMng n:skillGrps){
						if(m.getId() == n.getId() && m.getSkillId() == n.getSkillId() && m.getDataStatus() != n.getDataStatus()){
							updateChk = true;
						}
					}
					if(updateChk)
					{						
						skillGrpMngMapper.updateSkillGrp(m);
						
						m.setWorkNm(user_name + "(" + user_cd + ")");
						m.setWorkGb("I");
						m.setMenuGb("스킬 그룹 관리");
						m.setWorkGroup(m.getSkillGrpName().toUpperCase());
						String workInfo = "스킬 그룹내 " + m.getSkillName() + "(" + m.getSkillLevel() + ") 스킬 추가";
						m.setWorkInfo(workInfo);
						skillGrpMngMapper.insertGrpHist(m);
						
					}
					else
					{
						skillGrpMngMapper.insertSkillGrp(m);
						
						m.setWorkNm(user_name + "(" + user_cd + ")");
						m.setWorkGb("I");
						m.setMenuGb("스킬 그룹 관리");
						m.setWorkGroup(m.getSkillGrpName().toUpperCase());
						String workInfo = "스킬 그룹내 " + m.getSkillName() + "(" + m.getSkillLevel() + ") 스킬 추가";
						m.setWorkInfo(workInfo);
						skillGrpMngMapper.insertGrpHist(m);
					}					
				}
			} 
			else if(m.getDataStatus() == AXBootTypes.DataStatus.MODIFIED)
			{
				if("1".equals(m.getOrgLevel()))
				{
					skillGrpMngMapper.updateSkillGrpOrg(m);
					
					m.setWorkNm(user_name + "(" + user_cd + ")");
					m.setWorkGb("U");
					m.setMenuGb("스킬 그룹 관리");
					m.setWorkGroup(m.getSkillGrpName().toUpperCase());
					String workInfo = "스킬 그룹 정보 변경";
					m.setWorkInfo(workInfo);
					skillGrpMngMapper.insertGrpHist(m);
				}
				else
				{
					skillGrpMngMapper.updateSkillGrp(m);
					
					m.setWorkNm(user_name + "(" + user_cd + ")");
					m.setWorkGb("U");
					m.setMenuGb("스킬 그룹 관리");
					m.setWorkGroup(m.getSkillGrpName().toUpperCase());
					String workInfo = "스킬 그룹내 " + m.getSkillName() + " 스킬의 레벨을 " + m.getSkillLevel() +" (으)로 변경";
					m.setWorkInfo(workInfo);
					skillGrpMngMapper.insertGrpHist(m);
				}
			} 
			else if(m.getDataStatus() == AXBootTypes.DataStatus.DELETED)
			{
				if("1".equals(m.getOrgLevel()))
				{
					skillGrpMngMapper.deleteSkillGrpOrg(m);
					skillGrpMngMapper.deleteSkillGrpOrgToOrg(m); 
					
					m.setWorkNm(user_name + "(" + user_cd + ")");
					m.setWorkGb("D");
					m.setMenuGb("스킬 그룹 관리");
					m.setWorkGroup(m.getSkgNm());
					String workInfo = "스킬 그룹 삭제";
					m.setWorkInfo(workInfo);
					skillGrpMngMapper.insertGrpHist(m);
				}
				else
				{
					boolean updateChk = false;
					for (skillGrpMng n:skillGrps){
						if(m.getId() == n.getId() && m.getSkillId() == n.getSkillId() && m.getDataStatus() != n.getDataStatus()){
							updateChk = true;
						}
					}
					if(updateChk)
					{
						m.setWorkNm(user_name + "(" + user_cd + ")");
						m.setWorkGb("D");
						m.setMenuGb("스킬 그룹 관리");
						m.setWorkGroup(m.getSkillGrpName().toUpperCase());
						String workInfo = "스킬 그룹내 " + m.getSkillName() + "(" + m.getSkillLevel() + ") 스킬 삭제";
						m.setWorkInfo(workInfo);
						skillGrpMngMapper.insertGrpHist(m);
					}
					else
					{
						skillGrpMngMapper.deleteSkillGrp(m);
						m.setWorkNm(user_name + "(" + user_cd + ")");
						m.setWorkGb("D");
						m.setMenuGb("스킬 그룹 관리");
						m.setWorkGroup(m.getSkillGrpName().toUpperCase());
						String workInfo = "스킬 그룹내 " + m.getSkillName() + "(" + m.getSkillLevel() + ") 스킬 삭제";
						m.setWorkInfo(workInfo);
						skillGrpMngMapper.insertGrpHist(m);
					}
				}
			}
		});
	}
	
	
	@Override
	public List<skillGrpMng> selectSkGrpSk(Map<String,Object> params) {
		
		return skillGrpMngMapper.selectSkGrpSk(params); 
	}
	
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveSkillGrpAll(String user_cd, String user_name, List<skillGrpMng> skillGrps){ 
		skillGrps.forEach(m -> {
			m.setUserCd(user_cd);
			m.setUserNm(user_name);
			
			m.setPid(m.getSgid());
			m.setId(m.getSkid());
			
			if(m.getDataStatus() == AXBootTypes.DataStatus.ORIGIN)
			{
				skillGrpMngMapper.updateSkillGrp(m);
				
				m.setMenuGb("스킬 그룹 관리");
				m.setWorkGb("U");
				
				String workInfo = "스킬 그룹내 " + m.getSknm() + " 스킬의 레벨을 " + m.getSkillLevel() +" (으)로 일괄 변경";
				m.setWorkInfo(workInfo);

				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGroup(m.getSgnm());
				
				skillGrpMngMapper.insertGrpHist(m);
			}
		});
	}
}