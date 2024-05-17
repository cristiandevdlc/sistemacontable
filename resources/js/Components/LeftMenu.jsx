import React, { useEffect, useRef, useState } from "react";
import BackIcon from "../../png/LeftArrow.png";
import MenuIcon from "../../png/drag_handle_black_24dp.png";
import { Link } from "react-router-dom";
import "../../sass/MenusComponent/_leftMenu.scss";
import { useContext } from "react";
import UserMenusContext from "@/Context/UserMenusContext";
import Configuration from '../../png/configurationIcon.png'
import LogoutIcon from '../../png/logoutIcon.png';
import CambioEmpresa from '../../png/cambioEmpresa.png'
import { useForm } from "@inertiajs/react";
import { Dialog, DialogTitle, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import request from "@/utils";
import SearchIcon from '@mui/icons-material/Search';

const LeftMenu = (props) => {
    const menuClass = props.showMenu ? "leftmenu open" : "leftmenu close";
    const [activeMenu, setActiveMenu] = useState("");
    const [activeMenu2, setActiveMenu2] = useState("");
    const [activeMenu3, setActiveMenu3] = useState("");
    const { selectedMenu, SetSelectedMenuFunc, state, dispatch } = useContext(UserMenusContext);
    const [empresas, setEmpresas] = useState();
    const [cambioEmpresasCard, setCambioEmpresasCard] = useState();
    const [open, setOpen] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [filteredMenus, setFilteredMenus] = useState(userMenus);
    const menuSearcherRef = useRef()
    const menuSearcherIconRef = useRef()
    const [isInputFocused, setIsInputFocused] = useState(false);
    const { post } = useForm();

    const GetEmpresas = async () => {
        const response = await fetch(route("empresas-con-iconos"));
        const data = await response.json();
        setEmpresas(data);
    };

    const handleCloseModal = () => {
        setOpen(!open);
        setErrors({});
    };

    const logout = (e) => {
        e.preventDefault();
        localStorage.clear()
        post(route('logout'));
    };

    const changeServer = async (id) => {
        const newToken = await request(route('user.cambio-empresa', id))
        localStorage.setItem('token', newToken.token)
        return window.location.replace(window.location);
    }

    const setPageTitle = (menu1, menu2 = '', menu3 = '') => {
        const title = {
            menu1: menu1,
            menu2: menu2,
            menu3: menu3,
        }
        localStorage.setItem('title', JSON.stringify(title))
    }

    function renderMenu(menu, selectedMenu) {
        const handleClick = (menu_nombre) => {
            SetSelectedMenuFunc(menu_nombre);
            setPageTitle(menu_nombre);
        };

        return (
            <React.Fragment>
                {menu.childs && menu.childs.length !== 0 ? (
                    <div className={`leftmenu-item accordion`} onClick={() => handleClick(menu.menu_nombre)}>
                        {menu.menu_nombre}
                    </div>
                ) : (
                    <Link
                        to={menu.menu_url}
                        onClick={() => handleClick(menu.menu_nombre)}
                        className={`leftmenu-item ${selectedMenu === menu.menu_nombre ? "item-selected" : ""}`}
                    >
                        {menu.menu_nombre}
                    </Link>
                )}

                {menu.childs && menu.childs.length !== 0 && (
                    <div className="submenu-panel">
                        <ul className="leftmenu-list">
                            {menu.childs.map((submenu, index2) => (
                                <li key={index2}>
                                    {renderMenu(submenu, selectedMenu)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );
    }

    useEffect(() => {
        GetEmpresas();
    }, []);

    // useEffect(() => {
    //     if (state.searchMenuTerm !== '' && state.searchMenuTerm) {
    //         const filtered = filterMenus(userMenus)
    //         setFilteredMenus(filtered);
    //     } else {
    //         setFilteredMenus(userMenus);
    //     }
    // }, [state.searchMenuTerm, userMenus]);

    useEffect(() => {
        if (state.filteredMenus) {
            const handleClick = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu === this) {
                    this.classList.remove("active");
                    subPanel.style.maxHeight = null;
                    setActiveMenu(null);
                } else {
                    if (activeMenu) {
                        activeMenu.classList.remove("active");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("active");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu(this);
                }
            };
            const handleClick2 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu2 === this) {
                    this.classList.remove("active2");
                    subPanel.style.maxHeight = null;
                    setActiveMenu2(null);
                } else {
                    if (activeMenu2) {
                        activeMenu2.classList.remove("active2");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("active2");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu2(this);
                }
            };
            const handleClick3 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu3 === this) {
                    this.classList.remove("active3");
                    subPanel.style.maxHeight = null;
                    setActiveMenu3(null);
                } else {
                    if (activeMenu3) {
                        activeMenu3.classList.remove("active3");
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                        subPanel.style.maxHeight = null;
                    }
                    this.classList.add("active3");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu3(this);
                }
            };

            const accordions = document.querySelectorAll(".accordion");
            accordions.forEach((accordion) => {
                accordion.addEventListener("click", handleClick);
            });
            const accordions2 = document.querySelectorAll(".accordion2");
            accordions2.forEach((accordion) => {
                accordion.addEventListener("click", handleClick2);
            });
            const accordions3 = document.querySelectorAll(".accordion3");
            accordions3.forEach((accordion) => {
                accordion.addEventListener("click", handleClick3);
            });

            return () => {
                accordions.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick);
                });
                accordions2.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick2);
                });
                accordions3.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick3);
                });
            };
        }
    }, [state.filteredMenus, activeMenu, activeMenu2, activeMenu3, SetSelectedMenuFunc]);

    useEffect(() => {
        if (empresas) {
            setCambioEmpresasCard(empresas.map(empresas => (
                <div key={empresas.id} className="optEmpresa" >
                    <img src={`data:image/png;base64,${empresas.empresa_Logotipo}`} alt="" />
                    <p>{empresas.empresa_razonSocial}</p>
                </div>
            )));
        }
    }, [!empresas]);

    return (
        <div id="left-menu" className={menuClass}>
            <ul className="circles" ><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>
            {/* <div className="leftmenu-button cursor-pointer">
                <button onClick={props.MenuFunction}>
                    <img
                        className="non-selectable"
                        src={props.showMenu == true ? BackIcon : MenuIcon}
                        alt=""
                    />
                </button>
            </div> */}
            <div className="flex flex-col h-[100svh]">
                <div className="headerMenu pt-4 pl-7 pr-7 border-b-2 border-[#d1d1d117]">
                    <div className="user-info">
                        <p className="text-[12px]">{props.auth.user.usuario_username}</p>
                        <p className="text-[#fcfcfc] text-[14px] truncate">{props.auth.user.usuario_nombre}</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="leftmenu-button cursor-pointer">
                            <button onClick={props.MenuFunction}>
                                <img
                                    className="non-selectable"
                                    src={props.showMenu == true ? BackIcon : MenuIcon}
                                    alt=""
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='relative pt-2'>
                    <div className='flex justify-end min-h-[3rem] mr-5 mt-2 mb-3'>
                        <input
                            ref={menuSearcherRef}
                            id="search-input-leftmenu"
                            className={`search-input-leftmenu ${isInputFocused ? 'focused' : ''}`}
                            type="text"
                            value={state.searchMenuTerm}
                            onChange={e => {
                                // var key = event.keyCode;
                                // if ((key >= 65 && key <= 90) || key == 8)
                                // setSearchTerm(e.target.value)
                                dispatch({ type: 'SET_SEARCH_MENU_TERM', payload: e.target.value })
                            }}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                        />
                        <label htmlFor="search-input-leftmenu" className='non-selectable'><SearchIcon ref={menuSearcherIconRef} className={`search-icon-leftmenu ${isInputFocused ? 'focused' : ''}`} /></label>
                    </div>
                </div>
                <div className="containerMenu grow pt-1 blue-scroll">
                    <ul id="menus-list" className="leftmenu-list">
                        {state.filteredMenus && state.filteredMenus.length > 0 &&
                            state.filteredMenus.map((menu, index) => (
                                <li key={index}>
                                    {renderMenu(menu, selectedMenu)}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="footerMenu border-t-2 border-[#d1d1d117]">
                    <div className=" text-[#a8a8a8]">
                        <p className="text-[12px]">Empresa</p>
                        <p className="text-[#fcfcfc] cursor-pointer non-selectable" onClick={() => setOpen(!open)}>{props.empresa.empresa}</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 items-center logout-button">
                        <img id='logoutButton' src={LogoutIcon} onClick={(e) => logout(e)} className="w-[30px] h-[30px] cursor-pointer clickeableItem" />
                        {/* <img
                        src={CambioEmpresa}
                        onClick={() => setOpen(!open)}
                        className="w-[18px] h-[18px] cursor-pointer clickeableItem"
                    /> */}
                    </div>
                </div>
            </div>
            <Dialog
                open={open} maxWidth="sm" fullWidth
                onClose={() => { handleCloseModal(); setOpen(!open); }}
            >
                <DialogTitle className="flex items-center justify-between">
                    Cambio de empresa
                    <CloseIcon
                        className="cursor-pointer"
                        onClick={() => setOpen(!open)}
                        style={{
                            fontSize: "16px",
                            color: "gray"
                        }}
                    />
                </DialogTitle>
                <div className="flex justify-center">
                    <Divider className="w-[95%]" />
                </div>
                <div className="containerEmpresas">
                    {empresas && empresas.map((item, index) => (
                        <button className="p-3" onClick={() => changeServer(item.empresa_idEmpresa)} key={index}>
                            <div className="optEmpresa" >
                                <img src={`data:image/png;base64,${item.empresa_Logotipo}`} alt="" />
                                <p>{item.empresa_razonSocial}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </Dialog>
        </div>
    );
};

export default LeftMenu;