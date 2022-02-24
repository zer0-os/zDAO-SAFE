import {
  Button,
  Container,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import ConnectWalletButton from '@/components/Button/ConnectWalletButton';
import Card from '@/components/Card';
import { DatePicker, TimePicker } from '@/components/DatePicker';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { shortenAddress } from '@/utils/address';

interface ProposalFormat {
  title: string;
  body: string;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  snapshot: number;
}

const LinkExternal = ({
  type,
  value,
}: {
  type: string;
  value: string | number;
}) => {
  return (
    <Link href={'#'} isExternal>
      <Stack direction={'row'} spacing={2} alignItems={'center'}>
        <Text>{value}</Text>
        <ExternalLinkIcon mx={'2px'} />
      </Stack>
    </Link>
  );
};

const CreateProposal = () => {
  const [state, setState] = useState<ProposalFormat>({
    title: '',
    body: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
  });
  const { title, body, startDate, startTime, endDate, endTime, snapshot } =
    state;
  const { account } = useActiveWeb3React();
  const navigate = useNavigate();

  const updateValue = (key: string, value: string | number | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleTitleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleBodyChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value);
  };

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <Link onClick={() => navigate(-1)}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </Link>

        <Stack
          spacing={12}
          flex={2}
          direction={{ base: 'column', sm: 'row' }}
          w={'full'}
        >
          <VStack spacing={6} flex={1}>
            {/* Proposal title & content */}
            <Input
              borderColor="gray.300"
              name={'title'}
              onChange={handleTitleChange}
              placeholder="Proposal title"
              size={'lg'}
              value={title}
              _hover={{
                borderRadius: 'gray.300',
              }}
              required
            ></Input>
            <Textarea
              borderColor="gray.300"
              name={'body'}
              onChange={handleBodyChange}
              placeholder="Proposal content"
              height={'200px'}
              value={body}
              _hover={{
                borderRadius: 'gray.300',
              }}
            ></Textarea>

            {/* Choices */}
            <Card title={'Choices'}>
              <Stack spacing={2} direction={'column'}>
                <Button
                  bg={'transparent'}
                  borderWidth={'1px'}
                  rounded={'full'}
                  _focus={{
                    borderColor: 'gray.600',
                  }}
                  _hover={{
                    bg: 'gray.100',
                  }}
                >
                  Yes
                </Button>
                <Button
                  bg={'transparent'}
                  borderWidth={'1px'}
                  rounded={'full'}
                  _hover={{
                    bg: 'gray.100',
                  }}
                  _focus={{
                    borderColor: 'gray.600',
                  }}
                >
                  No
                </Button>
              </Stack>
            </Card>
          </VStack>

          {/* Action */}
          <VStack width={{ base: 'full', sm: '400px' }}>
            <Card title={'Action'}>
              <Stack spacing={2} direction={'column'}>
                <Text>Start Date</Text>
                <DatePicker
                  name={'startDate'}
                  onChange={handleDateChange('startDate')}
                  selected={startDate}
                  placeholderText="YYYY/MM/DD"
                />
                <Text>Start Time</Text>
                <TimePicker
                  name={'startTime'}
                  onChange={handleDateChange('startTime')}
                  selected={startTime}
                  placeholderText="00:00"
                />
                <Text>End Date</Text>
                <DatePicker
                  name={'endDate'}
                  onChange={handleDateChange('endDate')}
                  selected={endDate}
                  placeholderText="YYYY/MM/DD"
                />
                <Text>End Time</Text>
                <TimePicker
                  name={'endTime'}
                  onChange={handleDateChange('endTime')}
                  selected={endTime}
                  placeholderText="00:00"
                />
                {account && (
                  <SimpleGrid
                    columns={2}
                    spacing={4}
                    templateColumns={{ base: '1fr 2fr' }}
                  >
                    <Text>Creator</Text>
                    <LinkExternal
                      type={'account'}
                      value={shortenAddress(account!)}
                    />
                  </SimpleGrid>
                )}
                <SimpleGrid
                  columns={2}
                  spacing={4}
                  templateColumns={{ base: '1fr 2fr' }}
                >
                  <Text>Snapshot</Text>
                  <LinkExternal type={'block'} value={snapshot} />
                </SimpleGrid>
                {account ? (
                  <Button
                    color={'white'}
                    bg={'blue.400'}
                    borderWidth={'1px'}
                    rounded={'full'}
                    _hover={{
                      bg: 'blue.100',
                    }}
                  >
                    Publish
                  </Button>
                ) : (
                  <ConnectWalletButton />
                )}
              </Stack>
            </Card>
          </VStack>
        </Stack>
      </VStack>
    </Container>
  );
};

export default CreateProposal;
