import Client from '@snapshot-labs/snapshot.js';

export const hubUrl =
  process.env.REACT_APP_SNAPSHOT_HUB || 'https://hub.snapshot.org';
const client = new Client.Client(hubUrl);

export default client;
