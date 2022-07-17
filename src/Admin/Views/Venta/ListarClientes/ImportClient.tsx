import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import React, { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";
import { async } from "regenerator-runtime";
import * as XLSX from "xlsx";
import { CreateClient } from "../../../../Service/ClienteService";
import { CreatePersona } from "../../../../Service/PersonService";
import { createPriceList } from "../../../../Service/PriceListAdminService";
export const ImportClient = () => {
    const queryClient = useQueryClient();
    const handleFile = () => {
        // @ts-ignore
        file.current.click();
    };
    const file = useRef(null);
    const [importanding, setImportanding] = useState(false)

    async function saveClient(persona_data: any, cliente_data: any) {
        let createPersona = await CreatePersona(persona_data);
        if (createPersona.data) {
            let createClient = await CreateClient({ ...cliente_data, PER_ID: createPersona.data });
        } else {
            alert("no se creo")
        }
    }
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
        setImportanding(true)
        promise.then(async (d) => {
            //@ts-ignore
            for (let i = 0; i < d.length; i++) {
                //@ts-ignore
                const val = d[i];
                let per_data = {
                    PET_ID: val["Tipo de cliente"],
                    PMT_ID: val["Forma de Pago"],

                    PER_TRADENAME: val["Nombre comercial"],
                    PER_RUC: val["RUC"],
                    PER_NAME: val["Nombre"],
                    PER_LASTNAME: val["Apellido"],
                    PER_DNI: val["Doc. Identidad"],
                    PER_N_PHONE: val["N° de celular"],
                    PER_EMAIL: val["Correo electronico"],
                    PER_COUNTRY: val["Pais de origen"],
                    PER_DEPARTMENT: val["Departamento"],
                    PER_PROVINCE: val["Provincia"],
                    PER_DISTRIC: val["Distrito"],
                    PER_DIRECTION: val["Dirección"],
                }
                for (let clave in per_data) {
                    //@ts-ignore
                    if (!per_data[clave]) {
                        //@ts-ignore
                        delete per_data[clave]
                    }
                }
                let cli_data = {
                    CLA_ID: val["Clasificación de cliente"],
                    PER_ID: val["Clasificación de cliente"]
                }
                console.log(per_data, cli_data);
                await saveClient(per_data, cli_data)
            }
            setImportanding(false)
            //queryClient.invalidateQueries('PriceList');
        });
    };

    return (
        <Button isLoading={importanding} onClick={handleFile} mx={2} leftIcon={<BsUpload />} colorScheme="green">
            <Text mx={2}>Import</Text>
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