package com.soluvis.bake.common.controller;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * <h2>SQLInjectionSafeValidator</h2>
 * The Constraint validator for for the annotation SQLInjectionSafe
 *
 * @author  Ramakrishna Punjal
 * @version 1.0.0
 * @since   2016-08-26
 * @see     SQLInjectionSafe
 *
 */
public class SQLInjectionSafeValidator implements ConstraintValidator<SQLInjectionSafe, String> {

    @Override
	public void initialize(SQLInjectionSafe sqlInjectionSafe) { }

    @Override
	public boolean isValid(String dataString, ConstraintValidatorContext cxt) {
        return SqlSafeUtil.isSqlInjectionSafe(dataString);
    }

}
