import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "../i18n/i18n";
import { HomeContact } from "../component/Home/HomeContact";

describe("HomeContact", () => {
  it("submits valid data in test mode without navigation", () => {
    render(
      <MemoryRouter>
        <HomeContact />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByTestId("input-email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("input-message"), { target: { value: "Hello project" } });
    fireEvent.click(screen.getByTestId("button-submit-contact"));

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
