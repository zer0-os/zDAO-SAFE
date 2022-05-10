import { zDAO } from '@zero-tech/zdao-sdk';
import { formatBytes32String } from 'ethers/lib/utils';
import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';

import Blockie from '../components/Blockie';
import { useSdkContext } from '../hooks/useSdkContext';
import { shortenAddress } from '../utils/address';

const ZDAOBlock = ({ zDAO }: { zDAO: zDAO }) => {
  return (
    <Button variant="link">
      <Card className="h-100 p-4">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Blockie
            alt={zDAO.title}
            seed={formatBytes32String(zDAO.title)}
            width="80px"
            height="80px"
            rounded
          />
          <h3>{zDAO.title}</h3>
          <h5>{shortenAddress(zDAO.createdBy)}</h5>
        </div>
      </Card>
    </Button>
  );
};

const Home = () => {
  const { zDAOs } = useSdkContext();

  return (
    <Container>
      <div className="row w-100">
        {zDAOs &&
          zDAOs.map((dao) => (
            <div className="col-4" key={dao.id}>
              <ZDAOBlock zDAO={dao} />
            </div>
          ))}
      </div>
    </Container>
  );
};

export default Home;
