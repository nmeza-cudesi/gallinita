import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup, InputRightElement, } from "@chakra-ui/input";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import React from "react";
import { BsEye } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { ImpresionVenta as FormatoImpresion } from "../Impresion/ImpresionVenta";
import api from "../RealizarVenta/ApiVentas";
export const VerComprobante = ({ venta }: { venta: any }) => {
  const messageToast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  let [correo, SetCorreo] = React.useState("");
  function EnviarCorreo() {
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (emailRegex.test(correo)) {
      messageToast({
        title: "Estamos enviando el correo",
        description: "El comprobante se está enviando al correo",
        status: "info",
        duration: 3000,
        isClosable: true,
      })
      api.ventas.sendCorreo(venta.DOC_ID, correo).then((result: any) => {
        if (result.message == "Mail send") {
          messageToast({
            title: "Correo enviado",
            description: "El comprobante fue enviado a " + correo + " satisfactoriamente",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
        } else {
          messageToast({
            title: "Correo no enviado",
            description: "hubo algún error al enviar el correo",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        }

      })
    } else {
      messageToast({
        title: "Correo no válido",
        description: "Ingrese un correo electrónico",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
    }
  }
  return (
    <>
      <Tooltip label='Ver Comprobante'>
        <IconButton
          /*@ts-ignore*/
          ref={btnRef}
          ml="1"
          colorScheme="teal"
          onClick={onOpen}
          icon={<FaEye />}
        />
      </Tooltip>

      {/*@ts-ignore*/}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        //@ts-ignore
        finalFocusRef={btnRef}
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Información de venta</DrawerHeader>

          <DrawerBody>
            <FormatoImpresion
              productos={[]}
              idventa={venta.DOC_ID}
              activador={() => { }}
            />
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="gmail"
                placeholder="Ingrese Correo"
                value={correo}
                onChange={(e) => {
                  SetCorreo(e.target.value);
                }}
              />
              <InputRightElement width="6rem">
                <Button h="1.75rem" size="sm" onClick={EnviarCorreo}>
                  Enviar Correo
                </Button>
              </InputRightElement>
            </InputGroup>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};