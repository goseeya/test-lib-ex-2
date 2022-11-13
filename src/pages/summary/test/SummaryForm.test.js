import { fireEvent, render, screen } from "@testing-library/react";
import SummaryForm from "../SummaryForm";

test("Initial conditions", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checkbox).not.toBeChecked();
  const confirmButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  expect(confirmButton).toBeDisabled();
});
test("Checking checkbox enables button and disables it", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const button = screen.getByRole("button", { name: /confirm order/i });
  fireEvent.click(checkbox);
  expect(button).toBeEnabled();
  fireEvent.click(checkbox);
  expect(button).toBeDisabled();
});
