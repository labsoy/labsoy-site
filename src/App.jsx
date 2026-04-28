import { Routes, Route } from 'react-router-dom';
import { HomePage } from "./pages/HomePage.jsx";
import { ChatPage } from "./pages/ChatPage.jsx";
import { LeadCaptureModal } from "./component/LeadCaptureModal/LeadCaptureModal.jsx";
import { MainLayout } from "./layout/MainLayout.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ServicesPage } from "./pages/ServicesPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { PortfolioPage } from "./pages/PortfolioPage.jsx";

export const App = () => {
    return (
        <>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </MainLayout>
            <ChatPage />
            <LeadCaptureModal />
        </>
    );
};