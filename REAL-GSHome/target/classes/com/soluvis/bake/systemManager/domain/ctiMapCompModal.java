package com.soluvis.bake.systemManager.domain;

import javax.persistence.Transient;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ctiMapCompModal")
public class ctiMapCompModal extends BaseJpaModel<String>{
    
	private String compId;
	private String compName; 
	private String id;
	private String name;
	private String orgType;
	private String sort;
	private String orgLevel;

	private String workNm;
	private String workInfo;
	private String workGb;
	private String menuGb;
	private String userCd;
	private String userNm;
    
    @Transient
    private boolean open = false;

	@Override
	public String getId() {
		return id;
	}

    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }

}
