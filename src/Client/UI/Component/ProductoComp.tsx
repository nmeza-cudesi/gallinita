import {
    Box, Flex, Grid, Text, useColorModeValue, NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
    Divider,
    IconButton,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Alert,
    AlertIcon,
    Tooltip,
    Skeleton
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import './CategoriaComp.css'
import { IProducto, IProductoCompra, IProductoCompras, IProductos } from '../../../Model/Productos'
import { Link } from 'react-router-dom'
import { FaCartPlus } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { CarritoState, CostoCompraState } from '../../../Data/Atoms/Carrito'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { getProductDetail, getProductsByCategoryOrSearcher, getProductWithDiscountById } from '../../../Service/TiendaOnlineService'
import { useQuery } from 'react-query'
import { SearcherState } from '../../../Data/Atoms/Product'
import { IsLoading } from './isLoading'
import './ProductoComp.css'
interface IBuscador {
    where: string,
    searcher: string
}
export const ProductoComp = ({ searcher, where }: IBuscador) => {

    const searcherState = useRecoilValue(SearcherState)

    const productsBG = useColorModeValue("white", "gray.900");
    const setCarritoState = useSetRecoilState(CarritoState)
    const { data, error, isLoading } = useQuery(['products', searcherState], () => getProductsByCategoryOrSearcher(searcherState), {
        refetchOnWindowFocus: false
    })

    /* if (where=="producto") {
        
    } else if(where=="categoria") {
        dataglobal = useQuery('products', ()=>getProductsByCategory(searcher))
    } else {
        dataglobal = useQuery('products', ()=>getProductsBySearch(searcher))
    } */
    function cortarString(description: string) {
        return description.length > 10 ? description.slice(0, 10) + "..." : description
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    function AgregarCarrito(producto: IProducto) {
        let productoCompra: IProductoCompra = {
            id: producto.PRO_ID,
            cantidad: 1,
            peso: producto.PRO_WEIGHT,
            nombre: producto.PRO_NAME,
            precio: producto.PRO_PRICE_DISCOUNT ? Number(producto.PRO_PRICE) - producto.PRO_PRICE_DISCOUNT : Number(producto.PRO_PRICE),
            subtotal: producto.PRO_PRICE_DISCOUNT ? ((producto.PRO_PRICE - producto.PRO_PRICE_DISCOUNT) * 1) : producto.PRO_PRICE * 1,
            descripcion: producto.PRO_DESCRIPTION,
            imagen: producto.PRO_IMAGE,
            //@ts-ignore
            descuento: producto.PRO_PRICE_DISCOUNT,
            preciosindecuento: Number(producto.PRO_PRICE)
        }
        let x = JSON.parse(localStorage.getItem('cart') || '[]') as Array<IProductoCompra>
        let encontrado = x.filter(element => element.id == productoCompra.id);
        //@ts-ignore
        if (!encontrado.length > 0) {
            x.push(productoCompra);
            localStorage.setItem('cart', JSON.stringify(x))
            setCarritoState(x)
        }

        onOpen();
    }

    if (isLoading) { return (<h1>Cargando...</h1>) }
    if (error) { return (<h1>algo salio mal :(</h1>) }
    return (

        <Flex justifyContent="center">
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Alert status="success">
                            <AlertIcon />
                            Se guardo con éxito
                        </Alert>
                    </ModalBody>
                    <ModalFooter>
                        <Link to="/">
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Seguir Comprando
                            </Button>
                        </Link>
                        <Link to="/carrito">
                            <Button variant="ghost">
                                Ir a Carrito
                            </Button>
                        </Link>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Grid padding={{ base: "5", md: "10" }} justify-self="center" maxWidth="1200px" templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: "5", md: "8" }}>
                {!data ? <h1>Cargando...</h1> : data.length > 0 ? data.map((val: any, idx: number) => {
                    return (
                        (val.PRO_DISABLED == 0 || val.PRO_AGOTADO == 0) ? <></> : <div className="contenedor__prod">
                            <div>
                                <Link to={val.PRO_PRICE_DISCOUNT ? "/ofert/" + val.PRO_ID : "/producto/" + val.PRO_ID}>
                                    <Image src={val.PRO_IMAGE} alt={val.PRO_NAME} width="100%" height={{ base: "100px", md: "200px" }} objectFit="cover" />
                                </Link>
                                <div className='product__datos'>
                                    <Link to={val.PRO_PRICE_DISCOUNT ? "/ofert/" + val.PRO_ID : "/producto/" + val.PRO_ID}>
                                        <Text textOverflow="ellipsis" fontSize={{ base: "small", md: "lg" }} fontWeight={"700"}>{val.PRO_NAME}</Text>
                                    </Link>
                                    <Tooltip label={val.PRO_DESCRIPTION} aria-label='A tooltip'>
                                        <Text textOverflow="ellipsis" fontSize={{ base: "small", md: "lg" }} >{cortarString(val.PRO_DESCRIPTION)}</Text>
                                    </Tooltip>

                                    {!val.PRO_PRICE_DISCOUNT ? <span style={{ color: "#FF4E00", fontWeight: "bold", fontSize: "1rem" }}>S/.{val.PRO_PRICE.toFixed(2)}</span>
                                        :
                                        <><span style={{ color: "#FF4E00", textDecoration: "line-through", fontSize: "1rem" }}>S/.{val.PRO_PRICE.toFixed(2)}</span> <span style={{ color: "#FF4E00", fontWeight: "bold", fontSize: "1.2rem" }}>S/. {(val.PRO_PRICE - val.PRO_PRICE_DISCOUNT).toFixed(2)}</span></>}
                                    <Flex justifyContent={"space-between"} className='button__pro'>

                                        {val.PRO_DISABLED == 0 ?
                                            <Box cursor="not-allowed" width="min-content" fontSize={{ base: "30px", md: "40px" }} >
                                                <FaCartPlus />
                                            </Box> :
                                            <Box cursor="pointer" width="min-content" fontSize={{ base: "30px", md: "40px" }} >
                                                <FaCartPlus onClick={() => { AgregarCarrito(val); }} />
                                            </Box>}

                                        {val.PRO_DISABLED == 0 ? <Button borderRadius={"full"} disabled fontWeight={"200"} variant='outline'>Agotado</Button> : <Link to={val.PRO_PRICE_DISCOUNT ? "/ofert/" + val.PRO_ID : "/producto/" + val.PRO_ID}>
                                            <Button borderRadius={"full"} fontWeight={"200"} variant='outline'>Ver más</Button>
                                        </Link>}
                                    </Flex>
                                </div>
                            </div>
                        </div>
                    )
                }

                ) : <h1>No se encontraron productos</h1>}
            </Grid></Flex>
    )
}
interface IproductoDetail {
    id: number,
    where: string
}
export const ProductoDetail = ({ id, where }: IproductoDetail) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cantidad, setCantidad] = useState(1)
    const setCarritoState = useSetRecoilState(CarritoState)
    const imgAndDetailProductBG = useColorModeValue("white", "gray.800");
    const deltailProductBG = useColorModeValue("gray.100", "gray.700");
    const countImput = useColorModeValue("gray.100", "gray.400");
    const buttonHoverBG = useColorModeValue("gray.500", "gray.300");
    const [reSearchDetailProduct, setReSearchDetailProduct] = useState({ cantidad: 0.1, id: id })
    var product_detail: any;
    //@ts-ignore
    let dataGlobal: any;

    const { data, isLoading, refetch } = useQuery(['producto_detail', reSearchDetailProduct], () => where == "ofert" ? getProductWithDiscountById(reSearchDetailProduct) : getProductDetail(reSearchDetailProduct), { refetchOnWindowFocus: false });
    if (data) {
        product_detail = data[0] as IProducto
    }
    function convertDateFormat(string: string) {
        var info = string.split('-');
        var sinhora= info[2].toString().split(' ');
        console.log(sinhora);
        return info[1] + '/' + info[0] + '/' + sinhora[0];
    }
    function AgregarCarrito() {
        let productoCompra: IProductoCompra = {
            id: product_detail.PRO_ID,
            cantidad: cantidad,
            peso: product_detail.PRO_WEIGHT,
            nombre: product_detail.PRO_NAME,
            precio: product_detail.PRO_PRICE_DISCOUNT ? Number(product_detail.PRO_PRICE) - product_detail.PRO_PRICE_DISCOUNT : Number(product_detail.PRO_PRICE),
            subtotal: product_detail.PRO_PRICE_DISCOUNT ? ((product_detail.PRO_PRICE - product_detail.PRO_PRICE_DISCOUNT) * cantidad) : product_detail.PRO_PRICE * cantidad,
            descripcion: product_detail.PRO_DESCRIPTION,
            imagen: product_detail.PRO_IMAGE,
            descuento: product_detail.PRO_PRICE_DISCOUNT,
            preciosindecuento: Number(product_detail.PRO_PRICE)
        }
        let x = JSON.parse(localStorage.getItem('cart') || '[]') as Array<IProductoCompra>
        let encontrado = x.filter(element => element.id == productoCompra.id);
        //@ts-ignore
        if (!encontrado.length > 0) {
            x.push(productoCompra);
            localStorage.setItem('cart', JSON.stringify(x))
            setCarritoState(x)
        }

        onOpen();
    }
    useEffect(() => {
        if (data) {

        }
    }, [data])

    /*     if (isLoading) return (<Text>asd</Text>);
        if (data.message) return (<Text>{data.message}</Text>); */
    return (
        <Flex paddingX="4" direction={{ base: "column", md: "row" }} justifyContent="space-around">
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Alert status="success">
                            <AlertIcon />
                            Se guardo con éxito
                        </Alert>
                    </ModalBody>
                    <ModalFooter>
                        <Link to="/">
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Seguir Comprando
                            </Button>
                        </Link>
                        <Link to="/carrito">
                            <Button variant="ghost">
                                Ir a Carrito
                            </Button>
                        </Link>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {where == "ofert" ? <>
                {/* <ProductExist data={data} isLoading={isLoading} AgregarCarrito={AgregarCarrito} CambioCantidad={CambioCantidad} cantidad={cantidad} /> */}

                <Box flex="5" padding="8" margin="4" borderRadius="md" bg={imgAndDetailProductBG}>
                    {data ? (data.message ? <Text fontSize="2xl">No Data</Text> : <img src={data[0].PRO_IMAGE} alt={data[0].nombre} />) : <Skeleton height={"350px"} width="100%" marginBottom="2" />}
                </Box>

                <Box flex="7" padding="8" margin="4" borderRadius="md" bg={imgAndDetailProductBG}>
                    {data ? (data.message ? <Text fontSize="2xl">No Data</Text> : <Text fontSize="2xl">{data[0].PRO_NAME}</Text>) : <Skeleton height={"36px"} width="100%" />}
                    <Flex gridGap="10%">
                        {data ? (data.message ? <Text fontSize="2xl">No Data</Text> : <Text textDecoration={data[0].PRO_PRICE_DISCOUNT ? "line-through" : "none"} fontSize="2xl">S/. {data[0].PRO_PRICE}</Text>) : <Skeleton height={"36px"} width="100%" />}
                        {data && (data.message ? <Text fontSize="2xl">No Data</Text> : <Text fontSize="2xl">S/. {data[0].PRO_PRICE - data[0].PRO_PRICE_DISCOUNT}</Text>)}
                    </Flex>
                    {data ? (data.message ? <Text fontSize="2xl">No Data</Text> : <Text display={data[0].PRO_PRICE_DISCOUNT ? "block" : "none"} fontSize="2xl">Descuento -S/. {(data[0].PRO_PRICE_DISCOUNT)}</Text>) : <Skeleton height={"36px"} width="100%" />}
                    <Flex borderRadius="md" bg={deltailProductBG} padding="4" direction="column">
                        <Text fontSize="3xl">Descripción</Text>
                        {data ? (data.message ? <Text fontSize="2xl">No Data</Text> : <Text marginBottom="4" fontSize="xl">{data[0].PRO_DESCRIPTION}</Text>) : <Skeleton height={"36px"} width="100%" />}
                        {isLoading ? <Skeleton height={"36px"} width="100%" marginBottom="4" /> : <Text marginBottom="4" fontSize="xl">peso neto de{" " + data[0].PRO_WEIGHT}Kg.</Text>}
                        {isLoading ? <Skeleton height={"36px"} width="100%" marginBottom="4" /> : <Text marginBottom="4" fontSize="xl">Fecha de vencimiento{" " +convertDateFormat(data[0].PRO_EXPIRATION_DATE)}</Text>}
                        {isLoading ?
                            <Button isLoading={isLoading} leftIcon={<FaCartPlus />} colorScheme="teal" variant="solid" _hover={{ bg: buttonHoverBG }}>
                                Agregar a Carrito
                            </Button>
                            :
                            <Button disabled={data[0].PRO_DISABLED == 0} leftIcon={<FaCartPlus />} onClick={AgregarCarrito} colorScheme="teal" variant="solid" _hover={{ bg: buttonHoverBG }}>
                                {data[0].PRO_DISABLED == 1 ? "Agregar a Carrito" : "Excede el Limite"}
                            </Button>
                        }
                    </Flex>
                </Box>
            </> :
                <>
                    <Box flex="5" padding="8" margin="4" borderRadius="md" bg={imgAndDetailProductBG}>
                        {data ? (data.message ? <Text fontSize="2xl">No Data</Text> : <img src={data[0].PRO_IMAGE} alt={data[0].nombre} />) : <Skeleton height={"350px"} width="100%" />}
                    </Box>

                    <Box flex="7" padding="8" margin="4" borderRadius="md" bg={imgAndDetailProductBG}>
                        <>
                            {isLoading ? <Skeleton height={"36px"} width="100%" /> : <Text fontSize="2xl">{data[0].PRO_NAME}</Text>}
                            <Flex gridGap="10%">
                                {isLoading ? <Skeleton height={"36px"} width="100%" /> : <Text fontSize="2xl">S/. {data[0].PRO_PRICE}</Text>}
                            </Flex>
                            <Flex borderRadius="md" bg={deltailProductBG} padding="4" direction="column">
                                <Text fontSize="3xl">Descripción</Text>
                                {isLoading ? <Skeleton height={"36px"} width="100%" marginBottom="4" /> : <Text marginBottom="4" fontSize="xl">{data[0].PRO_DESCRIPTION}</Text>}
                                {isLoading ? <Skeleton height={"36px"} width="100%" marginBottom="4" /> : <Text marginBottom="4" fontSize="xl">peso neto de{" " + data[0].PRO_WEIGHT}Kg.</Text>}
                                {isLoading ? <Skeleton height={"36px"} width="100%" marginBottom="4" /> : <Text marginBottom="4" fontSize="xl">Fecha de vencimiento{" " +convertDateFormat(data[0].PRO_EXPIRATION_DATE)}</Text>}
                                {isLoading ?
                                    <Button isLoading={isLoading} leftIcon={<FaCartPlus />} colorScheme="teal" variant="solid" _hover={{ bg: buttonHoverBG }}>
                                        Agregar a Carrito
                                    </Button>
                                    :
                                    <Button disabled={data[0].PRO_DISABLED == 0} leftIcon={<FaCartPlus />} onClick={AgregarCarrito} colorScheme="teal" variant="solid" _hover={{ bg: buttonHoverBG }}>
                                        {data[0].PRO_DISABLED == 1 ? "Agregar a Carrito" : "Excede el Limite"}
                                    </Button>
                                }

                            </Flex></>
                    </Box>
                </>}
        </Flex>
    )
}

