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
import com.soluvis.bakeGR.ivrStat.service.ivrServiceStatService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;

/** 
 * @author yejinlee
 * @desc   ivr 서비스 통계 리스트를 조회한다.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrServiceStat")
public class ivrServiceStatController extends commController{
	
	@Inject
	private ivrServiceStatService ivrServiceStatService; 
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
		
	/** 
	 * @desc ivr 서비스 통계 목록을 조회한다
	 */
	@RequestMapping(value="/serviceStatListSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String, Object>> ServiceStatListSearch(HttpServletRequest request) throws Exception {
		
		Map<String,Object> params = RequestUtil.getParameterMap(request);	
		Map<String, Object> map = new HashMap<String, Object>();
		List<Map<String,Object>> search = null;
		
		try
		{	
			String table = "";
			
			// searchView에서 입력받은 날짜, 시간
			map.put("startdate", params.get("startdate"));
			map.put("enddate", params.get("enddate"));
			map.put("starttime", params.get("starttime"));
			map.put("endtime", params.get("endtime"));
			map.put("interval", params.get("interval"));

			// 센터 구분
			String comp_cd = params.get("comp_cd").toString();
			if(!comp_cd.equals("")) {
				map.put("comp_cd", comp_cd);
			} else {
				map.put("comp_cd", "");
			}
			
			// 대표번호 구분
			String did = params.get("did").toString();
			if(!did.equals("ALL") && !did.equals("")) {
				map.put("did", did);
			} else {
				map.put("did", "");
			}
			
			// 테이블명
			switch(params.get("interval").toString()) {
				case "5m":
					table = "gsivr.ARS_SERVICE_NA";
					break;
				case "15m":
					table = "gsivr.ARS_SERVICE_FT";
					break;
				case "1h":
					table = "gsivr.ARS_SERVICE_HR";
					break;
				case "day":
					table = "gsivr.ARS_SERVICE_DY";
					break;
				case "month":
					table = "gsivr.ARS_SERVICE_MN";
			}
			
			map.put("table", table);

			logger.info("ivrServiceStatService.ServiceStatGet Query Start...");			
			search = ivrServiceStatService.ServiceStatGet(map);


			// 시간 처리 ( 00:00 ~ 00:05 )
			if(search.size() > 0)
			{
				String settime = ""; // xx:xx ~ xx:xx 최종 시간 변수
				String stime = ""; // db에 들어가 있는 앞시간
				String eetime = ""; // stime 앞시간 + 1시간 24시는 00시로 처리
				String etime = ""; // stime의 뒷시간 60분은 00분으로 처리
				
				String mday = ""; // 월별 2021-11 이런식이면 엑셀 익스포트시 깨짐
				
				for(int i = 0; i < search.size(); i++)
				{
					if("month".equals(params.get("interval")))
					{
						mday = "'" + search.get(i).get("ROW_DATE").toString();
						
						search.get(i).put("ROW_DATE", mday); 
					}
					
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
				}
			}
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
}

