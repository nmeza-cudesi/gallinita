import {
    Accordion,
    AccordionButton,
    AccordionPanel,
    AccordionItem,
    Drawer,
    DrawerOverlay,
    useDisclosure,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    Box,
    Text,
    Center,
    Flex,
    Button,
    Image,
    IconButton,
    FormControl,
    Badge,
    useToast,
    DrawerCloseButton,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { BsFileEarmarkMinus, BsPlusSquareFill } from "react-icons/bs";
import { IoPrintSharp, IoDownloadSharp, IoMail } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listaSaleOnline } from "../../../../Data/Atoms/SaleOnline";
import { ListForDocument } from "../../../../Service/PersonService";
import {
    ChangeOrderState,
    getDocumentForSaleOnline,
    ListProductsSalesOnline,
    VerifyVoucherOrder,
} from "../../../../Service/Sales";
import {
    SendMail,
    SendMailRejectedVoucher,
} from "../../../../Service/SendMailService";
import api from "../RealizarVenta/ApiVentas";
import { CambiarEstado } from "./CambiarEstado";
import { DonwloadPDF } from "./DonwloadPDF";
import { TablaProductosVentasOnline } from "./TablaProductos";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { Tooltip } from "@chakra-ui/react";

import success from "./assets/images/success.gif";
import denied from "./assets/images/denied.gif";
import noimage from "../../../UI/Assets/images/noimage.png";
import { VerficationOptions } from "./VerificationOptions/VerificationOptions";
import { VerifiedVoucher } from "./VerifiedVoucher/VerifiedVoucher";
import { DescriptionOrder } from "./Description/DescriptionOrder";

export const DeleteVentasModal = ({
    children,
    venta,
}: {
    children: ReactNode;
    venta?: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children}
        </>
    );
};

