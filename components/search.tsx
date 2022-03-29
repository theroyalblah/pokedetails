import { useRouter } from "next/router";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const Search = () => {
  const router = useRouter();
  const [formVal, setFormVal] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const str = formVal.replace(/\s+/g, '-').toLowerCase();
    router.push(`/${str}`);
  };

  return (
    <Form onSubmit={handleSubmit} className='search-bar'>
      <Form.Group>
        <Form.Label>Enter Pokemon</Form.Label>

        <Form.Control
          type="text"
          placeholder="Enter pokemon"
          onChange={(e) => setFormVal(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className='search-bar__submit-btn'>
        Submit
      </Button>
    </Form>
  );
};

export default Search;
