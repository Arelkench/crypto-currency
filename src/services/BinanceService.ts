export class BinanceService {
  private ws: WebSocket;
  private ethUsdtBuyPriceCallback: ((price: number) => void) | null = null;
  private ethUsdtSellPriceCallback: ((price: number) => void) | null = null;
  constructor() {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/usdteth@trade');
    this.initWebSocket();
  }

  private initWebSocket(): void {
    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: ['usdteth@trade'],
          id: 1,
        }),
      );
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const tradeData = JSON.parse(event.data);
      const isBuy = tradeData.m;
      if (isBuy && this.ethUsdtBuyPriceCallback) {
        // If it's a buy trade and the buy callback is provided, invoke the buy callback with the price
        self.postMessage({ price: tradeData.p, isSellPrice: false });
        this.ethUsdtBuyPriceCallback(tradeData.p);
      } else if (!isBuy && this.ethUsdtSellPriceCallback) {
        // If it's a sell trade and the sell callback is provided, invoke the sell callback with the price
        self.postMessage({ price: tradeData.p, isSellPrice: true });
        this.ethUsdtSellPriceCallback(tradeData.p);
      }
    };

    this.ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  public closeConnection(): void {
    this.ws.close();
  }
  public getBuyPrice(callback: (price: number) => void): void {
    this.ethUsdtBuyPriceCallback = callback;
  }

  public getSellPrice(callback: (price: number) => void): void {
    this.ethUsdtSellPriceCallback = callback;
  }
}
