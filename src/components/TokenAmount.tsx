import { cn } from '@/lib';
import { BN } from '@coral-xyz/anchor';
import React, { useMemo } from 'react';

type Props = {
  amount: number | BN | string;
  decimals: number;
  symbol?: string;
  className?: string;
};

const DisplayTokenAmount = ({ amount, decimals, symbol, className }: Props) => {
  const amountString = useMemo(() => {
    return new BN(amount).div(new BN(10).pow(new BN(decimals))).toString();
  }, [amount, decimals]);
  return (
    <span className={cn(className)}>
      {amountString} {symbol}
    </span>
  );
};

export default DisplayTokenAmount;
