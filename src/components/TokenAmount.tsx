import { cn } from '@/lib';
import { BN } from '@coral-xyz/anchor';
import React, { useMemo } from 'react';

type Props = {
  amount: number | BN | string;
  decimals?: number;
  symbol?: string;
  className?: string;
};

const DisplayTokenAmount = ({ amount, decimals, symbol, className }: Props) => {
  return (
    <span className={cn(className)}>
      {amount.toString()} {symbol}
    </span>
  );
};

export default DisplayTokenAmount;
