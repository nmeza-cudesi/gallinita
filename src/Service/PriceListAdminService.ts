export const getPriceList = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/list_price')
    return res.json()
}
// @ts-ignore
export const getDataToExport = async () => {
    const productpricelist = await fetch(import.meta.env.VITE_APP_API + '/list_price/productoutactivelist')
    const productwithoutpricelist = await fetch(import.meta.env.VITE_APP_API + '/product_details/price_listactive')

    const productpricelistJson = await productpricelist.json()
    const productwithoutpricelistJson = await await productwithoutpricelist.json()

    return [...(productpricelistJson.message ? [] : productpricelistJson), ...(productwithoutpricelistJson.message ? [] : productwithoutpricelistJson)]
}
// @ts-ignore
export const getProducsWithoutPriceList = async (PRL_ID) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/list_price/productout/' + PRL_ID)
    return res.json()
}
// @ts-ignore
export const getPriceByPL_ID = async (PRL_ID) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product_details/price_list/' + PRL_ID)
    return res.json()
}
// @ts-ignore
export const editePriceList = async ({ PRL_ID, ...res }) => {//
    await fetch(import.meta.env.VITE_APP_API + '/list_price/desabled', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
    })
    return await fetch(import.meta.env.VITE_APP_API + '/list_price/' + PRL_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}
// @ts-ignore
export const deletePriceList = async (PRL_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/list_price/' + PRL_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createPriceList = async () => {
    await fetch(import.meta.env.VITE_APP_API + '/list_price/desabled', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
    })
    return await fetch(import.meta.env.VITE_APP_API + '/list_price/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({})
    })
}