package com.soluvis.bake.system.domain.user;

//import eu.bitwalker.useragentutils.*;
import eu.bitwalker.useragentutils.BrowserType;
import eu.bitwalker.useragentutils.DeviceType;
import eu.bitwalker.useragentutils.Manufacturer;
import eu.bitwalker.useragentutils.RenderingEngine;
import eu.bitwalker.useragentutils.UserAgent;
import lombok.Data;

@Data
public class MDCLoginUser {
    private SessionUser sessionUser;

    private UserAgent userAgent;

    private BrowserType browserType;

    private RenderingEngine renderingEngine;

    private DeviceType deviceType;

    private Manufacturer manufacturer;

}
