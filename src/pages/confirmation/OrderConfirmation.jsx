import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useOrderDetails } from "../../contexts/OrderDetails";
import AlertBanner from "../common/AlertBanner";

export default function OrderConfirmation({ setOrderPhase }) {
  const { resetOrder } = useOrderDetails();
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:3030/order")
      .then((response) => setOrderNumber(response.data.orderNumber))
      .catch((error) => {
        setError(true);
      });
  }, []);

  const newOrderButton = (
    <Button onClick={handleClick}>Create new order</Button>
  );

  function handleClick() {
    resetOrder();
    setOrderPhase("inProgress");
  }
  if (error) {
    return (
      <>
        <AlertBanner message={null} variant={null} />
        {newOrderButton}
      </>
    );
  }
  if (orderNumber) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Thank you!</h1>
        <h2>Your order number is {orderNumber}</h2>
        <p style={{ fontSize: "25%" }}>
          as per our terms and conditions, nothing will happen now
        </p>
        {newOrderButton}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}
