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
import com.soluvis.bakeGR.ivrManagement.domain.ivrGREmerMent;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;
import com.soluvis.bakeGR.ivrManagement.service.ivrGREmerMentService;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRUrlListService;
import com.soluvis.bakeGR.ivrManagement.utils.globalVariables;
import com.soluvis.connTTS.makeSound;

/** 
 * @author gihyunpark
 * @desc   ivr 블랙컨슈머 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrEmerMent")
public class ivrGREmerMentController extends commController{
	
	@Inject
	private ivrGREmerMentService ivrGREmerMentService;	
	
	@Inject
	private ivrGRUrlListService ivrGRUrlListService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc 블랙컨슈머 목록을 조회한다
	 */
	@RequestMapping(value="/EmerMentSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGREmerMent> EmerMentSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<ivrGREmerMent> search = null;
		
		try
		{	
			logger.info("ivrGREmerMentService.EmerMentGet Query Start...");			
			search = ivrGREmerMentService.EmerMentGet(map);
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
	@RequestMapping(value = "/EmerMentSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse EmerMentSave(@Valid @RequestBody List<ivrGREmerMent> emerment, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> code = new HashMap<String, Object>();
		List<ivrGREmerMent> search = null;
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
			for (ivrGREmerMent em : emerment)
			{
				map.put("dnis", em.getDnis());
				map.put("sdate", em.getSdate());
				map.put("stime", em.getStime());
				map.put("edate", em.getEdate());
				map.put("etime", em.getEtime());
								
				if(AXBootTypes.DataStatus.CREATED.equals(em.getDataStatus()))
				{		
					logger.info("ivrGREmerMentService.EmerMentExist Query Start...");
					search = ivrGREmerMentService.EmerMentExist(map);
					int searchSize = search.size();
					
					if(searchSize == 0)
					{						
						map.put("va_yn", em.getVa_yn());
						map.put("ment", em.getMent());
						map.put("crt_dt", sdf.format(new Date()));
						map.put("crt_by", cid);
						
						logger.info("ivrGREmerMentService.EmerMentIst Query Start...");
						sqlrst = ivrGREmerMentService.EmerMentIst(map);
					}else{
						msg = "중복되는 기간이 있습니다. 기간을 확인해주세요.";
						return ok(msg);
					}
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(em.getDataStatus()))
				{
					map.put("seq", em.getSeq());
					map.put("dnis", em.getDnis());
					map.put("sdate", em.getSdate());
					map.put("stime", em.getStime());
					map.put("edate", em.getEdate());
					map.put("etime", em.getEtime());
					map.put("va_yn", em.getVa_yn());
					map.put("ment", em.getMent());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
					
					logger.info("ivrGREmerMentService.EmerMentExist Query Start...");
					search = ivrGREmerMentService.EmerMentExist(map);
					
					int searchSize = search.size();
					
					if(searchSize == 0){
						logger.info("ivrGREmerMentService.EmerMentUdt Query Start...");
						sqlrst = ivrGREmerMentService.EmerMentUdt(map);
						
						if(sqlrst == 0)
						{
							result++;
						}
					}else{
						msg = "중복되는 기간이 있습니다. 기간을 확인해주세요.";
						return ok(msg);
					}					
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(em.getDataStatus()))
				{
					map.put("seq", em.getSeq());
					
					logger.info("ivrGREmerMentService.EmerMentDel Query Start...");
					sqlrst = ivrGREmerMentService.EmerMentDel(map);
					
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

			code.put("code", "EMERMENT_SYNC");
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
				urlcode = ":18080/GRConnector/emerMentUpdate";
			}
			
			if(result == 0)
			{
				for(int i=0; i < UrlSize; i++)
				{				
			       try
			       {
			    	   URL obj = new URL(htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
			    	   System.out.println("GR 비상멘트관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode); 
		    		   logger.info("GR 비상멘트관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
		    		   
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
				    		   System.out.println("GR 비상멘트관리-->" + line + "===>result-" + rcode); 
				    		   logger.info("GR 비상멘트관리-->" + line + "===>result-" + rcode);
				    		   
				    		   rlt = line;
				    		   
				    		   jsonObject = new JSONObject(line);
				    	   }
				    	   err = rlt;			
				    	   
				    	   rlt = jsonObject.getString("result");
				    	   
				    	   System.out.println("GR 비상멘트관리rlt-->" + rlt); 
			    		   logger.info("GR 비상멘트관리rlt-->" + rlt);
			    		   
				    	   System.out.println("GR 비상멘트관리err-->" + err.toString()); 
			    		   logger.info("GR 비상멘트관리err-->" + err.toString()) ;
				    	   
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
	
	/** 
	 * @desc 블랙컨슈머 목록을 수정한다
	 */
	@RequestMapping(value = "/EmerMentTTS", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse EmerMentTTS(@Valid @RequestBody List<ivrGREmerMent> emerment, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, String> ttsMap = new HashMap<String, String>();
		List<ivrGREmerMent> search = null;
		System.out.println("들어왔다.");
		String ment = "";
		try {
			if(emerment.size() > 0){
				ivrGREmerMent em = emerment.get(0);
				ment = em.getMent();
				
				logger.info("ivrGREmerMentService.EmerMentTTS Query Start...");
				search = ivrGREmerMentService.EmerMentTTS(map);
				
				if(search.size() > 0){
					for (ivrGREmerMent forEm : search){
						ttsMap.put(forEm.getCode(), forEm.getName());
					}				
				}
				makeSound ms = new makeSound(ttsMap.get("TTS_HOSTP"), Integer.parseInt(ttsMap.get("TTS_PORTP")), "yumi");
				int tts_result = ms.makeV(ment);
				
				if(tts_result == 1){
					return ok("ok P");
				}else{
					ms = new makeSound(ttsMap.get("TTS_HOSTB"), Integer.parseInt(ttsMap.get("TTS_PORTB")), "yumi");
					tts_result = ms.makeV(ment);
					if(tts_result == 1){
						return ok("ok B");
					}else{
						return ok("Fail PB");
					}
				}
			}else{
				return ok("ok");
			}
		} catch (Exception e) {
			System.out.println(e.getStackTrace());
			logger.error(e.toString());
		}
		
		return ok("ok");
	}
}

