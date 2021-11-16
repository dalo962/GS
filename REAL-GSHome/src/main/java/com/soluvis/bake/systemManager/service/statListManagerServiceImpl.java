package com.soluvis.bake.systemManager.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.systemManager.domain.statListManager;
import com.soluvis.bake.systemManager.mapper.statListManagerMapper;

@Service
public class statListManagerServiceImpl implements statListManagerService{
	
	@Autowired
	private statListManagerMapper statLstMngMapper;
	
	@Override
	public List<statListManager> statTypeListSel()
	{		
		return statLstMngMapper.statTypeListSel();
	}
	
	@Override
	public List<statListManager> skillListSel(Map<String,Object> params)
	{		
		return statLstMngMapper.skillListSel(params);
	}
	
	@Override
	public List<statListManager> agentListSel(Map<String,Object> params)
	{		
		return statLstMngMapper.agentListSel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int skillListIst(Map<String,Object> params)
	{		
		return statLstMngMapper.skillListIst(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int agentListIst(Map<String,Object> params)
	{		
		return statLstMngMapper.agentListIst(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int skillListUdt(Map<String,Object> params)
	{		
		return statLstMngMapper.skillListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int agentListUdt(Map<String,Object> params)
	{		
		return statLstMngMapper.agentListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int skillListDel(Map<String,Object> params)
	{		
		return statLstMngMapper.skillListDel(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int agentListDel(Map<String,Object> params)
	{		
		return statLstMngMapper.agentListDel(params);
	}
	
	@Override
	public List<statListManager> userList()
	{		
		return statLstMngMapper.userList();
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int userFacIst(Map<String,Object> params)
	{		
		return statLstMngMapper.userFacIst(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int userFacDel(Map<String,Object> params)
	{		
		return statLstMngMapper.userFacDel(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int userDel(@Param("user_id") String user_id)
	{		
		return statLstMngMapper.userDel(user_id);
	}
	@Override
	public List<statListManager> userFacSel(Map<String,Object> params)
	{		
		return statLstMngMapper.userFacSel(params);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int userFacUdt(Map<String,Object> params)
	{		
		return statLstMngMapper.userFacUdt(params);
	}


	@Override
	public List<statListManager> skillListSelmodal(Map<String,Object> params)
	{		
		return statLstMngMapper.skillListSelmodal(params);
	}
	@Override
	public List<statListManager> agentListSelmodal(Map<String,Object> params)
	{		
		return statLstMngMapper.agentListSelmodal(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int skillListUdtmodal(Map<String,Object> params)
	{		
		return statLstMngMapper.skillListUdtmodal(params);
	}	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int agentListUdtmodal(Map<String,Object> params)
	{		
		return statLstMngMapper.agentListUdtmodal(params);
	}
	
	
	@Override
	public List<statListManager> userAuthSel(Map<String,Object> params)
	{		
		return statLstMngMapper.userAuthSel(params);
	}
	
	
	@Override
	public List<statListManager> selectHistoryTime(Map<String,Object> params)
	{		
		return statLstMngMapper.selectHistoryTime(params);
	}
	
	
	@Override
	public List<statListManager> userAuthLst(Map<String,Object> params)
	{		
		return statLstMngMapper.userAuthLst(params);
	}
	
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int userFacIstSetting(Map<String,Object> params)
	{		
		return statLstMngMapper.userFacIstSetting(params);
	}
}

