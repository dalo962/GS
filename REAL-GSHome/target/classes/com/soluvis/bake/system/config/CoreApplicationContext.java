package com.soluvis.bake.system.config;

import javax.inject.Named;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.mybatis.spring.transaction.SpringManagedTransactionFactory;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Primary;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.db.dbcp.AXBootDataSourceFactory;
import com.chequer.axboot.core.db.monitor.SqlMonitoringService;
import com.chequer.axboot.core.domain.log.AXBootErrorLogService;
import com.chequer.axboot.core.model.extract.service.jdbc.JdbcMetadataService;
import com.chequer.axboot.core.mybatis.MyBatisMapper;
import com.soluvis.bake.system.code.GlobalConstants;
import com.soluvis.bake.system.logging.AXBootLogbackAppender;

import ch.qos.logback.classic.LoggerContext;

@Configuration
@ComponentScan(basePackages = GlobalConstants.BASE_PACKAGE)
@EnableTransactionManagement(proxyTargetClass = true, mode = AdviceMode.PROXY)
@EnableJpaRepositories(basePackages = GlobalConstants.DOMAIN_PACKAGE)
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class CoreApplicationContext {

    @Bean(name="dataSource")
    @Primary
    public DataSource dataSource(@Named(value = "axBootContextConfig") AXBootContextConfig axBootContextConfig) throws Exception {
        return AXBootDataSourceFactory.create(axBootContextConfig.getDataSourceConfig());
    }

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource, AXBootContextConfig axBootContextConfig) {
        LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();

        entityManagerFactory.setDataSource(dataSource);
        entityManagerFactory.setPackagesToScan(axBootContextConfig.getDomainPackageName());
        AXBootContextConfig.DataSourceConfig.HibernateConfig hibernateConfig = axBootContextConfig.getDataSourceConfig().getHibernateConfig();
        entityManagerFactory.setJpaVendorAdapter(hibernateConfig.getHibernateJpaVendorAdapter());
        entityManagerFactory.setJpaProperties(hibernateConfig.getAdditionalProperties());

        return entityManagerFactory;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    @Bean
    public SpringManagedTransactionFactory managedTransactionFactory() {
        SpringManagedTransactionFactory managedTransactionFactory = new SpringManagedTransactionFactory();
        return managedTransactionFactory;
    }

    @Bean(name="sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(SpringManagedTransactionFactory springManagedTransactionFactory, DataSource dataSource, AXBootContextConfig axBootContextConfig) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage(GlobalConstants.BASE_PACKAGE);
        sqlSessionFactoryBean.setTypeHandlers(axBootContextConfig.getMyBatisTypeHandlers());
        sqlSessionFactoryBean.setTransactionFactory(springManagedTransactionFactory);
        return sqlSessionFactoryBean.getObject();
    }    

    @Bean(name="mapperScannerConfigurer")
    public MapperScannerConfigurer mapperScannerConfigurer() throws Exception {
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        mapperScannerConfigurer.setBasePackage(GlobalConstants.MAPPER_PACKAGE);
        mapperScannerConfigurer.setMarkerInterface(MyBatisMapper.class);
        mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
        return mapperScannerConfigurer;
    }    

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) throws ClassNotFoundException {
        JpaTransactionManager jpaTransactionManager = new JpaTransactionManager();
        jpaTransactionManager.setEntityManagerFactory(entityManagerFactory);
        return jpaTransactionManager;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(11);
    }

    @Bean
    public JdbcMetadataService jdbcMetadataService() {
        return new JdbcMetadataService();
    }

    @Bean(name = "axBootContextConfig")
    public AXBootContextConfig axBootContextConfig() {
        return new AXBootContextConfig();
    }

    @Bean
    public SqlMonitoringService sqlMonitoringService(DataSource dataSource) throws Exception {
        return new SqlMonitoringService(dataSource);
    }

    @Bean
    public LocalValidatorFactoryBean validatorFactoryBean() {
        return new LocalValidatorFactoryBean();
    }

    @Bean
    public AXBootLogbackAppender axBootLogbackAppender(AXBootErrorLogService axBootErrorLogService, AXBootContextConfig axBootContextConfig) throws Exception {
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        AXBootLogbackAppender axBootLogbackAppender = new AXBootLogbackAppender(axBootErrorLogService, axBootContextConfig);
        axBootLogbackAppender.setContext(loggerContext);
        axBootLogbackAppender.setName("axBootLogbackAppender");
        axBootLogbackAppender.start();
        loggerContext.getLogger("ROOT").addAppender(axBootLogbackAppender);

        return axBootLogbackAppender;
    }
    
    // ftp 연결
    //@Bean(name = "ftp1")
    //public String[] ftp(){
    //	String[] ftp = {"192.168.1.140", "22", "root", "soluvis"};    	
    //	return ftp;
    //}
    
    // 기존부분주석
    /* 이중 연결 factory 
    @Bean(name="sqlSessionFactory2")
    public SqlSessionFactory sqlSessionFactory2(SpringManagedTransactionFactory springManagedTransactionFactory, DataSource dataSource, AXBootContextConfig axBootContextConfig) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        BasicDataSource bds = new BasicDataSource();
        bds.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        bds.setUrl("jdbc:sqlserver://42.4.166.155:1433;databaseName=WCP");
        bds.setUsername("PDS_stat");
        bds.setPassword("samsung1!");
        
        // 테스트용
        //bds.setDriverClassName("oracle.jdbc.driver.OracleDriver");
        //bds.setUrl("jdbc:oracle:thin:@42.39.16.108:4999:orcl");
        //bds.setUsername("GENECFG");
        //bds.setPassword("soluvis");
        //System.out.println("db접속-->" + bds);
        DataSource ds = bds;
        sqlSessionFactoryBean.setDataSource(ds);
        sqlSessionFactoryBean.setTypeAliasesPackage(GlobalConstants.BASE_PACKAGE);
        sqlSessionFactoryBean.setTypeHandlers(axBootContextConfig.getMyBatisTypeHandlers());
        sqlSessionFactoryBean.setTransactionFactory(springManagedTransactionFactory);
        return sqlSessionFactoryBean.getObject();
    }
        
    @Bean(name="mapperScannerConfigurer2")
    public MapperScannerConfigurer mapperScannerConfigurer2() throws Exception {
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        mapperScannerConfigurer.setBasePackage(GlobalConstants.MITEL_MAPPER_PACKAGE);
        mapperScannerConfigurer.setMarkerInterface(MyBatisMapper.class);
        mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory2");
        return mapperScannerConfigurer;
    }
    */    
}
