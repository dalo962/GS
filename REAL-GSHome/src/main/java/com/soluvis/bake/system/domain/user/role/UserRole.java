package com.soluvis.bake.system.domain.user.role;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import com.soluvis.bake.system.domain.BaseJpaModel;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "AX_USER_ROLE_M")
@Comment(value = "사용자 롤")
@Alias("userRole")
public class UserRole extends BaseJpaModel<Long> {

    @Id
    @Column(name = "ID", precision = 19, nullable = false)
    @Comment(value = "ID")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="SEQ_USER_ROLE_M")
    @SequenceGenerator(name="SEQ_USER_ROLE_M", sequenceName="SEQ_USER_ROLE_M", allocationSize = 1, initialValue = 1)
    @ColumnPosition(1)
    private Long id;

    @Column(name = "USER_CD", length = 100, nullable = false)
    @Comment(value = "사용자 코드")
    @ColumnPosition(2)
    private String userCd;

    @Column(name = "ROLE_CD", length = 100, nullable = false)
    @Comment(value = "롤 코드")
    @ColumnPosition(3)
    private String roleCd;

    @Override
    public Long getId() {
        return id;
    }
}
