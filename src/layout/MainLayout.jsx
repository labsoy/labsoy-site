import { Header } from "../component/Header/Header";
import { Footer } from "../component/Footer/Footer";
import { useHashScroll } from "../hooks/useHashScroll";

export const MainLayout = ({ children }) => {
  useHashScroll();
  return (
    <div className="app-shell">
      <Header />
      <main id="main-content" className="app-shell__main" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};
