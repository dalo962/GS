package com.soluvis.bakeGR.ivrManagement.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.json.JSONObject;
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
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDnisTimeList;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRDnisTimeListService;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRUrlListService;
import com.soluvis.bakeGR.ivrManagement.utils.globalVariables;


/** 
 * @author gihyunpark
 * @desc   ivr 근무시간 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrDnisTimeList")
public class ivrGRDnisTimeListController extends commController{
	
	@Inject
	private ivrGRDnisTimeListService ivrGRDnisListService;

	@Inject
	private ivrGRUrlListService ivrGRUrlListService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc DNIS 근무시간 목록을 조회한다
	 */
	@RequestMapping(value="/DnisListSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRDnisTimeList> DnisListSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<ivrGRDnisTimeList> search = null;
		
		try
		{	
			map.put("dnis", "");
			map.put("delchk", "1");
			map.put("comp_cd", "RETAIL");
			
			logger.info("ivrGRDnisListService.DnisListGet Query Start...");	
			search = ivrGRDnisListService.DnisListGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
	
	/** 
	 * @desc DNIS 근무시간 목록을 수정한다
	 */
	@RequestMapping(value = "/DnisListSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse DnisListSave(@Valid @RequestBody List<ivrGRDnisTimeList> dtLst, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> code = new HashMap<String, Object>();
		List<ivrGRDnisTimeList> search = null;
		List<ivrGRUrlList> Urlsearch = null;
		List<ivrGRUrlList> UrlCodesearch = null;
		
		BufferedReader in = null;
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		int result = 0; 
		int sqlrst = 0;
		String msg = "success";
		StringBuffer msgbf = new StringBuffer(1024);
		msgbf.append("*동기화 결과\n");
		
		try
		{							
			for (ivrGRDnisTimeList dtl : dtLst)
			{
				map.put("dnis", dtl.getDnis());
				map.put("comp_cd", "RETAIL");
								
				// 평일근무시작시간
				if("".equals(dtl.getWr_stime()) || dtl.getWr_stime() == null)
				{
					map.put("wr_stime", "000000");
				}
				else
				{
					map.put("wr_stime", dtl.getWr_stime().replace(":", ""));
				}
				// 평일근무종료시간
				if("".equals(dtl.getWr_etime()) || dtl.getWr_etime() == null)
				{
					map.put("wr_etime", "000000");
				}
				else
				{
					map.put("wr_etime", dtl.getWr_etime().replace(":", ""));
				}
				
				// 점심시작시간
				if("".equals(dtl.getLc_stime()) || dtl.getLc_stime() == null)
				{
					map.put("lc_stime", "000000");
				}
				else
				{
					map.put("lc_stime", dtl.getLc_stime().replace(":", ""));
				}
				// 점심종료시간
				if("".equals(dtl.getLc_etime()) || dtl.getLc_etime() == null)
				{
					map.put("lc_etime", "000000");
				}
				else
				{
					map.put("lc_etime", dtl.getLc_etime().replace(":", ""));
				}
				
				// 토요일근무시작시간
				if("".equals(dtl.getSat_stime()) || dtl.getSat_stime() == null)
				{
					map.put("sat_stime", "000000");
				}
				else
				{
					map.put("sat_stime", dtl.getSat_stime().replace(":", ""));
				}
				// 토요일근무종료시간
				if("".equals(dtl.getSat_etime()) || dtl.getSat_etime() == null)
				{
					map.put("sat_etime", "000000");
				}
				else
				{
					map.put("sat_etime", dtl.getSat_etime().replace(":", ""));
				}
				
				// 일요일근무시작시간
				if("".equals(dtl.getSun_stime()) || dtl.getSun_stime() == null)
				{
					map.put("sun_stime", "000000");
				}
				else
				{
					map.put("sun_stime", dtl.getSun_stime().replace(":", ""));
				}
				// 일요일근무종료시간
				if("".equals(dtl.getSun_etime()) || dtl.getSun_etime() == null)
				{
					map.put("sun_etime", "000000");
				}
				else
				{
					map.put("sun_etime", dtl.getSun_etime().replace(":", ""));
				}
				
				// 휴일근무시작시간
				if("".equals(dtl.getHl_stime()) || dtl.getHl_stime() == null)
				{
					map.put("hl_stime", "000000");
				}
				else
				{
					map.put("hl_stime", dtl.getHl_stime().replace(":", ""));
				}				
				// 휴일근무종료시간
				if("".equals(dtl.getHl_etime()) || dtl.getHl_etime() == null)
				{
					map.put("hl_etime", "000000");
				}
				else
				{
					map.put("hl_etime", dtl.getHl_etime().replace(":", ""));
				}
				
				// 초과근무종료시간
				if("".equals(dtl.getOv_stime()) || dtl.getOv_stime() == null)
				{
					map.put("ov_stime", "000000");
				}
				else
				{
					map.put("ov_stime", dtl.getOv_stime().replace(":", ""));
				}
				// 초과근무종료시간
				if("".equals(dtl.getOv_etime()) || dtl.getOv_etime() == null)
				{
					map.put("ov_etime", "000000");
				}
				else
				{
					map.put("ov_etime", dtl.getOv_etime().replace(":", ""));
				}
				
				if(AXBootTypes.DataStatus.CREATED.equals(dtl.getDataStatus()))
				{		
					map.put("delchk", "0");
					search = ivrGRDnisListService.DnisListGet(map);
					int searchSize = search.size();
					
					if(searchSize == 0)
					{
						map.put("useyn", dtl.getUseyn());
						map.put("lc_useyn", dtl.getLc_useyn());
						map.put("hl_useyn", dtl.getHl_useyn());
						map.put("ov_useyn", dtl.getOv_useyn());		
						map.put("crt_dt", sdf.format(new Date()));
						map.put("crt_by", cid);
						
						logger.info("ivrGRDnisListService.DnisListIst Query Start...");
						sqlrst = ivrGRDnisListService.DnisListIst(map);
					}
					else
					{
						logger.info("ivrGRDnisListService.DnisListDelUdt Query Start...");
						sqlrst = ivrGRDnisListService.DnisListDelUdt(map);
					}					
					
					if(sqlrst == 0)
					{
						result++;
					}
					
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(dtl.getDataStatus()))
				{
					map.put("useyn", dtl.getUseyn());
					map.put("lc_useyn", dtl.getLc_useyn());
					map.put("hl_useyn", dtl.getHl_useyn());
					map.put("ov_useyn", dtl.getOv_useyn());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrGRDnisListService.DnisListUdt Query Start...");
					sqlrst = ivrGRDnisListService.DnisListUdt(map);		
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(dtl.getDataStatus()))
				{
					logger.info("ivrGRDnisListService.DnisListDel Query Start...");
					sqlrst = ivrGRDnisListService.DnisListDel(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}			
			}
			
			if(globalVariables.url_sync_flag == false)
				return ok(msg);	
						
			logger.info("ivrGRUrlListService.UrlListGet Query Start...");
			Urlsearch = ivrGRUrlListService.UrlListGet(map);
			int UrlSize = Urlsearch.size();

			code.put("code", "WORK_SYNC");
			logger.info("ivrGRUrlListService.IvrUrlGet Query Start...");
			UrlCodesearch = ivrGRUrlListService.IvrUrlGet(code);
			
			int UrlCodeSize = UrlCodesearch.size();
			String htpcode = "";
			String urlcode = "";
			
			if(UrlCodeSize > 0 && UrlCodeSize < 2)
			{
				htpcode = UrlCodesearch.get(0).getRemark();
				urlcode = UrlCodesearch.get(0).getUrl();
			}
			else
			{
				htpcode = "http://";
				urlcode = ":18080/GRConnector/workTimeUpdate";
			}
			
			if(result == 0)
			{
				for(int i=0; i < UrlSize; i++)
				{				
			       try
			       {
			    	   URL obj = new URL(htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
			    	   System.out.println("GR 근무시간관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode); 
		    		   logger.info("GR 근무시간관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
		    		   
			    	   HttpURLConnection con = (HttpURLConnection)obj.openConnection(); 

			    	   con.setRequestMethod("GET");
			    	   con.setReadTimeout(30000);

			    	   in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

			    	   if(in != null)
			    	   {
				    	   String line;
				    	   String err;
				    	  
				    	   String rlt = null;
				    	   int rcode  = con.getResponseCode();

				    	   JSONObject jsonObject = null;
				    	   
				    	   while((line = in.readLine()) != null)
				    	   {
				    		   System.out.println("GR 근무시간관리-->" + line + "===>result-" + rcode); 
				    		   logger.info("GR 근무시간관리-->" + line + "===>result-" + rcode);
				    		   
				    		   rlt = line;
				    		   
				    		   jsonObject = new JSONObject(line);
				    	   }
				    	   err = rlt;			
				    	   
				    	   rlt = jsonObject.getString("result");
				    	   
				    	   System.out.println("GR 근무시간관리rlt-->" + rlt); 
			    		   logger.info("GR 근무시간관리rlt-->" + rlt);
			    		   
				    	   System.out.println("GR 근무시간관리err-->" + err.toString()); 
			    		   logger.info("GR 근무시간관리err-->" + err.toString()) ;
				    	   
				    	   if(rcode == 200)
				    	   {
				    		   if(rlt.length() > 0)
				    		   {
				    			   if("success".equals(rlt) || "SUCCESS".equals(rlt))
				    			   {
				    				   map.put("file_rst", "정상");
						    		   map.put("url_nm", Urlsearch.get(i).getUrl_nm());
						    		   map.put("svr_ip", Urlsearch.get(i).getSvr_ip());				    		  
						    		   ivrGRUrlListService.UrlFileUdt(map);
						    		   
						    		   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 정상\n");
				    			   }
				    			   else
				    			   {
				    				   map.put("file_rst", err.substring(0, 30));
						    		   map.put("url_nm", Urlsearch.get(i).getUrl_nm());
						    		   map.put("svr_ip", Urlsearch.get(i).getSvr_ip());
						    		   ivrGRUrlListService.UrlFileUdt(map);			    	
						    		   
						    		   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패\n");
				    			   }				    			   
				    		   }
				    		   else
				    		   {
				    			   map.put("file_rst", "in.readLine() is null");
					    		   map.put("url_nm", Urlsearch.get(i).getUrl_nm());
					    		   map.put("svr_ip", Urlsearch.get(i).getSvr_ip());
					    		   ivrGRUrlListService.UrlFileUdt(map);			    	
					    		   
					    		   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패\n");
				    		   }				    		   
				    	   }
				    	   else
				    	   {
				    		   map.put("file_rst", err.substring(0, 30));
				    		   map.put("url_nm", Urlsearch.get(i).getUrl_nm());
				    		   map.put("svr_ip", Urlsearch.get(i).getSvr_ip());
				    		   ivrGRUrlListService.UrlFileUdt(map);			    	
				    		   
				    		   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패\n");
				    	   }			
			    	   }
			    	   if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
			       }
			       catch(Exception e)
			       { 
			    	   System.out.println(e);
			    	   //e.printStackTrace();
			    	   logger.error(e.toString());
			    	   
			    	   map.put("file_rst", e.toString().substring(0, 30));
		    		   map.put("url_nm", Urlsearch.get(i).getUrl_nm());
		    		   map.put("svr_ip", Urlsearch.get(i).getSvr_ip());
		    		   ivrGRUrlListService.UrlFileUdt(map);
		    		   
		    		   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패\n");
			       }
				}
				msgbf.append("*실패 된 사항은 URL관리 화면에서 확인해주시기 바랍니다.");
				msg = msgbf.toString();
			}
			else
			{
				msg = "DB 처리 중 오류가 발생하였습니다.\n 관리자에게 문의하세요.";
			}
		}
		catch(Exception e)
		{
			System.out.println(e.getStackTrace());
			logger.error(e.toString());
		}
		
		return ok(msg);
	}				
}

