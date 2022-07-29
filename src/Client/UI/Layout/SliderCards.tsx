import { Box, useColorModeValue, Text, Skeleton } from '@chakra-ui/react'
import _ from 'lodash'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { getProductWithDiscount, tenProduct } from '../../../Service/TiendaOnlineService'
import { TitleCenter } from '../Component/TitleCenter'
import './SliderCards.css'

export const SliderCards = ({ descuentoCant, setDescuentoCant }: { descuentoCant: any, setDescuentoCant: any }) => {
    const { data, isLoading } = useQuery('oferts', getProductWithDiscount, {
        refetchOnWindowFocus: false,
        onSuccess: (product) => {
            if (product.message) {
                setDescuentoCant(true)
            }

        }
    });
    const { data: tenProduc, isLoading: loading } = useQuery('tenProduct', tenProduct, { refetchOnWindowFocus: false });

    const colorsBoxShadow = useColorModeValue("e1e5ee", "gray-600");
    const colorBg = useColorModeValue("white", "gray.700");
    var descuentoSeparador = _.groupBy(data, 'DIS_PERCENTAGE')
    var keySeparador = Object.keys(descuentoSeparador)
    var descuentoSeparados: any[] = []
    keySeparador.map((val) => {
        descuentoSeparados.push({ porcentaje: val, descuento: descuentoSeparador[val] })
    })
    const scriptRef = useRef(false);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.1/js/swiper.min.js";
        //@ts-ignore
        script.async = true
        //script.onload = () => start()
        document.body.appendChild(script);
        scriptRef.current = true
    }, [isLoading]);

    if (isLoading || loading) return <Skeleton />;
    return (
        data.message ?
            (tenProduc && tenProduc.message) ?
                <>
                </>
                :
                <Box>
                    <TitleCenter title={"Nuestros Prductos"} bg="linear-gradient(90deg, rgb(165 177 229) 0%, rgb(33 120 192) 100%)"
                        padding={{ base: "8px 40px", md: "8px 80px" }} borderRadius="0 40px 40px 0 " width="80%" justifyContent="flex-start" margin="20px 0" />
                    <div className="wrapper">
                        {tenProduc && tenProduc.map((val: any) =>
                            <Box boxShadow={"10px 10px 10px var(--chakra-colors-gray-300)"} bg={colorBg} borderRadius="10px" className="card" key={val.PRO_ID}>
                                <div className="card__body">
                                    <img src={val.PRO_IMAGE} className="card__image" />
                                    <h2 className="card__title">{val.PRO_NAME}</h2>
                                    <p className="card__description">{val.PRO_DESCRIPTION}</p>
                                    <p className="card__description"><b> S/. {val.PRO_PRICE.toFixed(2)}</b></p>
                                </div>
                                <Link style={{ width: "100%" }} to={"/producto/" + val.PRO_ID}><button className="card__btn">Ver Producto</button></Link>
                            </Box>)}
                    </div>
                </Box>
            :
            <>
                {descuentoSeparados.map((descuentoEspecifico: any, idx: number) =>
                    <Box key={idx}>
                        <TitleCenter title={"Ofertas del " + descuentoEspecifico.porcentaje + "%"} bg="linear-gradient(90deg, rgb(165 177 229) 0%, rgb(33 120 192) 100%)"
                            padding={{ base: "8px 40px", md: "8px 80px" }} borderRadius="0 40px 40px 0 " width="80%" justifyContent="flex-start" margin="20px 0" />
                        <div key={"descuento" + idx} className="wrapper">
                            {isLoading ? <h1>cargando</h1> : (descuentoEspecifico.descuento).length > 0 ? (descuentoEspecifico.descuento).map((val: any) =>
                                <Box boxShadow={"10px 10px 10px var(--chakra-colors-gray-300)"} bg={colorBg} borderRadius="10px" className="card" key={val.PRO_ID}>
                                    <div className="card__body">
                                        <img src={val.PRO_IMAGE} className="card__image" />
                                        <h2 className="card__title">{val.PRO_NAME}</h2>
                                        <p className="card__description">{val.PRO_DESCRIPTION}</p>
                                    </div>
                                    <Link style={{ width: "100%" }} to={"/ofert/" + val.PRO_ID}><button className="card__btn">Ver Oferta</button></Link>
                                </Box>
                            ) : <h1></h1>}
                        </div>
                    </Box>
                )
                }
            </>

    )
}
