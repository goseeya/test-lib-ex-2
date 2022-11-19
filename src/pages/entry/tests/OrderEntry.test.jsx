import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import { OrderDetailsProvider } from "../../../contexts/OrderDetails";

test("handles error for scoops and toppings routes", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderEntry setOrderPhase={jest.fn()} />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});

test("disable order button when scoop count is zero", async () => {
  const user = userEvent.setup();

  render(<OrderEntry setOrderPhase={jest.fn()} />);
  const orderButton = screen.getByRole("button", { name: /order sundae/i });
  expect(orderButton).toBeDisabled();

  const vanillaScoup = await screen.findByRole("spinbutton", {
    name: /vanilla/i,
  });
  await user.clear(vanillaScoup);
  await user.type(vanillaScoup, "1");
  expect(orderButton).toBeEnabled();

  await user.clear(vanillaScoup);
  await user.type(vanillaScoup, "0");
  expect(orderButton).toBeDisabled();
});
