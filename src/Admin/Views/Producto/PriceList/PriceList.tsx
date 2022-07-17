import React, { useEffect } from 'react'
import { Grid, Button, Flex, Spacer, Box } from '@chakra-ui/react'
import { PriceListTable } from './PricelistTable';

export const PriceList = () => {

    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Lista de precios';
    }, [])
    
    return (<Grid
        gap="1rem"
    >

        <PriceListTable />
    </Grid>)
}
