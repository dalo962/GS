package com.soluvis.bake.system.controllers;

import java.util.List;

import javax.inject.Inject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.sample.child.ChildSample;
import com.soluvis.bake.system.domain.sample.child.ChildSampleService;
import com.soluvis.bake.system.domain.sample.child.ChildSampleVO;
import com.soluvis.bake.system.domain.sample.parent.ParentSample;
import com.soluvis.bake.system.domain.sample.parent.ParentSampleService;
import com.soluvis.bake.system.domain.sample.parent.ParentSampleVO;

@Controller
@RequestMapping(value = "/api/v1/samples")
public class SampleController extends commController {

    @Inject
    private ParentSampleService parentService;

    @Inject
    private ChildSampleService childService;

    @RequestMapping(value = "/parent", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.PageResponse parentList(Pageable pageable) {
        Page<ParentSample> pages = parentService.findAll(pageable);
        return Responses.PageResponse.of(ParentSampleVO.of(pages.getContent()), pages);
    }

    @RequestMapping(value = "/parent", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse parentSave(@RequestBody List<ParentSampleVO> list) {
        List<ParentSample> parentSampleList = ModelMapperUtils.mapList(list, ParentSample.class);
        parentService.save(parentSampleList);
        return ok();
    }

    @RequestMapping(value = "/parent", method = {RequestMethod.DELETE}, produces = APPLICATION_JSON)
    public ApiResponse parentDelete(@RequestParam(value = "key") List<String> keys) {
        parentService.deleteByKeys(keys);
        return ok();
    }

    @RequestMapping(value = "/child", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.PageResponse childList(@RequestParam(defaultValue = "") String parentKey, Pageable pageable) {
        Page<ChildSample> pages = childService.findByParentKeyWithPaging(parentKey, pageable);
        return Responses.PageResponse.of(ChildSampleVO.of(pages.getContent()), pages);
    }

    @RequestMapping(value = "/child", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse childSave(@RequestBody List<ChildSampleVO> list) {
        List<ChildSample> childSampleList = ModelMapperUtils.mapList(list, ChildSample.class);
        childService.save(childSampleList);
        return ok();
    }

    @RequestMapping(value = "/child", method = {RequestMethod.DELETE}, produces = APPLICATION_JSON)
    public ApiResponse childDelete(@RequestParam(value = "key") List<String> keys) {
        childService.deleteByKeys(keys);
        return ok();
    }
}
