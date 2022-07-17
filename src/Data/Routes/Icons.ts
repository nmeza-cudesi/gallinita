import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { FaGifts } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { BiSupport } from 'react-icons/bi';
import { AiOutlineDashboard } from 'react-icons/ai';

export const MyIcons = (iconName: string) => {
    const iconsList = {
        'Ventas': GiReceiveMoney,
        'Producto': FaGifts,
        'Compra': GiPayMoney,
        'Configuración': IoMdSettings,
        'Soporte': BiSupport,
        'Inicio': AiOutlineDashboard,
    }
    //@ts-ignore
    return iconsList[iconName]
}