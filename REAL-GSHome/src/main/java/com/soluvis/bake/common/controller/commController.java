package com.soluvis.bake.common.controller;

import java.sql.SQLException;

import javax.inject.Inject;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;

import com.chequer.axboot.core.api.ApiException;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.ApiStatus;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.validator.CollectionValidator;

@ControllerAdvice
public class commController {

    @Inject
    protected LocalValidatorFactoryBean validator;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.addValidators(new CollectionValidator(validator));
    }

    protected static final String APPLICATION_JSON = "application/json; charset=UTF-8";

    protected static final String TEXT_PLAIN_UTF_8 = "text/plain; charset=UTF-8";

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);

    public ApiResponse ok() {
        return ApiResponse.of(ApiStatus.SUCCESS, "SUCCESS");
    }

    public ApiResponse ok(String message) {
        return ApiResponse.of(ApiStatus.SUCCESS, message);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ApiResponse handleForbidden(Exception e) {
        //return ApiResponse.error(ApiStatus.FORBIDDEN, e.getMessage());
    	return ApiResponse.error(ApiStatus.FORBIDDEN, "BAD_FORBIDEN");
    }

    @ExceptionHandler(TypeMismatchException.class)
    public ApiResponse handleBadRequestException(Exception e) {
        errorLogging(e);
        return ApiResponse.error(ApiStatus.BAD_REQUEST, "BAD_REQUEST");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ApiResponse handleRequestParameterException(MissingServletRequestParameterException e) {
        errorLogging(e);
        //return ApiResponse.error(ApiStatus.BAD_REQUEST, e.getMessage());
        return ApiResponse.error(ApiStatus.BAD_REQUEST, "BAD_PARAMETER");
    }

    @ExceptionHandler(ApiException.class)
    public ApiResponse handleApiException(ApiException apiException) {
        //return ApiResponse.error(ApiStatus.getApiStatus(apiException.getCode()), apiException.getMessage());
    	return ApiResponse.error(ApiStatus.getApiStatus(apiException.getCode()), "BAD_API_EXCEPTION");
    }

    @ExceptionHandler(Throwable.class)
    public ApiResponse handleException(Throwable throwable) {
        errorLogging(throwable);

        //ApiResponse apiResponse = ApiResponse.error(ApiStatus.SYSTEM_ERROR, throwable.getMessage());
        ApiResponse apiResponse = ApiResponse.error(ApiStatus.SYSTEM_ERROR, "Error!\n데이터 처리중 에러가 발생하였습니다.\n시스템 관리자에게 문의하세요.");
        //System.out.println(ApiStatus.SYSTEM_ERROR);
        Throwable rootCause = ExceptionUtils.getRootCause(throwable);

        if (rootCause != null) {
            if (rootCause instanceof SQLException) {
                //String message = String.format("데이터 처리중 에러가 발생하였습니다.\n시스템 관리자에게 문의하세요.\n\n에러내용 : %s", rootCause.getLocalizedMessage());
            	String message = String.format("Error!\n데이터 처리중 에러가 발생하였습니다.\n시스템 관리자에게 문의하세요.");
                apiResponse = ApiResponse.error(ApiStatus.SYSTEM_ERROR, message);
            }
        }
        return apiResponse;
    }

    protected void errorLogging(Throwable throwable) {
        if (logger.isErrorEnabled()) {

            Throwable rootCause = ExceptionUtils.getRootCause(throwable);

            if (rootCause != null) {
                throwable = rootCause;
            }

            if (throwable.getMessage() != null) {
            	logger.error(throwable.getMessage().replace("ORA", "ERROR"), throwable);
            	
            	//if(throwable.getMessage().indexOf("ORA") == -1)
            	//{
            	//	logger.error(throwable.getMessage(), throwable);
            	//}
            	//else
            	//{
            	//	logger.error(throwable.getMessage().replace("ORA", "ERROR").substring(0, 12), throwable.toString().replace("ORA", "ERROR").substring(0, 12));
            	//}
            	
            	//System.out.println(throwable.getMessage().replace("ORA", "ERROR").substring(1, 12));
            	//System.out.println(throwable.toString().replace("ORA", "ERROR").substring(1, 12));
                //logger.error("ERROR", "Error!\n데이터 처리중 에러가 발생하였습니다.\n시스템 관리자에게 문의하세요.");
            } else {
            	logger.error("ERROR", throwable);
            	
            	//if(throwable.getMessage().indexOf("ORA") == -1)
            	//{
            	//	logger.error("ERROR", throwable.toString());
            	//}
            	//else
            	//{
            	//	logger.error("ERROR", throwable.toString().replace("ORA", "ERROR").substring(0, 12));
            	//}
            	
            	//System.out.println(throwable.getMessage());
            	//System.out.println(throwable);
                //logger.error("ERROR", "Error!\n데이터 처리중 에러가 발생하였습니다.\n시스템 관리자에게 문의하세요.");
            }
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Object processValidationError(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldErrors().get(0);
        //ApiResponse error = ApiResponse.error(ApiStatus.SYSTEM_ERROR, fieldError.getDefaultMessage());
        ApiResponse error = ApiResponse.error(ApiStatus.SYSTEM_ERROR, "Error!\n데이터 처리중 에러가 발생하였습니다.\n시스템 관리자에게 문의하세요.");
        error.getError().setRequiredKey(fieldError.getField());
        return error;
    }
}
