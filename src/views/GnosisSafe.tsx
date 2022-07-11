import {
  Box,
  Container,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  AssetType,
  Transaction,
  TransactionType,
  zDAOAssets,
} from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';

import { Loader } from '../components/Loader';
import { getFullDisplayBalance } from '../config/constants/number';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { shortenAddress } from '../utils/address';

const GnosisSafe = () => {
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
    <Container as={Stack} maxW={'7xl'}>
      <Stack direction={'column'} spacing={4}>
        <Heading fontSize={'2xl'}>Assets</Heading>
        <Link to={`/${zNA}`}>
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

        <Heading fontSize="2xl">Assets</Heading>
        <Box borderWidth="1px" borderRadius="12px" padding={3}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Asset</Th>
                <Th>Balance</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {assets ? (
                assets.coins.map((item, index) => (
                  <Tr key={item.address}>
                    <Td>{index + 1}</Td>
                    <Td>{item.name}</Td>
                    <Td>
                      {`${getFullDisplayBalance(
                        new BigNumber(item.amount),
                        item.decimals
                      )} ${item.symbol}`}
                    </Td>
                    <Td>{`${item.amountInUSD} USD`}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>
                    <Loader />
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        <Box mt={3} />
        <Heading fontSize="2xl">Transactions</Heading>
        <Box borderWidth="1px" borderRadius="12px" padding={3}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Type</Th>
                <Th>Function</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Created</Th>
                <Th>Success</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions ? (
                transactions.map((transaction, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>
                      {transaction.type === TransactionType.SENT
                        ? 'Sent'
                        : 'Received'}
                    </Td>
                    <Td>
                      {
                        // eslint-disable-next-line no-nested-ternary
                        transaction.asset.type === AssetType.NATIVE_TOKEN
                          ? `${getFullDisplayBalance(
                              new BigNumber(transaction.asset.value)
                            )} ETH`
                          : transaction.asset.type === AssetType.ERC20
                          ? `${getFullDisplayBalance(
                              new BigNumber(transaction.asset.value),
                              transaction.asset.decimals
                            )} ${transaction.asset.tokenSymbol}`
                          : '---'
                      }
                    </Td>
                    <Td>{shortenAddress(transaction.from)}</Td>
                    <Td>{shortenAddress(transaction.to)}</Td>
                    <Td>{transaction.created.toString()}</Td>
                    <Td>{transaction.status}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7}>
                    <Loader />
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </Container>
  );
};

export default GnosisSafe;
