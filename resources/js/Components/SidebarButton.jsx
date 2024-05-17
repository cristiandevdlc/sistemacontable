import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Drawer } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import MenuIcon from "../../png/drag_handle_black_24dp.png";
import UserMenusContext from "@/Context/UserMenusContext";
import ImageX from "../../png/xDeleteOrange.png"
import "../../sass/MenusComponent/_sidebar.scss";
import LogoutIcon from '../../png/logoutIcon.png';
import SearchIcon from '@mui/icons-material/Search';
import { useForm } from "@inertiajs/react";
import { useRef } from "react";

const SidebarButton = ({ props }) => {
    const { selectedMenu, SetSelectedMenuFunc, state, dispatch } = useContext(UserMenusContext);
    const [show, setShow] = useState(false);
    const [activeMenu, setActiveMenu] = useState("");
    const [activeMenu2, setActiveMenu2] = useState("");
    const [activeMenu3, setActiveMenu3] = useState("");
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const { post } = useForm();
    const sidebarMenuSearcherRef = useRef()
    const sidebarMenuSearcherIconRef = useRef()
    const [isInputFocused, setIsInputFocused] = useState(false);

    const showFunc = () => {
        setShow(!show);
        setActiveMenuIndex(null);
    };

    const logout = (e) => {
        e.preventDefault();
        localStorage.clear()
        post(route('logout'));
    };

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
                    <div className={`flex gap-16 sidebar-item sidebar-accordion`} onClick={() => handleClick(menu.menu_nombre)}>
                        {menu.menu_nombre}
                    </div>
                ) : (
                    <Link
                        to={menu.menu_url}
                        onClick={() => handleClick(menu.menu_nombre)}
                        className={`sidebar-item ${selectedMenu === menu.menu_nombre ? "item-selected" : ""}`}
                    >
                        {menu.menu_nombre}
                    </Link>
                )}

                {menu.childs && menu.childs.length !== 0 && (
                    <div className="submenu-panel">
                        <ul className="sidebar-list">
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

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth > 600) {
    //             setShow(false);
    //             setActiveMenuIndex(null);
    //         }
    //     };

    //     window.addEventListener("resize", handleResize);

    //     return () => {
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, []);

    useEffect(() => {
        if (state.filteredMenus) {
            const handleClick = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu === this) {
                    this.classList.remove("sidebar-active");
                    subPanel.style.maxHeight = null;
                    setActiveMenu(null);
                } else {
                    if (activeMenu) {
                        activeMenu.classList.remove("sidebar-active");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("sidebar-active");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu(this);
                }
            };
            const handleClick2 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu2 === this) {
                    this.classList.remove("sidebar-active2");
                    subPanel.style.maxHeight = null;
                    setActiveMenu2(null);
                } else {
                    if (activeMenu2) {
                        activeMenu2.classList.remove("sidebar-active2");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("sidebar-active2");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu2(this);
                }
            };
            const handleClick3 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu3 === this) {
                    this.classList.remove("sidebar-active3");
                    subPanel.style.maxHeight = null;
                    setActiveMenu3(null);
                } else {
                    if (activeMenu3) {
                        activeMenu3.classList.remove("sidebar-active3");
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                        subPanel.style.maxHeight = null;
                    }
                    this.classList.add("sidebar-active3");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu3(this);
                }
            };

            const accordions = document.querySelectorAll(".sidebar-accordion");
            accordions.forEach((accordion) => {
                accordion.addEventListener("click", handleClick);
            });
            const accordions2 = document.querySelectorAll(".sidebar-accordion2");
            accordions2.forEach((accordion) => {
                accordion.addEventListener("click", handleClick2);
            });
            const accordions3 = document.querySelectorAll(".sidebar-accordion3");
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

    const handleMenuClick = (index) => {
        if (activeMenuIndex === index) {
            setActiveMenuIndex(null);
        } else {
            setActiveMenuIndex(index);
        }
    };

    return (
        <div>
            <React.Fragment>
                <Button id="sidebar-button" onClick={showFunc}>
                    <img className="non-selectable" src={MenuIcon} />
                </Button>
                <Drawer anchor="right" open={show} onClose={showFunc}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: 275, height: "100dvh", background: "#1B2654", overflow: "hidden" }} role="presentation">
                        <div className="sidebar-menu">
                            <div className="flex flex-col h-[100svh]">
                                <div className="headerMenu pt-4 pl-7 pr-7 border-b-2 border-[#d1d1d117]">
                                    <div className="user-info">
                                        <p className="text-[12px]">{props.user.usuario_username}</p>
                                        <p className="text-[#fcfcfc] text-[14px] truncate">{props.user.usuario_nombre}</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="sidebarMenu" onClick={showFunc}>
                                            <img width="25" height="25" src={ImageX} />
                                        </div>
                                    </div>
                                </div>
                                <div className='relative pt-2'>
                                    <div className='flex justify-end min-h-[3rem] mr-4 mt-2 mb-3'>
                                        <input
                                            ref={sidebarMenuSearcherRef}
                                            id="search-input-sidebarMenu"
                                            className={`search-input-sidebarMenu ${isInputFocused ? 'focused' : ''}`}
                                            type="text"
                                            value={state.searchMenuTerm}
                                            onChange={e => {
                                                dispatch({ type: 'SET_SEARCH_MENU_TERM', payload: e.target.value })
                                            }}
                                            onFocus={() => setIsInputFocused(true)}
                                            onBlur={() => setIsInputFocused(false)}
                                        />
                                        <label htmlFor="search-input-sidebarMenu" className='non-selectable'><SearchIcon ref={sidebarMenuSearcherIconRef} className={`search-icon-sidebarMenu ${isInputFocused ? 'focused' : ''}`} /></label>
                                    </div>
                                </div>
                                <div className="sidebar-containerMenu grow blue-scroll">
                                    {/* <ul className="pt-1 sidebar-list">
                                    {state.filteredMenus && state.filteredMenus.map((menu, index) => {
                                        const isMenuOpen = activeMenuIndex === index;
                                        return (
                                            <li key={index}>
                                                {menu.childs.length !== 0 ? (
                                                    <div className={`sidebar-item ${menu.childs.length !== 0 ? "sidebar-accordion" : ""} ${isMenuOpen ? "sidebar-active" : ""}`}
                                                        onClick={(e) => {
                                                            e.currentTarget.classList.toggle("sidebar-active");
                                                            const subPanel = e.currentTarget.nextElementSibling;
                                                            if (subPanel.style.maxHeight) {
                                                                subPanel.style.maxHeight = null;
                                                            } else {
                                                                subPanel.style.maxHeight = subPanel.scrollHeight + "px";
                                                            }
                                                            handleMenuClick(index);
                                                        }}
                                                    >
                                                        {menu.menu_nombre}
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={menu.menu_url}
                                                        onClick={() => { SetSelectedMenuFunc(menu.menu_nombre); setShow(false); }}
                                                        className={`sidebar-item ${selectedMenu === menu.menu_nombre ? "item-selected" : ""}`}
                                                    >
                                                        {menu.menu_nombre}
                                                    </Link>
                                                )}
                                                {menu.childs.length !== 0 && (
                                                    <div className={`submenu-panel ${isMenuOpen ? "submenu-panel-active" : ""}`}>
                                                        <ul className="sidebar-list">
                                                            {menu.childs.length !== 0 && menu.childs.map((menu, index2) => {
                                                                const isMenuOpen = activeMenuIndex === index2;
                                                                return (
                                                                    <li key={index2}>
                                                                        {menu.childs.length !== 0 ? (
                                                                            <div className={`sidebar-item ${menu.childs.length !== 0 ? "sidebar-accordion" : ""} ${isMenuOpen ? "sidebar-active" : ""}`}
                                                                                onClick={(e) => {
                                                                                    e.currentTarget.classList.toggle("sidebar-active");
                                                                                    const subPanel = e.currentTarget.nextElementSibling;
                                                                                    if (subPanel.style.maxHeight) {
                                                                                        subPanel.style.maxHeight = null;
                                                                                    } else {
                                                                                        subPanel.style.maxHeight = subPanel.scrollHeight + "px";
                                                                                    }
                                                                                    handleMenuClick(index2);
                                                                                }}
                                                                            >
                                                                                {menu.menu_nombre}
                                                                            </div>
                                                                        ) : (
                                                                            <Link
                                                                                to={menu.menu_url}
                                                                                onClick={() => { SetSelectedMenuFunc(menu.menu_nombre); setShow(false); }}
                                                                                className={`sidebar-item ${selectedMenu === menu.menu_nombre ? "item-selected" : ""}`}
                                                                            >
                                                                                {menu.menu_nombre}
                                                                            </Link>
                                                                        )}
                                                                        {menu.childs.length !== 0 && (
                                                                            <div className={`submenu-panel2 ${isMenuOpen ? "submenu-panel-active" : ""}`}>
                                                                                <ul className="sidebar-list">
                                                                                    {menu.childs.length !== 0 &&
                                                                                        menu.childs.map((menu, index2) => {
                                                                                            const isMenuOpen = activeMenuIndex === index2;
                                                                                            return (
                                                                                                <li key={index2}>
                                                                                                    {menu.childs.length !== 0 ? (
                                                                                                        <div className={`sidebar-item ${menu.childs.length !== 0 ? "sidebar-accordion" : ""} ${isMenuOpen ? "sidebar-active" : ""}`}
                                                                                                            onClick={(e) => {
                                                                                                                e.currentTarget.classList.toggle("sidebar-active");
                                                                                                                const subPanel = e.currentTarget.nextElementSibling;
                                                                                                                if (subPanel.style.maxHeight) {
                                                                                                                    subPanel.style.maxHeight = null;
                                                                                                                } else {
                                                                                                                    subPanel.style.maxHeight = subPanel.scrollHeight + "px";
                                                                                                                }
                                                                                                                handleMenuClick(index2);
                                                                                                            }}
                                                                                                        >
                                                                                                            {menu.menu_nombre}
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <Link
                                                                                                            to={menu.menu_url}
                                                                                                            onClick={() => { SetSelectedMenuFunc(menu.menu_nombre); setShow(false); }}
                                                                                                            className={`sidebar-item ${selectedMenu === menu.menu_nombre ? "item-selected" : ""}`}
                                                                                                        >
                                                                                                            {menu.menu_nombre}
                                                                                                        </Link>
                                                                                                    )}
                                                                                                    {menu.childs.length !== 0 && (
                                                                                                        <div className={`submenu-panel3 ${isMenuOpen ? "submenu-panel-active" : ""}`}>
                                                                                                            {menu.childs.map((submenu, index3) => {
                                                                                                                return (
                                                                                                                    <Link
                                                                                                                        key={index3}
                                                                                                                        to={submenu.menu_url}
                                                                                                                        className={`sidebar-subitem ${selectedMenu === submenu.menu_nombre ? "item-selected" : ""}`}
                                                                                                                        onClick={() => { SetSelectedMenuFunc(submenu.menu_nombre); setShow(false); }}
                                                                                                                    >
                                                                                                                        {submenu.menu_nombre}
                                                                                                                    </Link>
                                                                                                                );
                                                                                                            })}

                                                                                                        </div>
                                                                                                    )}
                                                                                                </li>
                                                                                            );
                                                                                        })}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul> */}
                                    <ul id="sidebar-list" className="sidebar-list">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Drawer>
            </React.Fragment>
        </div>
    );
};

export default SidebarButton;
