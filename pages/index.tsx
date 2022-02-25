import type { NextPage } from "next";
import React from "react";
import { Container } from "react-bootstrap";
import Search from "../components/search";

const Home: NextPage = () => {
  return (
    <Container>
      <Search />
    </Container>
  );
};

export default Home;
