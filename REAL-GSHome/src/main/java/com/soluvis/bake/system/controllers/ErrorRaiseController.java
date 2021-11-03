package com.soluvis.bake.system.controllers;

import javax.inject.Inject;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.soluvis.bake.common.controller.commController;

@Controller
public class ErrorRaiseController extends commController {

    @Inject
    private JdbcTemplate jdbcTemplate;

    @RequestMapping(value = "/raiseError", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public ApiResponse raiseError(@RequestParam(required = false) String raise) throws Exception {

        //if (StringUtils.isNotEmpty(raise)) {
            //throw new Exception("API Error!!");        	
        //}

        return ok();
    }

    @RequestMapping(value = "/slowQuery", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public ApiResponse slowQuery() {    	
        jdbcTemplate.execute("SELECT SLEEP(5);");
        return ok();
    }
}
