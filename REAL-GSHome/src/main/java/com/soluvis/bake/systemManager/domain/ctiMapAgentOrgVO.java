package com.soluvis.bake.systemManager.domain;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ctiMapAgentOrgVO {
	
    private List<ctiMapAgentOrg> list;
    
    private List<ctiMapAgentOrg> deletedList;

}
