import React from "react";
import { render } from "@testing-library/react-native";
import { InvestmentItem } from "../src/components/InvestmentItem";
import { Investment } from "../src/types";

describe("InvestmentItem", () => {
  const mockInvestment: Investment = {
    id: 1,
    farmer_name: "John Doe",
    amount: 5000,
    crop: "Wheat",
    created_at: "2026-01-04T10:30:00.000Z",
  };

  it("renders investment item correctly", () => {
    const { getByText, getByTestId } = render(
      <InvestmentItem investment={mockInvestment} />
    );

    // Check if farmer name is displayed
    expect(getByText("John Doe")).toBeTruthy();

    // Check if amount is formatted correctly
    expect(getByText("$5,000.00")).toBeTruthy();

    // Check if crop is displayed
    expect(getByText("🌾 Wheat")).toBeTruthy();

    // Check if component has correct testID
    expect(getByTestId("investment-item")).toBeTruthy();
  });

  it("formats amount as currency", () => {
    const investment: Investment = {
      ...mockInvestment,
      amount: 1234.56,
    };

    const { getByText } = render(<InvestmentItem investment={investment} />);
    expect(getByText("$1,234.56")).toBeTruthy();
  });

  it("renders different crop types", () => {
    const investment: Investment = {
      ...mockInvestment,
      crop: "Corn",
    };

    const { getByText } = render(<InvestmentItem investment={investment} />);
    expect(getByText("🌾 Corn")).toBeTruthy();
  });

  it("handles long farmer names", () => {
    const investment: Investment = {
      ...mockInvestment,
      farmer_name: "This is a very long farmer name that should still render",
    };

    const { getByText } = render(<InvestmentItem investment={investment} />);
    expect(
      getByText("This is a very long farmer name that should still render")
    ).toBeTruthy();
  });
});
