import { FiChevronDown, FiMenu } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
  useToast,
  Image,
} from "@chakra-ui/react";
import { Link, Redirect } from "react-router-dom";
import { ClientState, NavClient } from "../../../../Data/Atoms/Client";
import { BiSearch } from "react-icons/bi";
import { SearcherState } from "../../../../Data/Atoms/Product";
import { CartHeader } from "./CartHeader";
import Cookies from "universal-cookie";
import { useQuery } from "react-query";
import { getCompany } from "../../../../Service/CompanyService";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {

  const cookies = new Cookies();
  const [buscador, setBuscador] = useState("");
  const [redirect, setRedirect] = useState(false);

  const auth = useRecoilValue(ClientState);
  const setAuth = useSetRecoilState(ClientState);
  const navclient = useRecoilValue(NavClient);
  const setSearcherState = useSetRecoilState(SearcherState);

  const MobileNavBorderBottom = useColorModeValue("gray.200", "gray.700");
  const menuListBG = useColorModeValue("white", "gray.900");
  const menuListBorder = useColorModeValue("gray.200", "gray.700");
  function LogOut() {
    cookies.remove("clientToken")
    //@ts-ignore
    setAuth({ auth: false, user: '', roles: [], accesos: [] }

    )
  }
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      flexWrap="wrap"
      alignItems="center"
      background="linear-gradient(90deg, rgba(44,82,130,1) 0%, rgba(66,153,225,1) 100%)"
      borderBottomColor={MobileNavBorderBottom}
      justifyContent={{
        base: "space-between",
        md: navclient ? "flex-end" : "space-between",
      }}>
      {auth && navclient ? (
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
      ) : (
        <></>
      )}

      <Link to="/">
        <Image
          w='150px'
          objectFit='cover'
          src='http://143.110.154.185:4000/upload/logo.jpg'
          alt='Dan Abramov'
        />
      </Link>
      <Flex justifyContent="center" mr={{ base: "40px", md: "100px" }} display={{ base: "none", sm: "block" }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setRedirect(true);
            setSearcherState({ where: true, key: buscador });
          }}>
          {redirect && <Redirect to={"/buscador/" + buscador} />}
          <InputGroup margin="5">
            <InputLeftElement pointerEvents="painted" children={<BiSearch />} />
            <Input
              bgColor="white"
              onChange={(event) => {
                if (event.target.value != "") {
                  setBuscador(event.target.value);
                  setRedirect(false);
                }
              }}
              focusBorderColor=""
              type="tel"
              placeholder="Buscar producto"
            />
          </InputGroup>
        </form>
      </Flex>
      <HStack spacing={{ base: "0", md: "6" }}>
        <CartHeader />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}>
              <HStack>
                {auth.auth && <>
                  <Avatar
                    size={"sm"}
                    src={
                      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
                  <NameClientUser name={auth.user} />
                </>}
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            {auth.auth ?
              <MenuList bg={menuListBG} borderColor={menuListBorder}>
                <Link to="/perfil">
                  <MenuItem>
                    Perfil
                  </MenuItem>
                </Link>
                <Link to="/pedidos">
                  <MenuItem>
                    Pedidos
                  </MenuItem>
                </Link>
                <Link to="/soporte">
                  <MenuItem>
                    Soporte
                  </MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem onClick={LogOut}>Sign out</MenuItem>
              </MenuList>
              :
              <MenuList bg={menuListBG} borderColor={menuListBorder}>
                <Link to="/login">
                  <MenuItem>
                    Iniciar Sesion
                  </MenuItem>
                </Link>
                <Link to="/registrar">
                  <MenuItem>
                    Registrar
                  </MenuItem>
                </Link>
              </MenuList>
            }
          </Menu>
        </Flex>
      </HStack>
      <Flex justifyContent="center" display={{ base: "block", sm: "none" }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setRedirect(true);
            setSearcherState({ where: true, key: buscador });
          }}>
          {redirect && <Redirect to={"/buscador/" + buscador} />}
          <InputGroup margin="5">
            <InputLeftElement pointerEvents="painted" children={<BiSearch />} />
            <Input
              bgColor="white"
              onChange={(event) => {
                if (event.target.value != "") {
                  setBuscador(event.target.value);
                  setRedirect(false);
                }
              }}
              focusBorderColor=""
              type="tel"
              placeholder="Buscar producto"
            />
          </InputGroup>
        </form>
      </Flex>
    </Flex>
  );
};
const NameClientUser = ({ name }: any) => {
  return (
    <VStack
      display={{ base: "none", md: "flex" }}
      alignItems="flex-start"
      spacing="1px"
      ml="2">
      <Text fontSize="sm">{name}</Text>
      <Text fontSize="xs" color="gray.600">
        Cliente
      </Text>
    </VStack>
  );
};
