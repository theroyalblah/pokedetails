import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEventHandler, ReactEventHandler, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

const Home: NextPage = () => {
  const router = useRouter();
  const [formVal, setFormVal] = useState('')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    router.push(`/${formVal}`);
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter Pokemon</Form.Label>

          <Form.Control type="text" placeholder="Enter email" onChange={e => setFormVal(e.target.value)}/>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Home;
