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
@Alias("skillLvlChnMain")
public class skillLvlChnMain extends BaseJpaModel<String>{
    
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
	private String agtId;
	private String agtName;
	private String agtDbid;
	private String sort;
	private String chnSort;
	private String skillSort;
	
	private String pid;
	private String id;
	private String name;
	private String orgType;
	private String orgLevel;	

	private String agtList;
	private String agtSelText;
	private String skillSelText;
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
	
	private String parentId;
	
	private String userCd;
	private String userNm;
	
	private String code;
	private String groupCd;
	private String groupNm;
	
	private String state;
	private String agtLogId;
	
	private String workAgId;
	private String workAgNm;
	private String workAgEmId;
	
	private String employeeid;
	
	private String skGrpId;
	private String skGrpName;
	
	private String oldskLvl;
	
	private String protect_skill;
	
	private String loginCheck;
	
	private String logid;
	private String first_name;
	private String skill_name;
	private String skill_lvl;
	
	private String suss;
	
    @Transient
    private boolean open = false;

    @Transient
    private List<skillLvlChnMain> children = new ArrayList<>();

    @Override
	public String getId() {
		return id;
	}
	
    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }

    public void addChildren(skillLvlChnMain s) {
        children.add(s);
    }
    
    @Override
	public skillLvlChnMain clone() {
        try {
        	skillLvlChnMain s = (skillLvlChnMain) super.clone();
        	s.setChildren(new ArrayList<>());
            return s;
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

}
