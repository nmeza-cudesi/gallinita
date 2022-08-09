import React from 'react'

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import { useQuery } from 'react-query';
import { Button, Stack, Skeleton } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';
import { ExportOrders } from '../../../../Service/Sales';

export const DescargarPedidos = () => {
    const { isLoading, data } = useQuery(
        "exportDetailOrder",
        ExportOrders,
        { refetchOnWindowFocus: false }
    );
    return <ExportCSV isLoading={isLoading} csvData={data} fileName="Pedidos Online" />
}

const ExportCSV = ({ csvData, fileName, isLoading }: any) => {



    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';



    const exportToCSV = (csvData: any, fileName: any) => {
        const dataExport = csvData.map((val: any) => {
            return {
                "NOMBRE/RAZON SOCIAL": val.PER_TRADENAME.length > 1 ? val.PER_TRADENAME : val.PER_NAME + " " + val.PER_LASTNAME,
                "DIRECCIÓN": val.PER_COUNTRY + " " + val.PER_DEPARTMENT + " " + val.PER_DISTRIC + " " + val.PER_DIRECTION,
                "PRODUCTOS": val.Productos,
                "TOTAL A PAGAR": val.totalPrecio,
            }
        })
        const ws = XLSX.utils.json_to_sheet(dataExport);

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);

    }



    return (

        <Button isLoading={isLoading} bg={"#3e49f9"} leftIcon={<BsDownload />} onClick={(e) => exportToCSV(csvData, fileName)}>Export</Button>

    )

}