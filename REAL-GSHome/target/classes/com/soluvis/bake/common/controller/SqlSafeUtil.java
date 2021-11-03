package com.soluvis.bake.common.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.chequer.axboot.core.controllers.BaseController;

/**
 * <h2>SqlSafeUtil</h2>
 * Util Class to help verify if provided string value is sql injection safe
 *
 * @author  Ramakrishna Punjal
 * @version 1.0.0
 * @since   2016-08-26
 *
 */
public class SqlSafeUtil {

	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	 
    private static final String SQL_TYPES =
            "TABLE, TABLESPACE, PROCEDURE, FUNCTION, TRIGGER, KEY, VIEW, MATERIALIZED VIEW, LIBRARY" +
                    "DATABASE LINK, DBLINK, INDEX, CONSTRAINT, TRIGGER, USER, SCHEMA, DATABASE, PLUGGABLE DATABASE, BUCKET, " +
                    "CLUSTER, COMMENT, SYNONYM, TYPE, JAVA, SESSION, ROLE, PACKAGE, PACKAGE BODY, OPERATOR" +
                    "SEQUENCE, RESTORE POINT, PFILE, CLASS, CURSOR, OBJECT, RULE, USER, DATASET, DATASTORE, " +
                    "COLUMN, FIELD, OPERATOR";

    private static final String[] SQL_REGEXPS = {
            "(?i)(.*)(\\b)+(OR|AND)(\\s)+(true|false)(\\s)*(.*)",
            "(?i)(.*)(\\b)+(OR|AND)(\\s)+(\\w)(\\s)*(\\=)(\\s)*(\\w)(\\s)*(.*)",
            "(?i)(.*)(\\b)+(OR|AND)(\\s)+(equals|not equals)(\\s)+(true|false)(\\s)*(.*)",
            "(?i)(.*)(\\b)+(OR|AND)(\\s)+([0-9A-Za-z_'][0-9A-Za-z\\d_']*)(\\s)*(\\=)(\\s)*([0-9A-Za-z_'][0-9A-Za-z\\d_']*)(\\s)*(.*)",
            "(?i)(.*)(\\b)+(OR|AND)(\\s)+([0-9A-Za-z_'][0-9A-Za-z\\d_']*)(\\s)*(\\!\\=)(\\s)*([0-9A-Za-z_'][0-9A-Za-z\\d_']*)(\\s)*(.*)",
            "(?i)(.*)(\\b)+(OR|AND)(\\s)+([0-9A-Za-z_'][0-9A-Za-z\\d_']*)(\\s)*(\\<\\>)(\\s)*([0-9A-Za-z_'][0-9A-Za-z\\d_']*)(\\s)*(.*)",
            "(?i)(.*)(\\b)+SELECT(\\b)+\\s.*(\\b)(.*)",
//            "(?i)(.*)(\\b)+SELECT(\\b)+\\s.*(\\b)+FROM(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+INSERT(\\b)+\\s.*(\\b)+INTO(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+UPDATE(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+DELETE(\\b)+\\s.*(\\b)+FROM(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+UPSERT(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+SAVEPOINT(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+CALL(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+ROLLBACK(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+KILL(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+DROP(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+CREATE(\\b)+(\\s)*(" + SQL_TYPES.replaceAll(",", "|") + ")(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+ALTER(\\b)+(\\s)*(" + SQL_TYPES.replaceAll(",", "|") + ")(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+TRUNCATE(\\b)+(\\s)*(" + SQL_TYPES.replaceAll(",", "|") + ")(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+LOCK(\\b)+(\\s)*(" + SQL_TYPES.replaceAll(",", "|") + ")(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+UNLOCK(\\b)+(\\s)*(" + SQL_TYPES.replaceAll(",", "|") + ")(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+RELEASE(\\b)+(\\s)*(" + SQL_TYPES.replaceAll(",", "|") + ")(\\b)+\\s.*(.*)",
            "(?i)(.*)(\\b)+DESC(\\b)+(\\w)*\\s.*(.*)",
            "(?i)(.*)(\\b)+DESCRIBE(\\b)+(\\w)*\\s.*(.*)",
            //"(.*)(/\\*|\\*/|;){1,}(.*)",
            //"(.*)(-){2,}(.*)",
            //"(.*)(/\\*|\\*/|\"|--|#)(.*)",            
            //"(?i)(.*)(\\b)+CASE(\\b)+\\s.*(\\b)+WHEN(\\b)+\\s.*(\\b)+THEN(\\b)+\\s.*(.*)",          
            "(.*)(-){2,}(.*)",                                                     // 2020-09-18 추가 --                
            "(.*)(')(.*)",                                                             // 2020-09-18 추가 '
            "(.*)(\")(.*)",                                                           // 2020-09-18 추가 "
            //"(.*)(\\(|\\))(.*)",                                             		// 2020-09-18 추가 () 
            "(.*)(#)(.*)",                                                             // 2020-09-18 추가 #
            "(.*)(=)(.*)",                                                            // 2020-09-18 추가 =
            "(.*)(\\|)(.*)",                                                           // 2020-09-18 추가 |           
            "(?i)(.*)(\\b)+UNION(\\b)+\\s.*(.*)",    // 2020-09-18 추가 
            "(?i)(.*)(\\b)+SELECT(\\b)+\\s.*(.*)",    // 2020-09-18 추가 
            "(?i)(.*)(\\b)+HAVING(\\b)+\\s.*(.*)",   // 2020-09-18 추가 
            "(?i)(.*)(\\b)+LIKE(\\b)+\\s.*(.*)",        // 2020-09-18 추가 
            "(?i)(.*)(\\b)+UPDATE(\\b)+\\s.*(.*)",   // 2020-09-18 추가 
            "(?i)(.*)(\\b)+DELETE(\\b)+\\s.*(.*)",    // 2020-09-18 추가 
            "(?i)(.*)(\\b)+DROP(\\b)+\\s.*(.*)",      // 2020-09-18 추가 
            //"(?i)(.*)(\\b)+CASE(\\b)+\\s.*(.*)",
            //"(?i)(.*)(\\b)+WHEN(\\b)+\\s.*(.*)",
            //"(?i)(.*)(\\b)+THEN(\\b)+\\s.*(.*)",
    };


