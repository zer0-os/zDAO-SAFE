import Client from '@snapshot-labs/snapshot.js';

const hubUrl = process.env.REACT_APP_SNAPSHOT_HUB || 'https://hub.snapshot.org';
const client = new Client.Client712(hubUrl);

export default client;