export const ProductoCarrito = ({ productocompra }: IProductoCompras) => {
    const setCostoCarrito = useSetRecoilState(CostoCompraState);

    const colorTextDiscount = useColorModeValue("rgba(0,47,52,.64)", "white");
    const setCarritoState = useSetRecoilState(CarritoState)
    var subtotal: number = 0;
    var descuento: number = 0;
    var total: number = 0;
    var envio: number = 10;
    const [productosCarrito, setProductosCarrito] = useState(productocompra);
    function BorrarCarrito(index: number) {
        let productos: IProductoCompra[] = JSON.parse(localStorage.getItem('cart') || '[]') as Array<IProductoCompra>
        const producto: IProductoCompra[] = productos.filter(elemnt => elemnt.id == index);
        const Productoindex = productos.indexOf(producto[0])
        if (Productoindex > -1) {
            productos.splice(Productoindex, 1);
        }
        CalcularSubtotal(productos);
        CalcularDescuento(productos);
        CalcularTotal();
        setProductosCarrito(productos)
        localStorage.setItem("cart", JSON.stringify(productos))
        setCarritoState(productos)

    }
    function CalcularSubtotal(array: IProductoCompra[]): number {

        array.map((val, idx) => {
            //@ts-ignore
            subtotal += (val.preciosindecuento * val.cantidad)
        })
        return subtotal;
    }
    function CalcularDescuento(array: IProductoCompra[]): number {
        array.map((val, idx) => {
            //@ts-ignore
            if (val.descuento != null || val.descuento == 0) {
                descuento += val.descuento * val.cantidad
            }
        })
        return descuento;
    }
    function CalcularTotal(): number {
        total = (subtotal - descuento) + envio
        setCostoCarrito({
            subtotal,
            descuento,
            total: +(total.toFixed(2))
        })
        return total;
    }
    async function setCantidad(event: any, index: number) {
        if (event.target.value > 0) {
            let productos: IProductoCompra[] = JSON.parse(localStorage.getItem('cart') || '[]') as Array<IProductoCompra>
            const producto: IProductoCompra[] = await productos.filter(elemnt => elemnt.id == index);
            producto[0].cantidad = event.target.value
            const Productoindex = await productos.indexOf(producto[0])
            productos.splice(Productoindex, 1, producto[0])
            localStorage.setItem("cart", JSON.stringify(productos))
            setCarritoState(productos)
            setProductosCarrito(productos);
            CalcularSubtotal(productos);
            CalcularDescuento(productos);
            CalcularTotal();
        }

    }
    return (
        <Box key="boxCarrito">
            {productosCarrito.map((val, idx) => <>
                <Flex direction={{ base: "row", md: "row" }} alignItems="center" marginY="4" paddingRight={{ base: "0" }} key={idx}>

                    <Image src={val.imagen} alt={val.nombre} boxSize={{ base: "50px", sm: "150px" }} borderRadius="20px"></Image>
                    <Box marginLeft="4" width={{ base: "150px", md: "150px" }}>
                        <Text fontSize={{ base: "sm", md: "lg" }} textTransform="uppercase">{val.nombre}</Text>
                        <Text whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" display={{ base: "none", lg: "block" }} color={colorTextDiscount} fontSize="md" >{val.descripcion}</Text>
                        <Text fontSize={{ base: "sm", sm: "lg" }} display={{ base: "block", md: "none" }} color="#FF4E00" fontWeight="bold">S/.{val.precio}</Text>
                    </Box>
                    <Box display={{ base: "none", md: "block" }} marginLeft="8" width={{ base: "100px", md: "250px" }}>
                        <Text color="#FF4E00" fontWeight="bold">S/.{val.precio}</Text>
                    </Box>
                    <Flex marginY="4" alignItems="center">
                        <Box fontSize="sm">
                            <label style={{ margin: "0 10px 0 0" }} htmlFor={"cantidad" + val.id}>Cantidad</label>
                        </Box>
                        <NumberInput borderRadius="full" defaultValue={val.cantidad} bg="gray.100" size="sm">
                            <NumberInputField disabled={true} onChange={(event) => setCantidad(event, val.id)} paddingLeft={{ base: "0", sm: "12px" }} paddingRight={{ base: "0", sm: "32px" }} id={"cantidad" + val.id} />
                            <NumberInputStepper display={{ base: "none", sm: "block" }}>
                            </NumberInputStepper>
                        </NumberInput>
                    </Flex>
                    <Box marginX="4" width="max-content">
                        <IconButton
                            borderRadius="full"
                            _hover={{ color: "white", bg: "red.400", fontsize: "10px" }}
                            variant="outline"
                            color="red.400"
                            onClick={() => { BorrarCarrito(val.id) }}
                            aria-label="open menu"
                            icon={< MdClose />}
                        />
                    </Box>
                </Flex>
                <Divider opacity="1" width="90%" />
            </>
            )}
        </Box>
    )
}