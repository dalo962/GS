package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrEmerMent;

public interface ivrEmerMentService {

	public List<ivrEmerMent> EmerMentGet(Map<String,Object> params);

	public List<ivrEmerMent> EmerMentExist(Map<String,Object> params);

	public int EmerMentIst(Map<String,Object> params);

	public int EmerMentUdt(Map<String,Object> params);

	public int EmerMentDel(Map<String,Object> params);

	public List<ivrEmerMent> EmerMentTTS(Map<String,Object> params);
}
