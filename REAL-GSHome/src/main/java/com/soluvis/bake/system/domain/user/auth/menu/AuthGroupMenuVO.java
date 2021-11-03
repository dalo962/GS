package com.soluvis.bake.system.domain.user.auth.menu;

import com.soluvis.bake.system.domain.program.Program;
import lombok.Data;

import java.util.List;

@Data
public class AuthGroupMenuVO {

    private List<AuthGroupMenu> list;

    private Program program;
}
