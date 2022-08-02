import { Button, Flex, Heading, IconButton, useColorMode, useColorModeValue, Text, Center } from '@chakra-ui/react'
import React from 'react'
import { ClientState, HeaderClient, NavClient } from '../../../Data/Atoms/Client'
import { useRecoilState, useSetRecoilState } from 'recoil';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useMutation } from 'react-query';
import { LoginAdmin } from '../../../Service/LoginService';
import { MyPasswordArea, MyTextInput } from '../../../GlobalUI/Forms/MyInputs';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { BiHome } from "react-icons/bi";

export const Login = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);
    setNavClient(false)
    setHeadClient(false)
    const { toggleColorMode } = useColorMode()
    const [client, setClient] = useRecoilState(ClientState)
    const formBackground = useColorModeValue("gray.300", "gray.700")
    const history = useHistory();
    const location = useLocation()
    // @ts-ignore
    const previusObjectURL = location.state?.from || "/"
    const validate = Yup.object({
        user: Yup.string().required("Debe ingresar su correo"),
        password: Yup.string().required("Debe ingresar su contraseña").required("Debe ingresar su contraseña")
    })

    const values = {
        user: '',
        password: '',
    }

    const { mutateAsync, isLoading } = useMutation(LoginAdmin, {
        onSuccess: data => {
            //@ts-ignore
            setTimeout(() => history.push(previusObjectURL),
                100
            )
            if (!data.hasOwnProperty("message")) {
                return setClient({
                    ...client, auth: true, iu: data.iu, user: data.user,
                    //@ts-ignore
                    roles: [...data.roles.map(val => val.ROL_NAME)],
                    accesos: data.accesos
                })
            }
        },
    })

    // **

    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Flex
                direction="column"
                p="12"
                rounded={16}
                boxShadow="0 0 1rem 0 rgba(0, 0, 0, .2);"
                borderRadius="5px;"
                backgroundColor=" rgba(255, 255, 255, .40);"
                backdropFilter="blur(5px);"
            >
                <Formik
                    initialValues={values}
                    validationSchema={validate}
                    onSubmit={async (values: any, { resetForm }) => {
                        await mutateAsync(values);
                        resetForm()
                    }}
                >
                    <Form>

                        <Flex alignContent="center" mb={6}>
                            <Center mr={4}>
                                <Link to={"/"}>
                                    <IconButton
                                        color="white"
                                        bg={"#2033c0"}
                                        _hover={{ bg: "#fbfbfb", color: "black" }}
                                        aria-label='Send email'
                                        fontSize={15}
                                        icon={<BiHome />}
                                    />
                                </Link>
                            </Center>
                            <Heading>Iniciar Sesión</Heading>
                        </Flex>
                        <MyTextInput
                            label="Usuario"
                            name="user"
                            type="text"
                            placeholder="Correo de usuario"
                        />
                        <MyPasswordArea
                            label="Contraseña"
                            name="password"
                            placeholder="Contraseña de usuario"
                        />
                        <Button
                            w="full"
                            my={4}
                            borderRadius="full"
                            type="submit"
                            color="white"
                            bg={"#2033c0"}
                            _hover={{ bg: "#fbfbfb", color: "black" }}
                            isLoading={isLoading}
                        >
                            Iniciar sesión
                        </Button>
                        <Center mb={5}>
                            <Text fontSize={{ base: 15, md: 20 }}>¿No estás registrado?</Text>
                        </Center>
                        <Link to={{ pathname: '/registrar', state: previusObjectURL }}>
                            <Button
                                color="#2033c0"
                                bg="#fbfbfb"
                                fontSize="15px"
                                fontWeight="bold"
                                _hover={{ bg: "#2033c0", color: "white" }}
                                borderRadius="full"
                                w="full"
                            >
                                Registrar</Button>
                        </Link>
                    </Form>
                </Formik>
            </Flex>

        </Flex >
    )
}
