import {
  Button,
  Center,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export const ProductSavedSuccessfully = ({ isOpen, onClose }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent style={{ backgroundColor: "#f6f4f2" }}>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <Image
              objectFit="cover"
              src="https://cdn.dribbble.com/users/619199/screenshots/3787913/media/b07e5b261a9286a9455a53a23d845a18.gif"
              alt="Product Saved Successfully"
              style={{
                objectFit: "contain",
                height: "264px",
                width: "270px",
              }}
            />
          </Center>
          <Center>
            <Text style={{ fontWeight: "bold" }} fontSize="md">
              Guardado Exitosamente
            </Text>
          </Center>
        </ModalBody>
        <ModalFooter>
          <Link to="/">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Nueva Compra
            </Button>
          </Link>
          <Link to="/carrito">
            <Button variant="ghost">Ir a Carrito</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
