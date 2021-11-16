package com.soluvis.bakeGR.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrGRHoliday")
public class ivrGRHoliday extends BaseJpaModel<String>{
	
	private String id;
	private String holiday; 	// 휴일 
	private String hl_useyn;	// 사용유무
	private String description;	// 사유
	private String crt_dt;		// 생성일
	private String crt_by;		// 생성자
	private String upt_dt;		// 수정일
	private String upt_by;		// 수정자

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
