import React from 'react'

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import { Button, Stack, Skeleton } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';

export const ListaVentasExport = ({ isLoading, data }: { isLoading: any, data: any }) => {
    if (isLoading) return (<Button
        bg={"#3e49f9"}
        isLoading={isLoading}
        leftIcon={<BsDownload />}>
        Export
    </Button>)
    return <ExportCSV csvData={data} fileName="Lista de Ventas" />
}

const ExportCSV = ({ csvData, fileName }: any) => {
    console.log(csvData);

    let data = !(csvData.status == 200) ? csvData.map((val: any, idx: number) => {
        return {
            "Fecha": val.DOC_DATE2
            , "ID Cliente": val.DOC_ID_CLIENT
            , "Nombre": val.DOC_BUSINESS_NAME
            , "Documento": val.DCT_NAME
            , "Comprobante": val.COMPROBANTE
            , "Tipo de Pago": val.PMT_NAME
            , "Monto": val.DOC_NETO
            , "Estado": val.DOC_ESTADO == "1" ? "Pagado" : "Emitido"
        }
    }) : [];

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';

    const exportToCSV = (csvData: any, fileName: any) => {

        const ws = XLSX.utils.json_to_sheet(csvData);

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);

    }



    return (
        <Button
            colorScheme="blue"
            leftIcon={<BsDownload />}
            onClick={(e) => exportToCSV(data, fileName)}>Export</Button>
    )

}