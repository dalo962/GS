package com.soluvis.bake.system.domain;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.domain.Persistable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.soluvis.bake.system.utils.SessionUtils;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@MappedSuperclass
@DynamicInsert
@DynamicUpdate
public abstract class TranJpaModel<PK extends Serializable> implements Persistable<PK>, Serializable {

    @Override
    @JsonIgnore
    public boolean isNew() {
        return null == getId();
    }

    @Column(name = "CREATED_AT", updatable = false)
    protected Date createdAt;

    @Column(name = "CREATED_BY", updatable = false)
    protected String createdBy;

    @PrePersist
    protected void onPersist() {
        this.createdBy = SessionUtils.getCurrentLoginUserCd();
        this.createdAt = new Date();
    }

    @PostLoad
    protected void onPostLoad() {
    }

}
