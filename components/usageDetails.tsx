import { Container, Row, Col } from "react-bootstrap";

type SmogonPercent = {
  raw: number;
  real: number;
  weighted: number;
};

type StringPercent = {
  [key: string]: number;
};

export type SmogonStats = {
  error: string;
  battles: number;
  lead: SmogonPercent;
  usage: SmogonPercent;
  count: number;
  weight: number;
  viability: number[];
  abilities: StringPercent;
  spreads: StringPercent;
  moves: StringPercent;
  teammates: StringPercent;
  items: StringPercent;
  counters: {
    [key: string]: number[];
  };
};

const toPercentageString = (num: number) => `${(num * 100).toFixed(2)}%`;

const UsageDetails = ({
  usage,
  moves,
  teammates,
  counters,
  abilities,
  items,
  spreads,
}: SmogonStats) => {
  const countersList = Object.keys(counters);

  const list = (name: string, list: StringPercent, n = 10) => {
    const keyList = Object.keys(list);
    return (
      <>
        <h3>{name}</h3>

        <ol>
          {[...Array(n)].map((_, i) => {
            const listItem = keyList[i];

            if (!listItem) return null;
            return (
              <li key={listItem}>
                {listItem} : {toPercentageString(list[listItem])}
              </li>
            );
          })}
        </ol>
      </>
    );
  };

  return (
    <section className="usage">
      <h2>Gen 8 OU Usage: {toPercentageString(usage.weighted)}</h2>

      <Container>
        <Row>
          <Col sm={4}>{list("Moves", moves, 20)}</Col>
          <Col sm={4}>{list("Items", items, 20)}</Col>
          <Col sm={4}>{list("Teammates", teammates, 20)}</Col>
        </Row>

        <Row>
          <Col sm={4}>{list("Abilities", abilities)}</Col>
          <Col sm={4}>{list("Spreads", spreads)}</Col>

          <Col sm={4}>
            <h3>Counters</h3>

            <ol>
              {countersList.map((_, i) => (
                <li key={countersList[i]}>{countersList[i]}</li>
              ))}
            </ol>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default UsageDetails;
