import { Grid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { MyContain } from "../../../UI/Components/MyContain";
import { VentasTable } from "./VentasTable";

export const ListarVentasOnline = () => {
  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Listar Pedidos Online';
  }, [])

  return (<Grid gap="1rem">
    <MyContain>
      <VentasTable />
    </MyContain>
  </Grid>)
};
