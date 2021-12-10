package com.soluvis.bakeGR.ivrManagement.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRBlackList;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRBlackListService;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRUrlListService;
import com.soluvis.bakeGR.ivrManagement.utils.globalVariables;

/** 
 * @author gihyunpark
 * @desc   ivr 블랙컨슈머 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrBlackList")
public class ivrGRBlackListController extends commController{
	
	@Inject
	private ivrGRBlackListService ivrGRBlackListService;	
	
	@Inject
	private ivrGRUrlListService ivrGRUrlListService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc 블랙컨슈머 목록을 조회한다
	 */
	@RequestMapping(value="/BlackListSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRBlackList> BlackListSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		Map<String,Object> params = RequestUtil.getParameterMap(request);
		List<ivrGRBlackList> search = null;
		
		try
		{	
			
			logger.info("ivrBlackListService.BlackListGet Query Start...");		
			params.put("comp_cd", "RETAIL");
			search = ivrGRBlackListService.BlackListGet(params);
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
    public ApiResponse BlackListSave(@Valid @RequestBody List<ivrGRBlackList> blackLst, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		int result = 0; 
		int sqlrst = 0;
		String msg = "success";
		
		try
		{
			for (ivrGRBlackList bl : blackLst)
			{
				map.put("comp_cd", "RETAIL");
				if(AXBootTypes.DataStatus.CREATED.equals(bl.getDataStatus()))
				{
					map.put("ani", bl.getAni());
					map.put("connid", bl.getConnid());
					map.put("description", bl.getDescription());
					map.put("bl_useyn", bl.getBl_useyn());
					map.put("degree", bl.getDegree());
					map.put("agentid", bl.getAgentid());
					map.put("agentname", bl.getAgentname());
					map.put("crt_dt", sdf.format(new Date()));
					if(cid.equals("") || cid == null)	map.put("crt_by", "IVR");
					else	map.put("crt_by", cid);
					
					
					logger.info("ivrGRBlackListService.BlackListIst Query Start...");
					sqlrst = ivrGRBlackListService.BlackListIst(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(bl.getDataStatus()))
				{
					map.put("seq", bl.getSeq());
					map.put("connid", bl.getConnid());
					map.put("description", bl.getDescription());
					map.put("bl_useyn", bl.getBl_useyn());
					map.put("degree", bl.getDegree());
					map.put("agentid", bl.getAgentid());
					map.put("agentname", bl.getAgentname());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrGRBlackListService.BlackListUdt Query Start...");
					sqlrst = ivrGRBlackListService.BlackListUdt(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(bl.getDataStatus()))
				{
					map.put("seq", bl.getSeq());
					logger.info("ivrGRBlackListService.BlackListDel Query Start...");
					sqlrst = ivrGRBlackListService.BlackListDel(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}			
			}
			if(globalVariables.url_sync_flag == false)
				return ok(msg);	
			
			if(result == 0){
				msg = sendURL(result);
			}else{
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
	 * @desc 블랙컨슈머 목록을 조회한다
	 */
	@RequestMapping(value="/FromIVR", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody int FromIVR(HttpServletRequest request) throws Exception {
		logger.info("#FromIVR Init");
		
		Map<String, Object> map = new HashMap<String, Object>(); 
		Map<String,Object> params = RequestUtil.getParameterMap(request);
		
		int result = 0;
		int sqlrst = 0;
		
//		map.put("ani", bl.getAni());
//		map.put("connid", bl.getConnid());
//		map.put("description", bl.getDescription());
//		map.put("agentid", bl.getAgentid());
		
		params.put("comp_cd", "RETAIL");
		params.put("bl_useyn", "1");
		params.put("degree", "1");
		params.put("crt_dt", sdf.format(new Date()));
		params.put("crt_by", "IVR");
		
		try
		{	
			logger.info("ivrGRBlackListService.BlackListIst Query Start...");
			sqlrst = ivrGRBlackListService.BlackListIst(params);
			
			if(sqlrst == 0){
				result++;
			}
			
			if(globalVariables.url_sync_flag == false)
				return sqlrst;
			
			sendURL(result);
			
			return sqlrst;
		}
		catch(Exception e)
		{
			logger.info("ivrGRBlackListService.BlackListIst Query Start...");
			System.out.println(e.getMessage());
		}
		
		return sqlrst;
	}
	
	
	/** 
	 * @desc IVR 서버로 신호를 전송한다.
	 */
	private String sendURL(int result){
		
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> code = new HashMap<String, Object>();
		List<ivrGRUrlList> Urlsearch = null;
		List<ivrGRUrlList> UrlCodesearch = null;
		BufferedReader in = null;
		StringBuffer msgbf = new StringBuffer(1024);		
		String msg = "success";
		
		map.put("comp_cd", "RETAIL");
		
		logger.info("ivrGRUrlListService.UrlListGet Query Start...");
		Urlsearch = ivrGRUrlListService.UrlListGet(map);
		int UrlSize = Urlsearch.size();

		code.put("code", "BLACK_SYNC");
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
			urlcode = ":18080/GSConnector/retail/blackConsumerUpdate";
		}
		
		if(result == 0)
		{
			for(int i=0; i < UrlSize; i++)
			{				
		       try
		       {
		    	   URL obj = new URL(htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
		    	   System.out.println("Retail 이슈고객관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode); 
	    		   logger.info("Retail 이슈고객관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
	    		   
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
			    		   System.out.println("Retail 이슈고객관리-->" + line + "===>result-" + rcode); 
			    		   logger.info("Retail 이슈고객관리-->" + line + "===>result-" + rcode);
			    		   
			    		   rlt = line;
			    		   
			    		   jsonObject = new JSONObject(line);
			    	   }
			    	   err = rlt;			
			    	   
			    	   rlt = jsonObject.getString("result");
			    	   
			    	   System.out.println("Retail 이슈고객관리rlt-->" + rlt); 
		    		   logger.info("Retail 이슈고객관리rlt-->" + rlt);
		    		   
			    	   System.out.println("Retail 이슈고객관리err-->" + err.toString()); 
		    		   logger.info("Retail 이슈고객관리err-->" + err.toString()) ;
			    	   
			    	   if(rcode == 200)
			    	   {
			    		   if(rlt.length() > 0)
			    		   {
			    			   if("success".equals(rlt) || "SUCCESS".equals(rlt))
//			    			   if("00".equals(rlt))
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
		
		return msg;
	}
	
	/** 
	 * @desc 블랙컨슈머 목록을 조회한다
	 */
	@RequestMapping(value="/RecUrlSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRBlackList> RecUrlSearch(HttpServletRequest request) throws Exception {
		
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRBlackList> search = null;
		List<ivrGRBlackList> recList = new ArrayList<ivrGRBlackList>();
		
		try {
			logger.info("ivrGRBlackListService.RecGet Query Start...");
			search = ivrGRBlackListService.RecGet(map);
			
			int searchSize = search.size();
			if(searchSize > 0 && searchSize < 2){
				for (ivrGRBlackList forEm : search){
					recList.add(forEm);
				}
			}else{
				ivrGRBlackList elist = new ivrGRBlackList();
				elist.setCode("HOSTP");
				elist.setName("https://devrecm.gsts.kr");
				recList.add(elist);
			}
		} catch (Exception e) {
			logger.info("ivrGRBlackListService.RecGet Query Fail..." + e.getMessage());
			ivrGRBlackList elist = new ivrGRBlackList();
			elist.setCode("HOSTP");
			elist.setName("https://devrecm.gsts.kr");
			recList.add(elist);
		}
		
		return recList;
		
	}
}

