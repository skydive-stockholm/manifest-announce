import { SkyviewApi } from "../services/SkyviewApi.ts"
import Skyview from "../services/Skyview.ts"
import { ref } from "vue"
import { useGlobalState } from "../store/store.ts"

export const useSkyview = () => {
    const state = useGlobalState()

    const skyViewApi = new SkyviewApi(state.value.core.skywin_endpoint)
    const skyview = ref<Skyview>(new Skyview())

    const fetchSkyview = async (): Promise<Skyview> => {
        let res = await skyViewApi.get()
        skyview.value = new Skyview(res)
        return skyview.value
    }

    fetchSkyview()

    // Fetch skyview every 5 seconds
    setInterval(fetchSkyview, 5 * 1000)

    return {
        skyview,
        fetchSkyview,
    }
}
