import { Box, Center, HStack } from "@chakra-ui/react";
import React from "react";
import { AcceptVoucher } from "./AcceptVoucher";
import { CancelledOrder } from "./CancelledOrder";
import { RejectedVoucher } from "./RejectedVoucher";

export const VerficationOptions = ({ confirmar, rechazar, cancelar }: any) => {
  return (
    <Box>
      <Center>
        <HStack spacing={8}>
          <AcceptVoucher confirmar={confirmar} />

          <RejectedVoucher rechazar={rechazar} />

          {/* TO DO: Cuando ya estemos listo para tener esta opcion desde el administrador, descomenten este componente y terminen el proceso */}
          {/* <CancelledOrder cancelled={cancelar} /> */}
        </HStack>
      </Center>
    </Box>
  );
};
