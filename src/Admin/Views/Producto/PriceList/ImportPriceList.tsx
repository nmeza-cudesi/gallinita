import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import React, { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";
import { async } from "regenerator-runtime";
import * as XLSX from "xlsx";
import { createPriceList } from "../../../../Service/PriceListAdminService";
export const ImportPriceList = () => {
    const queryClient = useQueryClient();
    const [idPriceList, setIdPriceList] = useState(0)
    const { mutateAsync: createPriceListAsync } = useMutation(createPriceList)
    const { mutateAsync, isLoading } = useMutation('createProductDetail')
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
            const dataJson = await createPriceListAsync()
            const data = await dataJson.json()
            const idPriceList = data.data
            //@ts-ignore
            d.map((val) => {
                let productDetail: any = { PRO_ID: 0, PRL_ID: 0, PRD_UNIT_PRICE: 0, PRD_PACKAGE_PRICE: 0 }
                productDetail.PRO_ID = val.PRO_ID;
                productDetail.PRL_ID = idPriceList;
                productDetail.PRD_UNIT_PRICE = val.PRD_UNIT_PRICE;
                productDetail.PRD_PACKAGE_PRICE = val.PRD_PACKAGE_PRICE;
                mutateAsync(productDetail);
            })
            queryClient.invalidateQueries('PriceList');
        });
    };
    
    return (
        <Button onClick={handleFile} mx={2} leftIcon={<BsUpload />} _hover={{}} color={"white"} bg={"#0f1e49"} >
            <Text mx={2}>Importar</Text>
            <input
                ref={file}
                hidden
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