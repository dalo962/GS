package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import com.soluvis.bake.ivrManagement.domain.ivrArsDiscount;

public interface ivrArsDiscountService {
		
	public List<ivrArsDiscount> ArsDcListGet(Map<String,Object> params);
	
	public int ArsDcListIst(Map<String,Object> params);
	
	public int ArsDcListUdt(Map<String,Object> params);
	
	public int ArsDcListDel(Map<String,Object> params);
}
