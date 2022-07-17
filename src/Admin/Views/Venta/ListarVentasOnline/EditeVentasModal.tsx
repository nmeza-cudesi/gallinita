import {
  Accordion,
  AccordionButton,
  AccordionPanel,
  AccordionItem,
  Drawer,
  DrawerOverlay,
  useDisclosure,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Box,
  Text,
  Center,
  HStack,
  Spacer,
  Flex,
  Button,
  Image,
  IconButton,
  FormControl,
  useRadioGroup,
  useRadio,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
  DrawerCloseButton,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState, useRef } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { BsFileEarmarkMinus, BsPlusSquareFill } from "react-icons/bs";
import {
  IoPrintSharp,
  IoDownloadSharp,
  IoMail,
} from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listaSaleOnline } from "../../../../Data/Atoms/SaleOnline";
import { ListForDocument } from "../../../../Service/PersonService";
import {
  ChangeOrderState,
  getDocumentForSaleOnline,
  ListProductsSalesOnline,
  VerifyVoucherOrder,
} from "../../../../Service/Sales";
import { SendMail, SendMailRejectedVoucher } from "../../../../Service/SendMailService";
import api from "../RealizarVenta/ApiVentas";
import { CambiarEstado } from "./CambiarEstado";
import { DonwloadPDF } from "./DonwloadPDF";
import { TablaProductosVentasOnline } from "./TablaProductos";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { Tooltip } from '@chakra-ui/react';

import success from "./assets/images/success.gif";
import denied from "./assets/images/denied.gif";
import noimage from "../../../UI/Assets/images/noimage.png";
import { getCompany } from "../../../../Service/CompanyService";

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}>
        {props.children}
      </Box>
    </Box>
  );
}

