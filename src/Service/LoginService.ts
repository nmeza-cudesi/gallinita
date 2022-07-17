import Cookies from "universal-cookie";
const cookies = new Cookies();
export const LoginAdmin = async (vals: any) => {
    let response = await fetch(import.meta.env.VITE_APP_API + '/login/singin', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ ...vals })
    })
    const data = await response.json();
    return data;
}
export const getTokenAdmin = async (token: string) => {
    let response = await fetch(import.meta.env.VITE_APP_API + '/login/getToken', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            authorization: "bearer=" + token
        },
        method: "GET",
        credentials: 'include',
    })
    const data = await response.json();
    return data;
}