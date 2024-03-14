import { useEffect, useState } from 'react';
import { BinanceService } from './BinanceService.ts';

export const useBinance = () => {
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);

  useEffect(() => {
    const binanceService = new BinanceService();

    binanceService.getPrice(({ price, isBuy }) => {
      if (price) {
        if (isBuy) {
          setBuyPrice(price);
        } else {
          setSellPrice(price);
        }
      }
    });

    return () => {
      binanceService.closeConnection();
    };
  }, []);

  return [buyPrice, sellPrice];
};
