import {
  Button,
  Flex,
  Heading,
  Image,
  Center,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useMutation } from "react-query";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { LoginAdmin } from "../../../../Service/LoginService";
import * as Yup from "yup";
import { Form, Formik, useFormik } from "formik";
import { FInput } from "../../../UI/Components/Formik/FInput";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import Cookies from "universal-cookie";

const userAccess = {
  Acceso: "Opciones",
  Ruta: "/opciones",
  SubAccesos: [
    {
      nombre: "Configuración",
      ruta: "/configuracion",
    },
    {
      nombre: "Perfil",
      ruta: "/perfil",
    },
  ],
};

export const AdminLogIn = () => {
  const cookies = new Cookies();

  // const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("gray.300", "gray.700");

  // ** SOBRE EL FORMULARIO

  const [admin, setAdmin] = useRecoilState(AdminState);

  const validate = Yup.object({
    user: Yup.string().required("Debe ingresar su correo"),
    password: Yup.string()
      .required("Debe ingresar su contraseña")
      .required("Debe ingresar su contraseña"),
  });

  const values = {
    user: "",
    password: "",
  };

  //@ts-ignore
  const { mutateAsync, isLoading } = useMutation(LoginAdmin, {
    onSuccess: (data) => {
      if (!data.hasOwnProperty("message"))
        return setAdmin({
          ...admin,
          auth: true,
          iu: data.iu,
          user: data.user,
          //@ts-ignore
          roles: [...data.roles.map((val) => val.ROL_NAME)],
          //@ts-ignore
          accesos: [...data.accesos, userAccess],
        });
    },
  });

  // **

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background={formBackground} p="12" rounded={16}>
        <Formik
          initialValues={values}
          validationSchema={validate}
          onSubmit={async (values: any, { resetForm }) => {
            await mutateAsync(values);
            resetForm();
          }}>
          <Form>
            <Heading mb={6}>
              <Center>
                <Image
                  //   borderRadius="full"
                  w="150px"
                  src="http://143.110.154.185:4000/upload/iconlogin.png"
                  alt="Phiona App"
                />
              </Center>
            </Heading>
            <MyTextInput
              label="Usuario"
              name="user"
              type="text"
              placeholder="Correo de usuario"
            />
            <MyTextInput
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Contraseña de usuario"
            />
            <Button
              w="full"
              my={4}
              colorScheme="teal"
              type="submit"
              isLoading={isLoading}>
              Iniciar sesión
            </Button>
            {/* <Button w="full" onClick={toggleColorMode}>
              Cambiar Tema
            </Button> */}
          </Form>
        </Formik>
      </Flex>
    </Flex>
  );
};
