import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AboutPage } from "../pages/AboutPage";
import "../i18n/i18n";

describe("AboutPage", () => {
  test("renders premium about content sections", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "We Engineer Digital Momentum for Ambitious Businesses" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Built to Close the Gap Between Strategy and Delivery" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Standards Behind Our Work" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why Teams Choose Labsoy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Proof Through Delivery" })).toBeInTheDocument();
  });

  test("renders about cta links", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Work with us" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start your project" })).toBeInTheDocument();
  });
});
