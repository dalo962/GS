package com.soluvis.bake.systemManager.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chequer.axboot.core.code.AXBootTypes;
import com.soluvis.bake.system.domain.BaseService;
import com.soluvis.bake.systemManager.domain.ctiMapSkillOrg;
import com.soluvis.bake.systemManager.domain.ctiMapSkillOrgVO;
import com.soluvis.bake.systemManager.mapper.ctiMapSkillOrgMapper;

@Service
public class ctiMapSkillOrgServiceImpl extends BaseService<ctiMapSkillOrg, Long> implements ctiMapSkillOrgService{

	@Inject
	private ctiMapSkillOrgMapper ctiMapSkillOrgMapper;
	
	@Override
	public List<ctiMapSkillOrg> selectSkillOrg(Map<String, Object> params) {

    	List<ctiMapSkillOrg> hierarchyList = new ArrayList<>();
        List<ctiMapSkillOrg> filterList = new ArrayList<>();
        List<ctiMapSkillOrg> returnList = ctiMapSkillOrgMapper.selectSkillOrg(params);

        for (ctiMapSkillOrg skillOrg : returnList) {
        	skillOrg.setOpen(true);

            ctiMapSkillOrg parent = getParent(returnList, skillOrg);

            if (parent == null) {
                hierarchyList.add(skillOrg);
            } else {
                parent.addChildren(skillOrg);
            }
        }
        filterList.addAll(hierarchyList);
		
		return filterList;
	}

	@Override
	public List<ctiMapSkillOrg> selectSkill(Map<String, Object> params) {
		return ctiMapSkillOrgMapper.selectSkill(params);
	}

	@Override
	public List<ctiMapSkillOrg> selectSkillDetail(Map<String, Object> params) {
		return ctiMapSkillOrgMapper.selectSkillDetail(params);
	}
	
	@Override
	//@Transactional(rollbackFor=Exception.class)
	public void processSkillOrg(String user_cd, String user_name, ctiMapSkillOrgVO skillOrgVO) {
		saveSkillOrg(user_cd, user_name, skillOrgVO.getList());
		deleteSkillOrg(user_cd, user_name, skillOrgVO.getDeletedList());
	} 
	
	@Transactional(rollbackFor=Exception.class)
	public void saveSkillOrg(String user_cd, String user_name, List<ctiMapSkillOrg> skillOrgs) {
		/*
		for (ctiMapSkillOrg _skillOrg : skillOrgs) {
			//System.out.println(_skillOrg.getName());
			//System.out.println("_skillOrg.getDataStatus() : " + _skillOrg.getDataStatus());
			System.out.println("데이터 검증 : " + _skillOrg.getId() + " / " + _skillOrg.getDataStatus());
			if (_skillOrg.getDataStatus() == AXBootTypes.DataStatus.CREATED){
				String newOrgId = ctiMapSkillOrgMapper.newOrgId();
				System.out.println("데이터 검증 : " + _skillOrg.getId() + " / " + newOrgId);
				_skillOrg.setId(newOrgId);
			}
		}*/

		for (int i = 0; i < skillOrgs.size(); i++) {
			if (skillOrgs.get(i).getDataStatus() == AXBootTypes.DataStatus.CREATED){
				String newOrgId = ctiMapSkillOrgMapper.newOrgId();
				skillOrgs.get(i).setId(newOrgId);
				skillOrgs.set(i, skillOrgs.get(i));
			}
		}
		
		skillOrgs.stream().filter(skillOrg -> isNotEmpty(skillOrg.getChildren())).forEach(skillOrg -> {
		skillOrg.getChildren().forEach(m -> m.setParentId(skillOrg.getId()));
		saveSkillOrg(user_cd, user_name, skillOrg.getChildren());
		});
		
		skillOrgs.forEach(m -> { 
			m.setUserCd(user_cd);
			m.setUserNm(user_name);
			
			if("0".equals(m.getOrgLevel())){
				m.setOrgType("0");
			}else{
				m.setOrgType("11");
			}
			
			if("N".equals(m.getSkill_time()) || null == m.getSkill_time())
			{
				m.setSkill_time("");
			}
			
			// 데이터 적재하기
			if(m.getDataStatus() == AXBootTypes.DataStatus.CREATED) {
				// insert
				ctiMapSkillOrgMapper.insertSkillOrg(m);
				if(m.getParentId() != null  && !("null".equals(m.getParentId().toLowerCase()))){
					ctiMapSkillOrgMapper.insertSkillOrgToOrg(m);
				}
				
				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("C");
				m.setMenuGb("스킬그룹 CTI 매핑");
				String workInfo = m.getName() + " 신규 추가";
				m.setWorkInfo(workInfo);
				ctiMapSkillOrgMapper.insertGrpHist(m);
			} else if(m.getDataStatus() == AXBootTypes.DataStatus.MODIFIED) {
				ctiMapSkillOrgMapper.updateSkillOrg(m);
				
				if(!m.getParentId().equals(m.getPreParentId())){
					if(m.getPreParentId() == null || "null".equals(m.getPreParentId().toLowerCase())){
						if(m.getParentId() != null && !("null".equals(m.getParentId().toLowerCase()))){
							//insert
							ctiMapSkillOrgMapper.insertSkillOrgToOrg(m);
						}
					}else{
						if(m.getParentId() == null  || "null".equals(m.getParentId().toLowerCase())){
							//delete
							ctiMapSkillOrgMapper.deleteSkillOrgToOrg(m);
						}else{
							//update
							ctiMapSkillOrgMapper.updateSkillOrgToOrg(m);
						}
					}
				}
				
				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("U");
				m.setMenuGb("스킬그룹 CTI 매핑");
				String workInfo = m.getName() + " 정보 변경";
				m.setWorkInfo(workInfo);
				ctiMapSkillOrgMapper.insertGrpHist(m);
			} 
			else {
				if((!m.getOrgLevel().equals(m.getPreOrgLevel()))  ||  (!m.getSort().equals(m.getPreSort()))){
					ctiMapSkillOrgMapper.updateSkillOrg(m);
					
					m.setWorkNm(user_name + "(" + user_cd + ")");
					m.setWorkGb("U");
					m.setMenuGb("스킬그룹 CTI 매핑");
					String workInfo = m.getName() + " 상위부서 및 정렬 순서 변경";
					m.setWorkInfo(workInfo);
					ctiMapSkillOrgMapper.insertGrpHist(m);
				}
			}
		});
	}

