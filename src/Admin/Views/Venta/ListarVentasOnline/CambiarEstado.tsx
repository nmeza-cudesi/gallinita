import { Box, Flex, Text, Icon, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, IconButton, useToast } from '@chakra-ui/react'
import React, {  useRef, useState } from 'react'
import { BsFillInboxFill, BsPersonCheckFill } from 'react-icons/bs'
import { FaCashRegister, FaTruck } from 'react-icons/fa'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { IEstados } from '../../../../Model/Order'
import './assets/css/CambiarEstado.css'

export const CambiarEstado = ({ sale, isLoading, mutateM }: { sale: any, isLoading: any, mutateM: any }) => {

    const [isOpen, setIsOpen] = useState(false)
    const cancelRef = useRef()
    const toast = useToast()

    var dato = 0;
    const onClose = () => setIsOpen(false)

    const estados: IEstados[] = [{
        idestado: 1,
        valor: FaCashRegister,
        nombre: "Pedido Registrado"
    }, {
        idestado: 2,
        valor: BsPersonCheckFill,
        nombre: "Pedido Confirmado"
    }, {
        idestado: 3,
        valor: FaTruck,
        nombre: "Pedido en Proceso"
    }, {
        idestado: 4,
        valor: BsFillInboxFill,
        nombre: "Pedido Entregado"
    }]

    function HandlesState(state: number, direccion: boolean) {
        //estadoGlobal(dato)
        dato = state
        if (direccion && state === 3) {
            setIsOpen(true)
        }
        else if (!direccion && state === 2) {
            toast({
                title: `Accion no permitida`,
                description:`No se puede regresar a este paso`,
                status: "warning",
                duration: 1500,
                isClosable: true,
            })
        } else {
            mutateM(dato, sale.PEDIDO)
            sale.ESTADO = dato
        }
    }
    function updateSate() {
        mutateM(3, sale.PEDIDO)
        sale.ESTADO = 3
        setIsOpen(false)
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                //@ts-ignore
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Cambiar un estado luego del pedido confirmado
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Provocara que ya no pueda regresar el estado del pedido
                            ¿Está seguro? No podrá deshacer esta acción después.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                // @ts-ignore
                                ref={cancelRef}
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={updateSate}
                            >
                                Confirmar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {!isLoading ?
                <>
                    <Flex gridGap="5" my="5" >

                        {estados.map((val, idx) => {
                            return <>
                                <input key={`input_radio_${idx}`} defaultChecked={val.idestado == sale.ESTADO} disabled className="input_radio" type="radio" id={val.idestado + "status"} name="type_status" />
                                <label key={`label_radio_${idx}`} className="label_radio" htmlFor={val.idestado + "status"}>
                                    <Box key={`box_a_${idx}`} my="5">
                                        <Box key={`box_b_${idx}`} fontSize={{ base: "15px", md: "20px" }}><Icon as={val.valor} /></Box>
                                        <Text key={`text_${idx}`}fontSize={{ base: "5px", md: "10px" }}>{val.nombre}</Text>
                                    </Box>
                                </label>

                            </>
                        })}
                    </Flex>
                    <Flex justifyContent={"space-between"}>
                        <IconButton disabled={sale.ESTADO == 1} onClick={() => { HandlesState(sale.ESTADO - 1, false) }} aria-label='Prev' icon={<FcPrevious />} />
                        <IconButton disabled={sale.ESTADO == 4} onClick={() => { HandlesState(Number(sale.ESTADO) + 1, true) }} aria-label='Next' icon={<FcNext />} />
                    </Flex>
                </>
                :
                <></>
            }

        </>
    )
}
