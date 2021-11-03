package com.soluvis.bake.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.WebApplicationInitializer;

@Configuration
public class AXBootApplicationInitializer extends SpringBootServletInitializer implements WebApplicationInitializer{

    public static final Object[] APPLICATION_SOURCES = new Object[]{AXBootApplication.class};

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(APPLICATION_SOURCES);
    }

    public static void main(String[] args) {
        SpringApplication.run(APPLICATION_SOURCES, args);
    }
    
}
