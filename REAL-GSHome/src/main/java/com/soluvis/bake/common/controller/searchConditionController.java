package com.soluvis.bake.common.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chequer.axboot.core.api.response.Responses;
import com.soluvis.bake.common.domain.searchCondition;
import com.soluvis.bake.common.service.searchConditionService;
import com.soluvis.bake.system.domain.user.MDCLoginUser;

@Controller
@RequestMapping(value = "/api/mng/searchCondition")
public class searchConditionController extends commController {

    @Inject
    private searchConditionService searchConditionService;
    
    //private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
    MDCLoginUser loginUser;
    
    @RequestMapping(value="/sockInfo", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse sockInfo(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<searchCondition> search = searchConditionService.sockInfo(map);
		return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/company", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse company(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		//if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()))
		if("S0001".equals(reqParam.getGrpcd()))
		{
			map.put("Id", "");
		}
		else
		{
			map.put("Id", reqParam.getComcd());
		}				
		
		List<searchCondition> search = searchConditionService.company(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/companyHO", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse companyHO(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		map.put("Id", "2"); //개발
		//map.put("Id", "3"); //운영
		List<searchCondition> search = searchConditionService.company(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/companyRE", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse companyGr(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		map.put("Id", "75"); //개발
		//map.put("Id", "260"); //운영
		List<searchCondition> search = searchConditionService.company(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/Allcompany", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse Allcompany(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		map.put("Id", "");
		List<searchCondition> search = searchConditionService.company(map);
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/channel", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse channel(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		//if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()))
		if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()) || "G0002".equals(reqParam.getGrpcd()) || "G0003".equals(reqParam.getGrpcd()))
		{
			map.put("Id", "");
		}
		else
		{
			map.put("Id", reqParam.getChncd());
		}						
		
		map.put("compId", reqParam.getCompId()); 
		List<searchCondition> search = searchConditionService.channel(map);
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/skchannel", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skchannel(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		if("N".equals(reqParam.getDispyn()))
		{
			map.put("Id", "");			
		}
		else
		{
			map.put("Id", reqParam.getChncd());			
		}		

		map.put("compId", reqParam.getCompId()); 
		List<searchCondition> search = searchConditionService.channel(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/skill", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skill(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		//map.put("compId", reqParam.getCompId());
		String[] complst = {};
		StringBuffer compbf = new StringBuffer(512);
		String comp = "";
		if(reqParam.getCompId() == null || "".equals(reqParam.getCompId()))
		{
			map.put("compId", "");
		}
		else
		{			
			reqParam.getCompId().toString();
			complst = reqParam.getCompId().toString().split(";");
			for(int j = 0; j < complst.length; j ++)
			{
				compbf.append("'" + complst[j].toString() + "',");
			}
			comp = compbf.toString().substring(0, compbf.toString().length() - 1);
			map.put("compId", comp); 
		}
		
		String[] tmplst = {};
		StringBuffer tmpbf = new StringBuffer(512);
		String tmp = "";
		if(reqParam.getChnId() == null || "".equals(reqParam.getChnId()))
		{
			tmp = "";
		}
		else
		{			
			reqParam.getChnId().toString();
			tmplst = reqParam.getChnId().toString().split(";");
			for(int j = 0; j < tmplst.length; j ++)
			{
				tmpbf.append("'" + tmplst[j].toString() + "',");
			}
			tmp = tmpbf.toString().substring(0, tmpbf.toString().length() - 1);
		}

		map.put("chnId", tmp); 
		
		String[] sklst = {};
		StringBuffer skbf = new StringBuffer(512);
		String sk = "";
		if(reqParam.getSkId() == null || "".equals(reqParam.getSkId()))
		{
			map.put("skId", "");
		}
		else
		{			
			reqParam.getSkId().toString();
			sklst = reqParam.getSkId().toString().split(";");
			for(int j = 0; j < sklst.length; j ++)
			{
				skbf.append("'" + sklst[j].toString() + "',");
			}
			sk = skbf.toString().substring(0, skbf.toString().length() - 1);
			map.put("skId", sk); 
		}
		
		map.put("filter", reqParam.getFilter());
		map.put("agnamenull", reqParam.getAgnamenull());
		List<searchCondition> search = searchConditionService.skill(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/skillRt", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skillRt(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		//map.put("compId", reqParam.getCompId());
		String[] complst = {};
		StringBuffer compbf = new StringBuffer(512);
		String comp = "";
		if(reqParam.getCompId() == null || "".equals(reqParam.getCompId()))
		{
			map.put("compId", "");
		}
		else
		{		
			reqParam.getCompId().toString();
			complst = reqParam.getCompId().toString().split(";");
			for(int j = 0; j < complst.length; j ++)
			{
				compbf.append("'" + complst[j].toString() + "',");
			}
			comp = compbf.toString().substring(0, compbf.toString().length() - 1);
			map.put("compId", comp); 
		}

		map.put("chnId", reqParam.getChnId()); 
		
		String[] sklst = {};
		StringBuffer skbf = new StringBuffer(512);
		String sk = "";
		if(reqParam.getSkId() == null || "".equals(reqParam.getSkId()))
		{
			map.put("skId", "");
		}
		else
		{			
			reqParam.getSkId().toString();
			sklst = reqParam.getSkId().toString().split(";");
			for(int j = 0; j < sklst.length; j ++)
			{
				skbf.append("'" + sklst[j].toString() + "',");
			}
			sk = skbf.toString().substring(0, skbf.toString().length() - 1);
			map.put("skId", sk); 
		}
		
		map.put("filter", reqParam.getFilter());
		List<searchCondition> search = searchConditionService.skillRt(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/skillGrp", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skillGrp(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		List<searchCondition> search = searchConditionService.skillGrp(map);
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/part", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse part(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		//if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()))
		if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()) || "G0002".equals(reqParam.getGrpcd()) || "G0003".equals(reqParam.getGrpcd()))	
		{
			map.put("Id", "");
		}
		else
		{
			map.put("Id", reqParam.getCencd());
		}				

		map.put("compId", reqParam.getCompId()); 
		List<searchCondition> search = searchConditionService.part(map);
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/team", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse team(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		//if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()))
		if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()) || "G0002".equals(reqParam.getGrpcd()) || "G0003".equals(reqParam.getGrpcd()))
		{
			map.put("Id", "");
		}
		else
		{
			map.put("Id", reqParam.getTeamcd());
		}				
		
		String[] tmplst = {};
		StringBuffer tmpbf = new StringBuffer(512);
		String tmp = "";
		if(reqParam.getPartId() == null || "".equals(reqParam.getPartId()))
		{
			tmp = "";
		}
		else
		{			
			reqParam.getPartId().toString();
			tmplst = reqParam.getPartId().toString().split(";");
			for(int j = 0; j < tmplst.length; j ++)
			{
				tmpbf.append("'" + tmplst[j].toString() + "',");
			}
			tmp = tmpbf.toString().substring(0, tmpbf.toString().length() - 1);
		}
		
		map.put("compId", reqParam.getCompId()); 
		map.put("partId", tmp); 

		map.put("filter", reqParam.getFilter());
		List<searchCondition> search = searchConditionService.team(map);
        return Responses.ListResponse.of(search);
    }

    
    @RequestMapping(value="/skpart", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skpart(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		//if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()))
		if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()))
		{
			map.put("Id", "");
		}
		else
		{
			map.put("Id", reqParam.getCencd());
		}				

		map.put("compId", reqParam.getCompId()); 
		List<searchCondition> search = searchConditionService.part(map);
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/skteam", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse skteam(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		//if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()))
		if("S0001".equals(reqParam.getGrpcd()) || "S0002".equals(reqParam.getGrpcd()) || "S0003".equals(reqParam.getGrpcd()))
		{
			map.put("Id", "");
		}
		else
		{
			map.put("Id", reqParam.getTeamcd());
		}				
		
		String[] tmplst = {};
		StringBuffer tmpbf = new StringBuffer(512);
		String tmp = "";
		if(reqParam.getPartId() == null || "".equals(reqParam.getPartId()))
		{
			tmp = "";
		}
		else
		{			
			reqParam.getPartId().toString();
			tmplst = reqParam.getPartId().toString().split(";");
			for(int j = 0; j < tmplst.length; j ++)
			{
				tmpbf.append("'" + tmplst[j].toString() + "',");
			}
			tmp = tmpbf.toString().substring(0, tmpbf.toString().length() - 1);
		}
		
		map.put("compId", reqParam.getCompId()); 
		map.put("partId", tmp); 

		map.put("filter", reqParam.getFilter());
		List<searchCondition> search = searchConditionService.team(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/agent", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse agent(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>(); 
    	//System.out.println(reqParam.getInterval());
    	//System.out.println(reqParam.getCreate_at());
    	//System.out.println(reqParam.getDelete_at());
		if(reqParam.getInterval() != null)
		{
			if("month".equals(reqParam.getInterval()))
			{
				String sdt = reqParam.getCreate_at().replace("-", "");
				String edt = reqParam.getDelete_at().replace("-", "");
				String ldt = reqParam.getDelete_at().replace("-", "");
				
				sdt = sdt.substring(0, 6);
				edt = edt.substring(0, 6);
				ldt = ldt.substring(4, 6);
				
				//System.out.println(edt);
				if("01".equals(ldt) || "03".equals(ldt) || "05".equals(ldt) || "07".equals(ldt) || "08".equals(ldt) || "10".equals(ldt) || "12".equals(ldt))
		    	{
					ldt = "-31";
		    	}
		    	else if("02".equals(ldt))
		    	{
		    		ldt = "-28";
		    	}
		    	else if("04".equals(ldt) || "06".equals(ldt) || "09".equals(ldt) || "11".equals(ldt))
		    	{
		    		ldt = "-30";
		    	}
				map.put("s_day", sdt.substring(0, 4) + "-" + sdt.substring(4, 6) + "-01");
				map.put("e_day", edt.substring(0, 4) + "-" + edt.substring(4, 6) + ldt);
			}
			else if("year".equals(reqParam.getInterval()))
			{
				String sdt = reqParam.getCreate_at().substring(0, 4);
				String edt = reqParam.getDelete_at().substring(0, 4);
				map.put("s_day", sdt + "-01-01");
				map.put("e_day", edt + "-12-31");
			}
			else
			{
				map.put("s_day", reqParam.getCreate_at());
				map.put("e_day", reqParam.getDelete_at());
			}
		}else{
			map.put("s_day", reqParam.getCreate_at());
			map.put("e_day", reqParam.getDelete_at());			
		}
		//System.out.println(map);
		map.put("compId", reqParam.getCompId()); 
		map.put("partId", reqParam.getPartId());		
		map.put("teamId", reqParam.getTeamId());
		
		List<searchCondition> search = searchConditionService.agent(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/dnis", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse dnis(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		//map.put("compId", reqParam.getCompId()); 
		List<searchCondition> search = searchConditionService.dnis(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/agentCfg", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse agentCfg(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId()); 
		
		String[] tmpPartlst = {};
		StringBuffer tmpPartbf = new StringBuffer(512);
		String tmpPart = "";
		if(reqParam.getPartId() == null || "".equals(reqParam.getPartId()))
		{
			tmpPart = "";
		}
		else
		{			
			reqParam.getPartId().toString();
			tmpPartlst = reqParam.getPartId().toString().split(";");
			for(int j = 0; j < tmpPartlst.length; j ++)
			{
				tmpPartbf.append("'" + tmpPartlst[j].toString() + "',");
			}
			tmpPart = tmpPartbf.toString().substring(0, tmpPartbf.length() - 1);
		}
		
		String[] tmpTeamlst = {};
		StringBuffer tmpTeambf = new StringBuffer(512);
		String tmpTeam = "";
		if(reqParam.getTeamId() == null || "".equals(reqParam.getTeamId()))
		{
			tmpTeam = "";
		}
		else
		{	
			reqParam.getTeamId().toString();
			tmpTeamlst = reqParam.getTeamId().toString().split(";");
			for(int j = 0; j < tmpTeamlst.length; j ++)
			{
				tmpTeambf.append("'" + tmpTeamlst[j].toString() + "',");
			}
			tmpTeam = tmpTeambf.toString().substring(0, tmpTeambf.toString().length() - 1);
		}
		
		map.put("compId", reqParam.getCompId()); 
		map.put("partId", tmpPart); 
		map.put("teamId", tmpTeam); 
		List<searchCondition> search = searchConditionService.agentCfg(map);
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/agentGrp", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse agentGrp(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("compId", reqParam.getCompId());  
		map.put("partId", reqParam.getPartId()); 
		map.put("teamId", reqParam.getTeamId()); 
		List<searchCondition> search = searchConditionService.agentGrp(map);
        return Responses.ListResponse.of(search);
    }
    
    
    @RequestMapping(value="/codeSelect", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse codeSelect(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<searchCondition> search = searchConditionService.codeSelect(map);
		return Responses.ListResponse.of(search);
    }
    
    
    @RequestMapping(value="/groupcdSelect", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse groupcdSelect(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.put("group_cd", reqParam.getGroupCd());
		map.put("code", "");
		map.put("data1", "");
		List<searchCondition> search = searchConditionService.groupcdSelect(map);
		return Responses.ListResponse.of(search);
    }
    
    
    @RequestMapping(value="/dispcompany", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse dispcompany(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		String[] comlst = {};
		StringBuffer combf = new StringBuffer(512);
		String com = "";
				
		if(reqParam.getCompId() == null || "".equals(reqParam.getCompId()))
		{
			com = "";
		}
		else
		{			
			reqParam.getCompId().toString();
			comlst = reqParam.getCompId().toString().split(";");
			for(int j = 0; j < comlst.length; j ++)
			{
				combf.append("'" + comlst[j].toString() + "',");
			}
			com = combf.toString().substring(0, combf.toString().length() - 1);
		}
		
		map.put("Id", com);	
		
		List<searchCondition> search = searchConditionService.dispcompany(map);
        return Responses.ListResponse.of(search);
    }
    

    @RequestMapping(value="/dispchannel", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse dispchannel(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		String[] comlst = {};
		StringBuffer combf = new StringBuffer(512);
		String com = "";
		
		if(reqParam.getCompId() == null || "".equals(reqParam.getCompId()))
		{
			com = "";
		}
		else
		{			
			reqParam.getCompId().toString();
			comlst = reqParam.getCompId().toString().split(";");
			for(int j = 0; j < comlst.length; j ++)
			{
				combf.append("'" + comlst[j].toString() + "',");
			}
			com = combf.toString().substring(0, combf.toString().length() - 1);
		}
				
		String[] chnlst = {};
		StringBuffer chnbf = new StringBuffer(512);
		String chn = "";
		if(reqParam.getChnId() == null || "".equals(reqParam.getChnId()))
		{
			chn = "";
		}
		else
		{			
			reqParam.getChnId().toString();
			chnlst = reqParam.getChnId().toString().split(";");
			for(int j = 0; j < chnlst.length; j ++)
			{
				chnbf.append("'" + chnlst[j].toString() + "',");
			}
			chn = chnbf.toString().substring(0, chnbf.toString().length() - 1);
		}
		
		map.put("compId", com);
		map.put("Id", chn); 

		List<searchCondition> search = searchConditionService.dispchannel(map);
        return Responses.ListResponse.of(search);
    }
    
    @RequestMapping(value="/disppart", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse disppart(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		String[] comlst = {};
		StringBuffer combf = new StringBuffer(512);
		String com = "";
		
		if(reqParam.getCompId() == null || "".equals(reqParam.getCompId()))
		{
			com = "";
		}
		else
		{			
			reqParam.getCompId().toString();
			comlst = reqParam.getCompId().toString().split(";");
			for(int j = 0; j < comlst.length; j ++)
			{
				combf.append("'" + comlst[j].toString() + "',");
			}
			com = combf.toString().substring(0, combf.toString().length() - 1);
		}
				
		String[] tmplst = {};
		StringBuffer tmpbf = new StringBuffer(512);
		String tmp = "";
		if(reqParam.getPartId() == null || "".equals(reqParam.getPartId()))
		{
			tmp = "";
		}
		else
		{			
			reqParam.getPartId().toString();
			tmplst = reqParam.getPartId().toString().split(";");
			for(int j = 0; j < tmplst.length; j ++)
			{
				tmpbf.append("'" + tmplst[j].toString() + "',");
			}
			tmp = tmpbf.toString().substring(0, tmpbf.toString().length() - 1);
		}
		
		map.put("compId", com);
		map.put("Id", tmp); 
		
		List<searchCondition> search = searchConditionService.disppart(map);
        return Responses.ListResponse.of(search);
    }

    @RequestMapping(value="/dispteam", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse dispteam(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		
		String[] comlst = {};
		StringBuffer combf = new StringBuffer(512);
		String com = "";		
		if(reqParam.getCompId() == null || "".equals(reqParam.getCompId()))
		{
			com = "";
		}
		else
		{			
			reqParam.getCompId().toString();
			comlst = reqParam.getCompId().toString().split(";");
			for(int j = 0; j < comlst.length; j ++)
			{
				combf.append("'" + comlst[j].toString() + "',");
			}
			com = combf.toString().substring(0, combf.toString().length() - 1);
		}
		
		String[] tmplst = {};
		StringBuffer tmpbf = new StringBuffer(512);
		String tmp = "";
		if(reqParam.getPartId() == null || "".equals(reqParam.getPartId()))
		{
			tmp = "";
		}
		else
		{			
			reqParam.getPartId().toString();
			tmplst = reqParam.getPartId().toString().split(";");
			for(int j = 0; j < tmplst.length; j ++)
			{
				tmpbf.append("'" + tmplst[j].toString() + "',");
			}
			tmp = tmpbf.toString().substring(0, tmpbf.toString().length() - 1);
		}
		
		String[] teplst = {};
		StringBuffer tepbf = new StringBuffer(512);
		String tep = "";
		if(reqParam.getTeamId() == null || "".equals(reqParam.getTeamId()))
		{
			tep = "";
		}
		else
		{		
			reqParam.getTeamId().toString();
			teplst = reqParam.getTeamId().toString().split(";");
			for(int j = 0; j < teplst.length; j ++)
			{
				tepbf.append("'" + teplst[j].toString() + "',");
			}
			tep = tepbf.toString().substring(0, tepbf.toString().length() - 1);
		}
		
		map.put("compId", com); 
		map.put("partId", tmp);
		map.put("Id", tep); 

		map.put("filter", reqParam.getFilter());
		List<searchCondition> search = searchConditionService.dispteam(map);
        return Responses.ListResponse.of(search);
    }
    
    /*
    @RequestMapping(value="/systemSel", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody Responses.ListResponse systemSel(@Valid @RequestBody searchCondition reqParam, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		map.put("menu_id", reqParam.getMenu_id()));
		map.put("user_cd", cid));
		
		List<searchCondition> search = searchConditionService.systemSelectGrp(map);
		return Responses.ListResponse.of(search);
    }    
    
    public int grpChk(String menu_id) throws Exception {
    	Map<String, Object> map = new HashMap<String, Object>(); 		
 		String cid = SessionUtils.getCurrentLoginUserCd();
 		map.put("menu_id", menu_id));
 		map.put("user_cd", cid));
 		List<searchCondition> search = searchConditionService.systemSelectGrp(map);
 		logger.error("chk  >>>" + search.size());
    	return search.size();
    }
    */
}
