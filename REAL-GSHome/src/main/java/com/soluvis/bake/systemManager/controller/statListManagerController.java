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
	
	//String[] arrMedn = new String[]{"incalls"};	
	String[] arrSkill = new String[]{"skCall", "skWait"};	
	String[] arrAgent = new String[]{"agCall", "agProdt", "agSkill"};

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
				search = statLstMngService.skillListSel(map);
			}
			else if("STAT02".equals(stattype))
			{
				map.put("seq", "");
				search = statLstMngService.agentListSel(map);
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
						map.put("interval", sl.getInterval());
						
						for(int i = 0; i < arrSkill.length; i++)
						{
							map.put("dispname", arrSkill[i]);
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
									statLstMngService.userFacIst(map);
								}							
							}
						}
					}
					else if("STAT02".equals(sl.getStat_type()))
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
						map.put("interval", sl.getInterval());
						
						for(int i = 0; i < arrAgent.length; i++)
						{
							map.put("dispname", arrAgent[i]);
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
									statLstMngService.userFacIst(map);
								}							
							}
						}
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
						map.put("interval", sl.getInterval());
						
						for(int j = 0; j < arrSkill.length; j++)
						{
							map.put("dispname", arrSkill[j]);
							statLstMngService.skillListUdt(map);
						}
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
						map.put("interval", sl.getInterval());
						
						for(int j = 0; j < arrAgent.length; j++)
						{
							map.put("dispname", arrAgent[j]);
							statLstMngService.agentListUdt(map);
						}
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(sl.getDataStatus()))
				{
					if("STAT01".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						map.put("colname", sl.getColname());
						
						statLstMngService.skillListDel(map);
						
						map.put("stat_gubun", "SKILL");
						map.put("stat_seq", sl.getSeq());
													
						statLstMngService.userFacDel(map);
					}
					else if("STAT02".equals(sl.getStat_type()))
					{
						map.put("seq", sl.getSeq());
						map.put("colname", sl.getColname());
						
						statLstMngService.agentListDel(map);
						
						map.put("stat_gubun", "AGENT");
						map.put("stat_seq", sl.getSeq());
													
						statLstMngService.userFacDel(map);
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
		if("SKILL".equals(tp)) 
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

		String tp = "";

		for (statListManager sl : statList)
		{	
			if(AXBootTypes.DataStatus.MODIFIED.equals(sl.getDataStatus()))
			{				
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
				
				if("SKILL".equals(tp)) 
				{ statLstMngService.skillListUdtmodal(map); }
				else if("AGENT".equals(tp)) 
				{ statLstMngService.agentListUdtmodal(map); }				
					
				map.put("stat_yn", sl.getUse_yn());
				map.put("stat_gubun",tp);
				map.put("stat_seq", sl.getSeq());
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
		int searchsize = search.size();
		
		map.put("seq", "");			
		map.put("useyn", "Y");
		
		List<statListManager> List = null;
		
		if("SKILL".equals(stat_gubun)) 
		{ List = statLstMngService.skillListSelmodal(map); }
		else if("AGENT".equals(stat_gubun)) 
		{ List = statLstMngService.agentListSelmodal(map); }
		
		if(searchsize > 0)
		{
			for(int i = 0; i < searchsize; i++)
			{
				if("Y".equals(search.get(i).getStat_yn()))
				{
					if(List.size() > 0)
					{
						Map<String, Object> Mmap = new HashMap<String, Object>();
						Mmap.put("key", List.get(i).getAsname());
						Mmap.put("label", List.get(i).getHanname());
						Mmap.put("sgroup", List.get(i).getSgroup());
						Mmap.put("width", 120);
						Mmap.put("align", "center");
						Mmap.put("sortable", true);		
						Mmap.put("stype", List.get(i).getStype());
						Mmap.put("colname", List.get(i).getColname());
						Mmap.put("interval", List.get(i).getInterval());
						
						if("M".equals(List.get(i).getGubun())) 
						{Mmap.put("formatter", "major");}
						else if("T".equals(List.get(i).getGubun())) 
						{Mmap.put("formatter", "hour");}
						else if("N".equals(List.get(i).getGubun())) 
						{Mmap.put("formatter", "cnt");}
						else if("P".equals(List.get(i).getGubun())) 
						{Mmap.put("formatter", "ptg");}
						else if("PS".equals(List.get(i).getGubun())) 
						{Mmap.put("formatter", "person");}
						//else if("PSG".equals(List.get(0).getGubun())) 
						//{Mmap.put("formatter", "perptg");}
						else if("TX".equals(List.get(i).getGubun())) 
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
		int ulistsize = ulist.size();
		
		Map<String, Object> Mmap = new HashMap<String, Object>(); 
		
		Mmap.put("seq", "");
		Mmap.put("useyn", "Y");
		if("SKILL".equals(stat_gubun)) 
		{ search = statLstMngService.skillListSelmodal(Mmap); }
		else if("AGENT".equals(stat_gubun)) 
		{ search = statLstMngService.agentListSelmodal(Mmap); }
		
		if(ulistsize > 0)
		{
			for(int i = 0; i < ulistsize; i++)
			{
				if(search.size() > 0)
				{
					Mmap = new HashMap<String, Object>();
					
					Mmap.put("colname", search.get(i).getAsname());
					Mmap.put("hanname", search.get(i).getHanname());
					Mmap.put("sgroup", search.get(i).getSgroup());
					Mmap.put("seq", ulist.get(i).getRm()) ; 	
					Mmap.put("statseq", ulist.get(i).getStat_seq());
					Mmap.put("interval", search.get(i).getInterval());
					
					search.get(i).setUse_yn(ulist.get(i).getStat_yn());
					Mmap.put("use_yn", search.get(i).getUse_yn());
						
					Mmap.put("gubun", search.get(i).getGubun());								
						
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
		
		int result = 0;
		List<statListManager> list = null;
		
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		map.put("user_id", cid);
		map.put("stat_gubun", stat_gubun);
		map.put("dispname", dispname);

		map.put("seq", "");	
		map.put("useyn", "Y");
		if("SKILL".equals(stat_gubun))
		{ list = statLstMngService.skillListSelmodal(map); }
		else if("AGENT".equals(stat_gubun))
		{ list = statLstMngService.agentListSelmodal(map); }
		
		int listsize = list.size(); 
		for(int i = 0; i < listsize; i++)
		{
			Map<String, String> ufact = (Map<String, String>) user_factor[i];

			map.put("stat_nseq", i+1) ;
			map.put("stat_yn", ufact.get("yn"));
			map.put("stat_oseq", ufact.get("stat_seq")); 
			
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
}

