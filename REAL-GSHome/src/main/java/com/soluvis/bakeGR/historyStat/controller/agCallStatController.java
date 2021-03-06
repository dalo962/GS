package com.soluvis.bakeGR.historyStat.controller;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.controller.SQLInjectionSafe;
import com.soluvis.bake.common.controller.SqlSafeUtil;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.bake.systemManager.domain.statListManager;
import com.soluvis.bake.systemManager.service.statListManagerService;
import com.soluvis.bakeGR.historyStat.service.agCallStatService;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRHoliday;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRHolidayService;

/** 
 * @author gihyunpark
 * @desc   상담사 통화통계를 조회한다
 */
@Controller
@RequestMapping(value = "/gr/api/hist/agCall")
public class agCallStatController extends commController{
	
	@Inject
	private agCallStatService agCallStaService;	
		
	@Inject
	private statListManagerService statLstMngServcice;	
		
	@Inject
	private ivrGRHolidayService ivrHolidayService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	/** 
	 * @desc js에서 받은 조건을 조합하여 쿼리문을 만들어 list를 받아온다
	 */ 
	@RequestMapping(value="/agCallSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> agCallSearch(@Valid @SQLInjectionSafe HttpServletRequest request) throws Exception {
		Map<String,Object> params = RequestUtil.getParameterMap(request);	
		Map<String, Object> map = new HashMap<String, Object>();
		List<Map<String,Object>> search = null;
		
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		// select, group, order
		String select = "";
		StringBuffer selectbf = new StringBuffer(512);
		selectbf.append("");
				
		String groupby = "";
		StringBuffer groupbybf = new StringBuffer(512);
		groupbybf.append("");
				
		String orderby = "";
		StringBuffer orderbybf = new StringBuffer(512);
		orderbybf.append("");
			
		// from
		String from = "";
		StringBuffer frombf = new StringBuffer(512);
		frombf.append("");
				
		// where
		String[] agslst = {};
		StringBuffer agsbf = new StringBuffer(512);
		String ags = "";
		
		// 합계
		String sum = "";
		StringBuffer sumbf = new StringBuffer(512);
		sumbf.append("");

		map.put("user_id", SqlSafeUtil.getSqlInjectionSafe(cid));
		map.put("stat_gubun", "AGENT");
		map.put("dispname", "agCall");
		map.put("seq", "");
		
		List<statListManager> Usearch = statLstMngServcice.userFacSel(map);
		List<statListManager> statlist = statLstMngServcice.agentListSel(map);
		
		int Usearchsize = Usearch.size();
		int statlistsize = statlist.size();
		int schk = 0; // select 항목 체크 int
	
		if(Usearchsize > 0)
		{
			// 기본값에 대한 SELECT, GROUP, ORDER문 생성
			for(int i = 0; i < Usearchsize; i++)
			{
				for(int j = 0; j < statlistsize; j++)
				{
					if(Usearch.get(i).getStat_seq().equals(statlist.get(j).getSeq()))
					{
						if("MAJOR".equals(statlist.get(j).getType()))
						{
							if("Y".equals(Usearch.get(i).getStat_yn()))
							{
								// N N Y 나오면 schk는 0이므로 초기화
								if(schk == 0)
								{
									groupbybf = new StringBuffer(512);
									groupbybf.append("");
								}
								
								if("5m".equals(params.get("interval")))
								{
									// 0,1,6,7
									if("0".equals(statlist.get(j).getInterval()) || "1".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
									{
										selectbf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										groupbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										orderbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										schk++;
									}
									
								}
								else if("15m".equals(params.get("interval")))
								{
									// 0,2,6,7
									if("0".equals(statlist.get(j).getInterval()) || "2".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
									{
										selectbf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										groupbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										orderbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										schk++;
									}
									
								}
								else if("1h".equals(params.get("interval")))
								{
									// 0,3,6,7
									if("0".equals(statlist.get(j).getInterval()) || "3".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
									{
										selectbf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										groupbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										orderbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										schk++;
									}
									
								}
								else if("day".equals(params.get("interval")))
								{
									// 0,4,7,8
									if("0".equals(statlist.get(j).getInterval()) || "4".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()) || "8".equals(statlist.get(j).getInterval()))
									{
										selectbf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										groupbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										orderbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										schk++;
									}
								}
								else if("month".equals(params.get("interval")))
								{
									// 0,5,8
									if("0".equals(statlist.get(j).getInterval()) || "5".equals(statlist.get(j).getInterval()) || "8".equals(statlist.get(j).getInterval()))
									{
										selectbf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										groupbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										orderbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										schk++;
									}
								}
							}
							else
							{
								// Y문을 1번도 타지 않았을 경우 group by없이 sum하면 0 나오니 기본항목 중 날짜(시간)에 대해 group문을 만들어 준다.(값이 다른 기본항목을 넣으면 group의미 없어짐)		
								if(schk == 0)
								{
									if("5m".equals(params.get("interval")) || "15m".equals(params.get("interval")) || "1h".equals(params.get("interval")))
									{
										if("row_date".equals(statlist.get(j).getColname().toLowerCase()) || "starttime".equals(statlist.get(j).getColname().toLowerCase()))
										{
											groupbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										}
									}
									else if("day".equals(params.get("interval")) || "month".equals(params.get("interval")))
									{
										if("row_date".equals(statlist.get(j).getColname().toLowerCase()))
										{
											groupbybf.append(" " + statlist.get(j).getColname().toLowerCase() + ",");
										}
									}
								}
							}
						}
						// 통계 항목에 대한 세팅
						else
						{
							if("Y".equals(Usearch.get(i).getStat_yn()))
							{
								if("ROUND".equals(statlist.get(j).getStype()))
								{
									if("5m".equals(params.get("interval")))
									{
										// 0,1,6,7
										if("0".equals(statlist.get(j).getInterval()) || "1".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("15m".equals(params.get("interval")))
									{
										// 0,2,6,7
										if("0".equals(statlist.get(j).getInterval()) || "2".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("1h".equals(params.get("interval")))
									{
										// 0,3,6,7
										if("0".equals(statlist.get(j).getInterval()) || "3".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("day".equals(params.get("interval")))
									{
										// 0,4,7,8
										if("0".equals(statlist.get(j).getInterval()) || "4".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()) || "8".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("month".equals(params.get("interval")))
									{
										// 0,5,8
										if("0".equals(statlist.get(j).getInterval()) || "5".equals(statlist.get(j).getInterval()) || "8".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + ",1),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
								}
								else
								{
									if("5m".equals(params.get("interval")))
									{
										// 0,1,6,7
										if("0".equals(statlist.get(j).getInterval()) || "1".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("15m".equals(params.get("interval")))
									{
										// 0,2,6,7
										if("0".equals(statlist.get(j).getInterval()) || "2".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("1h".equals(params.get("interval")))
									{
										// 0,3,6,7
										if("0".equals(statlist.get(j).getInterval()) || "3".equals(statlist.get(j).getInterval()) || "6".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("day".equals(params.get("interval")))
									{
										// 0,4,7,8
										if("0".equals(statlist.get(j).getInterval()) || "4".equals(statlist.get(j).getInterval()) || "7".equals(statlist.get(j).getInterval()) || "8".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}
									else if("month".equals(params.get("interval")))
									{
										// 0,5,8
										if("0".equals(statlist.get(j).getInterval()) || "5".equals(statlist.get(j).getInterval()) || "8".equals(statlist.get(j).getInterval()))
										{
											selectbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
											sumbf.append(" NVL(" + statlist.get(j).getStype() + "(" + statlist.get(j).getColname().toLowerCase() + "),0) as " + statlist.get(j).getAsname().toLowerCase() + ",");
										}
									}							
								}
							}					
						}
					}
				}
			}			
			
			select = selectbf.toString();
			groupby = groupbybf.toString();
			orderby = orderbybf.toString();

			if(select.length() == 0)
			{
				map.put("select", "*");
			}
			else
			{
				select = select.substring(0, select.length() - 1);
				map.put("select", select);				
			}
			
			if(groupby.length() == 0)
			{
				map.put("groupby", "");
			}
			else
			{
				groupby = groupby.substring(0, groupby.length() - 1);
				map.put("groupby", groupby);
			}
			
			if(orderby.length() == 0)
			{
				map.put("orderby", "1");
			}
			else
			{
				orderby = orderby.substring(0, orderby.length() - 1);
				map.put("orderby", orderby);
			}
			
			sum = sumbf.toString();
			if(sum.length() == 0)
			{
				map.put("sum", "*");
			}
			else
			{
				sum = sum.substring(0, sum.length() - 1);
				map.put("sum", sum);				
			}			
			// SELECT, GROUP, ORDER문 생성 끝
			
			// FROM 절 생성
			if("5m".equals(params.get("interval")))
			{ 
				from = "WDM.V_AGENT_NA "; 
			}
			else if("15m".equals(params.get("interval"))) 
			{ 
				from = "WDM.V_AGENT_FT "; 
			}
			else if("1h".equals(params.get("interval"))) 
			{ 
				from = "WDM.V_AGENT_HR ";
			}
			else if("day".equals(params.get("interval"))) 
			{ 
				from = "WDM.V_AGENT_DY "; 
			}
			else if("month".equals(params.get("interval"))) 
			{ 
				from = "WDM.V_AGENT_MN "; 
			}			
			map.put("from", from);			
			// FROM 절 생성 끝
			
			// WHERE 절 생성
			map.put("compId", SqlSafeUtil.getSqlInjectionSafe(params.get("comSelect").toString()));		
			if("".equals(params.get("deptSelect"))) 
			{
				map.put("partId", "");		
			}
			else
			{
				map.put("partId", SqlSafeUtil.getSqlInjectionSafe(params.get("deptSelect").toString()));
			}
			
			if("".equals(params.get("teamSelect"))) 
			{
				map.put("teamId", "");		
			}
			else
			{
				map.put("teamId", SqlSafeUtil.getSqlInjectionSafe(params.get("teamSelect").toString()));
			}
			
			if(params.get("check") != null)
			{
				String rep = SqlSafeUtil.getSqlInjectionSafe(params.get("selText").toString());
				rep = rep.toString().replace("'", ";");
				rep = rep.toString().replace("\"", ";");
				rep = rep.toString().replace("(", ";");
				rep = rep.toString().replace(")", ";");
				rep = rep.toString().replace("--", ";");
				rep = rep.toString().replace("#", ";");
				rep = rep.toString().replace("=", ";");
				rep = rep.toString().replace(",", ";");
				
				String[] aglst = {};
				StringBuffer agbf = new StringBuffer(512);
				String ag = "";
				if("id".equals(params.get("check")))
				{
					if("".equals(params.get("selText")))
					{
						map.put("agid", "");
					}
					else
					{
						aglst = rep.toString().split(";");
						for(int j = 0; j < aglst.length; j ++)
						{
							agbf.append("'" + aglst[j].toString() + "',");
						}
						ag = agbf.toString().substring(0, agbf.toString().length() - 1);
						map.put("agid", ag);
					}
					map.put("agname", "");
				}
				else
				{
					if("".equals(params.get("selText")))
					{
						map.put("agname", "");
					}
					else
					{
						aglst = rep.toString().split(";");
						for(int j = 0; j < aglst.length; j ++)
						{
							agbf.append("'" + aglst[j].toString() + "',");
						}
						ag = agbf.toString().substring(0, agbf.toString().length() - 1);
						map.put("agname", ag);
					}
					map.put("agid", "");
				}
			}
			else
			{
				map.put("agid", "");
				map.put("agname", "");
			}

			if("".equals(params.get("agentSelect")))
			{
				map.put("agids", "");
			}
			else
			{
				SqlSafeUtil.getSqlInjectionSafe(params.get("agentSelect").toString());
				agslst = params.get("agentSelect").toString().split(";");
				for(int j = 0; j < agslst.length; j ++)
				{
					agsbf.append("'" + agslst[j].toString() + "',");
				}
				ags = agsbf.toString().substring(0, agsbf.toString().length() - 1);
				map.put("agids", ags);
			}
			// 날짜
			if(params.get("startDate") == null) 
			{ 
				map.put("s_day", ""); 
			} 
			else 
			{ 
				map.put("s_day", params.get("startDate").toString()); 
			}
			if(params.get("endDate") == null) 
			{ 
				map.put("e_day", ""); 
			} 
			else 
			{ 
				map.put("e_day", params.get("endDate").toString()); 
			}
			// 시간
			if(!"day".equals(params.get("interval")) && !"month".equals(params.get("interval")))
			{
				if(params.get("startTime") == null) 
				{ 
					map.put("s_time", ""); 
				} 
				else 
				{ 
					map.put("s_time", params.get("startTime").toString()); 
				}	
				if(params.get("endTime") == null) 
				{ 
					map.put("e_time", ""); 
				} 
				else 
				{ 
					map.put("e_time", params.get("endTime").toString()); 
				}
			}
			
			// 휴일 제외 포함
			// 월이랑 년은 제외 타면 안됨
			if(!"month".equals(params.get("interval")) && !"year".equals(params.get("interval")))
			{
				// 토요일 제외
				if(params.get("sat").toString() != null)
				{
					if("Y".equals(params.get("sat").toString()))
					{
						map.put("sat", 7); // 토요일
					}
					else
					{
						map.put("sat", "");
					}
				}
				// 휴일 제외
				if(params.get("hol").toString() != null)
				{
					if("Y".equals(params.get("hol").toString()))
					{
						map.put("hol", 1); // 일요일
									
						Map<String, Object> hmap = new HashMap<String, Object>();
						hmap.put("hl_useyn", '1'); // 0 미사용, 1 사용
						hmap.put("comp_cd", "RETAIL");
						
						List<ivrGRHoliday> hol_list = ivrHolidayService.HolidayGet(hmap);
									
						StringBuffer holdaybf = new StringBuffer(512);
						holdaybf.append("");
						String holday = "";
						int hollistsize = hol_list.size();
									
						for(int i = 0; i < hollistsize; i++)
						{
							holdaybf.append("'" + 	hol_list.get(i).getHoliday().substring(0,4) + "-" + 
													hol_list.get(i).getHoliday().substring(4,6) + "-" +
													hol_list.get(i).getHoliday().substring(6,8) + "',");
						}
									
						holday = holdaybf.toString();
						if(holday.length() > 0)
						{
							holday = holday.substring(0, holday.length() - 1);
							map.put("holday", holday);
						}
						else
						{
							map.put("holday", "");
						}
					}
					else
					{
						map.put("hol", "");
						map.put("holday", "");
					}
				}
				// 휴일 포함
				if(params.get("hdt").toString() != null)
				{
					if("Y".equals(params.get("hdt").toString()))
					{
						map.put("hdt", 1); // 일요일
										
						Map<String, Object> hmap = new HashMap<String, Object>();
						hmap.put("hl_useyn", '1'); // 0 미사용, 1 사용
						hmap.put("comp_cd", "RETAIL");
						
						List<ivrGRHoliday> hdt_list = ivrHolidayService.HolidayGet(hmap);
									
						StringBuffer hdtdaybf = new StringBuffer(512);
						hdtdaybf.append("");
						String hdtday = "";
						int hdtlistsize = hdt_list.size();
									
						for(int i = 0; i < hdtlistsize; i++)
						{
							hdtdaybf.append("'" + 	hdt_list.get(i).getHoliday().substring(0,4) + "-" + 
													hdt_list.get(i).getHoliday().substring(4,6) + "-" +
													hdt_list.get(i).getHoliday().substring(6,8) + "',");
						}
									
						hdtday = hdtdaybf.toString();
						if(hdtday.length() > 0)
						{
							hdtday = hdtday.substring(0, hdtday.length() - 1);
							map.put("hdtday", hdtday);
						}
						else
						{
							map.put("hdtday", "");
						}
					}
					else
					{
						map.put("hdt", "");
						map.put("hdtday", "");
					}					
				}
			}
			// WHERE 절 생성 끝

			// 조회
			search = agCallStaService.agCallSel(map);	
			
			if(search.size() > 0)
			{
				String settime = ""; // xx:xx ~ xx:xx 최종 시간 변수
				String stime = ""; // db에 들어가 있는 앞시간
				String eetime = ""; // stime 앞시간 + 1시간 24시는 00시로 처리
				String etime = ""; // stime의 뒷시간 60분은 00분으로 처리
				
				String mday = ""; // 월별 2021-11 이런식이면 엑셀 익스포트시 깨짐
				
				for(int i = 0; i < search.size(); i++)
				{
					if(search.get(i).get("STARTTIME") != null && !"".equals(search.get(i).get("STARTTIME")))
					{
						if("5m".equals(params.get("interval")))
						{ 
							stime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":" + search.get(i).get("STARTTIME").toString().substring(2, 4);
							eetime = search.get(i).get("STARTTIME").toString().substring(0, 2);
							etime = search.get(i).get("STARTTIME").toString().substring(2, 4);
								
							if("00".equals(eetime)) { eetime = "01"; }
	        				else if("01".equals(eetime)) { eetime = "02"; }
	        				else if("02".equals(eetime)) { eetime = "03"; }
	        				else if("03".equals(eetime)) { eetime = "04"; }
	        				else if("04".equals(eetime)) { eetime = "05"; }
	        				else if("05".equals(eetime)) { eetime = "06"; }
	        				else if("06".equals(eetime)) { eetime = "07"; }
	        				else if("07".equals(eetime)) { eetime = "08"; }
	        				else if("08".equals(eetime)) { eetime = "09"; }
	        				else if("09".equals(eetime)) { eetime = "10"; }
	        				else if("10".equals(eetime)) { eetime = "11"; }
	        				else if("11".equals(eetime)) { eetime = "12"; }
	        				else if("12".equals(eetime)) { eetime = "13"; }
	        				else if("13".equals(eetime)) { eetime = "14"; }
	        				else if("14".equals(eetime)) { eetime = "15"; }
	        				else if("15".equals(eetime)) { eetime = "16"; }
	        				else if("16".equals(eetime)) { eetime = "17"; }
	        				else if("17".equals(eetime)) { eetime = "18"; }
	        				else if("18".equals(eetime)) { eetime = "19"; }
	        				else if("19".equals(eetime)) { eetime = "20"; }
	        				else if("20".equals(eetime)) { eetime = "21"; }
	        				else if("21".equals(eetime)) { eetime = "22"; }
	        				else if("22".equals(eetime)) { eetime = "23"; }
	        				else if("23".equals(eetime)) { eetime = "00"; }
								
							if("00".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":05"; }
		        			else if("05".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":10"; }
		        			else if("10".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":15"; }
		        			else if("15".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":20"; }
		        			else if("20".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":25"; }
		        			else if("25".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":30"; }
		        			else if("30".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":35"; }
		        			else if("35".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":40"; }
		        			else if("40".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":45"; }
		        			else if("45".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":50"; }
		        			else if("50".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":55"; }
		        			else if("55".equals(etime)) { etime = eetime + ":00"; }
	        				
	        				settime = stime + " ~ " + etime;
							search.get(i).put("STARTTIME", settime); 
						}
						else if("15m".equals(params.get("interval")))
						{ 
							stime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":" + search.get(i).get("STARTTIME").toString().substring(2, 4);
							eetime = search.get(i).get("STARTTIME").toString().substring(0, 2);
							etime = search.get(i).get("STARTTIME").toString().substring(2, 4);
								
							if("00".equals(eetime)) { eetime = "01"; }
	        				else if("01".equals(eetime)) { eetime = "02"; }
	        				else if("02".equals(eetime)) { eetime = "03"; }
	        				else if("03".equals(eetime)) { eetime = "04"; }
	        				else if("04".equals(eetime)) { eetime = "05"; }
	        				else if("05".equals(eetime)) { eetime = "06"; }
	        				else if("06".equals(eetime)) { eetime = "07"; }
	        				else if("07".equals(eetime)) { eetime = "08"; }
	        				else if("08".equals(eetime)) { eetime = "09"; }
	        				else if("09".equals(eetime)) { eetime = "10"; }
	        				else if("10".equals(eetime)) { eetime = "11"; }
	        				else if("11".equals(eetime)) { eetime = "12"; }
	        				else if("12".equals(eetime)) { eetime = "13"; }
	        				else if("13".equals(eetime)) { eetime = "14"; }
	        				else if("14".equals(eetime)) { eetime = "15"; }
	        				else if("15".equals(eetime)) { eetime = "16"; }
	        				else if("16".equals(eetime)) { eetime = "17"; }
	        				else if("17".equals(eetime)) { eetime = "18"; }
	        				else if("18".equals(eetime)) { eetime = "19"; }
	        				else if("19".equals(eetime)) { eetime = "20"; }
	        				else if("20".equals(eetime)) { eetime = "21"; }
	        				else if("21".equals(eetime)) { eetime = "22"; }
	        				else if("22".equals(eetime)) { eetime = "23"; }
	        				else if("23".equals(eetime)) { eetime = "00"; }
	        				
	        				if("00".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":15"; }
	        				else if("15".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":30"; }
	        				else if("30".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":45"; }
	        				else if("45".equals(etime)) { etime = eetime + ":00"; }
	        					
	        				settime = stime + " ~ " + etime;
	        				search.get(i).put("STARTTIME", settime); 
						} 
						else if("30m".equals(params.get("interval"))) 
						{
							stime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":" + search.get(i).get("STARTTIME").toString().substring(2, 4);
							eetime = search.get(i).get("STARTTIME").toString().substring(0, 2);
							etime = search.get(i).get("STARTTIME").toString().substring(2, 4);
								
							if("00".equals(eetime)) { eetime = "01"; }
	        				else if("01".equals(eetime)) { eetime = "02"; }
	        				else if("02".equals(eetime)) { eetime = "03"; }
	        				else if("03".equals(eetime)) { eetime = "04"; }
	        				else if("04".equals(eetime)) { eetime = "05"; }
	        				else if("05".equals(eetime)) { eetime = "06"; }
	        				else if("06".equals(eetime)) { eetime = "07"; }
	        				else if("07".equals(eetime)) { eetime = "08"; }
	        				else if("08".equals(eetime)) { eetime = "09"; }
	        				else if("09".equals(eetime)) { eetime = "10"; }
	        				else if("10".equals(eetime)) { eetime = "11"; }
	        				else if("11".equals(eetime)) { eetime = "12"; }
	        				else if("12".equals(eetime)) { eetime = "13"; }
	        				else if("13".equals(eetime)) { eetime = "14"; }
	        				else if("14".equals(eetime)) { eetime = "15"; }
	        				else if("15".equals(eetime)) { eetime = "16"; }
	        				else if("16".equals(eetime)) { eetime = "17"; }
	        				else if("17".equals(eetime)) { eetime = "18"; }
	        				else if("18".equals(eetime)) { eetime = "19"; }
	        				else if("19".equals(eetime)) { eetime = "20"; }
	        				else if("20".equals(eetime)) { eetime = "21"; }
	        				else if("21".equals(eetime)) { eetime = "22"; }
	        				else if("22".equals(eetime)) { eetime = "23"; }
	        				else if("23".equals(eetime)) { eetime = "00"; }
	        				
							if("00".equals(etime)) { etime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":30"; }
	        				else if("30".equals(etime)) { etime = eetime + ":00"; }
	        					
	        				settime = stime + " ~ " + etime;
	        				search.get(i).put("STARTTIME", settime); 
						}
						else if("1h".equals(params.get("interval"))) 
						{
							stime = search.get(i).get("STARTTIME").toString().substring(0, 2) + ":" + search.get(i).get("STARTTIME").toString().substring(2, 4);
							eetime = search.get(i).get("STARTTIME").toString().substring(0, 2);
							etime = search.get(i).get("STARTTIME").toString().substring(2, 4);
							
							if("00".equals(eetime)) { eetime = "01"; }
        					else if("01".equals(eetime)) { eetime = "02"; }
        					else if("02".equals(eetime)) { eetime = "03"; }
        					else if("03".equals(eetime)) { eetime = "04"; }
        					else if("04".equals(eetime)) { eetime = "05"; }
        					else if("05".equals(eetime)) { eetime = "06"; }
        					else if("06".equals(eetime)) { eetime = "07"; }
        					else if("07".equals(eetime)) { eetime = "08"; }
        					else if("08".equals(eetime)) { eetime = "09"; }
        					else if("09".equals(eetime)) { eetime = "10"; }
        					else if("10".equals(eetime)) { eetime = "11"; }
        					else if("11".equals(eetime)) { eetime = "12"; }
        					else if("12".equals(eetime)) { eetime = "13"; }
        					else if("13".equals(eetime)) { eetime = "14"; }
        					else if("14".equals(eetime)) { eetime = "15"; }
        					else if("15".equals(eetime)) { eetime = "16"; }
        					else if("16".equals(eetime)) { eetime = "17"; }
        					else if("17".equals(eetime)) { eetime = "18"; }
        					else if("18".equals(eetime)) { eetime = "19"; }
        					else if("19".equals(eetime)) { eetime = "20"; }
        					else if("20".equals(eetime)) { eetime = "21"; }
        					else if("21".equals(eetime)) { eetime = "22"; }
        					else if("22".equals(eetime)) { eetime = "23"; }
        					else if("23".equals(eetime)) { eetime = "00"; }
        					
        					etime = eetime + ":" + search.get(i).get("STARTTIME").toString().substring(2, 4);
        					
        					settime = stime + " ~ " + etime;
        					search.get(i).put("STARTTIME", settime); 
						}
					}
					
					if("month".equals(params.get("interval")))
					{
						mday = "'" + search.get(i).get("ROW_DATE").toString();
						
						search.get(i).put("ROW_DATE", mday); 
					}
				}
			}
			
			List<Map<String,Object>> searchsum = agCallStaService.agCallSelSum(map);			
			int searchsumsize = searchsum.size();
			if(searchsumsize > 0)
			{
				search.add(searchsum.get(0));
			}
		}
		return search;
	}	
}

