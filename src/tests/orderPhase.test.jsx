import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();
  // render app
  // no need to wrap in wrapper cuz app already has wrapper
  render(<App />);

  // add ice cream scoops and toppings
  // await here cuz option appears after axios call is resolved
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  //   const scoopsSubtotal = screen.getByText("Scoops subtotal", { exact: false });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  //   expect(scoopsSubtotal).toHaveTextContent("$4.00");

  // here no need to await cuz its the same axios call as before
  const chocolateInput = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  const cherryCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherryCheckbox);

  //   const toppingsTotal = screen.getByText("Toppings subtotal", { exact: false });
  //   expect(toppingsTotal).toHaveTextContent("$1.50");

  // find and click order button
  //   const orderButton = screen.getByText("Order");

  const orderButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  await user.click(orderButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  // checksummary option items
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  // alternatively
  // const optionItems = screen.getAllByRole('listItem);
  // const optionItemsText = optionItems.map((item) => item.textContent);
  // expect(optionItemsText).toEqual(['1 Vanilla', '2 Chocolate', 'Cherries']);

  // accept terms and conditions and click the button to confirm order
  const termsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(termsCheckbox);

  const confirmButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmButton);

  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // check confirmation page text
  // async cuz therewas POST betweem summary and confirmation
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });

  const notLoading = screen.queryByText("loading");
  expect(notLoading).not.toBeInTheDocument();

  expect(thankYouHeader).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // confirm order number on confirmation page
  //   const confirmOrderNumberButton = screen.getByRole("button", {
  //     name: "Confirm order number",
  //   });
  //   await user.click(confirmOrderNumberButton);

  // click new order button on confirmation page
  const newOrderButton = screen.getByRole("button", {
    name: /new order/i,
  });
  await user.click(newOrderButton);

  // check that scoops and toppings subtotals have been reset
  const scoopsTotal = await screen.findByText("Scoops total: $0.00");
  expect(scoopsTotal).toBeInTheDocument();
  //   expect(scoopsSubtotal).toHaveTextContent("$0.00");
  //   expect(toppingsTotal).toHaveTextContent("$0.00");
  const toppingsTotal = await screen.findByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument();

  // do we need to await anything to avoid test errors
  // wait for items to appear so that Testing Library doesnt get angry
  // about stuff happening after test is over

  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  const user = userEvent.setup();
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  const orderButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  await user.click(orderButton);

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});

test("Toppings header is not on summary page if toppings ordered, then removed", async () => {
  const user = userEvent.setup();
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  const cherryCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherryCheckbox);
  expect(cherryCheckbox).toBeChecked();
  const toppingsTotal = screen.getByText("Toppings total: $", { exact: false });
  expect(toppingsTotal).toHaveTextContent("1.50");

  await user.click(cherryCheckbox);
  expect(cherryCheckbox).not.toBeChecked();
  expect(toppingsTotal).toHaveTextContent("0.00");

  const orderButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  await user.click(orderButton);

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});
