import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./Button";
import useStripeContext from "../hooks/use-stripe-context";
import useUserContext from "../hooks/use-user-context";
import styles from "./StripePayment.module.css";
import useInvoicesContext from "../hooks/use-invoices-context";
import { ACTION } from "../helpers/form-constants";
import Logo from "../assets/logo-blue.svg";

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUserContext();

  const {
    setIsLoading,
    setPaymentError,
    isLoading,
    paymentError,
    createPaymentIntent,
    toggleStripeModal,
    toggleSuccessModal,
  } = useStripeContext();

  const { formState, updateInvoiceStatus, dispatch } = useInvoicesContext();

  // Check if user is not null before destructuring
  const userId = user ? user.userId : null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      const amountInCents = formState.total * 100; //convert to cents

      await createPaymentIntent(
        {
          paymentMethodId: paymentMethod.id,
          amount: amountInCents,
        },
        userId
      );
      // Create a local variable representing the new state
      const newState = {
        ...formState,
        status: "paid",
      };

      await updateInvoiceStatus(newState);
      dispatch({
        type: ACTION.UPDATE_FIELD,
        field: "status",
        value: "paid",
      });
      toggleStripeModal();
      setPaymentError(null);
      toggleSuccessModal();
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setPaymentError(null);
    toggleStripeModal();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.stripeModalBackdrop}>
      <div className={styles.stripeConfirmationModal}>
      <div className={styles.header}>
        <img src={Logo} alt="InvoiceNow Logo" className={styles.logo} />
        <span className={styles.logoText}>InvoiceNow</span>
      </div>
        <CardElement
          className={styles.cardElement}
          options={{ style: { base: {} }, hidePostalCode: true }}
        />
        <div className={styles.action}>
          <Button variant="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="pay" type="submit" disabled={!stripe || isLoading}>
            {isLoading ? "Processing..." : "Pay"}
          </Button>
        </div>
        {paymentError && (
          <div className={styles.errorMessage}>{paymentError}</div>
        )}
      </div>
    </form>
  );
};

export default StripePayment;
