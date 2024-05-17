export default function CheckMenuPermission(userMenus = [], url = location.pathname.substring(1)) {
    if (Array.isArray(userMenus)) {
        let result = null;
        userMenus.every((um1) => {
            if (um1.menu_url === url) {
                result = um1;
                return false
            } else {
                um1.childs.every((um2) => {
                    if (um2.menu_url === url) {
                        result = um2;
                        return false
                    } else {
                        um2.childs.every((um3) => {
                            if (um3.menu_url === url) {
                                result = um3;
                                return false
                            } else {
                                return true
                            }
                        })
                        return (result === null)
                    }
                })
                return (result === null)
            }
        })
        if (result)
            return {
                read: result.pivot.usuarioxmenu_consulta == 1,
                write: result.pivot.usuarioxmenu_alta == 1,
                update: result.pivot.usuarioxmenu_cambio == 1,
                special: result.pivot.usuarioxmenu_especial == 1,
                status: true
            }
        else return { status: false }

    }
    return { status: false }
}