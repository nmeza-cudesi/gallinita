import React, { ReactNode, useRef, useState } from "react";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Grid, GridItem, Stack, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useQuery } from "react-query";
import { AddProdCompra } from "./AddProdCompra";
import { ImportProdRemision } from "./ImportProd";

export const RegCompraModal = () => {

  const [idProducto, setIdProducto] = useState<any>();
  //const { data: product, isError: catIsError, isLoading: catLoading } = useQuery("productsByIdCat", () => producstByCatId(idProducto.CAT_ID), { refetchOnWindowFocus: false });

  const { isOpen, onOpen, onClose } = useDisclosure();

  let [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  const [completeAllValues, setCompleteAllValues] = useState(true);
  const inputEl = useRef(null);

  return (
    <>
      <Box w={"fit-content"} display="flex" gap={5}>
        <Button onClick={onOpen}>Agregar</Button>
        <ImportProdRemision />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl">
        <ModalOverlay />
        <ModalContent maxW="80%">
          <ModalHeader>Registrar Guia de Remision</ModalHeader>
          <ModalCloseButton onClick={() => setCompleteAllValues(true)} />
          <ModalBody pb={6}>
            {/* <ProductRemissionComp ref={inputEl} setProduct={setIdProducto} remision={1} /> */}
            <Grid
              h="auto"
              templateRows="repeat(5, auto)"
              templateColumns="repeat(8, 12.5%)"
              w="full">
              <GridItem mx={2} mt="15px" colSpan={8}>
                {/* tabs para compras con detalle o solo kilaje */}
                {<AddProdCompra ref={inputEl} idProducto={idProducto} />}
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => (onClose(), setCompleteAllValues(true))}
              isDisabled={esperandoRespuesta}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