export const EditVentasModal = ({
  children,
  venta,
}: {
  children: ReactNode;
  venta?: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [aprobacion, statusaprobacion] = useState(venta.APROBACION);
  const [donwload, statusdownload] = useState(venta.APROBACION === "1" ? false : true);
  const [preaprobacion, statuspreaprobacion] = useState(0);
  const [admin, setAdmin] = useRecoilState(AdminState);
  const [imagen, setImage] = useState(venta.VOUCHER == null ? noimage : venta.VOUCHER);
  const [loadingSend, setLoadinSend] = useState(false);
  const queryClient = useQueryClient();
  const company: any = queryClient.getQueryData("company");

  const [issOpen, setIssOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const cancelRef = useRef();
  const onsClose = () => {
    setIssOpen(false);
  };

  const { mutate, isLoading: isLoadingM } = useMutation(ChangeOrderState, { mutationKey: "stateMutation" })
  const toast = useToast();

  const updated = useSetRecoilState(listaSaleOnline);

  const options = ["Aceptar", "Rechazar"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "verificacion",
    onChange: confirmacion,
  });

  function mutateM(state: number, orderId: number) {
    mutate({ ORD_ID: orderId, ORD_STATUS: state })
  }

  async function sendEmail(wtogo: string) {
    setLoadinSend(true);
    let resSendEmail;
    if (wtogo === "Aceptar") {
      resSendEmail = await SendMail(venta);
    } else if (wtogo === "Rechazar") {
      resSendEmail = await SendMailRejectedVoucher(venta);
    }

    if (resSendEmail.status == 200) {
      setLoadinSend(false)
      return toast({
        position: "bottom-left",
        title: "Email enviado correctamente.",
        description: "El email fue enviado correctamente.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setLoadinSend(false)
      return toast({
        position: "bottom-left",
        title: "Falló el envio de mensaje",
        description: "Intentelo mas tarde cuando el servicio se restablesca",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }
  const getFecha = () => {
    let hoy = new Date();
    return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();
  };
  console.log(venta);
  async function confirmar() {
    setLoading(true);
    let verifyVoucher = await VerifyVoucherOrder(venta.PEDIDO, 1, admin.iu);
    let getPersonForDocument = await ListForDocument(venta.IDCLIENT);
    let productsArray = await ListProductsSalesOnline(venta.PEDIDO);
    let comprobanteSeleccionado = await getDocumentForSaleOnline((getPersonForDocument.DNI && getPersonForDocument.DNI.length > 0) ? 5 : 15);

    if (!getPersonForDocument.message && verifyVoucher.status == 200) {
      const saleProduct: any = [];
      const stockProduc: any = [];
      saleProduct.push({
        DOC_ID: 0,
        PRO_ID: 128,
        DIS_ID: null,
        SDT_CODE: "DELIVERY",
        SDT_AMOUNT: 0,
        SDT_DESCRIPTION: "DELIVERY",
        SDT_PRICE: company.COM_DELIVERY_PRICE,
        SDT_SUBTOTAL: company.COM_DELIVERY_PRICE,
        SDT_DISCOUNT: 0,
        SDT_TOTAL: company.COM_DELIVERY_PRICE,
        SDS_DAYS_TO_SEND: "DELIVERY",
        SDT_DATE: getFecha(),
        SDS_STATUS: "1",
      });
      productsArray.map((values: any, idx: any) => {
        saleProduct.push({
          DOC_ID: 0,
          PRO_ID: values.PRO_ID,
          DIS_ID: null,
          SDT_CODE: values.PRO_CODE,
          SDT_AMOUNT: values.CANTIDAD,
          SDT_DESCRIPTION: values.DESCRIPCION,
          SDT_PRICE: values.PRECIO,
          SDT_SUBTOTAL: values.PRECIO * values.CANTIDAD,
          SDT_DISCOUNT: (values.PRECIO * values.CANTIDAD) - values.SUBTOTAL,
          SDT_TOTAL: values.SUBTOTAL,
          SDS_DAYS_TO_SEND: values.ODT_DAYS_TO_SENDE,
          SDT_DATE: getFecha(),
          SDS_STATUS: "1",
        });
      });
      console.log(saleProduct);

      productsArray.map((values: any, idx: any) => {
        stockProduc.push({
          STK_ID: values.STK_ID,
          SDT_AMOUNT: values.CANTIDAD,
        });
      });
      console.log(comprobanteSeleccionado);

      let dataVenta = {
        document: {
          PMT_ID: 5,
          DCT_ID: (getPersonForDocument.DNI && getPersonForDocument.DNI.length > 0) ? 5 : 15,
          SLT_ID: 15,
          XCR_ID: 5,
          BUS_ID: 5,
          PER_ID: venta.IDCLIENT,
          DOC_ID_CLIENT:
            getPersonForDocument.DNI == ""
              ? getPersonForDocument.RUC
              : getPersonForDocument.DNI,
          DOC_BUSINESS_NAME: getPersonForDocument.TRADENAME ? getPersonForDocument.TRADENAME : getPersonForDocument.NOMBRE,
          DOC_DIRECTION_CLIENT: getPersonForDocument.DIRECTION,
          DOC_DOC_TYPE: comprobanteSeleccionado.DCT_NAME,
          DOC_SERIE: comprobanteSeleccionado.DCT_SERIE,
          DOC_NUMBER: comprobanteSeleccionado.DCT_SEQUENCE,
          DOC_SUBTOTAL: parseFloat(venta.TOTAL) + parseFloat(venta.DESCUENTO),
          DOC_SUB_SUBTOTAL: (parseFloat(venta.TOTAL) + parseFloat(venta.DESCUENTO)) / 1.18,
          DOC_SUB_DISCOUNT: parseFloat(venta.DESCUENTO),
          DOC_DISCOUNT: 0,
          DOC_DATE: getFecha(),
          DOC_TAXED: (parseFloat(venta.TOTAL) + parseFloat(venta.DESCUENTO)) / 1.18,
          DOC_INAFECT: 0.0,
          DOC_RELEASED: 0.0,
          DOC_IGV: venta.IGV,
          DOC_NETO: venta.TOTAL,
          DOC_STATUS: "CREADO",
        },
        sales_description: saleProduct,
        stock: stockProduc,
      };
      api.ventas.addDocument(dataVenta).then((result) => { });
      sendEmail("Aceptar");
      statusdownload(true);
      updated((val) => !val);
      statusaprobacion("1");
      setLoading(false);
      setIssOpen(false);
    }
  }

  async function rechazar() {
    setLoading(true);
    let verifyVoucher = await VerifyVoucherOrder(venta.PEDIDO, 2, admin.iu);

    if (verifyVoucher.status == 200) {
      sendEmail("Rechazar");
      statusaprobacion("2");
      updated((val) => !val);
      statusdownload(false);
      setLoading(false);
      setIssOpen(false);
    }
  }

  async function confirmacion(values: any) {
    if (values == "Aceptar") {
      statuspreaprobacion(1);
      setIssOpen(true);
    } else if (values == "Rechazar") {
      statuspreaprobacion(2);
      setIssOpen(true);
    }
  }
  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Drawer onClose={onClose} isOpen={isOpen} size={"xl"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Box>
              <Flex>
                <Text style={{ fontWeight: "bold" }}> Detalle Pedido</Text>
                <IconButton
                  icon={<IoPrintSharp />}
                  aria-label="Imprimir"
                  colorScheme="orange"
                  ml={4}
                  mr={4}
                  disabled={
                    donwload
                  }
                />
                <DonwloadPDF venta={venta} disabled={donwload}>
                  <IconButton
                    icon={<IoDownloadSharp />}
                    aria-label="Descargar"
                    colorScheme="blue"
                    disabled={donwload}
                  />
                </DonwloadPDF>
              </Flex>
            </Box>
          </DrawerHeader>
          <DrawerBody>
            <Box bg="white" w="100%" color="black">
              <BoxInfo>
                <Flex>
                  <Box p="2">
                    <Text>
                      <strong> Pedido: </strong># {venta.PEDIDO}
                    </Text>
                  </Box>
                </Flex>
              </BoxInfo>
              <BoxInfo>
                <Flex>
                  <Box p="2">
                    <Text>
                      <strong>Cliente: </strong> <ClienteName pro={venta} />
                    </Text>
                  </Box>
                  <Spacer />
                  <Box p="2">
                    <strong> Email: </strong>
                    {venta.EMAIL != "" &&
                      venta.EMAIL != null &&
                      venta.APROBACION != 0 &&
                      venta.APROBACION != null ? (
                      <Button onClick={() => sendEmail("Aceptar")} isLoading={loadingSend} background="white">
                        <Badge
                          ml={2}
                          cursor="pointer"
                          colorScheme="blue"
                          variant="outline"
                          fontSize="15px">
                          <IoMail />
                        </Badge>
                      </Button>
                    ) : (
                      <Badge colorScheme="red" variant="outline">
                        Sin Email
                      </Badge>
                    )}
                  </Box>
                </Flex>
              </BoxInfo>
              <BoxInfo>
                <Flex>
                  <Box p="2">
                    <strong> Fecha de pedido: </strong> {venta.ORD_DATE_ORDER2}
                  </Box>
                  <Spacer />
                  <Box p="2">
                    <strong> Descuento: </strong> s/. {venta.DESCUENTO}
                  </Box>
                  <Spacer />
                  <Box p="2">
                    <strong> IGV: </strong> s/. {Number(venta.IGV).toFixed(2)}
                  </Box>
                  <Spacer />
                  <Box p="2">
                    <strong> Total: </strong> s/. {venta.TOTAL}
                  </Box>
                </Flex>
              </BoxInfo>
              <BoxInfo>
                <CambiarEstado sale={venta} isLoading={isLoadingM} mutateM={mutateM} aprobacion={venta.APROBACION} />
              </BoxInfo>
              <Box
                bg="white"
                w="100%"
                mt={4}
                color="black"
                border="1px solid gray">
                <TablaProductosVentasOnline idOrder={venta.PEDIDO} />
              </Box>
              <Box
                bg="white"
                w="100%"
                mt={4}
                color="black"
                border="1px solid gray">
                <Accordion allowMultiple>
                  <AccordionItem>
                    {({ isExpanded }) => (
                      <>
                        <AccordionButton>
                          <VerifiedVoucher aprobacion={aprobacion} voucher={venta.VOUCHER} />
                          {isExpanded ? (
                            <BsFileEarmarkMinus fontSize="12px" />
                          ) : (
                            <BsPlusSquareFill fontSize="12px" />
                          )}
                        </AccordionButton>
                        <AccordionPanel>
                          {aprobacion == '0' && venta.VOUCHER !== null ? (<>
                            <BoxView>
                              <Center padding={"5"} >
                                <Box >
                                  <HStack>
                                    {options.map((value) => {
                                      const radio = getRadioProps({ value });
                                      return (
                                        <>
                                          <RadioCard key={value} {...radio} >
                                            <Center>
                                              {value === "Aceptar" ? (
                                                <AiOutlineCheckCircle size={"70"} color="green" />) :
                                                (<AiOutlineCloseCircle size={"70"} color="red" />)}
                                            </Center>
                                            <Center>
                                              <Text fontWeight={"bold"} fontSize="lg"> {` ${value} voucher`}</Text>
                                            </Center>
                                          </RadioCard>
                                        </>

                                      );
                                    })}
                                  </HStack>
                                </Box>
                              </Center>
                            </BoxView>
                            <BoxView>
                              <Center h="100%" w="100%">
                                <Image
                                  src={imagen}
                                  alt="Voucher"
                                  objectFit="cover"
                                  boxSize="600px"
                                />
                              </Center>
                            </BoxView>
                          </>
                          ) : aprobacion == '1' ? (
                            <>
                              <BoxView>
                                <Center mb={2}>
                                  <Badge
                                    backgroundColor={"white"}
                                    p={1}>

                                    <Center>
                                      <img src={success} alt="" sizes={"100"} width={"100"} />
                                      - Voucher verificado y aprobado
                                      <br />
                                      - Aprobado por {venta.APROBADOR}
                                      {/* <br />
                                            - Aprobado el 10/01/2020 */}
                                    </Center>
                                  </Badge>
                                </Center>
                              </BoxView>
                              <BoxView>
                                <Center h="100%" w="100%">
                                  <Image
                                    src={imagen}
                                    alt="Voucher"
                                    objectFit="cover"
                                    boxSize="600px"
                                  />
                                </Center>
                              </BoxView>

                            </>
                          ) : (
                            <>
                              <BoxView>
                                <Center mb={2}>
                                  <Badge
                                    backgroundColor={"white"}
                                    p={1}>
                                    <Center>
                                      <img src={denied} alt="" sizes={"100"} width={"100"} />
                                      - Voucher Rechazado
                                      <br />
                                      - Rechazado por {venta.APROBADOR}
                                    </Center>
                                  </Badge>
                                </Center>
                                <Tooltip label='No Permitido'>
                                  <Center>
                                    <Button
                                      disabled={true}
                                      colorScheme="gray"
                                      variant="outline"
                                      fontSize="15px">
                                      <Center>
                                        <IoMail /> | Solicitar nuevo voucher al cliente
                                      </Center>
                                    </Button>
                                  </Center>
                                </Tooltip>
                              </BoxView>
                              <BoxView>
                                <Center h="100%" w="100%">
                                  <Image
                                    src={imagen}
                                    alt="Voucher"
                                    objectFit="cover"
                                    boxSize="600px"
                                  />
                                </Center>
                              </BoxView>
                            </>
                          )}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                </Accordion>
              </Box>
              <FormControl>
                <Box bg="white" w="100%" pl={4} pr={4} mt={4} color="black">
                  <Button onClick={onClose}>Cerrar</Button>
                </Box>
              </FormControl>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={issOpen}
        //@ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onsClose}
        closeOnOverlayClick={false}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {preaprobacion == 1
                ? "Esta aceptando el voucher brindado por el cliente."
                : "Esta rechazando el voucher brindado por el cliente."}
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Está seguro? <br />
              {preaprobacion == 1
                ? "Esta acción registrara la orden como una venta aceptada."
                : "Se le enviará un correo al cliente pidiendo que actualice el voucher."}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Center>
                <Button
                  // @ts-ignore
                  ref={cancelRef}
                  onClick={onsClose}
                  isDisabled={isLoading}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  ml={3}
                  onClick={preaprobacion == 1 ? confirmar : rechazar}
                  isLoading={isLoading}>
                  Confirmar
                </Button>
              </Center>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export const BoxInfo = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      bg="white"
      w="100%"
      pl={2}
      pr={4}
      mt={2}
      color="black"
      border="1px solid gray">
      {children}
    </Box>
  );
};

const ClienteName = ({ pro }: { pro: any }) => {
  console.log(pro);
  return (<Text>{(pro.CLIENTE.trim()).length > 0 ? pro.CLIENTE : pro.TRADENAME}</Text>)
}

export const BoxView = ({ children }: { children: ReactNode }) => {
  return (
    <Box bg="white" p={2} m={2} border="1px solid gray" height={"auto"}>
      {children}
    </Box>
  );
};

export const VerifiedVoucher = ({ aprobacion, voucher }: { aprobacion?: any, voucher?: any }) => {
  let theVerifiedIs = "";
  let colorVerified = "";

  switch (aprobacion) {
    case "1":
      theVerifiedIs = "Voucher verificado";
      colorVerified = "green";
      break;
    case "2":
      theVerifiedIs = "Voucher rechazado";
      colorVerified = "yellow";
      break;
    default:
      theVerifiedIs = "Falta Verificación";
      colorVerified = "red";
      break;
  }

  return (
    <>
      <Box flex="1" textAlign="left">
        <Flex>
          <Box>
            <strong> Documento de Pago: </strong>
            {/* { voucher == null ? "Sin Voucher" : "Voucher Eliminado" } */}
            {voucher !== null ? "Voucher Adjunto" : voucher === null ? "Sin Voucher" : "Voucher Eliminado"}
          </Box>
          <Spacer />
          <Box pr={4}>
            <strong> Verificación: </strong>
            <Badge
              colorScheme={colorVerified}
              variant="outline">
              {theVerifiedIs}
            </Badge>
          </Box>
        </Flex>
      </Box>
    </>
  );
};