    // pre-build the Pattern objects for faster validation
    // private static final List<Pattern> validationPatterns = buildValidationPatterns();
    private static final List<Pattern> validationPatterns = buildPatterns(SQL_REGEXPS);

    /**
     * Determines if the provided string value is SQL-Injection-safe.
     * <p>
     * Empty value is considered safe.
     * This is used in by the SqlInjectionSafe annotation.
     *
     * @param  dataString  string value that is to verified
     * @return   'true' for safe and 'false' for unsafe
     */
    public static boolean isSqlInjectionSafe(String dataString){
        if(isEmpty(dataString)){
            return true;
        }

        for(Pattern pattern : validationPatterns){
            if(matches(pattern, dataString)){
                return false;
            }
        }
        return true;
    }
    
    public static String getSqlInjectionSafe(String dataString) throws Exception{
        if(isEmpty(dataString)){
            return dataString;
        }

        for(Pattern pattern : validationPatterns){
            if(matches(pattern, dataString)){
                //return null;
            	logger.error(pattern + ">>" + dataString);
            	throw new NullPointerException();
            }
        }
        return dataString;
    }

    private static boolean matches(Pattern pattern, String dataString){
        Matcher matcher = pattern.matcher(dataString);
        return matcher.matches();
    }

    private static List<Pattern> buildPatterns(String[] expressionStrings){
        List<Pattern> patterns = new ArrayList<Pattern>();
        for(String expression : expressionStrings){
            patterns.add(getPattern(expression));
        }
        return patterns;
    }


    private static Pattern getPattern(String regEx){
        return Pattern.compile(regEx, Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
    }

    private static boolean isEmpty(CharSequence cs) {
        return cs == null || cs.length() == 0;
    }
}
