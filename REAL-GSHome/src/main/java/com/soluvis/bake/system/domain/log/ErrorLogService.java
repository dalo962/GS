package com.soluvis.bake.system.domain.log;

import javax.inject.Inject;
import javax.persistence.Query;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.domain.log.AXBootErrorLog;
import com.chequer.axboot.core.domain.log.AXBootErrorLogService;
import com.chequer.axboot.core.utils.MDCUtil;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import com.chequer.axboot.core.utils.PhaseUtils;
import com.soluvis.bake.system.domain.BaseService;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.StackTraceElementProxy;
import ch.qos.logback.core.util.ContextUtil;


@Service
public class ErrorLogService extends BaseService<ErrorLog, Long> implements AXBootErrorLogService {

    private ErrorLogRepository errorLogRepository;

    @Inject
    private AXBootContextConfig axBootContextConfig;

    @Inject
    public ErrorLogService(ErrorLogRepository errorLogRepository) {
        super(errorLogRepository);
        this.errorLogRepository = errorLogRepository;
    }

    @Override
    public void saveLog(AXBootErrorLog axBootErrorLog) {
        ErrorLog errorLog = ModelMapperUtils.map(axBootErrorLog, ErrorLog.class);
        save(errorLog);
    }

    @Override
	@Transactional
    public void deleteAllLogs() {
        Query query = em.createNativeQuery("DELETE FROM AX_ERROR_LOG_M");
        query.executeUpdate();
    }

    @Override
    public void deleteLog(Long id) {
        delete(id);
    }

    @Override
    public AXBootErrorLog build(ILoggingEvent loggingEvent) {
        ErrorLog errorLog = new ErrorLog();
        errorLog.setPhase(PhaseUtils.phase().substring(0,3999));
        errorLog.setSystem(axBootContextConfig.getApplication().getName().substring(0,3999));
        errorLog.setLoggerName(loggingEvent.getLoggerName().substring(0,3999));
        errorLog.setServerName(axBootContextConfig.getServerName().substring(0,3999));
        errorLog.setHostName(getHostName().substring(0,3999));
        errorLog.setPath(MDCUtil.get(MDCUtil.REQUEST_URI_MDC).substring(0,3999));
        //errorLog.setMessage(loggingEvent.getFormattedMessage());
        errorLog.setMessage("Error!!");
        errorLog.setHeaderMap(MDCUtil.get(MDCUtil.HEADER_MAP_MDC).substring(0,3999));        
        errorLog.setParameterMap(MDCUtil.get(MDCUtil.PARAMETER_BODY_MDC).substring(0,3999));
        errorLog.setUserInfo(MDCUtil.get(MDCUtil.USER_INFO_MDC).substring(0,3999));        
        
        if (loggingEvent.getThrowableProxy() != null) {
            errorLog.setTrace(getStackTrace(loggingEvent.getThrowableProxy().getStackTraceElementProxyArray()));
        }

        return errorLog;
    }


    public String getHostName() {
        try {
            return ContextUtil.getLocalHostName();
        } catch (Exception e) {
            // ignored
        	e.getMessage();
        }
        return null;
    }

    public String getStackTrace(StackTraceElementProxy[] stackTraceElements) {
        if (stackTraceElements == null || stackTraceElements.length == 0) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        for (StackTraceElementProxy element : stackTraceElements) {
            sb.append(element.toString());
            sb.append("\n");
        }
        return sb.toString().substring(0, 3999);
    }
}
