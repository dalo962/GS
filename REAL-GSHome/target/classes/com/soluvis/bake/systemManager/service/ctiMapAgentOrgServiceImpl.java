package com.soluvis.bake.systemManager.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chequer.axboot.core.code.AXBootTypes;
import com.soluvis.bake.system.domain.BaseService;
import com.soluvis.bake.systemManager.domain.ctiMapAgentOrg;
import com.soluvis.bake.systemManager.domain.ctiMapAgentOrgVO;
import com.soluvis.bake.systemManager.mapper.ctiMapAgentOrgMapper;

@Service
public class ctiMapAgentOrgServiceImpl extends BaseService<ctiMapAgentOrg, Long> implements ctiMapAgentOrgService{

	@Inject
	private ctiMapAgentOrgMapper ctiMapAgentOrgMapper;
	
	@Override
	public List<ctiMapAgentOrg> selectAgentOrg(Map<String, Object> params) {

    	List<ctiMapAgentOrg> hierarchyList = new ArrayList<>();
        List<ctiMapAgentOrg> filterList = new ArrayList<>();
        List<ctiMapAgentOrg> returnList = ctiMapAgentOrgMapper.selectAgentOrg(params);

        for (ctiMapAgentOrg agentOrg : returnList) {
        	agentOrg.setOpen(true);

            ctiMapAgentOrg parent = getParent(returnList, agentOrg);

            if (parent == null) {
                hierarchyList.add(agentOrg);
            } else {
                parent.addChildren(agentOrg);
            }
        }
        filterList.addAll(hierarchyList);
		
		return filterList;
	}

	@Override
	public List<ctiMapAgentOrg> selectAgent(Map<String, Object> params) {
		return ctiMapAgentOrgMapper.selectAgent(params);
	}

	@Override
	public List<ctiMapAgentOrg> selectAgentDetail(Map<String, Object> params) {
		
		return ctiMapAgentOrgMapper.selectAgentDetail(params);
	}
	
	@Override
	//@Transactional(rollbackFor=Exception.class)
	public void processAgentOrg(String user_cd, String user_name, ctiMapAgentOrgVO agentOrgVO) {
		saveAgentOrg(user_cd, user_name, agentOrgVO.getList());
		deleteAgentOrg(user_cd, user_name, agentOrgVO.getDeletedList());
	}
	
	@Transactional(rollbackFor=Exception.class)
	public void saveAgentOrg(String user_cd, String user_name, List<ctiMapAgentOrg> agentOrgs) {
		for (int i = 0; i < agentOrgs.size(); i++) {
			if (agentOrgs.get(i).getDataStatus() == AXBootTypes.DataStatus.CREATED){
				String newOrgId = ctiMapAgentOrgMapper.newOrgId();
				agentOrgs.get(i).setId(newOrgId);
				agentOrgs.set(i, agentOrgs.get(i));
			}
		}
		
		agentOrgs.stream().filter(agentOrg -> isNotEmpty(agentOrg.getChildren())).forEach(agentOrg -> {
		agentOrg.getChildren().forEach(m -> m.setParentId(agentOrg.getId()));
		saveAgentOrg(user_cd, user_name, agentOrg.getChildren());
		});
		
		agentOrgs.forEach(m -> { 
			m.setUserCd(user_cd);
			m.setUserNm(user_name);
			
			if("0".equals(m.getOrgLevel())){
				m.setOrgType("0");
			}else{
				m.setOrgType("12");
			}
			// 데이터 적재하기
			if(m.getDataStatus() == AXBootTypes.DataStatus.CREATED) {
				// insert
				ctiMapAgentOrgMapper.insertAgentOrg(m);
				if(m.getParentId() != null  && !("null".equals(m.getParentId().toLowerCase()))){
					ctiMapAgentOrgMapper.insertAgentOrgToOrg(m);
				} 
				
				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("C");
				m.setMenuGb("상담사팀 CTI 매핑");
				String workInfo = m.getName() + " 신규 추가";
				m.setWorkInfo(workInfo);
				ctiMapAgentOrgMapper.insertGrpHist(m);
			} else if(m.getDataStatus() == AXBootTypes.DataStatus.MODIFIED) {
				ctiMapAgentOrgMapper.updateAgentOrg(m);
				
				if(!m.getParentId().equals(m.getPreParentId())){
					if(m.getPreParentId() == null || "null".equals(m.getPreParentId().toLowerCase())){
						if(m.getParentId() != null && !("null".equals(m.getParentId().toLowerCase()))){
							//insert
							ctiMapAgentOrgMapper.insertAgentOrgToOrg(m);
						}
					}else{
						if(m.getParentId() == null  || "null".equals(m.getParentId().toLowerCase())){
							//delete
							ctiMapAgentOrgMapper.deleteAgentOrgToOrg(m);
						}else{
							//update
							ctiMapAgentOrgMapper.updateAgentOrgToOrg(m);
						}
					}
				}
				
				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("U");
				m.setMenuGb("상담사팀 CTI 매핑");
				String workInfo = m.getName() + " 정보 변경";
				m.setWorkInfo(workInfo);
				ctiMapAgentOrgMapper.insertGrpHist(m);
			} 
			else {
				if(!m.getOrgLevel().equals(m.getPreOrgLevel())  ||  !m.getSort().equals(m.getPreSort())){
					ctiMapAgentOrgMapper.updateAgentOrg(m);
					
					m.setWorkNm(user_name + "(" + user_cd + ")");
					m.setWorkGb("U");
					m.setMenuGb("상담사팀 CTI 매핑");
					String workInfo = m.getName() + " 상위부서 및 정렬 순서 변경";
					m.setWorkInfo(workInfo);
					ctiMapAgentOrgMapper.insertGrpHist(m);
				}
			}
		});
	}

