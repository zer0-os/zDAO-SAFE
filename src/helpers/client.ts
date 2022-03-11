import { SNAPSHOT_HUB } from '@/config/constants/snapshot';
import Client from '@snapshot-labs/snapshot.js';

const client = new Client.Client(SNAPSHOT_HUB);

export default client;
