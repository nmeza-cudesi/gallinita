import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import { useQuery } from 'react-query'
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable'
import { getPointSales } from '../../../../Service/PoaintSaleService'
import { TableCharge } from '../../../UI/Components/TableCharge/tablecharge'
import { DeletePosModal } from './DeletePosModal'
import { UpdatePosModal } from './UpdatePosModal'

export const PuntoVentaTable = () => {
    const { data, isError, isLoading, isFetching, refetch } = useQuery("PointSales", getPointSales, { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: "Nro Comprobante",
            accessor: "POS_NAME",
            filter: "fuzzyText",
        },
        {
            Header: "Forma de Pago",
            accessor: "POS_DESCRIPTION",
            filter: "fuzzyText",
        },
        {
            Header: "Fecha de Registro",
            accessor: "POS_DIRECTION",
            disableFilters: true,
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell ven={row.original} />,
        },
    ];

    // @ts-ignore
    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;
    return (
        <>
            <MyReactTable 
             columns={columns}
             data={data}
             isPaginated
             hasFilters/>

             
             
        </>
    )
}
const ActionCell = (ven : any) => (
    <>
        <DeletePosModal pointSale = {ven["ven"]}>
            <Button>Eliminar</Button>
        </DeletePosModal>
        <UpdatePosModal pointSale={ven["ven"]}>
            <Button>Editar</Button>
        </UpdatePosModal>
    </>
)