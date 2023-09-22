import { api } from '@/services/api-settings'
interface Params {
    [key: string]: string
}


export default () => ({ suuid, pointModule, pointName, params }: { suuid?: string, pointModule: string, pointName: string, params?: Params }) => {
    const fullApiUrl = api.apiUrl() + api.points[pointModule][pointName](suuid) + '?page_size=28&' + new URLSearchParams(params).toString()

    return useFetch(fullApiUrl, {
        immediate: false,
        async beforeFetch({ options }) {
            const token = localStorage.getItem('token')

            if (token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Token ${token}`
                }
            }

            return {
                options
            }
        },

        afterFetch(ctx) {
            if (!ctx.data.count) {
                ctx.data = []
            } else {
                ctx.data = ctx.data.results.map(item => ({ title: item.name, value: item.suuid }))
            }

            return ctx
        }
    }).json()


}
