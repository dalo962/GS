package com.soluvis.bake.common.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("searchCondition")
public class searchCondition extends BaseJpaModel<String>{
	
	private String agentId;
	
	
	private String agent_id;
	private String agent_name;

	
	private String code;
	private String groupCd;
	private String groupNm;
	
	
	private String pid;
	private String id;
	private String name;
	private String compId;
	private String compName;
	
	private String chnId;
	private String chnName;
	private String skillId;
	private String skillName;
	
	private String partId;
	private String partName;
	private String teamId;
	private String teamName;
	
	private String ctiCompId;
	private String ctiSkillId;
	private String ctiChnId;
	private String ctiTeamId;
	private String ctiSkillName;
	private String ctiAgroupId;
	private String ctiAgroupName;
	private String ctiAgentId;
	
	private	String agentDbid;
	private String agentName;
	
	private String grpcd;	
	private String comcd;
	private String cencd;
	private String teamcd;
	private String chncd;
	private String dispyn;
	
	private String company_cd;
	private String dept_cd;
	private String team_cd;
	private String company_name;
	private String dept_name;
	private String team_name;
	private String agid;
	private String agname;
	private String create_at;
	private String delete_at;
	private String skId;
	
	private String interval;
	
	private String objectNm;
	private String objectCd;
	private String sort;
	private String filter;
	private String agnamenull;
	
	private String data1;
	private String data2;
	
	private String dispcomcd;
	private String dispcencd;
	private String dispteamcd;
	private String dispchncd;
	
	private String parent_id;
	
	
	private String user_cd;
	private String user_nm;
	private String gac;
	private String menu_id;
	//private String menu_nm;
	
	@Override
	public String getId() {
		return id;
	}
}
