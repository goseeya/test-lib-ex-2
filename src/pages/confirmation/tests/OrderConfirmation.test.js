import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderConfirmation from "../OrderConfirmation";
import { server } from "../../../mocks/server";
import { rest } from "msw";

test("error response from server for submitting order", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/order", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderConfirmation />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error occurred. Please try again later."
  );
});
