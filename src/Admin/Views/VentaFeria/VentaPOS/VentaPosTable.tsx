import { Box, Button, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getPointSaleById, getSaleByPOS } from "../../../../Service/PoaintSaleService";
import { MyContain } from "../../../UI/Components/MyContain";
import { DeletePosModal } from "../PuntoVenta/DeletePosModal";
import { IconButton } from '@chakra-ui/react'
import { BsFillTrashFill } from "react-icons/bs";

export const VentaPosTable = () => {
    const { data, isError, isFetched, isLoading, refetch } = useQuery('VentaByPOS', () => getSaleByPOS(3))
    console.log(data);

    // Use State de Productos
    const [listProd, setListProd] = useState([])

    // Use State de Data para poder modificar su valor al agregar producto
    const [array, setArray] = useState([])


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
            Cell: ({ row }) => <ActionCell setArray={setArray} setListProd = {setListProd} row = {row.original} array = {array}/>,
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
                setListProd((old) => [...old, listCode[0]])
                // @ts-ignore
                setArray((old) => old.filter((d: any) => d.RDT_ID !== listCode[0].RDT_ID))
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

    return (
        <Box flex={'7'}>
            <MyContain>
                <Input placeholder='Basic usage' onKeyUp={searchCodebar} onKeyDown={handleEnter} />
                <MyReactTable
                    columns={columns}
                    // @ts-ignore
                    data={listProd}
                    skipPageReset={skipPageReset}
                    updateMyData={updateMyData} />
            </MyContain>
        </Box>
    )
    
}

const ActionCell = ({setArray, setListProd, row, array}: {setArray : any, setListProd: any, row:  any, array :any} ) => {
    function handleDelete(){
        setListProd((old:any) => old.filter((d:any) => d.RDT_ID !== row.RDT_ID));
        setArray((old:any) => [...old, row]);
        console.log(array);
        
    }
    return (


        <IconButton aria-label="eliminar venta en punto de venta" onClick={handleDelete} icon= {<BsFillTrashFill/>} />

    )
}