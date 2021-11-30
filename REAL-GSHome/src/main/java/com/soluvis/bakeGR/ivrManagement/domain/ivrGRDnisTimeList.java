package com.soluvis.bakeGR.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrGRDnisTime")
public class ivrGRDnisTimeList extends BaseJpaModel<String>{
	
	private String id;
	private String dnis;		//대표번호
	
	private String useyn;		//근무시간사용유무	
	private String wr_stime;	//평일근무시작시간
	private String wr_etime;	//평일근무종료시간
	
	private String lc_useyn;	//점심시간사용유무
	private String lc_stime;	//점심시작시간
	private String lc_etime;	//점심종료시간
	
	private String sat_stime;	//토요일근무시작시간
	private String sat_etime;	//토요일근무종료시간
	
	private String sun_stime;	//일요일근무시작시간
	private String sun_etime;	//일요일근무종료시간

	private String hl_useyn;	//휴일근무여부
	private String hl_stime;	//휴일근무시작시간
	private String hl_etime;	//휴일근무종료시간
	
	private String ov_useyn;	//초과근무여부
	private String ov_stime;	//초과근무시작시간
	private String ov_etime;	//초과근무종료시간
		
	private String comp_cd;		// 회사 코드
	private String crt_dt;		//생성일
	private String crt_by;		//생성자
	private String upt_dt;		//수정일
	private String upt_by;		//수정자

	private String delyn;
	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
