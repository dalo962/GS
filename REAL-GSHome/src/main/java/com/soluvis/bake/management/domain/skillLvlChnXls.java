package com.soluvis.bake.management.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("skillLvlChnXls")
public class skillLvlChnXls extends BaseJpaModel<String>{
    
	private String id;
	private String employee_id;
	private String logid;
	private String first_name;
	private String company;
	private String dept;
	private String team;
	private String group;
	private String skgroup;
	private String Checkyn;
	private String exec;
	
	private String compId;
	private String compName; 
	private String partId;
	private String partName; 
	private String teamId;
	private String teamName;
	private String chnId;
	private String chnName;
	private	String skillId;
	private String skillName;
	private String ctiSkillName;
	private String skillGrpId;
	private String skillGrpName;
	private String skillOrgId;
	private String agtGrpId;
	private String agtGrpName;
	
	private String agtTeamName;
	
	private String agtId;
	private String agtName;
	private String agtDbid;
	private String sort;	
	
	private String pid;
	private String name;
	private String orgType;
	private String orgLevel;	

	private String agtList;
	private String agtSelText;
	private String chk;
	private String dispSkillId;
	
	private String skillDbid;
	private String skillGubun;
	private String skillLevel;
	
	private String workNm;
	private String workInfo;
	private String workGb;
	private String regGb;
	private String menuGb;
	private String levelName;
	private String workAgEmId;
	private String workAgNm;
	private String workAgId;
	private String workGp;
	private String workRemark;
	
	private String parentId;
	
	private String userCd;
	private String userNm;	
	
	private String protect;
	private String defaultGrp;
	private String applyGrp;
	private String modifyGrp;
	
	private String defaultGrp_nm;
	private String applyGrp_nm;
	
	private String skillGrpNm;
	private String agtLogId;
	
	private String state;
	private String grpid;
	private String grpname;
	
	private String employeeid;
	
	private String skilllvl;
	
	private String skillList;

	private String protect_skill;
	
	private String suss;
	
    @Override
	public String getId() {
		return id;
	}
}
