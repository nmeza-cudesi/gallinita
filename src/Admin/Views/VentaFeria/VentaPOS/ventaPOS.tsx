import React, { useState } from 'react';
import { MyContain } from '../../../UI/Components/MyContain';
import { SelectPOS } from './selectPOS'
import { Flex, Select } from '@chakra-ui/react'
import { useQuery } from 'react-query';
import { getPointSales } from '../../../../Service/PoaintSaleService';
import { VentaPosTable } from './VentaPosTable';
import { VentaPosInfo } from './VentaPosInfo';

export const VentaPOS = () => {

    // const { data, isError, isFetching, isLoading, refetch } = useQuery('PuntoVenta', getPointSales)

    const [POS_ID , setPOS_ID] = useState(0)
    return (
        <>
            <MyContain>
                <SelectPOS setPOS_ID={setPOS_ID}/>
            </MyContain>

            <Flex marginTop={'1%'} gap = {'10px'}>
                <VentaPosTable/>
                <VentaPosInfo/>
            </Flex>
            {POS_ID}
        </>
    )
}
