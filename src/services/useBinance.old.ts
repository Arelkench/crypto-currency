import { useEffect, useState } from 'react';
import { BinanceService } from './BinanceService';

const useBinance = (): [number | null, number | null] => {
  const [buyPrice, setBuyPrice] = useState<number | null>(null);
  const [sellPrice, setSellPrice] = useState<number | null>(null);

  useEffect(() => {
    const binanceService = new BinanceService();

    const logPrice = (price: number) => {
      console.log('Current price:', price);
    };

    binanceService.getBuyPrice(logPrice);
  }, []);

  return [buyPrice, sellPrice];
};

export default useBinance;
