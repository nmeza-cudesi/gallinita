import React from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";

import { MdRemoveShoppingCart } from "react-icons/md";
import { NewVoucherModal } from "./NewVoucher";
import { AiOutlineFileSync } from "react-icons/ai";

export const MessageVoucherRejected = ({ voucher, id_order, refetch }: any) => {
  const boxCarritoVacioBG = useColorModeValue("gray.200", "gray.500");
  const buttonarritoVacioBG = useColorModeValue("blue.600", "gray.300");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex justifyContent="center">
        <Box
          textAlign="center"
          borderRadius="lg"
          p="5"
          m="5"
          bg={boxCarritoVacioBG}
        >
          <Text fontWeight="bold" textTransform="uppercase">
            Su Voucher a sido rechazado
          </Text>
          <Text textTransform="uppercase">
            Ingrese un nuevo voucher o Cancele la compra
          </Text>
          <Flex>
            <Button
              m={1}
              onClick={onOpen}
              mt="5"
              leftIcon={<AiOutlineFileSync />}
              bg="blue.700"
              color="white"
              variant="solid"
              _hover={{ bg: buttonarritoVacioBG }}
            >
              Nuevo voucher
            </Button>

            <Tooltip label="No Permitido">
              <Box>
                <Button
                  disabled={true}
                  m={1}
                  mt="5"
                  leftIcon={<MdRemoveShoppingCart />}
                  bg="blue.700"
                  color="white"
                  variant="solid"
                  _hover={{ bg: buttonarritoVacioBG }}
                >
                  Cancelar Compra
                </Button>
              </Box>
            </Tooltip>
          </Flex>
        </Box>
      </Flex>
      <NewVoucherModal
        voucher={voucher}
        isOpen={isOpen}
        onClose={onClose}
        id_order={id_order}
        refetch={refetch}
      />
    </>
  );
};
