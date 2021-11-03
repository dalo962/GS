package com.soluvis.bake.system;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

import com.chequer.axboot.core.AXBootCoreConfiguration;

@SpringBootApplication
//@PropertySource(value = {"classpath:axboot-common.properties", "classpath:axboot-${spring.profiles.active:local}.properties"})
//@PropertySource(value = {"file:C:/dev/properties/axboot-common.properties", "file:C:/dev/properties/axboot-${spring.profiles.active:local}.properties"})
@PropertySource(value = {"file:/gcti/bake/config/axboot-common.properties", "file:/gcti/bake/config/axboot-${spring.profiles.active:local}.properties"})
//@PropertySource(value = {"file:/WAS/Apps/CioStatsApp/app_config/axboot-common.properties", "file:/WAS/Apps/CioStatsApp/app_config/axboot-${spring.profiles.active:local}.properties"})
@Import(AXBootCoreConfiguration.class)
public class AXBootApplication {
}
