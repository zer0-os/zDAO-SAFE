import {
  AssetType,
  Transaction,
  TransactionType,
  zDAOAssets,
} from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { Loader } from '../components/Loader';
import { getFullDisplayBalance } from '../config/constants/number';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { useSdkContext } from '../hooks/useSdkContext';
import { shortenAddress } from '../utils/address';

const GnosisSafe = () => {
  const { chainId } = useActiveWeb3React();
  const { instance } = useSdkContext();
  const { zNA } = useParams();
  const zDAO = useCurrentZDAO(zNA);

  const [assets, setAssets] = useState<zDAOAssets | undefined>();
  const [transactions, setTransactions] = useState<Transaction[] | undefined>();

  useEffect(() => {
    const fetch = async () => {
      if (!zDAO) return;

      const tempAssets = await zDAO.listAssets();
      setAssets(tempAssets);
      console.log('assets', tempAssets);

      const tempTxs = await zDAO.listTransactions();
      setTransactions(tempTxs);
      console.log('transactions', tempTxs);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [zDAO]);

  return (
    <Container>
      <h3>Assets</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Asset</th>
            <th>Balance</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {assets ? (
            assets.coins.map((item, index) => (
              <tr key={item.address}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>
                  {`${getFullDisplayBalance(
                    new BigNumber(item.amount),
                    item.decimals,
                  )} ${item.symbol}`}
                </td>
                <td>{`${item.amountInUSD} USD`}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <Loader />
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <h3>Transactions</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Function</th>
            <th>From</th>
            <th>To</th>
            <th>Created</th>
            <th>Success</th>
          </tr>
        </thead>
        <tbody>
          {transactions ? (
            transactions.map((transaction, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {transaction.type === TransactionType.SENT
                    ? 'Sent'
                    : 'Received'}
                </td>
                <td>
                  {
                    // eslint-disable-next-line no-nested-ternary
                    transaction.asset.type === AssetType.NATIVE_TOKEN
                      ? `${getFullDisplayBalance(
                          new BigNumber(transaction.asset.value),
                        )} ETH`
                      : transaction.asset.type === AssetType.ERC20
                      ? `${getFullDisplayBalance(
                          new BigNumber(transaction.asset.value),
                          transaction.asset.decimals,
                        )} ${transaction.asset.tokenSymbol}`
                      : '---'
                  }
                </td>
                <td>{shortenAddress(transaction.from)}</td>
                <td>{shortenAddress(transaction.to)}</td>
                <td>{transaction.created.toString()}</td>
                <td>{transaction.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>
                <Loader />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default GnosisSafe;
