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
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRUrlListService;
import com.soluvis.bakeGR.ivrManagement.utils.globalVariables;

/** 
 * @author gihyunpark
 * @desc   ivr URL 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrUrlList")
public class ivrGRUrlListController extends commController{
	
	@Inject
	private ivrGRUrlListService ivrGRUrlListService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc URL 목록을 조회한다
	 */
	@RequestMapping(value="/UrlListSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRUrlList> UrlListSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		Map<String,Object> params = RequestUtil.getParameterMap(request);
		List<ivrGRUrlList> search = null;
		
		try
		{	
			logger.info("ivrGRUrlListService.UrlListGet Query Start...");
			map.put("comp_cd", params.get("comp_cd"));
			search = ivrGRUrlListService.UrlListGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
	
	/** 
	 * @desc URL 목록을 수정한다
	 */
	@RequestMapping(value = "/UrlListSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse UrlListSave(@Valid @RequestBody List<ivrGRUrlList> urlLst, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRUrlList> search = null;
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		try
		{
			for (ivrGRUrlList ul : urlLst)
			{
				if(!"".equals(ul.getComp_cd()) && null != ul.getComp_cd())
				{
					map.put("comp_cd", ul.getComp_cd());
				}
				else
				{
					map.put("comp_cd", "RETAIL");
				}
				
				map.put("url_nm", ul.getUrl_nm());
								
				if(AXBootTypes.DataStatus.CREATED.equals(ul.getDataStatus()))
				{		
					search = ivrGRUrlListService.UrlListGet(map);
					int searchSize = search.size();
					
					if(searchSize == 0)
					{
						map.put("svr_ip", ul.getSvr_ip());
						map.put("crt_dt", sdf.format(new Date()));
						map.put("crt_by", cid);
						
						logger.info("ivrGRUrlListService.UrlListIst Query Start...");
						ivrGRUrlListService.UrlListIst(map);
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(ul.getDataStatus()))
				{
					map.put("svr_ip", ul.getSvr_ip());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrGRUrlListService.UrlListUdt Query Start...");
					ivrGRUrlListService.UrlListUdt(map);					
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(ul.getDataStatus()))
				{
					logger.info("ivrGRUrlListService.UrlListDel Query Start...");
					ivrGRUrlListService.UrlListDel(map);
				}			
			}
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		return ok();		
	}
	
	
	
	/** 
	 * @desc 파일 동기화
	 */
	@RequestMapping(value = "/UrlFileSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse UrlFileSave(@Valid @RequestBody List<ivrGRUrlList> dtLst, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>(); 
		Map<String, Object> code = new HashMap<String, Object>();
		List<ivrGRUrlList> UrlCodesearch = null;
		
		BufferedReader in = null;
		
		String msg = "success";
		StringBuffer msgbf = new StringBuffer(1024);
		msgbf.append("*동기화 결과\n");
		
		if(globalVariables.url_sync_flag == false)
			return ok(msg);	
		
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
			urlcode = ":18080/GSConnector/retail/workTimeUpdate";
		}
				
		try
		{							
			for (ivrGRUrlList dtl : dtLst)
			{
				try
				{
					URL obj = new URL(htpcode + dtl.getSvr_ip() + urlcode);
					System.out.println("Retail URL관리Url-->" + htpcode + dtl.getSvr_ip() + urlcode); 
		    		logger.info("Retail URL관리Url-->" + htpcode + dtl.getSvr_ip() + urlcode);
		    		   
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
							System.out.println("Retail URL관리-->" + line + "===>result-" + rcode);
							logger.info("Retail URL관리-->" + line + "===>result-" + rcode);
							
							rlt = line;
							
							jsonObject = new JSONObject(line);
						}
						err = rlt;			
				    	   
						rlt = jsonObject.getString("result");
				    	   
						System.out.println("Retail URL관리rlt-->" + rlt); 
			    		logger.info("Retail URL관리rlt-->" + rlt);
			    		   
				    	System.out.println("Retail URL관리err-->" + err.toString()); 
			    		logger.info("Retail URL관리err-->" + err.toString()) ;
			    		   
					 	if(rcode == 200)
					 	{
					 		if(rlt.length() > 0)
					 		{
					 			if("success".equals(rlt) || "SUCCESS".equals(rlt))
					 			{
					 				map.put("file_rst", "정상");
							 		map.put("url_nm", dtl.getUrl_nm());
							 		map.put("svr_ip", dtl.getSvr_ip());
							 		ivrGRUrlListService.UrlFileUdt(map);
							 		
							 		msgbf.append(dtl.getUrl_nm() + "(" + dtl.getSvr_ip() + ") - 정상\n");
					 			}
					 			else
					 			{
					 				map.put("file_rst", err.substring(0, 30));
							 		map.put("url_nm", dtl.getUrl_nm());
							 		map.put("svr_ip", dtl.getSvr_ip());
							 		ivrGRUrlListService.UrlFileUdt(map);
							 		
							 		msgbf.append(dtl.getUrl_nm() + "(" + dtl.getSvr_ip() + ") - 실패\n");
					 			}
					 		}
					 		else
					 		{
					 			map.put("file_rst", "in.readLine() is null");
						 		map.put("url_nm", dtl.getUrl_nm());
						 		map.put("svr_ip", dtl.getSvr_ip());
						 		ivrGRUrlListService.UrlFileUdt(map);
						 		
						 		msgbf.append(dtl.getUrl_nm() + "(" + dtl.getSvr_ip() + ") - 실패\n");
					 		}
					 	}
					 	else
					 	{
					 		map.put("file_rst", err.substring(0, 30));
					 		map.put("url_nm", dtl.getUrl_nm());
					 		map.put("svr_ip", dtl.getSvr_ip());
					 		ivrGRUrlListService.UrlFileUdt(map);
					 		
					 		msgbf.append(dtl.getUrl_nm() + "(" + dtl.getSvr_ip() + ") - 실패\n");
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
			    	map.put("url_nm", dtl.getUrl_nm());
			    	map.put("svr_ip", dtl.getSvr_ip());
			    	ivrGRUrlListService.UrlFileUdt(map);
			    	
			    	msgbf.append(dtl.getUrl_nm() + "(" + dtl.getSvr_ip() + ") - 실패\n");
			    }
			}
			msgbf.append("*실패 된 사항은 확인해주시기 바랍니다.");
			msg = msgbf.toString();			
		}
		catch(Exception e)
		{
			System.out.println(e.getStackTrace());
			logger.error(e.toString());
		}
		
		return ok(msg);
	}
}

