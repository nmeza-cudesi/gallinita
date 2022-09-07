export const getPointSales = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/point_sale')
    return res.json()
}

export const getPointSaleById = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/point_sale/' + id)
    return res.json()
}

export const editePointSale = async ({ formData, CAT_ID }: { formData: FormData, CAT_ID: number }) => {

    return await fetch(import.meta.env.VITE_APP_API + '/point_sale/' + CAT_ID, {

        method: "PATCH",
        body: formData

    })
}

// @ts-ignore
export const deletePointSale = async (CAT_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/point_sale/' + CAT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createPointSale = async (objectSale: any) => {

    return await fetch(import.meta.env.VITE_APP_API + '/point_sale/', {

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(objectSale)

    })
}
