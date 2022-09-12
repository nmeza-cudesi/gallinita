import React, { useState } from 'react';
import { MyContain } from '../../../UI/Components/MyContain';
import { SelectPOS } from './selectPOS'
import { Flex, Select } from '@chakra-ui/react'
import { useQuery } from 'react-query';
import { getPointSales } from '../../../../Service/PoaintSaleService';
import { VentaPosTable } from './VentaPosTable';
import { VentaPosInfo } from './VentaPosInfo';

export const VentaPOS = ({ proList }: { proList: any }) => {

    // const { data, isError, isFetching, isLoading, refetch } = useQuery('PuntoVenta', getPointSales)
    const [venta, setVenta] = useState({
        descuentoGeneral: 0,
        totalIGVInafecto: 0,
        descuento: 0,
        total: 0,
        totalMontoInafecto: 0
    })

    // Use State de Data para poder modificar su valor al agregar producto
    const [array, setArray] = useState([])
    // Use State de Productos
    const [listProd, setListProd] = useState([])

    const [POS_ID, setPOS_ID] = useState(0)

    return (
        <>
            <MyContain>
                <SelectPOS setPOS_ID={setPOS_ID} />
            </MyContain>

            <Flex marginTop={'1%'} gap={'10px'}>
                <VentaPosTable POS_ID={POS_ID} array={array} setArray={setArray} listProd={listProd} setListProd={setListProd} />
                <VentaPosInfo venta={venta} POS_ID={POS_ID} array={array} setArray={setArray} listProd={listProd} setListProd={setListProd} />
            </Flex>
            {POS_ID}
        </>
    )
}
