package com.soluvis.bake.ivrManagement.domain;

import org.apache.ibatis.type.Alias;

import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("ivrDeployMng")
public class ivrDeployMng extends BaseJpaModel<String>{
	
	private String id;
	private String seq; 		//시퀀스
	private String directory;	//디렉토리 경로
	private String filename;	//파일 이름
	private String filesize;	//파일 용량
	private String uuid;		//파일 업로드 uuid
	private String description;	//사유
	private String step;		//진행단계
	private String mpvivrmcp001;	//mp1 결과
	private String mpvivrmcp002;	//mp2 결과
	private String mpvivrmcp003;	//mp3 결과
	private String mpvivrmcp004;	//mp4 결과
	private String mpvivrmcp005;	//mp5 결과
	private String mpvivrmcp006;	//mp6 결과
	private String dpvivrmcp001;	//dp1 결과
	private String dpvivrmcp002;	//dp2 결과
	private String dpvivrmcp003;	//dp3 결과
	private String dpvivrmcp004;	//dp4 결과
	private String dpvivrmcp005;	//dp5 결과
	private String dpvivrmcp006;	//dp6 결과
	private String work_flag;	//배포 작업위치 플래그
	private String backup_dt;	//백업 날짜
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
