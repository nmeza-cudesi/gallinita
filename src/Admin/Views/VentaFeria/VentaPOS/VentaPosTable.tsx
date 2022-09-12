import { Box, Button, Input, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getPointSaleById, getSaleByPOS } from "../../../../Service/PoaintSaleService";
import { MyContain } from "../../../UI/Components/MyContain";
import { DeletePosModal } from "../PuntoVenta/DeletePosModal";
import { IconButton } from '@chakra-ui/react'
import { BsFillTrashFill } from "react-icons/bs";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";

export const VentaPosTable = ({ POS_ID, array, setArray, listProd, setListProd }: { POS_ID: any, array: any, setArray: any, listProd: any, setListProd: any }) => {
    const { data, isError, isFetching, isLoading, refetch } = useQuery(['VentaByPOS', POS_ID], () => getSaleByPOS(POS_ID), { refetchOnWindowFocus: false })
    console.log(data);

    const valorcito = useRef(null)

    const [skipPageReset, setSkipPageReset] = useState(false);
    const columns = [
        {
            Header: "Nombre Producto",
            accessor: "PRO_NAME",
        },
        {
            Header: "Precio",
            accessor: "RDT_PRICE",
        },
        {
            Header: "Peso",
            accessor: "RDT_AMOUNT",
        },
        {
            Header: "Codigo de Barra",
            accessor: "RDT_CODEBAR",
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell setArray={setArray} setListProd={setListProd} row={row.original} array={array} />,
        },
    ];
    const [listCode, setListCode] = useState([])
    function searchCodebar(event: any) {
        // busca para agregar la tabla :D
        setListCode(array.filter((element: any) => {
            return element.RDT_CODEBAR == event.target.value
        }))
    }

    function handleEnter(event: any) {
        // esto atualiza la tabla :D
        if (event.keyCode === 13) {
            if (listCode[0]) {
                // console.log(listCode[0]);            
                setListProd((old: any) => [...old, listCode[0]])
                // @ts-ignore
                setArray((old) => old.filter((d: any) => d.RDT_ID !== listCode[0].RDT_ID))
                // @ts-ignore
                valorcito.current.value = ''
                console.log(array);

            } else {
                alert("NO HAY REGISTROS DE ESTE CÓDIGO")
            }
        }

    }
    function updateMyData(row: any) {
        setSkipPageReset(true);
        console.log(row.index);

        // @ts-ignore
        setProds((old: any) => {
            // @ts-ignore
            return old.filter((val, idx) => idx !== row.index);
        });
    }

    useEffect(() => {
        setSkipPageReset(false);
    }, [listProd]);

    useEffect(() => {
        setArray(data)
    }, [data])

    // @ts-ignore
    /* if (isLoading || isFetching) return (<TableCharge />) */

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;

    return (
        <Box w={'60%'}>
            <MyContain>
                <Input placeholder='Basic usage' onKeyUp={searchCodebar} onKeyDown={handleEnter} ref={valorcito} />
                {(isLoading || isFetching) ?
                    <TableCharge />
                    : <MyReactTable
                        columns={columns}
                        // @ts-ignore
                        data={listProd}
                        skipPageReset={skipPageReset}
                        updateMyData={updateMyData} />
                }
            </MyContain>
        </Box>
    )

}

const ActionCell = ({ setArray, setListProd, row, array }: { setArray: any, setListProd: any, row: any, array: any }) => {
    function handleDelete() {
        setListProd((old: any) => old.filter((d: any) => d.RDT_ID !== row.RDT_ID));
        setArray((old: any) => [...old, row]);
        console.log(array);

    }
    return (


        <IconButton aria-label="eliminar venta en punto de venta" onClick={handleDelete} icon={<BsFillTrashFill />} />

    )
}