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
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRHoliday;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRHolidayService;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRUrlListService;
import com.soluvis.bakeGR.ivrManagement.utils.globalVariables;

/** 
 * @author gihyunpark
 * @desc   ivr 블랙컨슈머 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrHoliday")
public class ivrGRHolidayController extends commController{
	
	@Inject
	private ivrGRHolidayService ivrGRHolidayService;	
	
	@Inject
	private ivrGRUrlListService ivrGRUrlListService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc 블랙컨슈머 목록을 조회한다
	 */
	@RequestMapping(value="/HolidaySearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRHoliday> HolidaySearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<ivrGRHoliday> search = null;
		
		try
		{
			map.put("holiday", "");
			
			logger.info("ivrGRHolidayService.HolidayGet Query Start...");			
			search = ivrGRHolidayService.HolidayGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
	
	/** 
	 * @desc 블랙컨슈머 목록을 수정한다
	 */
	@RequestMapping(value = "/HolidaySave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse HolidaySave(@Valid @RequestBody List<ivrGRHoliday> hlLst, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> code = new HashMap<String, Object>();
		List<ivrGRHoliday> search = null;
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
			for (ivrGRHoliday hl : hlLst)
			{
				map.put("holiday", hl.getHoliday());
								
				if(AXBootTypes.DataStatus.CREATED.equals(hl.getDataStatus()))
				{		
					search = ivrGRHolidayService.HolidayGet(map);
					int searchSize = search.size();
					
					if(searchSize == 0)
					{
						map.put("hl_useyn", hl.getHl_useyn());
						map.put("description", hl.getDescription());
						map.put("crt_dt", sdf.format(new Date()));
						map.put("crt_by", cid);
						
						logger.info("ivrGRHolidayService.HolidayIst Query Start...");
						sqlrst = ivrGRHolidayService.HolidayIst(map);
					}
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(hl.getDataStatus()))
				{
					map.put("hl_useyn", hl.getHl_useyn());
					map.put("description", hl.getDescription());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrGRHolidayService.HolidayUdt Query Start...");
					sqlrst = ivrGRHolidayService.HolidayUdt(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(hl.getDataStatus()))
				{
					logger.info("ivrGRHolidayService.HolidayDel Query Start...");
					sqlrst = ivrGRHolidayService.HolidayDel(map);
					
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

			code.put("code", "HOLIDAY_SYNC");
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
				urlcode = ":18080/GRConnector/holidayUpdate";
			}
			
			if(result == 0)
			{
				for(int i=0; i < UrlSize; i++)
				{				
			       try
			       {
			    	   URL obj = new URL(htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
			    	   System.out.println("GR 휴일관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode); 
		    		   logger.info("GR 휴일관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
		    		   
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
				    		   System.out.println("GR 휴일관리-->" + line + "===>result-" + rcode); 
				    		   logger.info("GR 휴일관리-->" + line + "===>result-" + rcode);
				    		   
				    		   rlt = line;
				    		   
				    		   jsonObject = new JSONObject(line);
				    	   }
				    	   err = rlt;			
				    	   
				    	   rlt = jsonObject.getString("result");
				    	   
				    	   System.out.println("GR 휴일관리rlt-->" + rlt); 
			    		   logger.info("GR 휴일관리rlt-->" + rlt);
			    		   
				    	   System.out.println("GR 휴일관리err-->" + err.toString()); 
			    		   logger.info("GR 휴일관리err-->" + err.toString()) ;
				    	   
				    	   if(rcode == 200)
				    	   {
				    		   if(rlt.length() > 0)
				    		   {
				    			   //if("success".equals(rlt) || "SUCCESS".equals(rlt))
				    			   if("00".equals(rlt))
				    			   {
				    				   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 정상\n");
				    			   }
				    			   else
				    			   {
				    				   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패 (" + err.substring(0, 30) + ")\n");
				    			   }				    			   
				    		   }
				    		   else
				    		   {
				    			   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패 (in.readLine() is null)\n");
				    		   }				    		   
				    	   }
				    	   else
				    	   {
				    		   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패 (" + err.substring(0, 30) + ")\n");
				    	   }			
			    	   }
			    	   if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
			       }
			       catch(Exception e)
			       { 
			    	   System.out.println(e);
			    	   //e.printStackTrace();
			    	   logger.error(e.toString());
			    	   
			    	   msgbf.append(Urlsearch.get(i).getUrl_nm() + "(" + Urlsearch.get(i).getSvr_ip() + ") - 실패 (" + e.toString().substring(0, 30) + ")\n");
			       }
				}
				msgbf.append("*실패 된 사항은 확인해주시기 바랍니다.");
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

