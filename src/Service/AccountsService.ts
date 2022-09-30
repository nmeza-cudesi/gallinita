export default class AccountsServices {
    constructor() { }

    public get_account = async ({ origin, host }: any) => {
        const response = await fetch(`${import.meta.env.VITE_APP_API_IRIS}/subdomains`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': origin,
                'Host': host
            },
            method: "GET",
            body: JSON.stringify({ url: origin })
        })
        console.log('response', response)
        return response;
    }

}