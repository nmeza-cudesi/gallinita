
import React, { useEffect } from 'react';
import { MyContain } from '../../../UI/Components/MyContain';
import { MetodoPagoTable } from './MetPagoTable';

export const MetodoPago = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Métodos de Pagos';
      }, [])
    return (
        <>
            <MyContain >
                <MetodoPagoTable />
            </MyContain>
        </>
    )
}
