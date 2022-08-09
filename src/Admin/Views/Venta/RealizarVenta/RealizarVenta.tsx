import {
  Box,
  Divider,
} from "@chakra-ui/react";
import "./InputSearch.css";
import api from "./ApiVentas";
import { Buscador } from "./Buscador";
import { InfoVenta } from "./InfoVenta";
import React, { useEffect } from "react";
import { VentaTable } from "./VentaTable";
import { CalculadorTotal } from "./CalculadoraTotal";
import { MyContain } from "../../../UI/Components/MyContain";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";

export const getFecha = () => {
  let hoy = new Date();
  return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate()
};

export const RealizarVenta = () => {
  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Realizar Venta';
  }, []);

  let [cambio, SetCambio] = React.useState(0);
  let [vuelto, SetVuelto] = React.useState(0.0);
  let [descuento, SetDescuento] = React.useState(0);
  let [productos, SetProductos] = React.useState([]);
  let [queryProducto, SetQueryProducto] = React.useState("");
  let [total, SetTotal] = React.useState(0);




  let filtro = productos.filter((producto: any) => {
    return `${producto.PRO_NAME}`
      .toLowerCase()
      .includes(queryProducto.toLowerCase());
  });

  let [productoMuestra, SetProductoMuestra] = React.useState(filtro[0]);
  const cambioVuelto = () => {
    let cambioVuelto: number = cambio - total;
    cambioVuelto = parseFloat(cambioVuelto.toFixed(2));
    SetVuelto(cambioVuelto);

  }
  const handleChangeCambio = (e: any) => {

    SetCambio(e.target.value);
    let cambioVuelto: number = parseFloat(e.target.value) - total;
    cambioVuelto = parseFloat(cambioVuelto.toFixed(2));
    SetVuelto(cambioVuelto);

  }
  //INFOVENTA
  const [admin, setAdmin] = useRecoilState(AdminState);
  let [formDetalle, SetFormDetalle] = React.useState({
    tipoComprobante: 1,
    PER_ID: 0,
    idCliente: "00000000",
    razonSocial: "CLIENTES VARIOS",
    direccion: "",
    metodoPago: 1,
    tipoMoneda: 1,
    tipoCambio: 1,
    vendedor: admin.user,
    monto: 50.0,
    fecha: getFecha(),
    carrito: [],
    cambio: 0,
    vuelto: 0,
  });

  //=======
  let [subtotalGeneral, SetSubtotalGeneral] = React.useState(0);
  let [descuentoGeneral, SetDescuentoGeneral] = React.useState(0);
  let [vistaDescripcion, SetVistaDescripcion] = React.useState([]);
  let [totalMontoInafecto, SetTotalMontoInafecto] = React.useState(0);
  let [totalIGVInafecto, SetTotalIGVInafecto] = React.useState(0);

  const updateTotal = () => {
    const valores = vistaDescripcion.map((prod) => {
      console.log(prod);
      return {
        // @ts-ignore
        total: prod.total,
        // @ts-ignore
        decuento: prod.descuento,
        // @ts-ignore
        inafec: prod.inafecta,
      };
    });
    let totalTotal = 0;
    let totalDescuento = 0;
    let totalInafect = 0;
    let totalIGVInafect = 0;
    valores.map((e) => {
      totalTotal = totalTotal + e.total;
      totalDescuento = totalDescuento + e.decuento;
      if (e.inafec == "1") {
        totalInafect = totalInafect + (e.total / 1.18);
        totalIGVInafect = totalIGVInafect + ((e.total / 1.18) * 0.18);
      }
    });
    SetTotalMontoInafecto(totalInafect);
    SetTotalIGVInafecto(totalIGVInafect);
    SetSubtotalGeneral(totalTotal);
    SetTotal(subtotalGeneral - descuentoGeneral);
    SetDescuento(totalDescuento);
  };

  return (
    <React.Fragment>
      <MyContain>
        <Box display={{ md: "flex" }} w="100%">
          <Box
            m="1"
            p="1"
            borderRadius="10px"
            w={["100%", "100%", "70%"]}
          >
            <Box position="relative" >
              <h2>
                <b>Insumos</b>
              </h2>
              <br />
              <Buscador
                SetProductoMuestra={SetProductoMuestra}
                SetFormDetalle={SetFormDetalle}
                vistaDescripcion={vistaDescripcion}
                productoMuestra={productoMuestra}
                SetVistaDescripcion={SetVistaDescripcion}
                formDetalle={formDetalle}
              />
              <Divider m="2" />

              <Box pt={3} style={{marginBottom:"100px"}} >
                <h2 >
                  <b >Descripción</b>
                </h2>
                
                <VentaTable
                  updateTotal={updateTotal}
                  cambioVuelto={cambioVuelto}
                  vistaDescripcion={vistaDescripcion}
                  SetVistaDescripcion={SetVistaDescripcion}
                  total={subtotalGeneral}
                  SetDescuentoGeneral={SetDescuentoGeneral}
                />
                <CalculadorTotal
                  SetTotal={SetTotal}
                  total={total}
                  subtotalGeneral={subtotalGeneral}
                  descuentoGeneral={descuentoGeneral}
                  SetDescuentoGeneral={SetDescuentoGeneral}
                  SetFormDetalle={SetFormDetalle}
                />
              </Box>
            </Box>
          </Box>
          <Box
            m="1"
            p="1"
            borderRadius="10px"
            w={["100%", "100%", "30%"]}
            position="relative"
          >
            <InfoVenta
              vistaDescripcion={vistaDescripcion}
              total={total}
              totalMontoInafecto={totalMontoInafecto}
              totalIGVInafecto={totalIGVInafecto}
              SetFormDetalle={SetFormDetalle}
              subtotalGeneral={subtotalGeneral}
              descuentoGeneral={descuentoGeneral}
              descuento={descuento}
              cambio={cambio}
              vuelto={vuelto}
              cambioVuelto={cambioVuelto}
              SetCambio={SetCambio}
              handleChangeCambio={handleChangeCambio}
              formDetalle={formDetalle}
            />
          </Box>
        </Box>
      </MyContain>
    </React.Fragment>
  );
};
