package com.soluvis.bake.common.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("menuMng")
public class menuManager extends BaseJpaModel<String>{
			
	private String step1;	
	private String step2;	
	private String step3;	
	private String menu_id;	
	private String user_id;	
	private String grp_auth_cd;	
	private String use_yn;	
	private String parent_id;	
		
	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return menu_id;
	}
	
}
