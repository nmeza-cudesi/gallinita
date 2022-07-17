
/* metodo_pago */
const ListMetodoPago = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/metodo_pago')
    return res.json()
}

const GetOneMetodoPago = async (idTicket: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/getone/' + idTicket)
}

const CreateMetodoPago = async (formData: FormData) => {
    return await fetch(import.meta.env.VITE_APP_API + '/metodo_pago/', {

        method: "POST",
        body: formData

    })
}

const EditMetodoPago = async ({ formData, MPG_ID }: { formData: FormData, MPG_ID: number }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/metodo_pago/' + MPG_ID, {

        method: "PATCH",
        body: formData

    })
}
const DeleteMetodoPago = async (MPG_ID: string) => {
    return await fetch(import.meta.env.VITE_APP_API + '/metodo_pago/' + MPG_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export {
    ListMetodoPago,
    GetOneMetodoPago,
    CreateMetodoPago,
    EditMetodoPago,
    DeleteMetodoPago
}