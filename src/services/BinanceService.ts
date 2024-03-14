export class BinanceService {
  private ws: WebSocket;
  private isOpened: boolean;
  private priceCallback:
    | (({ price, isBuy }: { price: number; isBuy: boolean }) => void)
    | null = null;
  private dataBuffer: number[] = [];

  constructor() {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');
    this.isOpened = false;
    this.initWebSocket();
  }

  private initWebSocket(): void {
    this.ws.onopen = () => {
      this.isOpened = true;
      this.ws.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: ['ethusdt@trade'],
          id: 1,
        }),
      );
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const tradeData = JSON.parse(event.data);
      const price = parseFloat(tradeData.p);
      const isBuy = tradeData.m;

      if (!this.priceCallback) {
        return;
      }

      this.dataBuffer.push(tradeData);

      if (this.dataBuffer.length > 10) {
        this.dataBuffer.shift();
      }

      this.priceCallback({ price, isBuy });
    };

    this.ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  public closeConnection(): void {
    if (this.isOpened) {
      this.ws.close();
    }
  }

  public getPrice(
    callback: ({ price, isBuy }: { price: number; isBuy: boolean }) => void,
  ): void {
    // Set the callback function to be invoked when the price is received
    this.priceCallback = callback;
  }
}
