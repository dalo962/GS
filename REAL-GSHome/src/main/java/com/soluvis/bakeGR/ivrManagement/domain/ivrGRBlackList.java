package com.soluvis.bakeGR.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrGRBlack")
public class ivrGRBlackList extends BaseJpaModel<String>{
	
	private String id;
	private String seq;			// 시퀀스
	private String ani; 		// 전화번호 
	private String description;	// 사유
	private String connid;		// ConnID
	private String bl_useyn;	// 사용유무
	private String agentid;		// 상담사 ID
	private String degree;		// 차수 1:1차  2:2차
	private String crt_dt;		// 생성일
	private String crt_by;		// 생성자
	private String upt_dt;		// 수정일
	private String upt_by;		// 수정자
	
	private String code;		// 녹취 common_code code
	private String name;		// 녹취 common_code name

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
