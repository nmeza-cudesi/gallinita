import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Box, Text, Center, Flex } from '@chakra-ui/layout';
import React, { useEffect } from 'react'
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { MdCall, MdPlace } from 'react-icons/md';
import { useSetRecoilState } from 'recoil';
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client';
import './Contactanos.css'
export const Contactanos = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);
    useEffect(() => {
        setNavClient(false)
        setHeadClient(true)
    }, [])
    return (
        <>
            <Box w={"100%"}>
                <Center>
                    <Text fontSize={50} fontWeight={600}>Contactanos</Text>
                </Center>
                <Flex bg={"#2397fe"} minH={"150px"} justifyContent="space-around" alignItems={"center"}>
                    <Box color={"white"}>
                        <Center >
                            <img width={50} src="https://cdn-icons-png.flaticon.com/512/0/191.png" alt="icon Cell Phone" />
                        </Center>
                        <Text>Teléfono</Text>
                    </Box>
                    <Box color={"white"}>
                        <Center fontSize={50}>
                            <FiMail />
                        </Center>
                        <Text>E-mail</Text>
                    </Box>
                    <Box color={"white"}>
                        <Center fontSize={50}>
                            <FiMapPin />
                        </Center>
                        <Text>Derección</Text>
                    </Box>
                </Flex>
            </Box>
            <Box w={"100%"} bg="white">
                <Box className="contenedor">

                    <h3>Envianos un mensaje</h3>
                    <Box className="contenido">
                        {/* <Box className="info">
                    <List fontSize="20px" color="blackAlpha.700" marginY="10" spacing={8}>
                        <ListItem >
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
                    <Box className="redes-s">
                        <a href="https://www.facebook.com/multispaceperu"><FaFacebookF /></a>
                        <a href="https://www.instagram.com/3dmultispaceperu/"><FaWhatsapp /></a>
                    </Box>
                </Box> */}
                        <form id="form_agregar" className="formulario" >
                            <Input type="text" name="nombre" id="nombre" placeholder="Nombre" />
                            <Input type="text" name="correo" id="correo" placeholder="Correo" />
                            <Input type="text" name="asunto" id="asunto" placeholder="Asunto" />
                            <textarea name="descripcion" id="descripcion" placeholder="Descripción"></textarea>
                            <Button type="submit" colorScheme="teal" variant="outline"><span>ENVIAR</span></Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
