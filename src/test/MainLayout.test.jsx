import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import "../i18n/i18n";

describe("MainLayout", () => {
  test("renders app shell and children", () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <h1>Page Content</h1>
        </MainLayout>
      </MemoryRouter>
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });
});
