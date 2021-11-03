package com.soluvis.bake.management.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("skillLvlSummary")
public class skillLvlSummary extends BaseJpaModel<String>{
	
	private String id;
	private String skillName;
	
	private String compId;
	private String gpId;
	private String gpName;
	private String skLvl;
	private String skId;
	
	private String compNm;
	private String deptNm;
	private String teamNm;
	private String employee_id;
	private String first_name;
	private String last_name;
	private String default_group;
	private String apply_group;
	
	private String state;
	
	private String loginCheck;
	
	@Override
	public String getId() {
		return id;
	}
}
