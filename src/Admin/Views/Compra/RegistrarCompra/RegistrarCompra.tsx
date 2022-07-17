import { Button } from '@chakra-ui/button'
import { Grid } from '@chakra-ui/layout'
import React, { useEffect } from 'react'
import { MyContain } from '../../../UI/Components/MyContain'
import { CompraTable } from './CompraTable'
import { RegCompraModal } from './RegCompraModal'

export const RegistrarCompra = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Guia de Remision';
    }, [])
    return (
        <Grid
            gap="1rem"
        >
            <MyContain>
                <RegCompraModal />
            </MyContain>
            <MyContain>
                <CompraTable />
            </MyContain>
        </Grid>
    )
}
