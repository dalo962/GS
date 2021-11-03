package com.soluvis.bake.systemManager.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.bake.systemManager.domain.statListManager;
import com.soluvis.bake.systemManager.service.statListManagerService;

/** 
 * @author gihyunpark
 * @desc   통계에 대한 관리를 하며 누적 항목의 경우 변경이 일어날시 유저 항목 관리 테이블을 작업해 줘야함(누적, 실시간) 누적 통계에서 모달창 및 그리드에 대한 세팅을 한다
 */
@Controller
@RequestMapping(value = "/api/statLstMng")
public class statListManagerController extends commController{
	
	@Inject
	private statListManagerService statLstMngService;	
		
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	String[] arrMedn = new String[]{"incalls"};	
	String[] arrSkill = new String[]{"depart", "work", "combine", "timeto"};	
	String[] arrAgent = new String[]{"workCall", "agentCall", "agentStatus"};

	/** 
	 * @desc 통계 구분항목을 조회하여 콤보박스를 세팅한다
	 */ 
	@RequestMapping(value="/statTypeLst", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody List<statListManager> statTypeLst(@Valid HttpServletRequest request) throws Exception {
		List<statListManager> search = statLstMngService.statTypeListSel();
		
		return search;
	}
	
	/** 
	 * @desc 통계 구분 항목에 대한 리스트를 조회한다
	 */
	@RequestMapping(value="/statLstMngSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<statListManager> statLstMngSearch(@Valid HttpServletRequest request, String stattype) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<statListManager> search = null;
		//int chk = scs.grpChk("85");
		int chk = 1;
		
		if(chk > 0)
		{
			if("STAT01".equals(stattype))
			{
				map.put("seq", "");
				search = statLstMngService.mednListSel(map);
			}
			else if("STAT02".equals(stattype))
			{
				map.put("seq", "");
				search = statLstMngService.skillListSel(map);
			}
			else if("STAT03".equals(stattype))
			{
				map.put("seq", "");
				search = statLstMngService.agentListSel(map);
			}
			else
			{
				map.put("stat_type", stattype);
				map.put("stat_id", "");
				search = statLstMngService.realListSel(map);
			}		
		}
		return search;
	}
	
	/** 
	 * @desc 통계 항목을 추가, 수정, 삭제하며 추가,삭제시에는 user_factor 테이블에 작업을 해주지만 update시에는 작업하지 않으며 report_init테이블은 추가, 수정, 삭제 작업을 다 해준다 누적과 실시간 로직은 다르게 한다 
	 */
	@RequestMapping(value = "/statLstMngSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse statLstMngSave(@Valid @RequestBody List<statListManager> statList, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<statListManager> search = null;
		List<statListManager> Usearch = null;

		//int chk = scs.grpChk("85");	
		int chk = 1;
		
		if(chk > 0)
		{
			for (statListManager sl : statList)
			{	
				if(AXBootTypes.DataStatus.CREATED.equals(sl.getDataStatus()))
				{
					if("STAT01".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						search = statLstMngService.mednListSel(map);
						if(search.size() != 0)
						{
							return ok("Fail");
						}
						map.put("colname", sl.getColname());					
						map.put("hanname", sl.getHanname());
						map.put("use_yn", "N");
						map.put("gubun", sl.getGubun());
						map.put("type", sl.getType());
						map.put("stype", sl.getStype());
						map.put("asname", sl.getAsname());
						
						for(int i = 0; i < arrMedn.length; i++)
						{
							map.put("dispname", arrMedn[i]);
							//int result = statLstMngService.mednListIst(map);
							statLstMngService.mednListIst(map);
						}
						Usearch = statLstMngService.userList();
						if(Usearch.size() > 0)
						{
							map.clear();
							int Usearchsize = Usearch.size();
							for(int i = 0; i < Usearchsize; i++)
							{
								map.put("user_cd", Usearch.get(i).getUser_cd());
								map.put("stat_gubun", "MEDN");
								map.put("stat_seq", sl.getSeq());
								map.put("stat_yn", "N");
								for(int j = 0; j < arrMedn.length; j++)
								{
									map.put("dispname", arrMedn[j]);
									//int Uresult = statLstMngService.userFacIst(map);	
									statLstMngService.userFacIst(map);
								}
							}
							//for(int k = 0; k < arrMedn.length; k++)
							//{
							//	map.put("dispname", arrMedn[k]);
							//	int Rresult = statLstMngService.rinitFacIst(map);
							//}
						}					
					}
					else if("STAT02".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						search = statLstMngService.skillListSel(map);
						if(search.size() != 0)
						{
							return ok("Fail");
						}
						map.put("colname", sl.getColname());
						map.put("hanname", sl.getHanname());
						map.put("use_yn", "N");
						map.put("gubun", sl.getGubun());
						map.put("type", sl.getType());
						map.put("stype", sl.getStype());
						map.put("asname", sl.getAsname());
						
						for(int i = 0; i < arrSkill.length; i++)
						{
							map.put("dispname", arrSkill[i]);
							//int result = statLstMngService.skillListIst(map);
							statLstMngService.skillListIst(map);
						}
						Usearch = statLstMngService.userList();
						if(Usearch.size() > 0)
						{
							map.clear();
							int Usearchsize = Usearch.size();
							for(int i = 0; i < Usearchsize; i++)
							{
								map.put("user_cd", Usearch.get(i).getUser_cd());
								map.put("stat_gubun", "SKILL");
								map.put("stat_seq", sl.getSeq());
								map.put("stat_yn", "N");							
								for(int j = 0; j < arrSkill.length; j++)
								{
									map.put("dispname", arrSkill[j]);
									//int Uresult = statLstMngService.userFacIst(map);	
									statLstMngService.userFacIst(map);
								}							
							}
							for(int k = 0; k < arrSkill.length; k++)
							{
								map.put("dispname", arrSkill[k]);
								//int Rresult = statLstMngService.rinitFacIst(map);
								statLstMngService.rinitFacIst(map);
							}
						}
					}
					else if("STAT03".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						search = statLstMngService.agentListSel(map);
						if(search.size() != 0)
						{
							return ok("Fail");
						}
						map.put("colname", sl.getColname());
						map.put("hanname", sl.getHanname());
						map.put("use_yn", "N");
						map.put("gubun", sl.getGubun());
						map.put("type", sl.getType());
						map.put("stype", sl.getStype());
						map.put("asname", sl.getAsname());
						
						for(int i = 0; i < arrAgent.length; i++)
						{
							map.put("dispname", arrAgent[i]);
							//int result = statLstMngService.agentListIst(map);
							statLstMngService.agentListIst(map);
						}		
						Usearch = statLstMngService.userList();
						if(Usearch.size() > 0)
						{
							map.clear();
							int Usearchsize = Usearch.size();
							for(int i = 0; i < Usearchsize; i++)
							{
								map.put("user_cd", Usearch.get(i).getUser_cd());
								map.put("stat_gubun", "AGENT");
								map.put("stat_seq", sl.getSeq());
								map.put("stat_yn", "N");
								for(int j = 0; j < arrAgent.length; j++)
								{
									map.put("dispname", arrAgent[j]);
									//int Uresult = statLstMngService.userFacIst(map);	
									statLstMngService.userFacIst(map);
								}							
							}
							for(int k = 0; k < arrAgent.length; k++)
							{
								map.put("dispname", arrAgent[k]);
								//int Rresult = statLstMngService.rinitFacIst(map);
								statLstMngService.rinitFacIst(map);
							}
						}
					}
					else
					{
						map.put("stat_type", sl.getStat_type());
						map.put("stat_id", sl.getStat_id());
						map.put("stat_nm", sl.getStat_nm());
						search = statLstMngService.realListSel(map);
						if(search.size() != 0)
						{
							return ok("Fail");
						}
						map.put("stat_group", sl.getStat_group());
						map.put("stat_nm", sl.getStat_nm());
						map.put("stat_desc", sl.getStat_desc());
						map.put("stat_unit", sl.getStat_unit());
						if(sl.getStat_opt1() == null)
						{
							map.put("stat_opt1", "");
						}
						else
						{
							map.put("stat_opt1", sl.getStat_opt1());
						}
						map.put("stat_opt2", sl.getStat_opt2());
						if(sl.getStat_opt3() == null)
						{
							map.put("stat_opt3", "");
						}
						else
						{
							map.put("stat_opt3", sl.getStat_opt3());
						}
						
						//int result = statLstMngService.realListIst(map);
						statLstMngService.realListIst(map);
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(sl.getDataStatus()))
				{
					if("STAT01".equals(sl.getStat_type()))
					{
						map.put("hanname", sl.getHanname());
						map.put("gubun", sl.getGubun());
						map.put("type", sl.getType());
						map.put("stype", sl.getStype());
						map.put("seq", sl.getSeq());
						map.put("asname", sl.getAsname());
						map.put("colname", sl.getColname());		
						
						for(int j = 0; j < arrMedn.length; j++)
						{
							map.put("dispname", arrMedn[j]);
							//int result = statLstMngService.mednListUdt(map);
							statLstMngService.mednListUdt(map);
						}
						
						//int result = statLstMngService.mednListUdt(map);
					}
					else if("STAT02".equals(sl.getStat_type()))
					{
						map.put("hanname", sl.getHanname());
						map.put("gubun", sl.getGubun());
						map.put("type", sl.getType());
						map.put("stype", sl.getStype());
						map.put("seq", sl.getSeq());
						map.put("asname", sl.getAsname());
						map.put("colname", sl.getColname());
						
						for(int j = 0; j < arrSkill.length; j++)
						{
							map.put("dispname", arrSkill[j]);
							//int result = statLstMngService.skillListUdt(map);	
							statLstMngService.skillListUdt(map);
						}	
						//int result = statLstMngService.skillListUdt(map);
					}
					else if("STAT03".equals(sl.getStat_type()))
					{
						map.put("hanname", sl.getHanname());
						map.put("gubun", sl.getGubun());
						map.put("type", sl.getType());
						map.put("stype", sl.getStype());
						map.put("seq", sl.getSeq());
						map.put("asname", sl.getAsname());
						map.put("colname", sl.getColname());
						
						for(int j = 0; j < arrAgent.length; j++)
						{
							map.put("dispname", arrAgent[j]);
							//int result = statLstMngService.agentListUdt(map);	
							statLstMngService.agentListUdt(map);
						}	
						//int result = statLstMngService.agentListUdt(map);
					}
					else
					{
						map.put("stat_group", sl.getStat_group());
						map.put("stat_nm", sl.getStat_nm());
						map.put("stat_desc", sl.getStat_desc());
						map.put("stat_unit", sl.getStat_unit());					
						map.put("stat_id", sl.getStat_id());
						map.put("stat_type", sl.getStat_type());
						if(sl.getStat_opt1() == null)
						{
							map.put("stat_opt1", "");
						}
						else
						{
							map.put("stat_opt1", sl.getStat_opt1());
						}
						map.put("stat_opt2", sl.getStat_opt2());
						if(sl.getStat_opt3() == null)
						{
							map.put("stat_opt3", "");
						}
						else
						{
							map.put("stat_opt3", sl.getStat_opt3());
						}
						//int result = statLstMngService.realListUdt(map);
						statLstMngService.realListUdt(map);
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(sl.getDataStatus()))
				{
					if("STAT01".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						map.put("colname", sl.getColname());
						
						//int result = statLstMngService.mednListDel(map);
						statLstMngService.mednListDel(map);
						
						map.put("stat_gubun", "MEDN");
						map.put("stat_seq", sl.getSeq());
													
						//int Uresult = statLstMngService.userFacDel(map);
						statLstMngService.userFacDel(map);
						//int Rresult = statLstMngService.rinitFacDel(map);
					}
					else if("STAT02".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						map.put("colname", sl.getColname());
						
						//int result = statLstMngService.skillListDel(map);
						statLstMngService.skillListDel(map);
						
						map.put("stat_gubun", "SKILL");
						map.put("stat_seq", sl.getSeq());
													
						//int Uresult = statLstMngService.userFacDel(map);
						statLstMngService.userFacDel(map);
						//int Rresult = statLstMngService.rinitFacDel(map);
						statLstMngService.rinitFacDel(map);
					}
					else if("STAT03".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						map.put("colname", sl.getColname());
						
						//int result = statLstMngService.agentListDel(map);
						statLstMngService.agentListDel(map);
						
						map.put("stat_gubun", "AGENT");
						map.put("stat_seq", sl.getSeq());
													
						//int Uresult = statLstMngService.userFacDel(map);
						statLstMngService.userFacDel(map);
						//int Rresult = statLstMngService.rinitFacDel(map);
						statLstMngService.rinitFacDel(map);
					}
					else
					{					
						map.put("stat_id", sl.getStat_id());
						map.put("stat_type", sl.getStat_type());
						map.put("stat_nm", sl.getStat_nm());
						
						//int result = statLstMngService.realListDel(map);
						statLstMngService.realListDel(map);
					}
				}
			}
		}
		return ok();
	}
	
	
	/** 
	 * @desc 메뉴별 항목 설정에 대한 모달창을 실행한다
	 */ 
	@RequestMapping(value="/statLstMngMenuSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<statListManager> statLstMngMenuSearch(@Valid HttpServletRequest request, String disp) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		List<statListManager> search = null;
		String tp = "";
		
		for(int i = 0; i < arrMedn.length; i++)
		{
			if(arrMedn[i].toString().equals(disp))
			{
				tp = "MEDN";
				break;
			}
		}
		for(int i = 0; i < arrSkill.length; i++)
		{
			if(arrSkill[i].toString().equals(disp))
			{
				tp = "SKILL";
				break;
			}
		}
		for(int i = 0; i < arrAgent.length; i++)
		{
			if(arrAgent[i].toString().equals(disp))
			{
				tp = "AGENT";
				break;
			}
		}
		map.put("seq", "");
		map.put("dispname", disp);
		map.put("useyn", "");
		if("MEDN".equals(tp)) 
		{ search = statLstMngService.mednListSelmodal(map); }
		else if("SKILL".equals(tp)) 
		{ search = statLstMngService.skillListSelmodal(map); }
		else if("AGENT".equals(tp)) 
		{ search = statLstMngService.agentListSelmodal(map); }
				
		return search;
	}
	
	/** 
	 * @dese 메뉴별 항목 설정에 대한 모달창을 저장한다
	 */
	@RequestMapping(value="/statLstMngMenuSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse statLstMngMenuSave(@Valid @RequestBody List<statListManager> statList, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		//int result = 0;
		//int Uresult = 0;
		//int Rresult = 0;
		String tp = "";
		//List<statListManager> search = null;	

		for (statListManager sl : statList)
		{	
			if(AXBootTypes.DataStatus.MODIFIED.equals(sl.getDataStatus()))
			{
				for(int i = 0; i < arrMedn.length; i++)
				{
					if(arrMedn[i].toString().equals(sl.getDispname()))
					{
						tp = "MEDN";
						break;
					}
				}
				for(int i = 0; i < arrSkill.length; i++)
				{
					if(arrSkill[i].toString().equals(sl.getDispname()))
					{
						tp = "SKILL";
						break;
					}
				}
				for(int i = 0; i < arrAgent.length; i++)
				{
					if(arrAgent[i].toString().equals(sl.getDispname()))
					{
						tp = "AGENT";
						break;
					}
				}						
				map.put("use_yn", sl.getUse_yn());
				if(sl.getSgroup() == null)
				{
					map.put("sgroup", "-");
				}
				else
				{
					if("".equals(sl.getSgroup()))
					{
						map.put("sgroup", "-");
					}
					else
					{
						map.put("sgroup", sl.getSgroup());
					}
				}
				map.put("seq", sl.getSeq());
				map.put("colname", sl.getColname());
				map.put("dispname", sl.getDispname());
				
				if("MEDN".equals(tp)) 
				{ statLstMngService.mednListUdtmodal(map); }
				else if("SKILL".equals(tp)) 
				{ statLstMngService.skillListUdtmodal(map); }
				else if("AGENT".equals(tp)) 
				{ statLstMngService.agentListUdtmodal(map); }				
				
				/*
				if(tp.equals("MEDN")) { result = statLstMngService.mednListUdtmodal(map); }
				else if(tp.equals("SKILL")) { result = statLstMngService.skillListUdtmodal(map); }
				else if(tp.equals("AGENT")) { result = statLstMngService.agentListUdtmodal(map); }
					
				map.put("stat_gubun",tp);
				search = statLstMngService.userList();
				
				for(int i = 0; i < search.size(); i++)
				{
					map.put("user_id", search.get(i).getUser_cd());
					map.put("stat_nseq", sl.getSeq());
					map.put("stat_yn", sl.getUse_yn());
					map.put("stat_oseq", sl.getSeq());
					map.put("stat_seq", sl.getSeq());
						
					Uresult = statLstMngService.userFacUdt(map);				
				}*/			
				map.put("stat_yn", sl.getUse_yn());
				map.put("stat_gubun",tp);
				map.put("stat_seq", sl.getSeq());
				//Rresult = statLstMngService.rinitFacUdt(map);
				statLstMngService.rinitFacUdt(map);
			}
		}		
		return ok();
	}
	
	
	/** 
	 * @desc 그리드에 표시할 통계 항목을 세팅한다
	 */ 
	@RequestMapping(value="/getStatGrid", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> getStatGrid(@Valid HttpServletRequest request, String stat_gubun, String dispname) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		map.put("user_id", cid);
		map.put("stat_gubun", stat_gubun);
		map.put("dispname", dispname);
		
		List<statListManager> search = statLstMngService.userFacSel(map);
		
		if(search.size() > 0)
		{
			int searchsize = search.size();
			for(int i = 0; i < searchsize; i++)
			{
				if("Y".equals(search.get(i).getStat_yn()))
				{
					Map<String, Object> Mmap = new HashMap<String, Object>(); 
						
					map.put("seq", search.get(i).getStat_seq());	
					map.put("dispname", search.get(i).getDispname());
					List<statListManager> List = null;
					map.put("useyn", "Y");
					if("MEDN".equals(stat_gubun)) 
					{ List = statLstMngService.mednListSelmodal(map); }
					else if("SKILL".equals(stat_gubun)) 
					{ List = statLstMngService.skillListSelmodal(map); }
					else if("AGENT".equals(stat_gubun)) 
					{ List = statLstMngService.agentListSelmodal(map); }
						
					if(List.size() > 0)
					{
						Mmap.put("key", List.get(0).getAsname());
						Mmap.put("label", List.get(0).getHanname());
						Mmap.put("sgroup", List.get(0).getSgroup());
						Mmap.put("width", 120);
						Mmap.put("align", "center");
						Mmap.put("sortable", true);		
						Mmap.put("stype", List.get(0).getStype());
						Mmap.put("colname", List.get(0).getColname());
						
						if("M".equals(List.get(0).getGubun())) 
						{Mmap.put("formatter", "major");}
						else if("T".equals(List.get(0).getGubun())) 
						{Mmap.put("formatter", "hour");}
						else if("N".equals(List.get(0).getGubun())) 
						{Mmap.put("formatter", "cnt");}
						else if("P".equals(List.get(0).getGubun())) 
						{Mmap.put("formatter", "ptg");}
						else if("PS".equals(List.get(0).getGubun())) 
						{Mmap.put("formatter", "person");}
						else if("PSG".equals(List.get(0).getGubun())) 
						{Mmap.put("formatter", "perptg");}
						else if("TX".equals(List.get(0).getGubun())) 
						{Mmap.put("formatter", "texter");}
						
						list.add(Mmap);
					}
				}		
			}
		}	
		
		return list;
	}
	
	/** 
	 * @desc 모달창을 조회해준다
	 */
	@RequestMapping(value="/getStatModal", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> getStatModal(@Valid HttpServletRequest request, String stat_gubun, String dispname) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		List<statListManager> ulist = null;
		List<statListManager> search = null;
		
		map.put("user_id", cid);
		map.put("stat_gubun",stat_gubun);
		map.put("dispname", dispname);
			
		ulist = statLstMngService.userFacSel(map);
		
		if(ulist.size() > 0)
		{
			int ulistsize = ulist.size();
			for(int i = 0; i < ulistsize; i++)
			{
				Map<String, Object> Mmap = new HashMap<String, Object>(); 
				
				Mmap.put("seq", ulist.get(i).getStat_seq());
				Mmap.put("dispname", ulist.get(i).getDispname());
				Mmap.put("useyn", "Y");
				if("MEDN".equals(stat_gubun)) 
				{ search = statLstMngService.mednListSelmodal(Mmap); }
				else if("SKILL".equals(stat_gubun)) 
				{ search = statLstMngService.skillListSelmodal(Mmap); }
				else if("AGENT".equals(stat_gubun)) 
				{ search = statLstMngService.agentListSelmodal(Mmap); }
					
				if(search.size() > 0)
				{
					Mmap.put("colname", search.get(0).getAsname());
					Mmap.put("hanname", search.get(0).getHanname());
					Mmap.put("sgroup", search.get(0).getSgroup());
					//search.get(0).setSeq(ulist.get(i).getSort());
					Mmap.put("seq", ulist.get(i).getRm()) ; //search.get(0).getSeq());		
					Mmap.put("statseq", ulist.get(i).getStat_seq());
					
					search.get(0).setUse_yn(ulist.get(i).getStat_yn());
					Mmap.put("use_yn", search.get(0).getUse_yn());
						
					Mmap.put("gubun", search.get(0).getGubun());								
						
					list.add(Mmap);
				}
			}		
		}
		
		return list;
	}
	
	/** 
	 * @desc 모달창을 저장해준다
	 */ 
	@RequestMapping(value="/StatModalSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody int StatModalSave(@Valid @RequestBody Map<String,Object> modalSave, HttpServletRequest request) throws Exception {

		Map<String,Object> reqTmp = (Map<String, Object>) modalSave.get("0");
		Map<String, Object> map = new HashMap<String, Object>(); 
		String stat_gubun = (String) reqTmp.get("stat_gubun");
		String dispname = (String) reqTmp.get("dispname");
		Object[]  user_factor = ((List<statListManager>) reqTmp.get("user_factor")).toArray();
		
		//System.out.println("modalSave.get(0) : " + modalSave.get("0"));
		//System.out.println("modalSave.stat_gubun : " + stat_gubun);
		//System.out.println("modalSave.dispname : " + dispname);
		
		int result = 0;
		List<statListManager> list = null;
		
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		map.put("user_id", cid);
		map.put("stat_gubun", stat_gubun);
		map.put("dispname", dispname);
//		map.put("stat_gubun", request.getParameter("stat_gubun"));
//		map.put("dispname", request.getParameter("dispname"));
		
		map.put("seq", "");	
		map.put("useyn", "Y");
		if("MEDN".equals(stat_gubun)) 
		{ list = statLstMngService.mednListSelmodal(map); }
		else if("SKILL".equals(stat_gubun))
		{ list = statLstMngService.skillListSelmodal(map); }
		else if("AGENT".equals(stat_gubun))
		{ list = statLstMngService.agentListSelmodal(map); }
		
		//list = statLstMngService.userFacSel(map);
		int listsize = list.size(); 
		for(int i = 0; i < listsize; i++)
		{
			Map<String, String> ufact = (Map<String, String>) user_factor[i];
			//System.out.println("temp.stat_yn() : " + ufact.get("yn"));
			//System.out.println("temp.stat_seq() : " + ufact.get("stat_seq"));
			map.put("stat_nseq", i+1) ; //params.get("user_factor[" + i + "][num]"));
			map.put("stat_yn", ufact.get("yn"));
			map.put("stat_oseq", ufact.get("stat_seq")); //list.get(i).getStat_seq());
			
//			map.put("stat_nseq", i+1) ; //params.get("user_factor[" + i + "][num]"));
//			map.put("stat_yn", params.get("user_factor[" + i + "][yn]"));
//			map.put("stat_oseq", params.get("user_factor[" + i + "][stat_seq]")); //list.get(i).getStat_seq());
				
			result = statLstMngService.userFacUdt(map);
		}
		
		return result;
	}
	
	
	
	
	/** 
	 * @desc 권한 및 소속,부서,팀 코드를 가져온다
	 */ 
	@RequestMapping(value="/userAuthLst", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody List<statListManager> userAuthLst(@Valid HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		map.put("user_cd", cid);		
		List<statListManager> search = statLstMngService.userAuthSel(map);
		
		return search;
	}
	
	
	/** 
	 * @desc 권한 및 소속,부서,팀 코드를 가져온다
	 */ 
	@RequestMapping(value="/userAuthLstCd", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<statListManager> userAuthLstCd(@Valid HttpServletRequest request, String user_cd) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		
		//System.out.println(request.getParameter("user_cd"));
		//System.out.println(user_cd);
		map.put("user_cd", request.getParameter("user_cd"));		
		List<statListManager> search = statLstMngService.userAuthSel(map);
		
		return search;
	}
	
	
	@RequestMapping(value="/historytimeget", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public @ResponseBody List<statListManager> historytimeget(@Valid HttpServletRequest request) throws Exception{
		Map<String, Object> map = new HashMap<String, Object>();
		List<statListManager> search = null;
		
		if("".equals(request.getParameter("comSelect")) || request.getParameter("comSelect") == null)
		{
			map.put("codeSelect","day_0");
			map.put("comSelect","0");
		}
		else
		{
			map.put("codeSelect",request.getParameter("codeSelect"));
			map.put("comSelect",request.getParameter("comSelect"));
		}
		
		if("".equals(request.getParameter("mSelete")) || request.getParameter("mSelete") == null)
		{
			map.put("group_cd","HISTORY_TIME");
		}
		else
		{
			map.put("group_cd","IVR_TIME");
		}
		
		search = statLstMngService.selectHistoryTime(map);
		
		return search;
	}
    
    
    
    /** 
	 * @desc ivr에서 최대건수를 가져온다
	 */ 
	@RequestMapping(value="/ivrMaxSizeGet", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<statListManager> ivrMaxSizeGet(@Valid HttpServletRequest request, String groupcd) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("group_cd", "IVRMAXCNT");		
		List<statListManager> search = statLstMngService.ivrMaxSize(map);
		
		return search;
	}
}

