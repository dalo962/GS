package com.soluvis.bake.system.domain.program.menu;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import com.soluvis.bake.common.service.menuManagerService;
import com.soluvis.bake.system.domain.BaseService;

@Service
public class MenuService extends BaseService<Menu, Long> {
    private MenuRepository menuRepository;

    @Inject
    public MenuService(MenuRepository menuRepository) {
        super(menuRepository);
        this.menuRepository = menuRepository;
    }

    public List<Menu> get(RequestParams requestParams) { 	
        String menuGrpCd = requestParams.getString("menuGrpCd", "");
        String progCd = requestParams.getString("progCd", "");
        String returnType = requestParams.getString("returnType", "hierarchy");
        boolean menuOpen = requestParams.getBoolean("menuOpen", true);
        List<Long> menuIds = (List<Long>) requestParams.getObject("menuIds");

        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(menuGrpCd)) {
            builder.and(qMenu.menuGrpCd.eq(menuGrpCd));
        }

        if (isNotEmpty(progCd)) {
            builder.and(qMenu.progCd.eq(progCd));
        }

        List<Menu> menuList = select()
                .from(qMenu)
                .leftJoin(qMenu.program, qProgram)
                .fetchJoin()
                .where(builder)
                .orderBy(qMenu.level.asc(), qMenu.sort.asc())
                .fetch();


        if (returnType.equals("hierarchy")) {
            List<Menu> hierarchyList = new ArrayList<>();
            List<Menu> filterList = new ArrayList<>();

            for (Menu menu : menuList) {
                menu.setOpen(menuOpen);

                if (menuIds != null) {
                    if (isNotEmpty(menu.getProgCd()) && !menuIds.contains(menu.getMenuId())) {
                        continue;
                    }
                }

                Menu parent = getParent(hierarchyList, menu);

                if (parent == null) {
                    hierarchyList.add(menu);
                } else {
                    parent.addChildren(menu);
                }
            }

            if (menuIds != null) {
                filterNoChildMenu(filterList, hierarchyList);
            } else {
                filterList.addAll(hierarchyList);
            }

            return filterList;
        }

        return menuList;
    }

    public boolean hasTerminalMenu(Menu menu) {
        boolean hasTerminalMenu = false;

        if (isNotEmpty(menu.getChildren())) {
            for (Menu _menu : menu.getChildren()) {
                hasTerminalMenu = hasTerminalMenu(_menu);

                if (hasTerminalMenu) {
                    return true;
                }
            }
        }

        if (isNotEmpty(menu.getProgCd())) {
            hasTerminalMenu = true;
        }

        return hasTerminalMenu;
    }

    public void filterNoChildMenu(List<Menu> filterList, List<Menu> startList) {
        if (isNotEmpty(startList)) {
            for (Menu menu : startList) {
                if (hasTerminalMenu(menu)) {
                    Menu parent = getParent(filterList, menu);

                    if (parent == null) {
                        filterList.add(menu.clone());
                    } else {
                        parent.addChildren(menu.clone());
                    }
                }

                if (isNotEmpty(menu.getChildren())) {
                    filterNoChildMenu(filterList, menu.getChildren());
                }
            }
        }
    }
    /** 
	 * @desc 기존 소스 주석 처리	 
    public List<Menu> getAuthorizedMenuList(String menuGrpCd, List<String> authGroupList) {
    	List<Long> menuIds = select().select(qAuthGroupMenu.menuId).distinct().from(qAuthGroupMenu).where(qAuthGroupMenu.grpAuthCd.in(authGroupList)).fetch();

        RequestParams<Menu> requestParams = new RequestParams<>(Menu.class);
        requestParams.put("menuGrpCd", menuGrpCd);
        requestParams.put("menuIds", menuIds);
        requestParams.put("menuOpen", "false");

        return get(requestParams);
    }*/    
    /** 
	 * @desc 계정과 권한에 대한 메뉴 id를 불러옴
	 */
    @Inject
	private menuManagerService mstService;
    
    public List<Menu> getAuthorizedMenuList(String user_cd, String menuGrpCd, List<String> authGroupList) {
    	Map<String, Object> map = new HashMap<String, Object>();
    	RequestParams<Menu> requestParams = new RequestParams<>(Menu.class);
    	
    	//System.out.println(authGroupList.size());
    	for(int i = 0; i < authGroupList.size(); i++)
    	{
    		String grp_auth_cd = authGroupList.get(0).toString();
    		map.put("grp_auth_cd", grp_auth_cd);
    		map.put("user_id", user_cd);
    	
    		List<Long> menuIds = mstService.loginMenuidSel(map);

    		requestParams.put("menuGrpCd", menuGrpCd);
    		requestParams.put("menuIds", menuIds);
    		requestParams.put("menuOpen", "false");
    	}
        return get(requestParams);
    }
    // 신규작성 ↑
    
    public Menu getParent(List<Menu> menus, Menu menu) {
        Menu parent = menus.stream().filter(m -> m.getId().equals(menu.getParentId())).findAny().orElse(null);

        if (parent == null) {
            for (Menu _menu : menus) {
                parent = getParent(_menu.getChildren(), menu);

                if (parent != null)
                    break;
            }
        }

        return parent;
    }

    @Transactional
    public void processMenu(MenuRequestVO menuVO) {
        saveMenu(menuVO.getList());
        deleteMenu(menuVO.getDeletedList());
    }

    @Transactional
    public void saveMenu(List<Menu> menus) {
        if(menus != null)
        {
	    	menus.forEach(m -> {
	            if (isEmpty(m.getProgCd())) {
	                m.setProgCd(null);
	            }
	
	            if (m.getLevel() == 0) {
	                m.setParentId(null);
	            }
	        });
        }
        
        save(menus);
        menus.stream().filter(menu -> isNotEmpty(menu.getChildren())).forEach(menu -> {
            menu.getChildren().forEach(m -> m.setParentId(menu.getId()));
            saveMenu(menu.getChildren());
        });
    }

    @Transactional
    public void deleteMenu(List<Menu> menus) {
        delete(menus);
        menus.stream().filter(menu -> isNotEmpty(menu.getChildren())).forEach(menu -> {
            deleteMenu(menu.getChildren());            
        });
    }

    @Transactional
    public void updateMenu(Long id, Menu request) {
        Menu exist = findOne(id);
        exist.setMultiLanguageJson(request.getMultiLanguageJson());
        save(exist);
    }
}
