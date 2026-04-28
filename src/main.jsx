import "./styles/index.css";
import "./i18n/i18n";
import { App } from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

createRoot(document.getElementById('root')).render(
    <BrowserRouter basename={routerBasename}>
        <App />
    </BrowserRouter>
);