package com.soluvis.bake.common.utils;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class RequestUtil {
	
	//private static final Logger logger = LoggerFactory.getLogger(RequestUtil.class);
	
	public static Map<String, Object> getParameterMap(HttpServletRequest request) {

		Enumeration<?> paramNames = request.getParameterNames();

		Map<String, Object> paramMap = new HashMap<String, Object>();

		while (paramNames.hasMoreElements()) {
			
			String name = paramNames.nextElement().toString();
			String value = request.getParameter(name);
			
			//logger.info("Param Key : " + name + " Value : " + value);
			paramMap.put(name, value);
		}
		
		return paramMap;
	}
	
	public static String getUserIp(){
		String ip = null;
		
		try
		{		
	        HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
	
	        ip = request.getHeader("X-Forwarded-For");
	        
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getHeader("Proxy-Client-IP"); 
	        } 
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getHeader("WL-Proxy-Client-IP"); 
	        } 
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getHeader("HTTP_CLIENT_IP"); 
	        } 
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getHeader("HTTP_X_FORWARDED_FOR"); 
	        }
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getHeader("X-Real-IP"); 
	        }
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getHeader("X-RealIP"); 
	        }
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getHeader("REMOTE_ADDR");
	        }
	        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	            ip = request.getRemoteAddr(); 
	        }
		}
		catch(Exception e)
		{
			e.getStackTrace();
		}
		
		return ip;
	}
}
