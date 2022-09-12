import React from 'react';
import { MyContain } from '../../../UI/Components/MyContain';
import { Select } from '@chakra-ui/react'
import { useQuery } from 'react-query';
import { getPointSales } from '../../../../Service/PoaintSaleService';

export const SelectPOS = ({setPOS_ID} : {setPOS_ID : any}) => {

    const { data, isError, isFetching, isLoading, refetch } = useQuery('PuntoVenta', getPointSales)
    return (
        <>
            <Select placeholder='Select option' width={'fit-content'} onChange= {(e) => {setPOS_ID(e.target.value)}}>
                {data && data.map((element:any) => 
                    <option value={element.POS_ID}>{element.POS_NAME}</option>
                )}
            </Select>
        </>
    )
}
