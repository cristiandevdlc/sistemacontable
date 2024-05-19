<<<<<<< HEAD
import React, { useState } from "react";
import Footer from "@/components/Footer";
// import Header from "@/components/Header";
import LeftMenu from "@/components/LeftMenu";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import { useReducer } from "react";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
// import UserMenusContext from "@/Context/UserMenusContext";
import { getEnterpriseData } from "@/utils";
import { lazy, Suspense } from 'react';
import LoadingDiv from "@/components/LoadingDiv";
=======
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from "react";
// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import LeftMenu from "@/components/LeftMenu";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useReducer } from "react";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
// import UserMenusContext from "@/Context/UserMenusContext";
// import { getEnterpriseData } from "@/utils";
import { lazy, Suspense } from 'react';
// import LoadingDiv from "@/components/LoadingDiv";
>>>>>>> 3f79b784d3fe4f34f05becba95928cc467bd0f7e
import '../../sass/TablesComponent/_tablesStyle.scss'
import "../../sass/TablesComponent/_tableEditDropStyle.scss";
import "../../sass/Select/_virtualizedSelect.scss";
import "../../sass/_scrollableContentStyle.scss";
<<<<<<< HEAD

const Dashboard = lazy(() => import('./Dashboard'));

const routes = [
    {
        path: "/",
        component: Dashboard
    },
    {
        path: 'dashboard',
        component: Dashboard
    }
];

const Home = (props) => {
    const { post } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    // const [state, dispatch] = useReducer(reducer, initialState);
    // const [userMenus, setUserMenus] = useState();
    const [loggedUser, setLoggedUser] = useState();
    const [selectedMenu, setSelectedMenu] = useState();
    const [showMenu, setShowMenu] = useState(true);
    const [token, setToken] = useState(false);
    const [empresa, setEmpresa] = useState({
        empresa: '',
        logo: '',
    });

    useEffect(() => {
        const title = {
            menu1: 'Dashboard',
            menu2: '',
            menu3: '',
        };

        localStorage.setItem('title', JSON.stringify(title));
        localStorage.setItem('token', props.token);

        const url = location.pathname.substring(1);

        setToken(true);
        if (props.menuInicio && props.menuInicio.menu_url !== url) {
            return window.location.replace(`/${props.menuInicio.menu_url}`);
        }

    }, [props.token, props.menuInicio, location.pathname]);

    return (
        <div id="page-container">
            <div className="content sm:overflow-auto md:overflow-hidden">
                {/* <Header user={props.auth.user} empresa={empresa} /> */}
                <div className="scrollable-content styled-scroll">
                    <Routes>
                        {
                            routes.map((route, index) => (
                                <Route key={index} path={route.path} element={(
                                    <Suspense fallback={<div className="h-full"><LoadingDiv /></div>}>
                                        <route.component />
                                    </Suspense>
                                )} />
                            ))
                        }
                    </Routes>
                </div>
            </div>
=======

export default function Dashboard({ auth }) {


    const routes  = [

        {
            path: "/",
            import: lazy(() => import('./Dashboard'))
        },
        {
            path: 'dashboard',  
            import: lazy(() => import("./Dashboard"))
        },
        // {
        //     path: 'login',  
        //     import: lazy(() => import("./Login"))
        // },

    ];


    const Home = (props) => {
    const { post } = useForm()
    const navigate = useNavigate();
    const location = useLocation();
    const [state, dispatch] = useReducer(reducer, initialState)
    const [userMenus, setUserMenus] = useState()
    const [loggedUser, setLoggedUser] = useState()
    const [selectedMenu, setSelectedMenu] = useState()
    const [showMenu, setShowMenu] = useState(true);
    const [token, setToken] = useState(false);
    const [empresa, setEmpresa] = useState({
        empresa: '',
        logo: '',
    })
    // const [filteredMenus, setFilteredMenus] = useState(userMenus);

    useEffect(() => {
        // if (props.token) {
        const title = {
            menu1: 'Dashboard',
            menu2: '',
            menu3: '',
        }

        localStorage.setItem('title', JSON.stringify(title))
        localStorage.setItem('token', props.token)

        const url = location.pathname.substring(1)

        setToken(true)
        if (props.menuInicio && props.menuInicio.menu_url !== url) {
            return window.location.replace(`/${props.menuInicio.menu_url}`);
        }

    }, []);

    const getUserMenus = async () => {
        const response = await fetch(route("user.menus"))
        const data = await response.json()
        dispatch({ type: 'SET_USER_MENUS', payload: data })
        setUserMenus(data)
    };

    const getEmpresaLogged = () => {
        getEnterpriseData().then(res => {
            setEmpresa(res);
        })
    }

    const SetLoggedUser = () => {
        dispatch({ type: 'SET_LOGGED_USER', payload: props.auth.user })
        setLoggedUser(props.auth.user)
    }

    const SetSelectedMenuFunc = (menu) => {
        dispatch({ type: 'SET_SELECTED_MENU', payload: menu })
        setSelectedMenu(menu)
    }

    const MenuFunction = () => {
        setShowMenu(!showMenu);
    };

    const filterMenus = (menuList, calc = []) => {
        const regex = new RegExp(state.searchMenuTerm.toLowerCase(), 'u');
        const obj = {}
        menuList.forEach(menu => {
            if (menu.childs && menu.childs.length > 0) {
                filterMenus(menu.childs, calc);
            } else {
                const objKeys = Object.keys(menu);
                const child = {};

                for (const key of objKeys) {
                    child[key] = menu[key];
                }

                if (child.menu_nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(regex)) {
                    calc.push(child);
                }
            }
        });
        return calc
    };

    useEffect(() => {
        if (!userMenus && token) {
            getUserMenus();
            SetLoggedUser();
            getEmpresaLogged();
        }
    }, [userMenus, token]);

    useEffect(() => {
        if (state.searchMenuTerm !== '' && state.searchMenuTerm) {
            const filtered = filterMenus(state.userMenus)
            dispatch({ type: 'SET_FILTERED_MENUS', payload: filtered })
            // setFilteredMenus(filtered);
        } else {
            dispatch({ type: 'SET_FILTERED_MENUS', payload: userMenus })
            // setFilteredMenus(userMenus);
        }
    }, [state.searchMenuTerm, userMenus]);

    const containerClass = showMenu ? "body-container" : "body-container open";

    return (
        <div id="page-container">
                    <div className="content sm:overflow-auto md:overflow-hidden">
                        <div className="scrollable-content styled-scroll">
                            <Routes>
                                {
                                    routes.map((route, index) => (
                                        <Route key={index} lazy={route.import} path={route.path} element={(
                                            <Suspense fallback={
                                                <div className="h-full"> <LoadingDiv /> </div>
                                            }>
                                                <route.import />
                                            </Suspense>
                                        )} />
                                    ))
                                }
                            </Routes>
                        </div>
                    </div>
>>>>>>> 3f79b784d3fe4f34f05becba95928cc467bd0f7e
            <div className="serverhostInfo non-selectable">{props.localServerInfo && props.localServerInfo}</div>
        </div>
    );
};

<<<<<<< HEAD
export default Home;
=======
}       
>>>>>>> 3f79b784d3fe4f34f05becba95928cc467bd0f7e
