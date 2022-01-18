package com.soluvis.bakeGR.historyStat.controller;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.soluvis.bake.common.controller.SQLInjectionSafe;
import com.soluvis.bake.common.controller.SqlSafeUtil;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bakeGR.historyStat.service.callListService;

/** 
 * @author yejinlee
 * @desc   call list를 조회한다
 */
@Controller
@RequestMapping(value = "/gr/api/hist/callList")
public class callListController extends commController{
	
	@Inject
	private callListService callListService;	
		
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	/** 
	 * @desc call list를 조회한다
	 */ 
	@RequestMapping(value="/callListSearch", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody List<Map<String,Object>> callListSearch(@Valid @SQLInjectionSafe @RequestBody Map<String,Object> params, HttpServletRequest request) throws Exception {		
		//센터
		if("".equals(params.get("comSelect"))) {
			params.put("center", "");
		} else {
			params.put("center", SqlSafeUtil.getSqlInjectionSafe(params.get("comSelect").toString()));
		}	

		//그룹
		if("".equals(params.get("deptSelect"))) {
			params.put("dept_name", "");
		} else {
			params.put("dept_name", SqlSafeUtil.getSqlInjectionSafe(params.get("deptSelect").toString()));
		}	
		
		//팀
		if("".equals(params.get("teamSelect"))) {
			params.put("team_name", "");
		} else {
			params.put("team_name", SqlSafeUtil.getSqlInjectionSafe(params.get("teamSelect").toString()));
		}
		
		String[] anilst = {};
		StringBuffer anibf = new StringBuffer(512);
		StringBuffer anitobf = new StringBuffer(512);
		String ani = "";
		String amo = "";
		String anito = "";
		//String anitomo = "";
		if("".equals(params.get("callText"))) {
			params.put("ani", "");
		} else {
			String callText = SqlSafeUtil.getSqlInjectionSafe(params.get("callText").toString());
			callText = callText.replace("'", ";");
			callText = callText.replace("\"", ";");
			callText = callText.replace("(", ";");
			callText = callText.replace(")", ";");
			callText = callText.replace("--", ";");
			callText = callText.replace("#", ";");
			callText = callText.replace("=", ";");
			callText = callText.replace(",", ";");

			anilst = callText.toString().split(";");
			for(int i = 0; i < anilst.length; i ++) {
				if("0".equals(anilst[i].toString().substring(0,1))) {
					anitobf.append("'" + anilst[i].toString().substring(1,anilst[i].toString().length()) + "',");					
				} else {
					anitobf.append("'" + "0" + anilst[i].toString() + "',");
				}

				amo = anilst[i].toString();				
				anibf.append("'" + amo.toString() + "',");
			}						
			ani = anibf.toString().substring(0, anibf.toString().length() - 1);
			anito = anitobf.toString().substring(0, anitobf.toString().length() - 1);
			params.put("ani", ani + "," + anito);
		}
		
		String[] aglst = {};
		StringBuffer agbf = new StringBuffer(512);
		String ag = "";
		if("".equals(params.get("agidText"))) {
			params.put("agentid", "");
		} else {
			String agidText = SqlSafeUtil.getSqlInjectionSafe(params.get("agidText").toString());
			agidText = agidText.replace("'", ";");
			agidText = agidText.replace("\"", ";");
			agidText = agidText.replace("(", ";");
			agidText = agidText.replace(")", ";");
			agidText = agidText.replace("--", ";");
			agidText = agidText.replace("#", ";");
			agidText = agidText.replace("=", ";");
			agidText = agidText.replace(",", ";");
			
			//aglst = params.get("agidText").toString().split(";");
			aglst = agidText.toString().split(";");
			for(int j = 0; j < aglst.length; j ++) {
				agbf.append("'" + aglst[j].toString() + "',");
			}
			ag = agbf.toString().substring(0, agbf.toString().length() - 1);
			params.put("agentid", ag);
		}
		
		String[] conlst = {};
		StringBuffer conbf = new StringBuffer(512);
		String con = "";
		if("".equals(params.get("connidText"))) {
			params.put("connid", "");
		} else {
			String connidText = SqlSafeUtil.getSqlInjectionSafe(params.get("connidText").toString());
			connidText = connidText.replace("'", ";");
			connidText = connidText.replace("\"", ";");
			connidText = connidText.replace("(", ";");
			connidText = connidText.replace(")", ";");
			connidText = connidText.replace("--", ";");
			connidText = connidText.replace("#", ";");
			connidText = connidText.replace("=", ";");
			connidText = connidText.replace(",", ";");
			
			//conlst = params.get("connidText").toString().split(";");
			conlst = connidText.toString().split(";");
			for(int j = 0; j < conlst.length; j ++) {
				conbf.append("'" + conlst[j].toString() + "',");
			}
			con = conbf.toString().substring(0, conbf.toString().length() - 1);
			params.put("connid", con);
		}
		
		String[] ticlst = {};
		StringBuffer ticbf = new StringBuffer(512);
		String tic = "";
		if("".equals(params.get("ticketText"))) {
			params.put("ticket_num", "");
		} else {
			String ticketText = SqlSafeUtil.getSqlInjectionSafe(params.get("ticketText").toString());
			ticketText = ticketText.replace("'", ";");
			ticketText = ticketText.replace("\"", ";");
			ticketText = ticketText.replace("(", ";");
			ticketText = ticketText.replace(")", ";");
			ticketText = ticketText.replace("--", ";");
			ticketText = ticketText.replace("#", ";");
			ticketText = ticketText.replace("=", ";");
			ticketText = ticketText.replace(",", ";");

			ticlst = ticketText.toString().split(";");
			for(int j = 0; j < ticlst.length; j ++) {
				ticbf.append("'" + ticlst[j].toString() + "',");
			}
			tic = ticbf.toString().substring(0, ticbf.toString().length() - 1);
			params.put("ticket_num", tic);
		}
		
		params.put("s_day", SqlSafeUtil.getSqlInjectionSafe(params.get("startDate").toString().replace("-", "") + params.get("startTime").toString() + "00"));
		params.put("e_day", SqlSafeUtil.getSqlInjectionSafe(params.get("endDate").toString().replace("-", "") + params.get("endTime").toString() + "59"));		
		
		params.put("iotype", params.get("iotype"));

		List<Map<String,Object>> search = callListService.callListSel(params);
		
		// 고객번호 마스킹(****)
		if(search.size() > 0) {
			for(int i = 0; i < search.size(); i++) {
				// Inbound //
				if(search.get(i).get("IBANI") != null && !"".equals(search.get(i).get("IBANI"))) {
					String Ani = search.get(i).get("IBANI").toString();
					search.get(i).put("IBANI", maskPhoneNumber(Ani)); 
				}
				
				// Outbound //
				if(search.get(i).get("OBANI") != null && !"".equals(search.get(i).get("OBANI"))) {
					String Ani = search.get(i).get("OBANI").toString();
					search.get(i).put("OBANI", maskPhoneNumber(Ani)); 
				}
			}
		}

		return search;
	}	
	
	// 전화번호 가운데자리 마스킹하는 메서드 //
	private String maskPhoneNumber (String phoneNumber) {
		String resultNumber = phoneNumber;
		String regex = "^(0[1-9][0-9]|02)(\\d{3,4})(\\d{4})$";	// 전화번호 정규식 (000-0000-0000)
		Matcher matcher = Pattern.compile(regex).matcher(resultNumber);
		
		if(matcher.find()) { // 입력받은 번호에서 정규식과 맞는 패턴을 찾는다.
			String target = matcher.group(2); // 두 번째 그룹(중간번호 3~4자리)를 가져온다.
			int length = target.length();
			char[] c = new char[length];
			Arrays.fill(c, '*'); // 중간번호 사이즈만큼 * 을 채운다.

			return resultNumber.replaceFirst(target, String.valueOf(c));
		} else {
			regex = "^(\\d{4})(\\d{4})$"; // 전화번호 정규식 (0000-0000)
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

