import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";
import "../i18n/i18n";

describe("App routes", () => {
  test("renders home page content on root", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Hi there! this is")).toBeInTheDocument();
    expect(screen.getByText("Technology & Creative Excellence")).toBeInTheDocument();
    expect(screen.getByText(/How We Work:/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ready to Transform Your Business?" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Start Your Project Today" })).not.toBeInTheDocument();
  });

  test("renders portfolio page", () => {
    render(
      <MemoryRouter initialEntries={["/portfolio"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("button-category-all")).toBeInTheDocument();
    expect(screen.getByLabelText("Portfolio", { exact: true })).toBeInTheDocument();
  });

  test("renders services page", () => {
    render(
      <MemoryRouter initialEntries={["/services"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Enterprise Services" })).toBeInTheDocument();
    expect(screen.getAllByText("Enterprise AI Automation Platform").length).toBeGreaterThan(0);
  });

  test("renders about page", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "We Engineer Digital Momentum for Ambitious Businesses" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Standards Behind Our Work" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start your project" })).toBeInTheDocument();
  });

  test("renders contact page", () => {
    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Start Your Project Today" })).toBeInTheDocument();
  });
});
