function customerMessage(state){
  let str = "";
  if(state.status === "draft"){
    str += `Greetings ${state.customerName}!\n` ;
    str += "========\n";
    str += `An invoice was created for ${state.description} services rendered by ${state.businessName}.\n`
    str += `Please login to your InvoiceNow customer portal to see the invoice details and pay.`
  }else{
    str += `Greetings ${state.customerName}!\n` ;
    str += "========\n";
    str += `An invoice for ${state.description} services rendered by ${state.businessName} was just updated.\n`
    str += `Please login to your InvoiceNow customer portal to see the updated invoice details and pay.`
  }
  return str;
}

function businessMessage(state){
  return `${state.invoiceNumber}`;
}

export {customerMessage, businessMessage};