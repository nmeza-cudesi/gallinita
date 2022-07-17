import { Stack, Skeleton, Img, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillEdit } from 'react-icons/ai';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { EditPromotionStatus } from '../../../../Service/PromotionAdminService';
import { ListMetodoPago } from '../../../../Service/MetodoPagoService';
import { EditMetPagoModal } from './EditMetodoPagoModal';

export const MetodoPagoTable = () => {
    
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('metodo_pago', ListMetodoPago, { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: 'ID',
            Footer: 'ID',
            accessor: 'MPG_ID',
            disableFilters: true
        },

        {
            Header: 'Imagen',
            Footer: 'Imagen',
            accessor: 'MPG_IMAGE',
            // @ts-ignore
            Cell: ({ row }) => (
                <Img src={row.original.MPG_IMAGE} />
            ),
        },
        {
            Header: 'Titulo',
            Footer: 'Titulo',
            accessor: 'MPG_NAME',
        },
        {
            Header: 'Descripción',
            Footer: 'Descripción',
            accessor: 'MPG_DESCRIPTION',
        },
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'actions', 
            // @ts-ignore
            Cell: ({ row }) => (
                <ActionCell metodopago={row.original} />
            ),
        },
    ]

    if (isLoading || isFetching) return (
        <Stack>
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
        </Stack>
    )

    // @ts-ignore
    if (isError) return <h1>{error.message} {':('}</h1>
    // @ts-ignore
    if (data.message) return <h1>{data.message}</h1>
    return (
        <>
            {/* <IconButton m="2" onClick={() => refetch()} aria-label="Recargar" icon={<IoReload />} /> */}
            <MyReactTable columns={columns} data={data || []} isPaginated hasFilters pagesOptions={[5, 10, 15]} />
        </>
    )
}

const ActionCell = ({ metodopago }: { metodopago: any }) => {

    const status = metodopago.PRT_STATUS === '1'
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(EditPromotionStatus, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('promociones')
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
        },
        onError: () => alert("error intentarlo luego")
    })
    return (
        <Stack direction={{ base: "column", md: "row" }}>
            // * MODAL PARA EDITAR
            {<EditMetPagoModal metodopago={metodopago}>
                <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
            </EditMetPagoModal>}
        </Stack>)
}