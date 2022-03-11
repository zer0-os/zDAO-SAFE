import TokenPlaceHolder from '@/assets/icons/token_placeholder.svg';
import { getFullDisplayBalance } from '@/config/constants/number';
import { LinkButton } from '@/components/Button';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useSafeTokens from '@/hooks/useSafeTokens';
import useSafeTransactions from '@/hooks/useSafeTransactions';
import { getExternalLink, shortenAddress } from '@/utils/address';
import {
  Box,
  Container,
  Heading,
  Image,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { SyntheticEvent } from 'react';

const setImageToPlaceholder = (
  event: SyntheticEvent<HTMLImageElement, Event>
): void => {
  const image = event.currentTarget;
  image.src = TokenPlaceHolder;
};

const GnosisSafe = () => {
  const { chainId } = useActiveWeb3React();
  const tokens = useSafeTokens();
  const transactions = useSafeTransactions();

  return (
    <Container as={Stack} maxW={'7xl'}>
      <Stack direction={'column'} spacing={4}>
        <Heading fontSize={'2xl'}>Assets</Heading>
        {tokens && transactions ? (
          <>
            <Box borderWidth={'1px'} borderRadius={'12px'} padding={3}>
              <Table variant={'simple'}>
                <Thead>
                  <Tr>
                    <Th>Asset</Th>
                    <Th>Balance</Th>
                    <Th>Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tokens?.items.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Stack direction={'row'} spacing={3}>
                          <Image
                            src={item.tokenInfo.logoUri ?? TokenPlaceHolder}
                            w={'24px'}
                            height={'24px'}
                            alt={item.tokenInfo.name}
                            onError={setImageToPlaceholder}
                          />
                          <Text>{item.tokenInfo.name}</Text>
                        </Stack>
                      </Td>
                      <Td>
                        {`${getFullDisplayBalance(
                          new BigNumber(item.balance),
                          item.tokenInfo.decimals
                        )} ${item.tokenInfo.symbol}`}
                      </Td>
                      <Td>{item.fiatBalance} USD</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Box mt={3}></Box>
            <Heading fontSize={'2xl'}>Transactions</Heading>
            <Box borderWidth={'1px'} borderRadius={'12px'} padding={3}>
              <Table variant={'simple'}>
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Type</Th>
                    <Th>Function</Th>
                    <Th>From</Th>
                    <Th>To</Th>
                    <Th>Created</Th>
                    <Th>Success</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((tx: any, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>
                        {tx.transaction.txInfo.type === 'Transfer'
                          ? tx.transaction.txInfo.direction === 'INCOMING'
                            ? 'Received'
                            : tx.transaction.txInfo.direction === 'OUTGOING'
                            ? 'Sent'
                            : 'Unknown'
                          : tx.transaction.txInfo.type === 'Custom'
                          ? 'Contract interaction'
                          : 'Unknown'}
                      </Td>
                      <Td>
                        {tx.transaction.txInfo.type === 'Transfer'
                          ? tx.transaction.txInfo.transferInfo.type ===
                            'NATIVE_COIN'
                            ? `${getFullDisplayBalance(
                                new BigNumber(
                                  tx.transaction.txInfo.transferInfo.value
                                )
                              )} ETH`
                            : tx.transaction.txInfo.transferInfo.type ===
                              'ERC20'
                            ? `${getFullDisplayBalance(
                                new BigNumber(
                                  tx.transaction.txInfo.transferInfo.value
                                ),
                                tx.transaction.txInfo.transferInfo.decimals
                              )} ${
                                tx.transaction.txInfo.transferInfo.tokenSymbol
                              }`
                            : '--'
                          : tx.transaction.txInfo.type === 'Custom'
                          ? tx.transaction.txInfo.methodName
                          : '--'}
                      </Td>
                      <Td>
                        {tx.transaction.txInfo.type === 'Transfer' ? (
                          <LinkButton
                            href={getExternalLink(
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              chainId!,
                              'address',
                              tx.transaction.txInfo.sender.value
                            )}
                            isExternal
                          >
                            {shortenAddress(tx.transaction.txInfo.sender.value)}
                          </LinkButton>
                        ) : (
                          '--'
                        )}
                      </Td>
                      <Td>
                        {tx.transaction.txInfo.type === 'Transfer' ? (
                          <LinkButton
                            href={getExternalLink(
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              chainId!,
                              'address',
                              tx.transaction.txInfo.recipient.value
                            )}
                            isExternal
                          >
                            {shortenAddress(
                              tx.transaction.txInfo.recipient.value
                            )}
                          </LinkButton>
                        ) : tx.transaction.txInfo.type === 'Custom' ? (
                          <LinkButton
                            href={getExternalLink(
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              chainId!,
                              'address',
                              tx.transaction.txInfo.to.value
                            )}
                            isExternal
                          >
                            {shortenAddress(tx.transaction.txInfo.to.value)}
                          </LinkButton>
                        ) : (
                          '--'
                        )}
                      </Td>
                      <Td>
                        {format(
                          new Date(tx.transaction.timestamp),
                          'yyyy-MM-dd HH:mm:ss'
                        )}
                      </Td>
                      <Td>{tx.transaction.txStatus}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </>
        ) : (
          <Stack justifyContent={'center'}>
            <Heading as={'h1'} fontSize={'xl'} fontFamily={'body'}>
              Loading ...
            </Heading>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default GnosisSafe;
