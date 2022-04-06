package com.soluvis.bake.ivrManagement.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soluvis.bake.ivrManagement.domain.ivrArsDiscount;
import com.soluvis.bake.ivrManagement.mapper.ivrArsDiscountMapper;

@Service
public class ivrArsDiscountServiceImpl implements ivrArsDiscountService{
	
	@Autowired
	private ivrArsDiscountMapper ivrArsDiscountMapper;
	
	@Override
	public List<ivrArsDiscount> ArsDcListGet(Map<String,Object> params)
	{		
		return ivrArsDiscountMapper.ArsDcListGet(params);
	}
		
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int ArsDcListIst(Map<String,Object> params)
	{		
		return ivrArsDiscountMapper.ArsDcListIst(params);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int ArsDcListUdt(Map<String,Object> params)
	{		
		return ivrArsDiscountMapper.ArsDcListUdt(params);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int ArsDcListDel(Map<String,Object> params)
	{		
		return ivrArsDiscountMapper.ArsDcListDel(params);
	}
}

