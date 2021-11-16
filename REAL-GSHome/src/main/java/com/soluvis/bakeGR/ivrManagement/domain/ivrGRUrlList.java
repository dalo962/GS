package com.soluvis.bakeGR.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrGRUrl")
public class ivrGRUrlList extends BaseJpaModel<String>{
	
	private String id;
	private String url_nm;		//URL명
	private String svr_ip;		//서버IP
	private String crt_dt;		//생성일
	private String crt_by;		//생성자
	private String upt_dt;		//수정일
	private String upt_by;		//수정자
	private String file_rst;	//수정자
	
	
	private String group_cd;	//그룹코드
	private String group_nm;	//그룹명
	private String code;		//코드
	private String remark;		//주소1
	private String url;			//주소2
	
	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
