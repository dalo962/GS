package com.soluvis.bake.system.domain.sample.parent;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentSampleRepository extends AXBootJPAQueryDSLRepository<ParentSample, String> {
}
