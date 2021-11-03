package com.soluvis.bake.systemManager.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.soluvis.bake.systemManager.domain.statListManager;

public interface statListManagerService {
		
	public List<statListManager> statTypeListSel();

	public List<statListManager> mednListSel(Map<String,Object> params);

	public List<statListManager> skillListSel(Map<String,Object> params);

	public List<statListManager> agentListSel(Map<String,Object> params);

	public List<statListManager> realListSel(Map<String,Object> params);

	public int mednListIst(Map<String,Object> params);

	public int skillListIst(Map<String,Object> params);

	public int agentListIst(Map<String,Object> params);

	public int realListIst(Map<String,Object> params);

	public int mednListUdt(Map<String,Object> params);

	public int skillListUdt(Map<String,Object> params);

	public int agentListUdt(Map<String,Object> params);

	public int realListUdt(Map<String,Object> params);

	public int mednListDel(Map<String,Object> params);

	public int skillListDel(Map<String,Object> params);

	public int agentListDel(Map<String,Object> params);

	public int realListDel(Map<String,Object> params);
	

	public List<statListManager> userList();

	public int userFacIst(Map<String,Object> params);

	public int userFacDel(Map<String,Object> params);
	
	public int userDel(@Param("user_id") String user_id);
	
	public List<statListManager> userFacSel(Map<String,Object> params);
	
	public int userFacUdt(Map<String,Object> params);
	
	
	public int rinitFacIst(Map<String,Object> params);

	public int rinitFacUdt(Map<String,Object> params);

	public int rinitFacDel(Map<String,Object> params);
	
	
	public List<statListManager> mednListSelmodal(Map<String,Object> params);
	public List<statListManager> skillListSelmodal(Map<String,Object> params);
	public List<statListManager> agentListSelmodal(Map<String,Object> params);

	public int mednListUdtmodal(Map<String,Object> params);
	public int skillListUdtmodal(Map<String,Object> params);
	public int agentListUdtmodal(Map<String,Object> params);
	
	
	public List<statListManager> userAuthSel(Map<String,Object> params);
	
	public List<statListManager> selectHistoryTime(Map<String,Object> params);
	
	public List<statListManager> userAuthLst(Map<String,Object> params);
	
	public List<statListManager> ivrMaxSize(Map<String,Object> params);
}

