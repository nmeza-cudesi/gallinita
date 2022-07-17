import React, { ReactNode } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useMutation, useQueryClient } from 'react-query';
import { deletePriceList } from '../../../../Service/PriceListAdminService';

export const DeletePriceLisDialog = ({ children, priceListID }: { children: ReactNode, priceListID: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const cancelRef = useRef()
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(deletePriceList, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('PriceList')
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
        },
        onError: (err:Error) => alert(err.message+"error manooo")
    })
    const onClose = () => setIsOpen(false)

    async function handleDelete() {
        // @ts-ignore
        await mutate(priceListID);
        onClose()
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
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
                            Eliminar Lista de Producto
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            ¿Está seguro? No podrá deshacer esta acción después.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                // @ts-ignore
                                ref={cancelRef}
                                onClick={onClose}
                                isDisabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={handleDelete}
                                isLoading={isLoading}
                            >
                                Confirmar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}