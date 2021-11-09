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
import com.soluvis.bake.ivrManagement.domain.ivrBlackList;
import com.soluvis.bake.ivrManagement.domain.ivrUrlList;
import com.soluvis.bake.ivrManagement.service.ivrBlackListService;
import com.soluvis.bake.ivrManagement.service.ivrUrlListService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;

/** 
 * @author gihyunpark
 * @desc   ivr 블랙컨슈머 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrUrlList")
public class ivrGRUrlListController extends commController{
	
	@Inject
	private ivrBlackListService ivrBlackListService;	
	
	@Inject
	private ivrUrlListService ivrUrlListService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc 블랙컨슈머 목록을 조회한다
	 */
	@RequestMapping(value="/BlackListSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrBlackList> BlackListSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<ivrBlackList> search = null;
		
		try
		{	
			map.put("ani", "");
			
			logger.info("ivrBlackListService.BlackListGet Query Start...");			
			search = ivrBlackListService.BlackListGet(map);
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
	@RequestMapping(value = "/BlackListSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse BlackListSave(@Valid @RequestBody List<ivrBlackList> blackLst, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> code = new HashMap<String, Object>();
		List<ivrBlackList> search = null;
		List<ivrUrlList> Urlsearch = null;
		List<ivrUrlList> UrlCodesearch = null;
		
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
			for (ivrBlackList bl : blackLst)
			{
				map.put("ani", bl.getAni());
								
				if(AXBootTypes.DataStatus.CREATED.equals(bl.getDataStatus()))
				{		
					search = ivrBlackListService.BlackListGet(map);
					int searchSize = search.size();
					
					if(searchSize == 0)
					{
						map.put("flag", bl.getFlag());
						map.put("crt_dt", sdf.format(new Date()));
						map.put("crt_by", cid);
						
						logger.info("ivrBlackListService.BlackListIst Query Start...");
						sqlrst = ivrBlackListService.BlackListIst(map);
					}
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(bl.getDataStatus()))
				{
					map.put("flag", bl.getFlag());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrBlackListService.BlackListUdt Query Start...");
					sqlrst = ivrBlackListService.BlackListUdt(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(bl.getDataStatus()))
				{
					logger.info("ivrBlackListService.BlackListDel Query Start...");
					sqlrst = ivrBlackListService.BlackListDel(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}			
			}
		
			logger.info("ivrUrlListService.UrlListGet Query Start...");
			Urlsearch = ivrUrlListService.UrlListGet(map);
			int UrlSize = Urlsearch.size();

			code.put("code", "BLACK_SYNC");
			logger.info("ivrUrlListService.IvrUrlGet Query Start...");
			UrlCodesearch = ivrUrlListService.IvrUrlGet(code);
			
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
				urlcode = ":18080/infomartConnector/blackConsumerUpdate";
			}
			
			if(result == 0)
			{
				for(int i=0; i < UrlSize; i++)
				{				
			       try
			       {
			    	   URL obj = new URL(htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
			    	   System.out.println("블랙컨슈머관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode); 
		    		   logger.info("블랙컨슈머관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
		    		   
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
				    		   System.out.println("블랙컨슈머관리-->" + line + "===>result-" + rcode); 
				    		   logger.info("블랙컨슈머관리-->" + line + "===>result-" + rcode);
				    		   
				    		   rlt = line;
				    		   
				    		   jsonObject = new JSONObject(line);
				    	   }
				    	   err = rlt;			
				    	   
				    	   rlt = jsonObject.getString("result");
				    	   
				    	   System.out.println("블랙컨슈머관리rlt-->" + rlt); 
			    		   logger.info("블랙컨슈머관리rlt-->" + rlt);
			    		   
				    	   System.out.println("블랙컨슈머관리err-->" + err.toString()); 
			    		   logger.info("블랙컨슈머관리err-->" + err.toString()) ;
				    	   
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

