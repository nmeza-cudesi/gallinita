import { Box, Flex, List, ListIcon, ListItem, OrderedList, Text, UnorderedList } from '@chakra-ui/layout'
import React from 'react'
import { BiSupport } from 'react-icons/bi'
import { FaClipboardList } from 'react-icons/fa'
import { FiMail } from 'react-icons/fi'
import { MdCall, MdCheckCircle, MdPlace, MdSettings } from 'react-icons/md'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <Flex gridGap={{base:"20px",md:"0"}} bg="blackAlpha.800" paddingX="10" paddingY="5" direction = {{base:"column",md:"row"}} justifyContent="space-between">
            <Box color="whiteAlpha.800" width={{base:"100%",md:"25vw"}}>
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Contáctanos
                </Text>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={MdCall} color="green.500" />
                        987654321
                    </ListItem>
                    <ListItem>
                        <ListIcon as={FiMail} color="green.500" />
                        tienda@gmail.com
                    </ListItem>
                    <ListItem>
                        <ListIcon as={MdPlace} color="green.500" />
                        Av.San martin Huachipa Ñaña
                    </ListItem>
                </List>
            </Box>
            <Box justifyContent="center" color="whiteAlpha.800" width={{base:"100%",md:"25vw"}}>
                <Flex justifyContent={{base:"none",md:"center"}}>
                    <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                        Atención al Cliente
                    </Text>
                </Flex>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={FaClipboardList} color="green.500" />
                        <Link to="/pedidos"  style={{textDecoration:"underline"}}>Pedidos</Link>
                    </ListItem>
                    <ListItem>
                        <ListIcon as={BiSupport} color="green.500" />
                        <Link to="/soporte"  style={{textDecoration:"underline"}}>Soporte</Link>
                    </ListItem>
                    <ListItem>
                        <ListIcon as={MdCall} color="green.500" />
                        <Link to="/contactanos" style={{textDecoration:"underline"}}>Contáctanos</Link>
                    </ListItem>
                </List>
            </Box>
            <Box marginLeft={{base:"0",md:"10"}} color="whiteAlpha.800" width={{base:"100%",md:"25vw"}}>
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Método de Pago
                </Text>
                <List spacing={3}>
                    <ListItem>
                        BCP
                    </ListItem>
                    <ListItem>
                        YAPE
                    </ListItem>
                    <ListItem>
                        Depósito
                    </ListItem>
                </List>
            </Box>
        </Flex>
    )
}
