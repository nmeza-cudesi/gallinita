import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getSaleByPOS } from "../../../../Service/PoaintSaleService";
import { MyContain } from "../../../UI/Components/MyContain";
import { FindProductPOD } from "./FindProductPOS";

export const VentaPosInfo = (
    {
        POS_ID,
        array,
        setArray,
        listProd,
        setListProd,
        venta,
    }
        :
        {
            POS_ID: any,
            array: any,
            setArray: any,
            listProd: any,
            setListProd: any
            venta: any,
        }
) => {

    const [loadSend, setLoadSend] = useState(false)
    const [formVenta, setFormVenta] = useState({
        metodoPago: "",
        document_Type: 0,
        persona_id: 0,
        cliente: {
            idCliente: "",
            razonSocial: "",
            direccion: "",
        },
        document: {
            document_name: "",
            document_serie: "",
            document_correlativo: "",
        }
    })

    const getFecha = () => {
        let hoy = new Date();
        return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate()
    };
    const getProductosTabla = () => {
        let productosTabla: any[] = [];
        listProd.map((producto: any) => {
            productosTabla.push({
                DOC_ID: 0,
                PRO_ID: producto.PRO_ID, //ID DEL PRODUCTO
                DIS_ID: null, //ID DEL DESCUENTO sv_discount, PUEDE SER NULO
                SDT_CODE: producto.RDT_CODEBAR, //CODIGO DEL PRODUCTO
                SDT_AMOUNT: producto.RDT_AMOUNT, //CANTIDAD VENDIDA
                SDT_DESCRIPTION: producto.PRO_NAME, //DESCRIPCION DEL PRODUCTO
                SDT_PRICE: producto.RDT_PRICE.toFixed(2), //PRECIO DEL PRODUCTO
                SDT_SUBTOTAL: producto.RDT_PRICE.toFixed(2), //CANTIDAD * PRECIO
                SDT_DISCOUNT: 0, //DESCUENTO DEL PRODUCTO
                SDT_TOTAL: producto.RDT_PRICE.toFixed(2), //SUBTOTAL - DESCUENTO
                SDS_DAYS_TO_SEND: getFecha(), //FECHA DE CREACIÓN
                SDT_DATE: getFecha(),
                //SE MANTIENE POR DEFAULT
                SDS_STATUS: "1", //SIEMPRE 1
            });
        });
        return productosTabla;
    };

    const saveDataVenta = () => {
        setLoadSend(true);
        //console.log(props.formDetalle, "detalle del documento");

        let dataVenta = {
            //MODELO DEL JSON QUE DEBE TOMAR LA VARIABLE doc ||||||||| NO MODIFICAR ESTA VARIABLE
            document: {
                //ESTO SE DEJA POR DEFAULT EN PAGO AL CONTADO
                PMT_ID: formVenta.metodoPago, // METODO DE PAGO DE LA TABLA sv_payment_method

                //VALOR CAMBIA
                DCT_ID: formVenta.document_Type, //TIPO DE DOCUMENTO DE LA TABLA sv_document_type [FACTURA, BOLETA]
                //default
                SLT_ID: 5, //TIPO DE VENTA DE LA TABLA sv_sales_type [VENTA FISICA, VENTA ONLINE]

                //ESTO SE DEJA EN DEFAULT
                XCR_ID: 5, //NO SE QUE VAINA ES, SOLO PONLE 5
                BUS_ID: 5, //DATOS DEL NEGOCIO CON EL QUE SE ESTÁ VENDIENDO

                //CAMBIA - DATOS CLIENTE
                PER_ID:
                    formVenta.persona_id == 0 ? null : formVenta.persona_id, //dato del cliente
                DOC_ID_CLIENT: formVenta.cliente.idCliente, //EL ID DEL CLIENTE YA SEA DNI O RUC
                DOC_BUSINESS_NAME: formVenta.cliente.razonSocial, //NOMBRE DEL CLIENTE O SU RAZON SOCIAL
                DOC_DIRECTION_CLIENT: formVenta.cliente.direccion, //DIRECCION DEL CLIENTE
                //CAMBIA - DATOS DOCUMENTO
                DOC_DOC_TYPE: formVenta.document.document_name, //SI ES FACTURA, BOLETA O NOTA DE CREDITO
                DOC_SERIE: formVenta.document.document_serie, //CODIGO SERIE DEL COMPROBANTE
                DOC_NUMBER: formVenta.document.document_correlativo, //NUMERO QUE ACOMPAÑA A LA SERIE, ES EL CORRELATIVO
                //CAMBIA - DATOS DOCUMENTO - TOTAL
                DOC_SUB_SUBTOTAL:
                    ((venta.total + venta.descuentoGeneral + venta.descuento) / 1.18) + Number(venta.totalIGVInafecto.toFixed(2)), // OPERACION GRAVADA + TOTAL IGV INAFECETA
                DOC_SUB_DISCOUNT: venta.descuento,
                DOC_SUBTOTAL: venta.total + venta.descuentoGeneral + venta.descuento, //EL TOTAL DEL SUBTOTAL SIN IGV SIN EL DESCUENTO
                DOC_DISCOUNT: venta.descuentoGeneral, //EL TOTAL DEL DESCUENTO
                DOC_TAXED:
                    ((venta.total + venta.descuentoGeneral + venta.descuento) / 1.18) - Number(venta.totalMontoInafecto.toFixed(2)), //TOTAL DEL SUBTOTAL SIN IGV CON DESCUENTO - TOTAL MONTO INAFECETA
                //SE DEJA EN 0.00
                DOC_INAFECT: Number(venta.totalIGVInafecto.toFixed(2)) + Number(venta.totalMontoInafecto.toFixed(2)), //TOTAL DE INAFECTO // TOTAL MONTO INAFECETA + TOTAL IGV INAFECETA = total precio de productos inafectos
                DOC_RELEASED: 0.0, //TOTAL QUE EXONERA IGV

                //CAMBIA
                DOC_IGV:
                    (((venta.total + venta.descuentoGeneral + venta.descuento) / 1.18) * 0.18) - Number(venta.totalIGVInafecto.toFixed(2)), //IGV DEL DOC_TAXED - TOTAL IGV INAFECETA
                DOC_NETO: venta.total.toFixed(2), //DOC_TAXED + DOC_IGV
                //CAMBIA - ESTADO DOCUMENTO
                DOC_STATUS: "CREADO", //HAY 2 ESTADO [CREADO,ACEPTADO ]
                DOC_DATE: getFecha(),
            },
            sales_description: getProductosTabla(),
            //stock: getStockChange(),
        };
        // onOpen();

        //validar productos
        /* if (getProductosTabla().length == 0) {
            messageToast({
                title: "Datos faltantes",
                description: "No hay productos por vender",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        } else {
            onOpen();
            api.ventas.addDocument(dataVenta).then((result) => {
                SetLoadSend(false);
                if (result.status == 200) {
                    SetMessageOfSended({
                        ...messageOfSended,
                        message: result.message,
                        status: result.status,
                        lastId: result.lastId,
                    });
                } else {
                    if (result.status == 500) {
                        console.log(result);
                        SetMessageOfSended({
                            ...messageOfSended,
                            message: "error interno [500]",

                            status: result.status,
                        });
                    } else {
                        if (result.status == 404) {
                            SetMessageOfSended({
                                ...messageOfSended,
                                message: "Dirección no encontrada [404]",
                                status: result.status,
                            });
                        } else {
                            SetMessageOfSended({
                                ...messageOfSended,
                                message: "error interno",
                                status: result.status,
                            });
                        }
                    }
                }
            });
        } */
    };


    return (
        <Box w={'40%'}>
            <Box boxShadow="md"
                p={3}
                bg={'white'}
                borderRadius="md"
                alignItems="start"
                justifyContent="center">
                <Box p={"15px"}>
                    <FindProductPOD array={array} setListProd={setListProd} setArray={setArray} />
                </Box>
                <Box p={"15px"}>
                    <Text>Cambios</Text>
                </Box>
            </Box >
        </Box >
    )
}