import { Button, IconButton } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Divider, Flex, Spacer, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { useToast } from "@chakra-ui/react";
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
export const AddProdCompra = ({
  ref,
  idProducto,

}: {
  ref: any
  idProducto: any,

}) => {
  const [producto, setProducto] = useState("")
  const [productoFind, setProductoFind] = useState([])
  const queryClient = useQueryClient();
  const { mutateAsync: CrateRemission } = useMutation(AgregarRemission)
  const { mutateAsync: UpdateDocumentSequence } = useMutation(updateDocumentSequence)
  const { mutateAsync: CrateRemissionDetail } = useMutation(AgregarRemissionDetail)

  const { data, isLoading, isError, isFetching, refetch } = useQuery(
    "documentoRemisionData",
    DocumentRemission,
    { refetchOnWindowFocus: false }
  );

  const [form, setForm] = useState({
    cantidad: 0.0,
    precio: 0.0,
    dudedate: "",
    codebar: ""
  });

  const [total, setTotal] = useState(0);

  const [prods, setProds] = useState<RemissionsDetail[]>([]);
  const toast = useToast();
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

  async function handleClick() {
    //@ts-ignore
    document.getElementById("codebar").value = ""
    console.log(prods);
    let productoEncontrado = await ProductByCode(producto.substring(1, 6))
    console.log(productoEncontrado);
    setProds([
      ...prods,
      {
        //@ts-ignore
        PRO_ID: productoEncontrado[0].PRO_ID,
        RDT_AMOUNT: Number(producto.substring(6, 8) + "." + producto.substring(8, 11)),
        RDT_CODEBAR: producto,
        RDT_DUEDATE: form.dudedate,
        RDT_PRICE: Number((productoEncontrado[0].PRD_UNIT_PRICE * Number(producto.substring(6, 8) + "." + producto.substring(8, 11))).toFixed(2)),
        RDT_STATUS: "1",
        //@ts-ignore
        nameproduct: productoEncontrado[0].PRO_NAME,
      },
    ]);
  }
  async function handleAgregar() {
    console.log(prods);
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
    setProds([])
    refetch()
  }

  useEffect(() => {
    let suma = 0.0;
    // @ts-ignore
    prods.map((val) => {
      suma = Number(val.RDT_PRICE) + suma;
    });
    setTotal(suma);
    if (ref) ref.current.focus();
  }, [prods]);

  if (isLoading || isFetching) return <Skeleton />;

  return (
    <>
      <Box w="100%">
        <Text fontSize="lg" fontWeight="bold">
          Agregar producto
        </Text>
        <Flex borderRadius="5px" borderWidth="2px" p="5px" alignItems={"end"}>
          <Spacer />
          <Box w="80%" >
            <label htmlFor="codebar">{idProducto && idProducto.PRO_NAME}</label>
            <Input
              ref={ref}
              name="PRO_CODEBAR"
              type="text"
              id="codebar"
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  handleClick()
                }
                console.log(e.target.value);
              }}
              onKeyUp={(e: any) => {
                if ((e.target.value as string).length > 6) {
                  setProducto(e.target.value)
                  console.log(form)
                }
                console.log(e.target.value);
              }} />
          </Box>
          <Spacer />
          <Box>
            <br />
            <Button
              colorScheme="green"
              //type="submit"
              onClick={handleClick}>
              Agregar Producto
            </Button>
          </Box>
        </Flex>
        <Divider />
        <CompraProdTable prods={prods} setProds={setProds} />
        <Flex direction="column">
          <Text float="right" mr="40%" fontWeight={500}>
            Total de la compra: s./ {total.toFixed(2)}
          </Text>
          <Button onClick={handleAgregar}>
            Agregar
          </Button>
        </Flex>
      </Box>
    </>
  );
};

const CompraProdTable = ({
  prods,
  setProds,
}: {
  prods: any;
  setProds: any;
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  console.log(prods);

  const columns = [
    {
      Header: "Nombre",
      accessor: "nameproduct",
    },
    {
      Header: "Peso",
      accessor: "RDT_AMOUNT",
    },
    {
      Header: "Precio Total",
      accessor: "RDT_PRICE",
    },
    {
      Header: "",
      id: "remove_action",
      // @ts-ignore
      Cell: ({ row }) => {
        return (
          <IconButton
            colorScheme="red"
            aria-label="Search database"
            icon={<AiFillDelete />}
            onClick={() => updateMyData(row)}
          />
        );
      },
    },
  ];

  function updateMyData(row: any) {
    setSkipPageReset(true);
    console.log(row.index);

    // @ts-ignore
    setProds((old: any) => {
      // @ts-ignore
      return old.filter((val, idx) => idx !== row.index);
    });
  }

  useEffect(() => {
    setSkipPageReset(false);
  }, [prods]);

  return (
    <>
      <MyReactTable
        columns={columns}
        data={prods}
        skipPageReset={skipPageReset}
        updateMyData={updateMyData}
      />
    </>
  );
};
