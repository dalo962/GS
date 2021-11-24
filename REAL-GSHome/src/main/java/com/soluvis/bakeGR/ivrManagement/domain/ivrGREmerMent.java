package com.soluvis.bakeGR.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrGREmerMent")
public class ivrGREmerMent extends BaseJpaModel<String>{
	
	private String id;
	private String seq; 	// 시퀀스 
	private String dnis; 	// 대표번호
	private String sdate;	// 시작날짜
	private String stime;	// 시작시간
	private String edate;	// 종료날짜
	private String etime;	// 종료시간
	private String emer_type;	// 멘트타입
	private String ment;	// 멘트
	private String crt_dt;	// 생성일
	private String crt_by;	// 생성자
	private String upt_dt;	// 수정일
	private String upt_by;	// 수정자
	private String cnt;		// 멘트 존재여부 카운트
	
	private String code;	// common_code code
	private String name;	// common_code name

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
