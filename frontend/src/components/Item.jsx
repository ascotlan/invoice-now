import styles from './Item.module.css'
import PropTypes from "prop-types";
import {formatCurrency} from '../helpers/format-data';

function Item({item}) {
  const derivedPrice = formatCurrency.format(Number(item.price) / 100);
  const derivedTotal = formatCurrency.format(Number(item.total) / 100);
  return (
    <>
    <div className={`strong margin-left-helper`}>{item.name}</div>
    <div className={styles.qty}>{item.quantity}</div>
    <div className={styles.items}>{derivedPrice}</div>
    <div className={`strong ${styles.items} margin-right-helper`}>{derivedTotal}</div>
    </>
  )
}

Item.propTypes = {
  item: PropTypes.object
};

export default Item;
