package com.soluvis.bake.system.domain;

import com.soluvis.bake.system.domain.code.QCommonCode;
import com.soluvis.bake.system.domain.file.QCommonFile;
import com.soluvis.bake.system.domain.program.QProgram;
import com.soluvis.bake.system.domain.program.menu.QMenu;
import com.soluvis.bake.system.domain.user.QUser;
import com.soluvis.bake.system.domain.user.auth.QUserAuth;
import com.soluvis.bake.system.domain.user.auth.menu.QAuthGroupMenu;
import com.soluvis.bake.system.domain.user.role.QUserRole;
import com.chequer.axboot.core.domain.base.AXBootBaseService;
import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;

import java.io.Serializable;


public class BaseService<T, ID extends Serializable> extends AXBootBaseService<T, ID> {

    protected QUserRole qUserRole = QUserRole.userRole;
    protected QAuthGroupMenu qAuthGroupMenu = QAuthGroupMenu.authGroupMenu;
    protected QCommonCode qCommonCode = QCommonCode.commonCode;
    protected QUser qUser = QUser.user;
    protected QProgram qProgram = QProgram.program;
    protected QUserAuth qUserAuth = QUserAuth.userAuth;
    protected QMenu qMenu = QMenu.menu;
    protected QCommonFile qCommonFile = QCommonFile.commonFile;

    protected AXBootJPAQueryDSLRepository<T, ID> repository;

    public BaseService() {
        super();
    }

    public BaseService(AXBootJPAQueryDSLRepository<T, ID> repository) {
        super(repository);
        this.repository = repository;
    }
}
