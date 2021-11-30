package com.soluvis.bakeGR.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrGRDnis")
public class ivrGRDnis extends BaseJpaModel<String>{
	
	private String id;
	private String dnis; 		// 대표번호 
	private String dnis_useyn;	// 사용유무
	private String dnis_name;	// 명칭
	private String dnis_group;	// 그룹
	private String dnis_group_eng;	// 그룹
	private String dnis_media;	// 매체
	private String comp_cd;		// 회사 코드
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
