package com.soluvis.bake.systemManager.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chequer.axboot.core.code.AXBootTypes;
import com.soluvis.bake.system.domain.BaseService;
import com.soluvis.bake.systemManager.domain.ctiMapCompModal;
import com.soluvis.bake.systemManager.domain.ctiMapCompModalVO;
import com.soluvis.bake.systemManager.mapper.ctiMapCompModalMapper;

@Service
public class ctiMapCompModalServiceImpl extends BaseService<ctiMapCompModal, Long> implements ctiMapCompModalService{

	@Inject
	private ctiMapCompModalMapper ctiMapCompModalMapper;
	
	
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void processCompany(String user_cd, String user_name, ctiMapCompModalVO ctiMapCompVO) {
		saveCompany(user_cd, user_name, ctiMapCompVO.getList());
		deleteCompany(user_cd, user_name, ctiMapCompVO.getDeletedList());
	}
	

	@Transactional(rollbackFor=Exception.class)
	public void saveCompany(String user_cd, String user_name, List<ctiMapCompModal> ctiMapCompModal) {
		ctiMapCompModal.forEach(m -> {
			m.setOrgType("0");
			m.setOrgLevel("0");
			m.setUserCd(user_cd);
			m.setWorkNm(user_name + "(" + user_cd + ")");
			if(m.getDataStatus() == AXBootTypes.DataStatus.CREATED){
				m.setId(ctiMapCompModalMapper.newOrgId());
				ctiMapCompModalMapper.insertCompOrg(m);
				
				m.setWorkGb("I");
				String workInfo = m.getName() + " CTI 매핑 정보 변경(소속 추가)";
				m.setWorkInfo(workInfo);
				ctiMapCompModalMapper.insertHist(m);
			}else if(m.getDataStatus() == AXBootTypes.DataStatus.MODIFIED){
				ctiMapCompModalMapper.updateCompOrg(m);
				
				m.setWorkGb("U");
				String workInfo = m.getName() + " CTI 매핑 정보 변경(소속 정보 변경)";
				m.setWorkInfo(workInfo);
				ctiMapCompModalMapper.insertHist(m);
			}
		});
	}
	
	@Transactional(rollbackFor=Exception.class)
	public void deleteCompany(String user_cd, String user_name, List<ctiMapCompModal> ctiMapCompModal) {
		ctiMapCompModal.forEach(m -> {
			m.setOrgType("0");
			m.setOrgLevel("0");
			m.setUserCd(user_cd);
			m.setWorkNm(user_name + "(" + user_cd + ")");
			ctiMapCompModalMapper.deleteCompOrg(m);		// 소속, 채널, 부서 삭제
			ctiMapCompModalMapper.deleteSkillOrg(m);	// 스킬, 팀 삭제
			ctiMapCompModalMapper.deleteCompOrgToOrg(m);	// 소속의 채널, 부서 삭제
			ctiMapCompModalMapper.deleteSkillOrgToOrg(m);	// 소속의 스킬, 팀 삭제
			
			m.setWorkGb("D");
			String workInfo = m.getName() + " CTI 매핑 정보 변경(소속 삭제)";
			m.setWorkInfo(workInfo);
			ctiMapCompModalMapper.insertHist(m);
		});
	}
}