package com.soluvis.bake.systemManager.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("statLstMng")
public class statListManager extends BaseJpaModel<String>{
	
	private String colname;
	private String asname;
	private String hanname;
	private String seq;
	private String use_yn;
	private String gubun;
	private String stype;
	private String sgroup;
	private String dispname;
	private String rm;
	
	private String type;
	private String name;
	private String disa;
	
	private String stat_id;
	private String stat_type;
	private String stat_group;
	private String stat_nm;
	private String stat_desc;
	private String stat_opt1;
	private String stat_opt2;
	private String stat_unit;
	private String stat_opt3;
	
	private String user_cd;
	private String stat_gubun;
	private String stat_seq;
	private String stat_yn;
	private String sort;
	
	private String grp_auth_cd;
	private String company_cd;
	private String center_cd;
	private String team_cd;
	private String chn_cd;
	private String disp_use_yn;
	
	private String extension;
	private String ext_yn;
	
	private String num;
	private String yn;
	
	private String code;	
	private String data1;
	private String data2;
	private String remark;
	
	private String interval;
	
	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return seq;
	}
}
