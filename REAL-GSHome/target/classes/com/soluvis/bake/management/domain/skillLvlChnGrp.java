package com.soluvis.bake.management.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Transient;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("skillLvlChnGrp")
public class skillLvlChnGrp extends BaseJpaModel<String>{
    
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
	private String id;
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
	
	private String skillGrpNm;
	private String agtLogId;
	
	private String state;
	private String grpid;
	private String grpname;
	
	private String employeeid;
	
	private String loginCheck;
	
	private String defaultGrpName;
	
	private String suss;
	
    @Transient
    private boolean open = false;

    @Transient
    private List<skillLvlChnGrp> children = new ArrayList<>();

    @Override
	public String getId() {
		return id;
	}
	
    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }

    public void addChildren(skillLvlChnGrp s) {
        children.add(s);
    }
    
    @Override
	public skillLvlChnGrp clone() {
        try {
        	skillLvlChnGrp s = (skillLvlChnGrp) super.clone();
        	s.setChildren(new ArrayList<>());
            return s;
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

}
