import { Image } from '@chakra-ui/image'
import { Stack, IconButton, Button, HStack, Spacer } from '@chakra-ui/react'
import React from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { useQuery } from 'react-query'
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable'
import { getProductswithTDandCat } from '../../../../Service/ProductAdminService'
import { TableChargeListProduct } from '../../../UI/Components/TableCharge/tablecharge'
import { DeleteProdDialog } from './DeleteProdDialog'
import { CreateProdHijoModal, EditeProdModal } from './EditeProdModal'
import { MyContain } from '../../../UI/Components/MyContain'
import { CreateProdModal } from './CreateProdModal'
import { ButtonRefetch } from '../../../UI/Components/ButtonRefetch'
import { CgAdd } from 'react-icons/cg'
import { BsPlusLg } from 'react-icons/bs'
import { ImportProd } from './ImportProd'

export const ProdTable = ({ online }: { online: boolean }) => {

    const { data, isLoading, isError, isFetching, refetch } = useQuery('products', () => getProductswithTDandCat(online), { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: 'Categoría',
            Footer: 'Categoría',
            accessor: 'CAT_NAME'
        },
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'PRO_NAME'
        },
        {
            Header: 'Imagen',
            Footer: 'Imagen',
            id: 'pro_image',
            // @ts-ignore
            Cell: ({ row }) => <Image borderRadius={"full"} boxSize="80px" style={{ objectFit: "cover" }} src={row.original.PRO_IMAGE} />
        },
        {
            Header: 'Descripción',
            Footer: 'Descripción',
            accessor: 'PRO_DESCRIPTION'
        },
        {
            Header: 'Código',
            Footer: 'Código',
            accessor: 'PRO_CODE'
        },
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'pro_acciones',
            // @ts-ignore
            Cell: ({ row }) => <ActionCell pro={row.original} />
        },
    ]

    //@ts-ignore
    if (isError) return <h1>{error.message}</h1>;

    return (
        <>
            <MyContain>
                <HStack>
                    <CreateProdModal online={online}>
                        <Button colorScheme="green" >Agregar</Button>
                    </CreateProdModal>
                    <ImportProd />
                    <Spacer />
                    <ButtonRefetch refetch={refetch} />
                </HStack>
            </MyContain>
            {isLoading || isFetching ?
                <TableChargeListProduct /> :
                <MyContain>
                    <MyReactTable columns={columns} data={data.status == 200 ? [] : data} isPaginated hasFilters pagesOptions={[5, 10, 15]} />
                </MyContain>}
        </>

    )

}

const ActionCell = ({ pro }: { pro: any }) =>
    <Stack direction={{ base: "column", md: "row" }}>
        {pro.PRO_FATHER == 1 && <CreateProdHijoModal product={{ ...pro, PRO_REMISION: (pro.PRO_REMISION == 1) }}>
            <IconButton borderRadius={"full"} icon={<BsPlusLg />} aria-label="Editar" colorScheme="blue" />
        </CreateProdHijoModal>}
        <EditeProdModal product={{ ...pro, PRO_REMISION: (pro.PRO_REMISION == 1),PRO_FATHER: (pro.PRO_REMISION == 1), PRO_INAFECT: (pro.PRO_INAFECT == "1") }}>
            <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
        </EditeProdModal>
        <DeleteProdDialog proId={pro.PRO_ID}>
            <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
        </DeleteProdDialog>
    </Stack>