	@Transactional(rollbackFor=Exception.class)
	public void deleteAgentOrg(String user_cd, String user_name, List<ctiMapAgentOrg> agentOrgs) {
		agentOrgs.forEach(m -> { 
			// delete
			m.setUserCd(user_cd);
			m.setUserNm(user_name);
			
			if("0".equals(m.getOrgLevel())){
				m.setOrgType("0");
			}else{
				m.setOrgType("12");
			}
			ctiMapAgentOrgMapper.deleteAgentOrg(m);
			ctiMapAgentOrgMapper.deleteAgentOrgToOrg(m);
			
			m.setWorkNm(user_name + "(" + user_cd + ")");
			m.setWorkGb("D");
			m.setMenuGb("상담사팀 CTI 매핑");
			String workInfo = m.getName() + " 삭제";
			m.setWorkInfo(workInfo);
			ctiMapAgentOrgMapper.insertGrpHist(m);
		});
		agentOrgs.stream().filter(agentOrg -> isNotEmpty(agentOrg.getChildren())).forEach(agentOrg -> {
			deleteAgentOrg(user_cd, user_name, agentOrg.getChildren());            
		});
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void processAgentDetail(String user_cd, String user_name, ctiMapAgentOrgVO agentOrgVO) {
		saveAgentDetail(user_cd, user_name, agentOrgVO.getList());
		deleteAgentDetail(user_cd, user_name, agentOrgVO.getDeletedList());
	} 

	@Transactional(rollbackFor=Exception.class)
	public void saveAgentDetail(String user_cd, String user_name, List<ctiMapAgentOrg> agentOrgs) {
		agentOrgs.forEach(m -> { 
			if(m.getDataStatus() == AXBootTypes.DataStatus.MODIFIED){
				m.setUserCd(user_cd);
				ctiMapAgentOrgMapper.updateAgentDetail(m);
				
				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("U");
				m.setMenuGb("상담사팀 CTI 매핑");
				String workInfo = m.getName() + " CTI 매핑 정보 변경(dbid:" + m.getAgroupDbid() + ", name:" + m.getAgroupName() + ")";
				m.setWorkInfo(workInfo);
				ctiMapAgentOrgMapper.insertGrpHist(m);
			}
			
		});
	}

	@Transactional(rollbackFor=Exception.class)
	public void deleteAgentDetail(String user_cd, String user_name, List<ctiMapAgentOrg> agentOrgs) {
		agentOrgs.forEach(m -> { 
			if(m.getDataStatus() == AXBootTypes.DataStatus.DELETED){
				// delete
				m.setUserCd(user_cd);
				m.setPreParentId(m.getParentId());
				
				ctiMapAgentOrgMapper.deleteAgentOrg(m);
				ctiMapAgentOrgMapper.deleteAgentOrgToOrg(m);
				
				m.setWorkNm(user_name + "(" + user_cd + ")");
				m.setWorkGb("D");
				m.setMenuGb("상담사팀 CTI 매핑");
				String workInfo = m.getName() + " 삭제(dbid:" + m.getAgroupDbid() + ", name:" + m.getAgroupName() + ")";
				m.setWorkInfo(workInfo);
				ctiMapAgentOrgMapper.insertGrpHist(m);
			}
			
		});
	}
    
    public ctiMapAgentOrg getParent(List<ctiMapAgentOrg> agentOrgs, ctiMapAgentOrg agentOrg) {
    	ctiMapAgentOrg parent = agentOrgs.stream().filter(m -> m.getId().equals(agentOrg.getParentId())).findAny().orElse(null);
        if (parent == null) {
            for (ctiMapAgentOrg _agentOrg : agentOrgs) {
                parent = getParent(_agentOrg.getChildren(), agentOrg);
                if (parent != null)
                    break;
            }
        }
        return parent;
    }

    public boolean hasTerminalList(ctiMapAgentOrg agentOrg) {
        boolean hasTerminalAgentOrg = false;

        if (isNotEmpty(agentOrg.getChildren())) {
            for (ctiMapAgentOrg _agentOrgs : agentOrg.getChildren()) {
            	hasTerminalAgentOrg = hasTerminalList(_agentOrgs);

                if (hasTerminalAgentOrg) {
                    return true;
                }
            }
        }

        if (isNotEmpty(agentOrg.getParentId())) {
        	hasTerminalAgentOrg = true;
        }
        return hasTerminalAgentOrg;
    }
}