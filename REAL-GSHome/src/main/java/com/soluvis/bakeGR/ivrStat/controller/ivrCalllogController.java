package com.soluvis.bakeGR.ivrStat.controller;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bakeGR.ivrStat.service.ivrCalllogService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;

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
			
			// 고객번호 마스킹(****)
			if(search.size() > 0) {
				for(int i = 0; i < search.size(); i++) {
					if(search.get(i).get("ANI") != null && !"".equals(search.get(i).get("ANI"))) {
						String Ani = search.get(i).get("ANI").toString();
						search.get(i).put("ANI", maskPhoneNumber(Ani)); 
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

	// 전화번호 가운데자리 마스킹하는 메서드 //
	private String maskPhoneNumber (String phoneNumber) {
		String resultNumber = phoneNumber;
		String regex = "(\\d{2,3})(\\d{3,4})(\\d{4})$";	// 전화번호 정규식 (000-0000-0000)
		Matcher matcher = Pattern.compile(regex).matcher(resultNumber);
		
		if(matcher.find()) { // 입력받은 번호에서 정규식과 맞는 패턴을 찾는다.
			String target = matcher.group(2); // 두 번째 그룹(중간번호 3~4자리)를 가져온다.
			int length = target.length();
			char[] c = new char[length];
			Arrays.fill(c, '*'); // 중간번호 사이즈만큼 * 을 채운다.

			return resultNumber.replaceFirst(target, String.valueOf(c));
		} else {
			regex = "(\\d{4})(\\d{4})"; // 전화번호 정규식 (0000-0000)
			matcher = Pattern.compile(regex).matcher(resultNumber);
			
			if(matcher.find()) {
				String target = matcher.group(1);
				int length = target.length();
				char[] c = new char[length];
				Arrays.fill(c, '*');

				return resultNumber.replaceFirst(target, String.valueOf(c));
			}
		}

		// 전화번호 패턴이 "000-0000-0000" 또는 "0000-0000"가 아닌 경우
		return resultNumber;
	}
}

