package com.soluvis.bake.management.domain;

import javax.persistence.Transient;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("grpModHistory")
public class grpModHistory extends BaseJpaModel<String>{
    
	private String compId;
	private String workDate;
	private String workInfo;
	private String workGb;
	private String menuGb;
	private String workName;
	private String id;
	
	private String workAgId;
	private String workAgEmId;
	private String workAgNm;
	private String workRemark;
	private String workGroup;
	
	private String strDate;
	private String endDate;
	
	private String userCd;	// 사용자명에 사번을 함께 넣고 사용자 사번에는 compId 정보를 넣는다.
	private String userNm;	// 사번에 회사정보가 들어가므로 작업자명(적업자사번)형식으로 들어간다.
	
	private String grpNm;
	private String grpNm2;
	private String agId;
	
	private String agEmId;
	private String agNm;
	
	private String deptNm;
	private String teamNm;
	private String teamNm2;
	
	private String grpcd;
	
    @Transient
    private boolean open = false;

    @Override
	public String getId() {
		return id;
	}
	
    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }
}
