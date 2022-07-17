import { IconButton } from "@chakra-ui/react"
import { IoReload } from "react-icons/io5"
import React from "react";

export const ButtonRefetch = ({ refetch }: { refetch: any }) => {
    return (
        <>
            <IconButton m="2" onClick={ () => refetch() } aria-label="Recargar" icon={ <IoReload /> } />
        </>
    )
}
