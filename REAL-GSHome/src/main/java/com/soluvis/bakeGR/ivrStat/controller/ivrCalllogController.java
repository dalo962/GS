package com.soluvis.bakeGR.ivrStat.controller;

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
import com.soluvis.bakeGR.ivrStat.service.ivrCalllogService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;

/** 
 * @author yejinlee
 * @desc   ivr 콜로그를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrCalllog")
public class ivrCalllogController extends commController{
	
	@Inject
	private ivrCalllogService ivrCalllogService; 
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc ivr 콜로그를 조회한다
	 */
	@RequestMapping(value="/calllogSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String, Object>> CalllogListSearch(HttpServletRequest request) throws Exception {
		
		Map<String,Object> params = RequestUtil.getParameterMap(request);	
		Map<String, Object> map = new HashMap<String, Object>();
		List<Map<String,Object>> search = null;
		
		try
		{	
			// searchView에서 입력받은 날짜, 시간
			map.put("startdate", params.get("startdate"));
			map.put("enddate", params.get("enddate"));
			map.put("starttime", params.get("starttime"));
			map.put("endtime", params.get("endtime"));
			
			// 대표번호 구분
			String did = params.get("did").toString();
			if(!did.equals("ALL") && !did.equals("")) {
				map.put("did", did);
			} else {
				map.put("did", "");
			}
			
			// 고객번호 구분
			if(params.get("ani") != null && !params.get("ani").equals("")) {
				StringBuffer anistr = new StringBuffer(512);
				String[] ani = {};
				
				ani = params.get("ani").toString().replace("-", "").split(";");
				int lastLength = ani.length;
				for(int i = 0; i < lastLength; i++) {
					anistr.append("'" + ani[i] + "',");
				}
				map.put("ani", anistr.toString().substring(0, anistr.toString().length() - 1));
			}
			
			logger.info("ivrCalllogService.CalllogGet Query Start...");			
			search = ivrCalllogService.CalllogGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
}

