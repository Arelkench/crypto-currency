import {
  MouseEvent,
  FC,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  useEffect,
} from 'react';
import { TextField, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { useBinance } from '../services/useBinance.ts';

type Tab = 'buy' | 'sell';

const ETHForm: FC = () => {
  const [buyPrice, sellPrice] = useBinance();

  const [ethAmount, setEthAmount] = useState<number | string>('');
  const [usdtAmount, setUsdtAmount] = useState<number | string>('');
  const [activeTab, setActiveTab] = useState<Tab>('buy');

  const price = useMemo(
    () => (activeTab === 'buy' ? buyPrice : sellPrice),
    [activeTab, buyPrice, sellPrice],
  );
  const handleToggleChange = useCallback(
    (_: MouseEvent<HTMLElement>, newTab: Tab) => {
      if (newTab) {
        setActiveTab(newTab);
      }
    },
    [],
  );
  const handleEthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEthAmount = event.target.value;

    if (newEthAmount <= '0' && newEthAmount != '') {
      return;
    }

    setEthAmount(Number(newEthAmount));

    // Calculate USDT amount based on the provided ETH amount
    const usdtAmount = parseFloat(newEthAmount) * price;
    setUsdtAmount(usdtAmount);
  };

  const handleUsdtChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (price === null) return;
    const newUsdtAmount = event.target.value;
    setUsdtAmount(newUsdtAmount);

    // Calculate ETH amount based on the provided USDT amount
    const ethAmount = parseFloat(newUsdtAmount) / price;
    setEthAmount(ethAmount);
  };

  useEffect(() => {
    if (!price || typeof ethAmount === 'string') {
      return;
    }

    setUsdtAmount(ethAmount * price);
  }, [activeTab, ethAmount, price]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <TextField
        label="ETH Amount"
        type="number"
        value={ethAmount}
        onChange={handleEthChange}
        variant="outlined"
        style={{ width: '300px', marginBottom: '16px' }}
      />
      <Box m={2}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleToggleChange}
          aria-label="Buy or Sell"
        >
          <ToggleButton value="buy" aria-label="Buy">
            Buy
          </ToggleButton>
          <ToggleButton value="sell" aria-label="Sell">
            Sell
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <TextField
        label="USDT Amount"
        type="number"
        value={usdtAmount}
        onChange={handleUsdtChange}
        variant="outlined"
        style={{ width: '300px' }}
      />
    </div>
  );
};

export default ETHForm;
