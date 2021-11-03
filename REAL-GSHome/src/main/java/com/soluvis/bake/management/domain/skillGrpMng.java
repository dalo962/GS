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
@Alias("skillGrpMng")
public class skillGrpMng extends BaseJpaModel<String>{
    	
	private String compSkId;
	private String chnSkId;
	private String skillSkId;
	
	private String compGrpId;
	private String chnGrpId;
	private String skillGrpId;
	private String skGrpId;
		
	private String compId;
	private String pid;
	private String id;
	private String chnName;
	private String skillName;
	private String chnSort;
	private String skillSort;
	private String skillDbid;
	private	String ctiSkillName;
	private String orgType;
	private String orgLevel;	
	private String parentId;
	
	private String compName;
	private String skillGrpName;
	private String sort;
	private String skillGubun;
	private String skillLevel;
	private String chnId;
	
	private	String skillId;
	private String name;
	private String skgNm;
	
	private String workNm;
	private String workInfo;
	private String workGb;
	private String workGroup;
	private String menuGb;
	private String userCd;
	private String userNm;
	
	private String updated_at;
	private String updated_by;
	
	private String skGrpName;	
	
	private String sgid;
	private String sgnm;
	private String skid;
	private String sknm;
	private String sklvl;
	
    @Transient
    private boolean open = false;

    @Transient
    private List<skillGrpMng> children = new ArrayList<>();

    @Override
	public String getId() {
		return id;
	}
	
    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }

    public void addChildren(skillGrpMng s) {
        children.add(s);
    }
    
    @Override
	public skillGrpMng clone() {
        try {
        	skillGrpMng s = (skillGrpMng) super.clone();
        	s.setChildren(new ArrayList<>());
            return s;
        } catch (Exception e) {
            // ignore
        }
        return null;
    }
}
