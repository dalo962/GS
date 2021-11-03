package com.soluvis.bake.system.domain.user;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = -1314427762L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUser user = new QUser("user");

    public final com.soluvis.bake.system.domain.QBaseJpaModel _super = new com.soluvis.bake.system.domain.QBaseJpaModel(this);

    public final StringPath company_cd = createString("company_cd");

    //inherited
    public final DateTimePath<java.time.Instant> createdAt = _super.createdAt;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    public final EnumPath<com.chequer.axboot.core.code.AXBootTypes.Deleted> delYn = createEnum("delYn", com.chequer.axboot.core.code.AXBootTypes.Deleted.class);

    public final StringPath email = createString("email");

    public final StringPath hpNo = createString("hpNo");

    public final StringPath ip = createString("ip");

    public final DateTimePath<java.time.Instant> lastLoginDate = createDateTime("lastLoginDate", java.time.Instant.class);

    public final StringPath locale = createString("locale");

    public final StringPath menuGrpCd = createString("menuGrpCd");

    public final DateTimePath<java.time.Instant> passwordUpdateDate = createDateTime("passwordUpdateDate", java.time.Instant.class);

    public final StringPath remark = createString("remark");

    //inherited
    public final DateTimePath<java.time.Instant> updatedAt = _super.updatedAt;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    public final com.soluvis.bake.system.domain.user.auth.QUserAuth userauth;

    public final StringPath userCd = createString("userCd");

    public final StringPath userNm = createString("userNm");

    public final StringPath userPs = createString("userPs");

    public final EnumPath<com.chequer.axboot.core.code.Types.UserStatus> userStatus = createEnum("userStatus", com.chequer.axboot.core.code.Types.UserStatus.class);

    public final EnumPath<com.chequer.axboot.core.code.AXBootTypes.Used> useYn = createEnum("useYn", com.chequer.axboot.core.code.AXBootTypes.Used.class);

    public QUser(String variable) {
        this(User.class, forVariable(variable), INITS);
    }

    public QUser(Path<? extends User> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUser(PathMetadata metadata, PathInits inits) {
        this(User.class, metadata, inits);
    }

    public QUser(Class<? extends User> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.userauth = inits.isInitialized("userauth") ? new com.soluvis.bake.system.domain.user.auth.QUserAuth(forProperty("userauth")) : null;
    }

}

