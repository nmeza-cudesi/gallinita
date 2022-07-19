export const ListSalesOnline = async () => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/sales/salesonline");
  const data = await res.json();
  return data;
};

export const ExportOrders = async () => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/orders/export");
  const data = await res.json();
  return data;
};

export const ListProductsSalesOnline = async (idOrder: any) => {
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/sales/productssalesonline/" + idOrder
  );
  const data = await res.json();
  return data;
};

export const VerifyVoucherOrder = async (
  idOrder: any,
  check: any,
  idUser: any
) => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ORD_APPROVAL: check, ORD_APPROVAL_USER: idUser }),
  };
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/sales/verifyvoucher/" + idOrder,
    requestOptions
  );
  const data = await res.json();
  return data;
};

export const getDocumentForSaleOnline = async (id: number) => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/document_type/" + id);
  const data = await res.json();
  return data;
};

//Cabiar el estado de la Orden
//@ts-ignore
export const ChangeOrderState = async ({ ORD_ID, ORD_STATUS, nombre, correo }) => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ORD_STATUS: ORD_STATUS }),
  };
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/orders/changestatus/" + ORD_ID,
    requestOptions
  );
  const estados = [{
    idestado: 1,
    nombre: "registrado"
  }, {
    idestado: 2,
    nombre: "confirmado"
  }, {
    idestado: 3,
    nombre: "en proceso de envio"
  }, {
    idestado: 4,
    nombre: "entregado"
  }]
  const requestOptionsEmail = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estadoOrden: estados.filter((val) => val.idestado == ORD_STATUS)[0].nombre, nombre: correo, correo: nombre }),
  };
  const resEmail = await fetch(
    import.meta.env.VITE_APP_API + "/mail/orderUpdate",
    requestOptionsEmail
  );

  const data = await res.json();
  return data;
};

//@ts-ignore
export const ChangeStatePay = async ({ DOC_ID, DOC_ESTADO, DOC_DATE_PAGO }) => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      DOC_ESTADO: DOC_ESTADO,
      DOC_DATE_PAGO: DOC_DATE_PAGO,
    }),
  };
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/document/" + DOC_ID,
    requestOptions
  );
  const data = await res.json();
  return data;
};

export const getConfiguracionImpresion = async () => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/config"); //falta
  return res.json();
};

export const getDataPago = async (id: any) => {
  try {
    return await fetch(import.meta.env.VITE_APP_API + "/person/identidad/" + id).then(res => res.json());
  } catch (Error) {
    return {
      error: Error,
    };
  }
}