package com.soluvis.bake.system.controllers;

import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.parameter.RequestParams;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.program.Program;
import com.soluvis.bake.system.domain.program.ProgramService;

@Controller
@RequestMapping(value = "/api/v1/programs")
public class ProgramController extends commController {

    @Inject
    private ProgramService programService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.ListResponse list(RequestParams<Program> requestParams) {
        List<Program> programs = programService.get(requestParams);
        return Responses.ListResponse.of(programs);
    }

    @RequestMapping(method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse save(@Valid @RequestBody List<Program> request) {
        programService.saveProgram(request);
        return ok();
    }
}
