import './bootstrap';
import '../css/styles.css';
// import '../sass/_inputText.scss'
import 'material-icons/iconfont/material-icons.scss';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import '../sass/TablesComponent/_tablesStyle.scss'
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
//core
import "primereact/resources/primereact.min.css";
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '@/utils'
import { noty } from '@/utils';



// navigator.serviceWorker.getRegistrations().then(registrations => {
//     console.log(registrations)
//     registrations.forEach(registration => {
//         console.log(registration)
//         registration.unregister();
//     });
// });

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';
let error = false;
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    let [resource, config] = args;

    const response = await originalFetch(resource, { ...config, headers });
    if (response.status === 599) {
        if (!error) {
            noty('Sesión terminada', 'error');
            error = true;
            setTimeout(() => {
                const logout = document.getElementById('logoutButton')
                logout.click()
            }, 2000)
        }
    }
    return response;
};

const originalXhrOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    originalXhrOpen.call(this, method, url, async, user, password);
    this.setRequestHeader('Authorization', headers.Authorization);
};

createInertiaApp({

    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <BrowserRouter>
                <App {...props} />

            </BrowserRouter>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
