import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import React, { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { async } from "regenerator-runtime";
import * as XLSX from "xlsx";
import { getCategoryById } from "../../../../Service/CategoryAdminService";
import { createPriceList } from "../../../../Service/PriceListAdminService";
import { createStock } from "../../../../Service/ProductAdminService";
import { AgregarRemission, AgregarRemissionDetail, DocumentRemission, ProductByCode, updateDocumentSequence } from "../../../../Service/RemisionAdminService";

interface RemissionsDetail {
    RDT_ID?: number;
    REM_ID?: number;
    PRO_ID: number;
    RDT_AMOUNT: number;
    RDT_CODEBAR: string;
    RDT_DUEDATE: string;
    RDT_PRICE: number;
    RDT_STATUS: string;
    nameproduct: string;
}

export const ImportProdRemision = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isLoading } = useMutation('createProduct')
    const { mutateAsync: CrateRemission } = useMutation(AgregarRemission)
    const { mutateAsync: UpdateDocumentSequence } = useMutation(updateDocumentSequence)
    const { mutateAsync: CrateRemissionDetail } = useMutation(AgregarRemissionDetail)
    const [cargando, setCargando] = useState(false)
    var prods: RemissionsDetail[] = []

    function zfill(number: number, width: number) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */
        var zero = "0"; /* String de cero */

        if (width <= length) {
            if (number < 0) {
                return ("-" + numberOutput.toString());
            } else {
                return numberOutput.toString();
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString());
            }
        }
    }

    const { data, isLoading: isLoadingRemission, isError, isFetching, refetch } = useQuery(
        "documentoRemisionData",
        DocumentRemission,
        { refetchOnWindowFocus: false }
    );
    //const { mutateAsync: createPriceListAsync } = useMutation(createPriceList)
    //const { mutateAsync, isLoading } = useMutation('createProductDetail')
    const handleFile = () => {
        // @ts-ignore
        file.current.click();
    };

    const file = useRef(null);
    //@ts-ignore
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                //@ts-ignore
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then(async (d) => {
            //const dataJson = await createPriceListAsync()
            //const data = await dataJson.json()
            //const idPriceList = data.data
            setCargando(true)
            //@ts-ignore
            for (let i = 0; i < d.length; i++) {
                //@ts-ignore
                const val = d[i];

                console.log(val);
                let productoEncontrado = await ProductByCode((val.codigo).toString().substring(1, 6));
                console.log(productoEncontrado);

                let categoriaEncontrada = await getCategoryById(productoEncontrado[0].CAT_ID);
                let horaCreate = new Date().toLocaleTimeString().toLocaleString()
                let datecreate = new Date().toLocaleDateString().toLocaleString();
                let dateSplit = datecreate.split("/");
                let dateexpere = Number(dateSplit[1]) + categoriaEncontrada.CAT_EXPIRATION_MONTH + "-" + dateSplit[0] + "-" + dateSplit[2] + " " + horaCreate;

                prods.push({
                    //@ts-ignore
                    PRO_ID: productoEncontrado[0].PRO_ID,
                    RDT_AMOUNT: Number((val.codigo).toString().substring(7, 8) + "." + (val.codigo).toString().substring(8, 11)),
                    RDT_CODEBAR: (val.codigo).toString(),
                    RDT_DUEDATE: dateexpere,
                    RDT_PRICE: Number((productoEncontrado[0].PRD_UNIT_PRICE * Number((val.codigo).toString().substring(7, 8) + "." + (val.codigo).toString().substring(8, 11)))),
                    RDT_STATUS: "1",
                    //@ts-ignore
                    nameproduct: productoEncontrado[0].PRO_NAME,
                })
                console.log(prods);

            }
            const cretedRemission = await CrateRemission({
                REM_ADDRESSEE: "Por Llenar",
                REM_CARRIER: "Por Llenar",
                REM_CODE: "GR" + zfill(Number(data.DCT_SEQUENCE) + 1, 5),
                REM_DATECREATED: "01-06-2022",
                REM_INPOINT: "Por Llenar",
                REM_LICENSE: "Por Llenar",
                REM_OUT: "0",
                REM_STATUS: "0",
                REM_OUTPOINT: "Por Llenar",
                REM_PLATE: "Por Llenar",
                REM_UPDATEOUT: "Por Llenar"
            })
            console.log(cretedRemission);
            await UpdateDocumentSequence({
                sequence: data.DCT_SEQUENCE,
                idDocument: 76
            })
            prods.map(async (remi, idx) => {
                await CrateRemissionDetail({
                    REM_ID: cretedRemission.data,
                    PRO_ID: remi.PRO_ID,
                    RDT_AMOUNT: remi.RDT_AMOUNT,
                    RDT_PRICE: remi.RDT_PRICE,
                    RDT_CODEBAR: remi.RDT_CODEBAR,
                    RDT_DUEDATE: remi.RDT_DUEDATE,
                    RDT_STATUS: remi.RDT_STATUS
                })
            })
            queryClient.invalidateQueries("remision")
            setCargando(false)
            //queryClient.invalidateQueries('PriceList');
        });
    };

    return (
        <Button isLoading={cargando || isLoadingRemission} onClick={handleFile} mx={2} leftIcon={<BsUpload />} colorScheme="green">
            <Text mx={2}>Import</Text>
            <input
                ref={file}
                hidden
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{ width: "150px" }}
                type="file"
                onChange={(e) => {
                    //@ts-ignore
                    const file = e.target.files[0];
                    readExcel(file);
                }}
            />
        </Button>
    )
}