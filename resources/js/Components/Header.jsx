import React, { useState } from "react";
import intergasLogo from "../../png/Grupo 10@2x.png";
import { Link, redirect } from "react-router-dom";
import UserMenusContext from "@/Context/UserMenusContext";
import '../../css/styles.css'
import fireImage from '../../png/flama.png';
import SidebarButton from "./SidebarButton";
import { useContext, useEffect } from "react";

const Header = (props) => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [menu1, setMenu1] = useState();
    const [menu2, setMenu2] = useState();
    const [menu3, setMenu3] = useState();
    const [aux, setAux] = useState(false);
    const { userMenus, selectedMenu, SetSelectedMenuFunc } = useContext(UserMenusContext);
    const popUpClass = showPopUp ? "popup-menu" : "hidden";

    useEffect(() => {
        if (aux) verifyMenuTitle()
        else verifyMenuTitle()
    }, [userMenus, selectedMenu]);

    const verifyMenuTitle = () => {
        if (Array.isArray(userMenus)) {
            const url = location.pathname.substring(1)

            let result = null;
            userMenus.every((um1) => {
                if (um1.menu_url === url) {
                    result = { menu1: um1.menu_nombre };
                    return false
                } else {
                    um1.childs.every((um2) => {
                        if (um2.menu_url === url) {
                            result = { menu2: um1.menu_nombre, menu1: um2.menu_nombre };
                            return false
                        } else {
                            um2.childs.every((um3) => {
                                if (um3.menu_url === url) {
                                    result = { menu3: um1.menu_nombre, menu2: um2.menu_nombre, menu1: um3.menu_nombre };
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
            if (result == null) result = { menu1: '' }
            setMenu1(result.menu1 ?? '')
            setMenu2(result.menu2 ?? '')
            setMenu3(result.menu3 ?? '')
            setAux(false)
        } else {
            setAux(true)
        }
    }

    return (
        <div className="pt-[5px] px-[5px]">
            <div className="header">
                <div className="header-options">
                    <SidebarButton props={props} />
                </div>
                <div className="max-[600px]:hidden titleHeader">
                    <img src={fireImage} alt="" className="headerIcon" />
                    <p className="headerRoute">
                        {
                            menu3 && menu3 !== '' ? (` ${menu3} / ${menu2} / ${menu1}`) : null
                        }
                        {
                            menu2 !== '' && menu3 === '' ? (` ${menu2} / ${menu1}`) : null
                        }
                        {
                            menu1 !== '' && menu2 === '' && menu3 === '' ? (` ${menu1}`) : null
                        }
                    </p>
                </div>
                <Link to={'/'} className="header-logo">
                    <img className="non-selectable max-h-[40px]" src={`data:image/png;base64, ${props.empresa.logo}`} alt="logo" />
                </Link>
            </div>
            <div className="min-[601px]:hidden mb-3 movilPathContainer">
                <span className="headerRoute">
                    {
                        menu3 && menu3 !== '' ? (` ${menu3} / ${menu2} / ${menu1}`) : null
                    }
                    {
                        menu2 !== '' && menu3 === '' ? (` ${menu2} / ${menu1}`) : null
                    }
                    {
                        menu1 !== '' && menu2 === '' && menu3 === '' ? (` ${menu1 ?? 'Unknown'}`) : null
                    }
                </span>
            </div>
        </div>
    );
};

export default Header;
