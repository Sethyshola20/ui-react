import { BSParams, OptionPriceResponse } from "@/types/options";

let wsInstance: WebSocket | null = null;

export async function priceOptionUseCase({ data }: { data: BSParams }): Promise<OptionPriceResponse> {
  return new Promise((resolve, reject) => {
    // Reuse existing connection if available and open
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      console.log("Reusing existing WebSocket connection");
      
      const onMessage = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          wsInstance!.removeEventListener('message', onMessage);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      
      wsInstance.addEventListener('message', onMessage);
      wsInstance.send(JSON.stringify(data));
      return;
    }
    
    // Create new connection
    console.log("Creating new WebSocket connection");
    const ws = new WebSocket("ws://localhost:8080/");
    wsInstance = ws;
    
    ws.onopen = () => {
      console.log("WebSocket opened, sending data");
      ws.send(JSON.stringify(data));
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("Received response, keeping connection open");
        resolve(response);
        // Don't close the connection!
      } catch (error) {
        reject(error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      wsInstance = null;
      reject(error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed by server or network issue");
      wsInstance = null;
    };
  });
}