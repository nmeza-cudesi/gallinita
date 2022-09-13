import { Image } from "@chakra-ui/image";
import {
  Box,
  Center,
  Divider,
  HStack,
  Spacer,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import React from "react";

import { useQuery } from "react-query";
import { Skeleton } from "@chakra-ui/skeleton";
import "./print.css";
export const ImpresionVenta = ({
  productos = [],
  idventa = null,
  activador = () => { },
}: {
  productos: any;
  idventa: any;
  activador: any;
}) => {

  let formato = {
    empresa: "",
    infoDoc: "",
    infoCliente: "",
    infoProductos: "",
    infoCostos: "",
  };

  async function getVentasWithClient() {
    if (idventa != null) {
      const res = await fetch(import.meta.env.VITE_APP_API + "/document/" + idventa);
      return res.json();
    } else {
      return null;
    }
  }

  const { isLoading, isError, data, error } = useQuery(
    "venta",
    getVentasWithClient,
    { refetchOnWindowFocus: false }
  );
  console.log(data);

  if (isLoading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;
  console.log(data);

  return (
    <div>
      {/* <Text> idventa :{idventa}</Text> */}
      <Box margin="5" border="1px" borderColor="blue.200" w="775px">
        <HStack m="4px">
          <InformacionEmpresa />
          {/* info Documento */}
          <InformacionRecibo datos={data} />
        </HStack>
        <Divider borderColor="blue.200" />

        {/* Info Cliente */}
        <InformacionCliente datos={data} />

        <Divider borderColor="blue.200" />

        {/* Info Producto */}
        <InformacionProducto idventa={idventa} activador={activador} />

        <Divider borderColor="blue.200" />

        <HStack m="5px">
          {/* qr Info */}
          <CodigoQR />

          <Spacer />

          {/* precios total Info */}
          <InformacionTotal
            grabada={(data.DOC_TAXED).toFixed(2)}
            exonerada={data.DOC_RELEASED.toFixed(2)}
            inafecta={data.DOC_INAFECT.toFixed(2)}
            igv={(data.DOC_IGV).toFixed(2)}
            total={data.DOC_NETO.toFixed(2)}
            subtotal={(data.DOC_INAFECT+ data.DOC_TAXED).toFixed(2)}
            descuento={((data.DOC_SUBTOTAL - data.DOC_NETO) / 1.18).toFixed(2)}
          />
        </HStack>
        {/* Resumen */}
        <Observaciones total={data.DOC_NETO.toFixed(2)} error={data.DOC_ERROR} />
      </Box>
    </div>
  );
};
const InformacionEmpresa = () => {
  async function getEmpresa() {
    // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
    const res = await fetch(import.meta.env.VITE_APP_API + "/company/");
    return res.json();
  }
  const { isLoading, isError, data, error } = useQuery("empresa", getEmpresa, {
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;

  return (
    <React.Fragment>
      <Image src="gibbresh.png" w={"30%"} fallbackSrc={import.meta.env.VITE_APP_LOGO + "/upload/LOGO%20HORIZONTAL.png"} />
      {/* empresa */}
      <Box w="650px">
        <Center>
          <Text>
            <b>{data[0].COM_COMPANY_NAME}</b>
          </Text>
        </Center>
        <Text fontSize="sm">
          <b>Dirección:</b> {data[0].COM_ORGANIZATION_DIRECTION}
        </Text>
        <Text fontSize="sm">
          <b>Teléfono:</b> {data[0].COM_ORGANIZATION_PHONE_ONE} <b>Celular:</b>{" "}
          {data[0].COM_ORGANIZATION_PHONE_THREE}
        </Text>
      </Box>
    </React.Fragment>
  );
};
const InformacionRecibo = ({ datos }: { datos: any }) => {
  async function getEmpresa() {
    // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
    const res = await fetch(import.meta.env.VITE_APP_API + "/company/");
    return res.json();
  }
  const { isLoading, isError, data, error } = useQuery("empresa", getEmpresa);

  if (isLoading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;

  return (
    <React.Fragment>
      <VStack
        border="1px"
        borderColor="blue.200"
        w="225px"
        h="150px"
        divider={<StackDivider borderColor="blue.200" />}
      >
        <Text h="50px" align="center" fontSize="lg">
          {datos.DOC_DOC_TYPE} ELECTRÓNICA{" "}
        </Text>
        <Text fontSize="sm" align="center">
          <b>RUC:</b> {data[0].COM_ORGANIZATION_RUC}
        </Text>
        <Text align="center">
          {" "}
          {datos.DOC_SERIE} - {datos.DOC_NUMBER}
        </Text>
      </VStack>
    </React.Fragment>
  );
};
const InformacionCliente = ({ datos }: { datos: any }) => {
  return (
    <React.Fragment>
      <Box m="5px">
        <HStack>
          <Text>
            {" "}
            <b>Cliente:</b>
          </Text>
          <Text>{datos.DOC_BUSINESS_NAME}</Text>
        </HStack>
        <HStack>
          <Text>
            {" "}
            <b>Dirección:</b>
          </Text>
          <Text>{datos.DOC_DIRECTION_CLIENT}</Text>
        </HStack>
        <HStack>
          <Text w="75px">
            {" "}
            <b>DNI/RUC:</b>
          </Text>
          <Text w="150px">{datos.DOC_ID_CLIENT}</Text>
          <Text w="75px">
            {" "}
            <b>Forma Pago:</b>
          </Text>
          <Text w="150px">{datos.PMT_NAME}</Text>
          <Text w="75px">
            {" "}
            <b>Moneda:</b>
          </Text>
          <Text w="150px">Sol</Text>
          <Text w="60px">
            {" "}
            <b>Fecha:</b>
          </Text>
          <Text w="150px">{datos.DOC_DATE2}</Text>
        </HStack>
      </Box>
    </React.Fragment>
  );
};
const InformacionProducto = ({
  idventa = null,
  activador = () => { },
}: {
  idventa: any;
  activador: any;
}) => {
  console.log(idventa);

  async function getProductosByVenta() {
    if (idventa != null) {
      // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
      const typeSale = await fetch(
        import.meta.env.VITE_APP_API + "/document/" + idventa
      ); //falta
      const type = await typeSale.json();

      const res = await fetch(
        import.meta.env.VITE_APP_API + "/sales_description/bysale/" + idventa + "/" + (type.SLT_ID == 15 ? "online" : "fisico")
      );
      return res.json();
    } else {
      return null;
    }
  }

  const { isLoading, isError, data, error } = useQuery(
    "productos",
    getProductosByVenta,
    { refetchOnWindowFocus: false }
  );

  if (isError) {
    return <h1>No se encuentran datos</h1>;
  }
  if (data != undefined) {
    if (data.hasOwnProperty("status")) {
      if (data.status == 404) {
        return <h1 color="red">No hay datos</h1>;
      }
    }
  }

  if (isLoading) {
    return <h1>Cargando...</h1>;
  } else {
    // React.useEffect(() => {
    //   activador()
    // })
    return (
      <React.Fragment>
        <Box m="5px">
          <Table variant="striped" colorScheme="blue" size="sm">
            <Thead>
              <Tr>
                <Th>Item</Th>
                <Th>Código</Th>
                <Th w="350px">Descripción</Th>
                <Th>Cantidad</Th>
                <Th isNumeric>Precio unitario</Th>
                <Th isNumeric>Precio Subtotal</Th>
                <Th isNumeric> Descuento</Th>
                <Th isNumeric> Precio Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((result: any, idx: any) => {
                return (
                  <Tr key={idx + 1}>
                    <Td>{idx + 1}</Td>
                    <Td>{result.SDT_CODE}</Td>
                    <Td>{result.SDT_DESCRIPTION}</Td>
                    <Td>{result.SDT_AMOUNT}</Td>
                    <Td>{result.SDT_PRICE}</Td>
                    <Td>{result.SDT_SUBTOTAL}</Td>
                    <Td>{result.SDT_DISCOUNT}</Td>
                    <Td>{result.SDT_TOTAL}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </React.Fragment>
    );
  }
};
const InformacionTotal = ({
  grabada = 0,
  exonerada = 0,
  inafecta = 0,
  igv = 0,
  total = 0,
  subtotal = 0,
  descuento = 0,
}: {
  grabada: any;
  exonerada: any;
  inafecta: any;
  igv: any;
  total: any;
  subtotal: any;
  descuento: any;
}) => {
  return (
    <React.Fragment>
      <Box border="1px" borderColor="blue.200">
        <Table variant="simple" size="sm" colorScheme="blue">
          <Tbody>
            <Tr>
              <Td>
                <Text align="right">
                  <b>Subtotal </b>
                </Text>
              </Td>
              <Td w="100px">{subtotal}</Td>
            </Tr>
            <Tr>
              <Td>
                <Text align="right">
                  <b>Descuento </b>
                </Text>
              </Td>
              <Td w="100px">{descuento}</Td>
            </Tr>
            <Tr>
              <Td>
                <Text align="right">
                  <b>Operación grabada </b>
                </Text>
              </Td>
              <Td w="100px">{grabada}</Td>
            </Tr>
            <Tr>
              <Td>
                <Text align="right">
                  <b>Operación exonerada</b>
                </Text>
              </Td>
              <Td>{exonerada}</Td>
            </Tr>
            <Tr>
              <Td>
                <Text align="right">
                  <b>Operación inafecta </b>
                </Text>
              </Td>
              <Td>{inafecta}</Td>
            </Tr>
            <Tr>
              <Td>
                <Text align="right">
                  <b>IGV </b>
                </Text>
              </Td>
              <Td>{igv}</Td>
            </Tr>
            <Tr>
              <Td>
                <Text align="right">
                  <b>Importe total</b>
                </Text>
              </Td>
              <Td>{total}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </React.Fragment>
  );
};
const CodigoQR = () => {
  return (
    <React.Fragment>
      <Box w="500px">
        <Center>
          {/* <Image
            boxSize="150px"
            src="gibbresh.png"
            fallbackSrc="https://static-unitag.com/images/help/QRCode/qrcode.png?mh=07b7c2a2"
          /> */}
        </Center>
        <Text align="center">
          Representación impresa del comprobante de venta
        </Text>
      </Box>
    </React.Fragment>
  );
};
const Observaciones = ({ total = 0, error = '' }: { total: any; error: any }) => {
  return (
    <React.Fragment>
      <Box m="5px">
        <Text>
          <b>SON: {total} con 0/100 soles</b>
        </Text>

        <Box border="1px" borderColor="blue.200">
          <Text>Observaciones:</Text>
          <Text>
            {error}
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};
