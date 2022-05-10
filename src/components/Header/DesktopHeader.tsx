import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

const DesktopHeader = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">zDAO Polygon</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/wilder.wheels/gnosis-safe">Gnosis Safe</Nav.Link>
          </Nav>

          <Button variant="outline-primary">Connect Wallet</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DesktopHeader;