	@Transactional(rollbackFor=Exception.class)
	public void deleteSkillOrg(String user_cd, String user_name, List<ctiMapSkillOrg> skillOrgs) {
		skillOrgs.forEach(m -> { 
			// delete
			m.setUserCd(user_cd);
			m.setUserNm(user_name);
			
			if("0".equals(m.getOrgLevel())){
				m.setOrgType("0");
			}else{
				m.setOrgType("11");
			}
			ctiMapSkillOrgMapper.deleteSkillOrg(m);
			ctiMapSkillOrgMapper.deleteSkillOrgToOrg(m);
			
			if("2".equals(m.getOrgLevel())){
				ctiMapSkillOrgMapper.deleteSkillGrp(m);
			}
			
			m.setWorkNm(user_name + "(" + user_cd + ")");
			m.setWorkGb("D");
			m.setMenuGb("스킬그룹 CTI 매핑");
			String workInfo = m.getName() + " 삭제";
			m.setWorkInfo(workInfo);
			ctiMapSkillOrgMapper.insertGrpHist(m);
		});
		skillOrgs.stream().filter(skillOrg -> isNotEmpty(skillOrg.getChildren())).forEach(skillOrg -> {
			deleteSkillOrg(user_cd, user_name, skillOrg.getChildren());            
		});
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void processSkillDetail(String user_cd, String user_name, ctiMapSkillOrgVO skillOrgVO) {
		saveSkillDetail(user_cd, user_name, skillOrgVO.getList());
		deleteSkillDetail(user_cd, user_name, skillOrgVO.getDeletedList());
	} 

	@Transactional(rollbackFor=Exception.class)
	public void saveSkillDetail(String user_cd, String user_name, List<ctiMapSkillOrg> skillOrgs) {
		skillOrgs.forEach(m -> { 
			if(m.getDataStatus() == AXBootTypes.DataStatus.MODIFIED){
				m.setUserCd(user_cd);
				m.setUserNm(user_name);
				
				if("N".equals(m.getSkill_time()) || null == m.getSkill_time())
				{
					m.setSkill_time("");
				}
				
				ctiMapSkillOrgMapper.updateSkillDetail(m);

				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("U");
				m.setMenuGb("스킬그룹 CTI 매핑");
				String workInfo = m.getName() + " CTI 매핑 정보 변경(스킬Dbid:" + m.getSkillDbid() + ", 스킬명:" + m.getSkillName() + "그룹Dbid:" + m.getAgroupDbid() + ", 그룹명:" + m.getAgroupName() + ")";
				m.setWorkInfo(workInfo);
				ctiMapSkillOrgMapper.insertGrpHist(m);
			}
			
		});
	}

	@Transactional(rollbackFor=Exception.class)
	public void deleteSkillDetail(String user_cd, String user_name, List<ctiMapSkillOrg> skillOrgs) {
		skillOrgs.forEach(m -> { 
			if(m.getDataStatus() == AXBootTypes.DataStatus.DELETED){
				m.setUserCd(user_cd);
				m.setUserNm(user_name);
				m.setPreParentId(m.getParentId());
				
				ctiMapSkillOrgMapper.deleteSkillOrg(m);
				ctiMapSkillOrgMapper.deleteSkillOrgToOrg(m);
				
				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("D");
				m.setMenuGb("스킬그룹 CTI 매핑");
				String workInfo = m.getName() + " 삭제(스킬Dbid:" + m.getSkillDbid() + ", 스킬명:" + m.getSkillName() + "그룹Dbid:" + m.getAgroupDbid() + ", 그룹명:" + m.getAgroupName() + ")";
				m.setWorkInfo(workInfo);
				ctiMapSkillOrgMapper.insertGrpHist(m);
			}
			
		});
	}
    
    public ctiMapSkillOrg getParent(List<ctiMapSkillOrg> skillOrgs, ctiMapSkillOrg skillOrg) {
    	ctiMapSkillOrg parent = skillOrgs.stream().filter(m -> m.getId().equals(skillOrg.getParentId())).findAny().orElse(null);
        if (parent == null) {
            for (ctiMapSkillOrg _skillOrg : skillOrgs) {
                parent = getParent(_skillOrg.getChildren(), skillOrg);
                if (parent != null)
                    break;
            }
        }
        return parent;
    }

    public boolean hasTerminalList(ctiMapSkillOrg skillOrg) {
        boolean hasTerminalSkillOrg = false;

        if (isNotEmpty(skillOrg.getChildren())) {
            for (ctiMapSkillOrg _skillOrgs : skillOrg.getChildren()) {
            	hasTerminalSkillOrg = hasTerminalList(_skillOrgs);

                if (hasTerminalSkillOrg) {
                    return true;
                }
            }
        }

        if (isNotEmpty(skillOrg.getParentId())) {
        	hasTerminalSkillOrg = true;
        }
        return hasTerminalSkillOrg;
    }
}