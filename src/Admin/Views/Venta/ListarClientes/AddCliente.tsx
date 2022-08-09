import {
    AlertIcon,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay, FormControl,
    FormLabel,
    Heading,
    HStack, Select,
    useDisclosure
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { MySelect, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import {
    Clasificacion,
    Grupo,
    PersonType
} from '../../../../Model/Clientes';
import { CreateClient } from '../../../../Service/ClienteService';
import { CreatePersona } from '../../../../Service/PersonService';
import { ModalAlertMessage } from '../../../UI/Components/ModalAlert/MyModal';
import { NewClientValues } from '../RealizarVenta/InfoVenta';

interface NewClient {
    title?: any;
    icon?: React.ReactElement;
    reload?: any;
    personType?: PersonType[];
    grupo?: any[];
    clasificacion?: Clasificacion[];
    sizeButton: string;
    persona: any;
    setPersona: any;
    clientState: boolean;
    clienteForm: any;
    setClienteForm: any;
    actionCloseDraw: any;
}

export const AddCliente = ({
    title,
    icon,
    reload,
    personType,
    grupo,
    clasificacion,
    sizeButton,
    persona,
    setPersona,
    clientState,
    clienteForm,
    setClienteForm,
    actionCloseDraw,
}: NewClient) => {
    // REACTORES
    let { isOpen: isOpenNewClient, onOpen: onOpenNewClient, onClose: onCloseNewClient } = useDisclosure()
    const [viewModal, setViewModal] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [statusModal, setStatusModal] = useState('');

    const buttonOpen: any = React.createRef();

    const OpenDraw = () => {
        onOpenNewClient();
    };

    async function saveClient(persona_data: any) {
        setMessageModal('Registrando Cliente ...');
        setStatusModal('info');
        setViewModal(true);
        let createPersona = await CreatePersona(persona_data);
        if (createPersona.data) {
            let createClient = await CreateClient({ ...clienteForm, PER_ID: createPersona.data });
            setMessageModal(createClient.message);
            setStatusModal('success');
            setViewModal(true);
            clearInputs();
            await reload();
        } else {
            setMessageModal(createPersona.message);
            setStatusModal('error');
            setViewModal(true);
        }
        setTimeout(() => {
            setViewModal(false);
        }, 1000);
    }

    function clearInputs() {
        setPersona(NewClientValues);

        setClienteForm({
            CLA_ID: 1,
            GRO_ID: 1,
            PER_ID: 0,
        });
    }
    const [aparecer, setAparecer] = useState(false)
    const [personaNegocio, setPersonaNegocio] = useState(false)
    console.log(persona);

    if (persona.PER_DNI && (persona.PER_DNI.length > 0 || persona.PER_RUC > 0)) {
        isOpenNewClient = true;
    }

    return (
        <>
            {viewModal == true ? (
                <>
                    <ModalAlertMessage
                        message={messageModal}
                        status={statusModal}
                        icon={<AlertIcon boxSize='40px' mr={0} />}
                    />
                </>
            ) : (
                <></>
            )}
            <Button
                onClick={OpenDraw}
                ref={buttonOpen}
                bg={"#0f1e49"} color={"white"} _hover={{}}
                size={sizeButton}>
                {icon}
                {title}
            </Button>
            <Drawer
                placement={'bottom'}
                onClose={onCloseNewClient}
                isOpen={isOpenNewClient}
                size='xl'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>
                        <Box p='2'>
                            <Heading size='md'>Nuevo Persona/Cliente </Heading>
                        </Box>
                    </DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Formik
                            initialValues={persona}
                            enableReinitialize={true}
                            // validationSchema={ BussinesInitialValues }
                            onSubmit={async (values: any) => {
                                console.log(values)
                                saveClient(values)
                            }}>
                            <Form>
                                <HStack spacing='20px' mb={5}>
                                    <FormControl>
                                        <MySelect
                                            label="Tipo de cliente"
                                            name='PET_ID'
                                            //@ts-ignore
                                            onChange={(event) => {
                                                console.log("persona natural");
                                                setPersona({ ...persona, PET_ID: event.target.value })
                                                setAparecer(event.target.value != "1" ? true : false)
                                                setPersonaNegocio(event.target.value == "8" ? true : false)

                                            }}>
                                            <option value="0">Selecciona un tipo</option>
                                            {personType?.map((value, idx) => {
                                                return (
                                                    <option key={idx} value={value.PET_ID}>
                                                        {value.PET_NAME}{' '}
                                                    </option>
                                                );
                                            })}
                                        </MySelect>
                                    </FormControl>
                                    <FormControl>
                                        <MySelect
                                            label="Forma de Pago"
                                            name='PMT_ID'
                                            //@ts-ignore
                                            onChange={(event) => {
                                                console.log("persona natural");
                                                setPersona({ ...persona, PMT_ID: event.target.value })
                                            }}>
                                            <option value="0">Forma de Pago</option>
                                            {grupo?.map((value, idx) =>
                                                <option key={idx} value={value.PMT_ID}>
                                                    {value.PMT_NAME}{' '}
                                                </option>
                                            )}
                                        </MySelect>
                                    </FormControl>
                                    <FormControl>
                                        <MySelect
                                            label="Clasificación de cliente"
                                            name='CLA_ID'
                                            //@ts-ignore
                                            onChange={(event) => {
                                                console.log("persona natural");
                                                setClienteForm({ ...clienteForm, CLA_ID: event.target.value })
                                            }}>
                                            <option value="0">Selecciona una clasificación</option>
                                            {clasificacion?.map((value, idx) =>
                                                <option key={idx} value={value.CLA_ID}>
                                                    {value.CLA_NAME}{' '}
                                                </option>
                                            )}
                                        </MySelect>
                                    </FormControl>
                                </HStack>
                                {aparecer && <HStack spacing='20px' mb={5}>
                                    <MyTextInput
                                        label='Nombre comercial'
                                        name='PER_TRADENAME'
                                        type='text'
                                        placeholder='Nombre comercial'
                                    />
                                    <MyTextInput
                                        label='RUC'
                                        name='PER_RUC'
                                        type='text'
                                        placeholder='Ingresa un ruc'
                                    />
                                </HStack>}
                                {!aparecer && <HStack spacing='20px' mb={5}>
                                    <MyTextInput
                                        label='Nombre'
                                        name='PER_NAME'
                                        type='text'
                                        placeholder='Nombre'
                                    />
                                    <MyTextInput
                                        label='Apellido'
                                        name='PER_LASTNAME'
                                        type='text'
                                        placeholder='Apellido'
                                    />
                                    <MyTextInput
                                        label='Doc. Identidad'
                                        name='PER_DNI'
                                        type='text'
                                        placeholder='Doc. Identidad'
                                    />
                                </HStack>}
                                {personaNegocio && <HStack spacing='20px' mb={5}>
                                    <MyTextInput
                                        label='Nombre'
                                        name='PER_NAME'
                                        type='text'
                                        placeholder='Nombre'
                                    />
                                    <MyTextInput
                                        label='Apellido'
                                        name='PER_LASTNAME'
                                        type='text'
                                        placeholder='Apellido'
                                    />
                                </HStack>}
                                <HStack spacing='20px' mb={5}>
                                    <MyTextInput
                                        label='N° de celular'
                                        name='PER_N_PHONE'
                                        type='number'
                                        placeholder='Ingresa un número de celular'
                                    />
                                    <MyTextInput
                                        label='Correo electronico'
                                        name='PER_EMAIL'
                                        type='email'
                                        placeholder='Ingresa un correo electronico'
                                    />
                                </HStack>
                                <HStack spacing='20px' mb={5}>
                                    <MyTextInput
                                        label='Pais de origen'
                                        name='PER_COUNTRY'
                                        type='text'
                                        placeholder='Ingresa un pais de origen'
                                    />
                                    <MyTextInput
                                        label='Departamento'
                                        name='PER_DEPARTMENT'
                                        type='text'
                                        placeholder='Ingresa un departamento'
                                    />
                                    <MyTextInput
                                        label='Provincia'
                                        name='PER_PROVINCE'
                                        type='text'
                                        placeholder='Ingresa una provincia'
                                    />
                                </HStack>
                                <HStack spacing='20px' mb={5}>
                                    <MyTextInput
                                        label='Distrito'
                                        name='PER_DISTRIC'
                                        type='text'
                                        placeholder='Ingresa un distrito'
                                    />
                                    <MyTextInput
                                        label='Dirección'
                                        name='PER_DIRECTION'
                                        type='text'
                                        placeholder='Ingresa una dirección'
                                    />

                                </HStack>
                                <Button type='submit' colorScheme='blue' mr={3}>
                                    Agregar
                                </Button>
                                <Button
                                    onClick={() => {
                                        clearInputs();
                                        onCloseNewClient
                                        actionCloseDraw();
                                    }}>
                                    Cancelar
                                </Button>
                            </Form>
                        </Formik>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
