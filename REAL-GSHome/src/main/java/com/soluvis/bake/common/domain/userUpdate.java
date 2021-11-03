package com.soluvis.bake.common.domain;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("userUp")
public class userUpdate {
		
	private String user_cd;
	private String user_nm;
	private String grp_auth_cd;
	private String user_ps;
	
}
