import axios from "axios";
export const axiosBase=axios.create({
    baseURL:'https://northwind.vercel.app/api/orders'
})