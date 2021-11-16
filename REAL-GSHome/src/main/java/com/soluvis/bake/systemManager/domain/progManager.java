package com.soluvis.bake.systemManager.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.common.controller.SQLInjectionSafe;
import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("progMng")
public class progManager extends BaseJpaModel<String>{

	private @SQLInjectionSafe String agg_time;
	private @SQLInjectionSafe String agg_gubun;
	private @SQLInjectionSafe String agg_flag;
	private @SQLInjectionSafe String created_at;
	private @SQLInjectionSafe String created_by;
	private @SQLInjectionSafe String updated_at;
	private @SQLInjectionSafe String numb;
	
	private @SQLInjectionSafe String dbid;	
	private @SQLInjectionSafe String starttime;
	private @SQLInjectionSafe String targettime;
	private @SQLInjectionSafe String statgubun;
	private @SQLInjectionSafe String targettable;	
	private @SQLInjectionSafe String exp;
	private @SQLInjectionSafe String exp_msg;
	private @SQLInjectionSafe String endtime;

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return dbid;
	}
}
