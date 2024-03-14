import { useState, useCallback } from 'react';
import {
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from '@mui/material';
import { useExchangeForm, ExchangeFormMode } from '../hooks/useExchangeForm.ts';
import styles from './App.module.css';

export const App = () => {
  const [activeTab, setActiveTab] = useState<ExchangeFormMode>('buy');

  const handleTabChange = useCallback(
    (_: unknown, newTab: ExchangeFormMode) => {
      if (newTab) {
        setActiveTab(newTab);
      }
    },
    [],
  );

  const { usdtValue, ethValue, onFieldChange } = useExchangeForm({
    mode: activeTab,
  });

  return (
    <div className={styles.container}>
      <Typography className={styles.title} variant="h5">
        {activeTab} ETH for USDT
      </Typography>

      <TextField
        label="ETH Amount"
        type="number"
        value={ethValue}
        onChange={onFieldChange('eth')}
        variant="outlined"
        className={styles.field}
      />

      <Box m={2}>
        <ToggleButtonGroup
          color="primary"
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          aria-label="Buy or Sell"
        >
          <ToggleButton
            className={styles.toggleButton}
            value="buy"
            aria-label="Buy"
          >
            Buy
          </ToggleButton>
          <ToggleButton
            className={styles.toggleButton}
            value="sell"
            aria-label="Sell"
          >
            Sell
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TextField
        label="USDT Amount"
        type="number"
        value={usdtValue}
        onChange={onFieldChange('usdt')}
        variant="outlined"
        className={styles.field}
      />
    </div>
  );
};
