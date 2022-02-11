package com.soluvis.bake.ivrManagement.controller;

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
import com.soluvis.bake.ivrManagement.domain.ivrEmerMent;
import com.soluvis.bake.ivrManagement.domain.ivrUrlList;
import com.soluvis.bake.ivrManagement.service.ivrEmerMentService;
import com.soluvis.bake.ivrManagement.service.ivrUrlListService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.connTTS.makeSound;

/**
 * @author dskang
 * @desc   ivr 비상멘트 관리페이지 Controller
 */
@Controller
@RequestMapping(value = "/api/ivr/ivrEmerMent")
public class ivrEmerMentController extends commController{

	@Inject
	private ivrEmerMentService ivrEmerMentService;

	@Inject
	private ivrUrlListService ivrUrlListService;

	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);

	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

	MDCLoginUser loginUser;

	/**
	 * @desc 비상멘트 목록을 조회한다
	 */
	@RequestMapping(value="/EmerMentSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrEmerMent> EmerMentSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String,Object> params = RequestUtil.getParameterMap(request);
		List<ivrEmerMent> search = null;

		try
		{
			logger.info("ivrEmerMentService.EmerMentGet Query Start...");
			map.put("sdate", params.get("sdate"));
			map.put("edate", params.get("edate"));
			map.put("ment", params.get("ment"));
			search = ivrEmerMentService.EmerMentGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}

		return search;
	}

	/**
	 * @desc 비상멘트 목록을 수정한다
	 */
	@RequestMapping(value = "/EmerMentSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse EmerMentSave(@Valid @RequestBody List<ivrEmerMent> emerment, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> code = new HashMap<String, Object>();
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
			for (ivrEmerMent em : emerment)
			{
				// 현재 입력 or 수정된 값 //
				map.put("seq", em.getSeq());
				map.put("dnis", em.getDnis());
				map.put("sdate", em.getSdate());
				map.put("stime", em.getStime());
				map.put("edate", em.getEdate());
				map.put("etime", em.getEtime());
				map.put("location", em.getLocation());
				map.put("emer_type", em.getEmer_type());
				map.put("ment", em.getMent());

				if(AXBootTypes.DataStatus.CREATED.equals(em.getDataStatus()))
				{
					// 새로 만들어질 때 작성일자, 작성자  //
					map.put("crt_dt", sdf.format(new Date()));
					map.put("crt_by", cid);

					logger.info("ivrEmerMentService.EmerMentIst Query Start...");
					sqlrst = ivrEmerMentService.EmerMentIst(map);

					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(em.getDataStatus()))
				{
					// 수정될 때 수정일자, 수정자  //
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);

					logger.info("ivrEmerMentService.EmerMentUdt Query Start...");
					sqlrst = ivrEmerMentService.EmerMentUdt(map);

					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(em.getDataStatus()))
				{
					// 삭제될 때 삭제할 번호 //
					map.put("seq", em.getSeq());

					logger.info("ivrEmerMentService.EmerMentDel Query Start...");
					sqlrst = ivrEmerMentService.EmerMentDel(map);

					if(sqlrst == 0)
					{
						result++;
					}
				}
			}

			logger.info("ivrUrlListService.UrlListGet Query Start...");
			Urlsearch = ivrUrlListService.UrlListGet(map);
			int UrlSize = Urlsearch.size();

			code.put("code", "EMER_SYNC");
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
				urlcode = ":18080/infomartConnector/emerMentUpdate";
			}

			if(result == 0)
			{
				for(int i=0; i < UrlSize; i++)
				{
			       try
			       {
			    	   URL obj = new URL(htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
			    	   System.out.println("비상멘트관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);
		    		   logger.info("비상멘트관리Url-->" + htpcode + Urlsearch.get(i).getSvr_ip() + urlcode);

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
				    		   System.out.println("비상멘트관리-->" + line + "===>result-" + rcode);
				    		   logger.info("비상멘트관리-->" + line + "===>result-" + rcode);

				    		   rlt = line;

				    		   jsonObject = new JSONObject(line);
				    	   }
				    	   err = rlt;

				    	   rlt = jsonObject.getString("result");

				    	   System.out.println("비상멘트관리rlt-->" + rlt);
			    		   logger.info("비상멘트관리rlt-->" + rlt);

				    	   System.out.println("비상멘트관리err-->" + err.toString());
			    		   logger.info("비상멘트관리err-->" + err.toString()) ;

				    	   if(rcode == 200)
				    	   {
				    		   if(rlt.length() > 0)
				    		   {
				    			   if("success".equals(rlt) || "SUCCESS".equals(rlt))
//				    			   if("00".equals(rlt))
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
			msg = e.getMessage()+"\n 관리자에게 문의하세요.";
			System.out.println(e.getStackTrace());
			logger.error(e.toString());
		}
		return ok(msg);
	}

	/**
	 * @desc 비상멘트 TTS 미리듣기 연동
	 */
	@RequestMapping(value = "/EmerMentTTS", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse EmerMentTTS(HttpServletRequest request) throws Exception {
		Map<String,Object> params = RequestUtil.getParameterMap(request);

		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, String> ttsMap = new HashMap<String, String>();
		List<ivrEmerMent> search = null;

		String msg = "";
		String seq = "";
		String ment = "";
		String crt_dt = "";
		String upt_dt = "";
		String reqPath = "";
		String filename = "";

		try {
			seq = params.get("seq").toString();
			ment = params.get("ment").toString();
			crt_dt = params.get("crt_dt").toString();
			upt_dt = params.get("upt_dt").toString();
			reqPath = "/gcti/tomcat/webapps/ROOT/assets/sound/gsshop/tts/";
//			reqPath = "D:\\dev\\Repo\\GS\\REAL-GSHome\\src\\main\\webapp\\assets\\sound\\gsshop\\tts\\";

			if(upt_dt != null && !upt_dt.equals("")){
				filename = seq+"_"+upt_dt+".wav";
			}else{
				filename = seq+"_"+crt_dt+".wav";
			}

			logger.info("ivrEmerMentService.EmerMentTTS Query Start...");
			search = ivrEmerMentService.EmerMentTTS(map);

			if(search.size() > 0){
				for (ivrEmerMent forEm : search){
					ttsMap.put(forEm.getCode(), forEm.getName());
				}
			}

			makeSound ms = new makeSound(ttsMap.get("TTS_HOSTP"), Integer.parseInt(ttsMap.get("TTS_PORTP")), "yumi", reqPath, filename);
			int tts_result = ms.makeV(ment);

			if(tts_result == 1){
				msg = "ok P";
			}else{
				ms = new makeSound(ttsMap.get("TTS_HOSTB"), Integer.parseInt(ttsMap.get("TTS_PORTB")), "yumi", reqPath, filename);
				tts_result = ms.makeV(ment);

				if(tts_result == 1){
					msg = "ok B";
				}else{
					msg = "Fail PB";
				}
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			logger.error(e.toString());
			msg = e.getMessage();
		}

		return ok(msg);
	}
}

