import { Proposal } from '@zero-tech/zdao-sdk';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { Loader } from '../components/Loader';
import { useSdkContext } from '../hooks/useSdkContext';

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{proposal.title}</Card.Title>
        <Card.Text>{proposal.createdBy}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const ListProposal = () => {
  const { zNA } = useParams();
  const { zDAOs } = useSdkContext();
  const [proposals, setProposals] = useState<{
    loading: boolean;
    list: Proposal[];
  }>({
    loading: true,
    list: [],
  });

  const zDAO = useMemo(() => {
    if (!zNA) return undefined;
    const filters = zDAOs.filter((zDAO) => zDAO.zNAs.indexOf(zNA) >= 0);
    return filters.length > 0 ? filters[0] : null;
  }, [zDAOs, zNA]);

  console.log('listProposal, zDAO', zDAO);

  useEffect(() => {
    const fetch = async () => {
      if (!zDAO) return;
      const list = await zDAO.listProposals();

      setProposals({
        loading: false,
        list,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [zDAO]);

  return (
    <Container>
      {proposals.loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      ) : (
        proposals.list.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))
      )}
    </Container>
  );
};

export default ListProposal;
