import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useBinance } from './useBinance.ts';

export type ExchangeFormMode = 'buy' | 'sell';

type Props = {
  mode: ExchangeFormMode;
};

const debounceInterval = 300;

export const useExchangeForm = ({ mode }: Props) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const { buyPrice, sellPrice } = useBinance();

  const [ethValue, setEthValue] = useState<number | string>('');
  const [usdtValue, setUsdtValue] = useState<number | string>('');

  const price = useMemo(
    () => (mode === 'buy' ? buyPrice : sellPrice),
    [mode, buyPrice, sellPrice],
  );

  const resetForm = useCallback(() => {
    setUsdtValue('');
    setEthValue('');
  }, []);

  const handleFieldChange = useCallback(
    (field: 'eth' | 'usdt') => (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const fieldValue = parseFloat(inputValue);

      if (inputValue === '') {
        resetForm();
        return;
      }

      if (isNaN(fieldValue) || !isFinite(fieldValue) || fieldValue < 0) {
        return;
      }

      if (field === 'eth') {
        setEthValue(fieldValue);
        setUsdtValue(fieldValue * price);
        return;
      }

      setUsdtValue(fieldValue);
      setEthValue(fieldValue / price);
    },
    [price, resetForm],
  );

  useEffect(() => {
    timer.current = setInterval(() => {
      if (typeof ethValue === 'string') {
        return;
      }

      setUsdtValue(ethValue * price);
    }, debounceInterval);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }

      timer.current = null;
    };
  }, [ethValue, price]);

  return { ethValue, usdtValue, onFieldChange: handleFieldChange };
};
