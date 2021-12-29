package com.soluvis.bakeGR.historyStat.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("agInfoMng")
public class agInfoManager extends BaseJpaModel<String>{
	
	private String id;
	private String agent_id;
	private String company_cd;
	private String dept_cd;
	private String team_cd;
	private String company_name;
	private String dept_name;
	private String team_name;
	private String dep_nm;
	private String agent_name;
	private String join_date;
	private String work_time;
	private String work;
	private String skill_name;
	private String age;
	private String mey_yn;
	private String gender;
	private String work_yn;
	private String leave_date;

	private String group_cd;
	private String group_nm;
	private String code;
	private String name;
	private String sort;
	private String use_yn;	
	
	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
