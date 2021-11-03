package com.soluvis.bake.systemManager.domain;

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
@Alias("ctiMapSkillOrg")
public class ctiMapSkillOrg extends BaseJpaModel<String>{
            
	private String compId;
	private String compName; 
	private String chnId;
	private String chnName;
	private String skillId;
	private String id;
	private String name;
	private String desc;
	private String orgType;
	private String sort;
	private String preSort;
	private String orgLevel;
	private String preOrgLevel;
	private String agroupDbid;
	private String agroupName;
	private String skillDbid;
	private String skillName;
	private String parentId;
	private String preParentId;
	private String skill_time;

	private String workNm;
	private String workInfo;
	private String workGb;
	private String menuGb;
	private String userCd;
	private String userNm;
    
    @Transient
    private boolean open = false;

    @Transient
    private List<ctiMapSkillOrg> children = new ArrayList<>();
	
	@Override
	public String getId() {
		return id;
	}

    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }

    public void addChildren(ctiMapSkillOrg s) {
        children.add(s);
    }

    @Override
	public ctiMapSkillOrg clone() {
        try {
        	ctiMapSkillOrg s = (ctiMapSkillOrg) super.clone();
        	s.setChildren(new ArrayList<>());
            return s;
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

}
