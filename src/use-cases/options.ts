import { BSParams, OptionPriceResponse } from "@/types/options";

export async function priceOptionUseCase({ data }:{ data: BSParams }):Promise<OptionPriceResponse>{

    return new Promise((resolve, reject)=>{
        const ws = new WebSocket("ws://localhost:8080/")
        ws.onopen = () => {
            ws.send(JSON.stringify(data))
        }

        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data)
                resolve(response)
                ws.close()
            } catch (error:unknown) {
                reject(error)
                ws.close()
            }
        } 

        ws.onerror = (error) => {
            reject(error)
            ws.close()
        }

        ws.onclose = () => {}
    })
}