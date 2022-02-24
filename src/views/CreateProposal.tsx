import Card from '@/components/Card';
import { DatePicker, TimePicker } from '@/components/DatePicker';
import {
  Button,
  Container,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

import { IoArrowBack } from 'react-icons/io5';
import { HiOutlineExternalLink } from 'react-icons/hi';

interface ProposalFormat {
  title: string;
  body: string;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  snapshot: number;
}

const LinkExternal = ({ type, value }: { type: string; value: string }) => {
  return (
    <Stack direction={'row'} spacing={2} alignItems={'center'}>
      <Text>{value}</Text>
      <Link href={'#'}>
        <HiOutlineExternalLink size={15} />
      </Link>
    </Stack>
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
        <Stack direction={'row'} align={'center'}>
          <IoArrowBack size={15} />
          <Heading size={'sm'}>Back</Heading>
        </Stack>

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
                <SimpleGrid
                  columns={2}
                  spacing={4}
                  templateColumns={{ base: '1fr 2fr' }}
                >
                  <Text>Creator</Text>
                  <LinkExternal type={'account'} value={'0x45...92c'} />
                </SimpleGrid>
                <SimpleGrid
                  columns={2}
                  spacing={4}
                  templateColumns={{ base: '1fr 2fr' }}
                >
                  <Text>Snapshot</Text>
                  <LinkExternal type={'block'} value={'154346235'} />
                </SimpleGrid>
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
              </Stack>
            </Card>
          </VStack>
        </Stack>
      </VStack>
    </Container>
  );
};

export default CreateProposal;
