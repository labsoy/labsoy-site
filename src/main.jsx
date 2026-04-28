import "./styles/index.css";
import "./i18n/i18n";
import { App } from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);