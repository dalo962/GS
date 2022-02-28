package com.soluvis.bakeGR.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrGRDeployFile")
public class ivrGRDeployFile extends BaseJpaModel<String>{
	
	private String id;
	private String uuid;		//파일 업로드 uuid
	private String filename;	//파일 이름
	private String filesize;	//파일 용량
	private String crt_dt;	//생성일
	private String crt_by;	//생성자
	private String upt_dt;	//수정일
	private String upt_by;	//수정자

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}
}
