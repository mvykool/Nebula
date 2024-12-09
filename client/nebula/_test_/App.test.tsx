import React from "react";
import App from "./../src/App";

import { render, screen } from "@testing-library/react";

describe(" App component", () => {
  it("should render app", () => {
    render(<App />);

    expect(screen.getByTestId("id")).toBeInTheDocument();
  });
});
