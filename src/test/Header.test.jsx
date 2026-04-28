import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../component/Header/Header";
import "../i18n/i18n";

describe("Header Component", () => {
  test("renders logo and navigation items", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Labsoy Home/i })).toBeInTheDocument();
    const mainNav = screen.getByRole("navigation", { name: /Main Navigation/i });
    expect(screen.getAllByText("Services").length).toBeGreaterThan(0);
    expect(within(mainNav).getByRole("link", { name: /^Portfolio$/ })).toBeInTheDocument();
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
    expect(screen.getByTestId("button-header-language-toggle")).toBeInTheDocument();
  });

  test("applies active class to current route", () => {
    render(
      <MemoryRouter initialEntries={["/services"]}>
        <Header />
      </MemoryRouter>
    );

    const [servicesLink] = screen.getAllByText("Services");
    expect(servicesLink).toHaveClass("is-active");
  });

  test("marks portfolio active on portfolio route, not home link", () => {
    render(
      <MemoryRouter initialEntries={["/portfolio"]}>
        <Header />
      </MemoryRouter>
    );

    const mainNav = screen.getByRole("navigation", { name: /Main Navigation/i });
    expect(within(mainNav).getByRole("link", { name: /^Portfolio$/ })).toHaveClass("is-active");
    expect(within(mainNav).getByRole("link", { name: /^Home$/ })).not.toHaveClass("is-active");
  });
});
