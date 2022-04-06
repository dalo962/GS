package com.soluvis.bake.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrArsDiscount")
public class ivrArsDiscount extends BaseJpaModel<String>{
	
	private String id;
	
	private String media; 		//매체
	private String useyn;		//사용유무
	
	private String wait_cnt;	//대기고객수	
	private String dis_cnt;		//할인금액
		
	private String crt_dt;		//생성일
	private String crt_by;		//생성자
	private String upt_dt;		//수정일
	private String upt_by;		//수정자

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
