import { useCallback, useEffect, useState } from 'react';
import {
  BinanceService,
  PriceCallbackProps,
} from '../services/BinanceService.ts';

export const useBinance = () => {
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);

  const handlePriceChange = useCallback(
    ({ price, isBuy }: PriceCallbackProps) => {
      if (price) {
        if (isBuy) {
          setBuyPrice(price);
        } else {
          setSellPrice(price);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const binanceService = new BinanceService();

    binanceService.getPrice(handlePriceChange);

    return () => {
      binanceService.closeConnection();
    };
  }, [handlePriceChange]);

  return { buyPrice, sellPrice };
};
