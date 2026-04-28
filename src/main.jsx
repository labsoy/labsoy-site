import "./styles/index.css";
import "./i18n/i18n";
import { App } from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import faviconUrl from "./assets/icons/favicon.png";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;
const ensureFavicon = () => {
    const selector = 'link[rel="icon"]';
    const existing = document.head.querySelector(selector);
    if (existing) {
        existing.setAttribute("href", faviconUrl);
        return;
    }
    const link = document.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute("type", "image/png");
    link.setAttribute("href", faviconUrl);
    document.head.appendChild(link);
};

ensureFavicon();

createRoot(document.getElementById('root')).render(
    <BrowserRouter basename={routerBasename}>
        <App />
    </BrowserRouter>
);