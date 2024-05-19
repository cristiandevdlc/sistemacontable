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
import '../../sass/TablesComponent/_tablesStyle.scss'
import "../../sass/TablesComponent/_tableEditDropStyle.scss";
import "../../sass/Select/_virtualizedSelect.scss";
import "../../sass/_scrollableContentStyle.scss";

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
            <div className="serverhostInfo non-selectable">{props.localServerInfo && props.localServerInfo}</div>
        </div>
    );
};

export default Home;
