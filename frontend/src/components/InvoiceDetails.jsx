import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./InvoiceDetails.module.css";
import useInvoicesContext from "../hooks/use-invoices-context";
import Empty from "./Empty";
import Button from "./Button";
import InvoiceDetailsHeader from "./InvoiceDetailsHeader";
import Item from "./Item";
import {
  formatDate,
  formatCurrency,
  derivedStatus,
} from "../helpers/format-data";
import InvoiceStatus from "./InvoiceStatus";

function InvoiceDetails() {
  const { id } = useParams(); //store the id parameter in the url
  const {
    userType,
    isLoading,
    isError,
    getInvoice,
    singleInvoice,
    lastUpdateTimestamp,
  } = useInvoicesContext();
  const navigate = useNavigate();

  useEffect(() => {
    // API call to get invoice by id
    getInvoice(id);
  }, [getInvoice, id, lastUpdateTimestamp]);

  if (isLoading || isError) {
    return <Empty isLoading={isLoading} isError={isError} />;
}

if (!singleInvoice || !singleInvoice.businessAddress || !singleInvoice.customerAddress) {
  return <Empty isLoading={isLoading}/>;
} 

  const {
    invoiceNumber,
    description,
    businessAddress,
    paymentDue,
    createdAt,
    customerName,
    customerAddress,
    items = [],
    total,
    status,
  } = singleInvoice;

  const derivedTotal = formatCurrency.format(Number(total));

  const renderedItems = items?.map((item) => (
    <Item key={item.name} item={item} />
  ));

  return (
    <section>
      <div className={styles.detailsGrid}>
        <Button variant="back" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <InvoiceDetailsHeader>
          <InvoiceStatus
            status={derivedStatus(userType, status)}
            invoiceNumber={invoiceNumber}
          />
        </InvoiceDetailsHeader>
        <article className={styles.articleGrid}>
          <div>
            <p>
              <span className="invoice-tag">#</span>
              <span className="strong">{invoiceNumber}</span>
            </p>
            <p>{description}</p>
          </div>
          <div className={styles.business}>
            <p>{businessAddress.street}</p>
            <p>{businessAddress.city}</p>
            <p>{businessAddress.postCode}</p>
            <p>{businessAddress.country}</p>
          </div>
          <div>
            <p>Invoice Date</p>
            <p className="strong">{formatDate(createdAt)}</p>
          </div>
          <div>
            <p>Bill to</p>
            <p className="strong">{customerName}</p>
          </div>
          <div>
            <p>Notification Sent to</p>
            <p className="strong">{customerAddress.phoneNumber}</p>
          </div>
          <div className={styles.dueDate}>
            <p>Payment Due</p>
            <p className="strong">{formatDate(paymentDue)}</p>
          </div>
          <div>
            <p>{customerAddress.street}</p>
            <p>{customerAddress.city}</p>
            <p>{customerAddress.postCode}</p>
            <p>{customerAddress.country}</p>
          </div>
          <p
            className={`margin-top-helper margin-left-helper ${styles.itemName}`}
          >
            Item Name
          </p>
          <p className={`margin-top-helper ${styles.qty}`}>QTY.</p>
          <p className={`margin-top-helper ${styles.items}`}>Price</p>
          <p
            className={`margin-top-helper ${styles.items} margin-right-helper`}
          >
            Total
          </p>
          {renderedItems}
          <div className={styles.subtotal}>
            <p>Amount Due</p>
            <p className={styles.total}>{derivedTotal}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default InvoiceDetails;
