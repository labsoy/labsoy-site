import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "../i18n/i18n";
import { HomeCompany } from "../component/Home/HomeCompany";

describe("HomeCompany", () => {
  it("renders company section and links to about", () => {
    render(
      <MemoryRouter>
        <HomeCompany />
      </MemoryRouter>
    );

    const about = screen.getByTestId("home-company-link-about");
    expect(about).toHaveAttribute("href", "/about");
    expect(about).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
