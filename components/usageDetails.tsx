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

const createGoodLink = (name: string): string => {
  let poke = name.toLowerCase();
  poke = poke.replace(/[^\w\s-]/gi, '');
  return poke.replace(' ', '-');
}

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

  const list = (name: string, list: StringPercent, n = 10, isLink = false) => {
    const keyList = Object.keys(list);
    return (
      <>
        <h3>{name}</h3>

        <ol>
          {[...Array(n)].map((_, i) => {
            const listItem = keyList[i];

            if (!listItem) return null;

            if (isLink) {
              return (
                <li key={listItem}>
                  <a href={createGoodLink(listItem)}>{listItem} : {toPercentageString(list[listItem])}</a>
                </li>
              );
            }
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
      <h3>Usage: {toPercentageString(usage.weighted)}</h3>

      <Container>
        <Row>
          <Col sm={4}>{list("Moves", moves, 20)}</Col>
          <Col sm={4}>{list("Items", items, 20)}</Col>
          <Col sm={4}>{list("Teammates", teammates, 20, true)}</Col>
        </Row>

        <Row>
          <Col sm={4}>{list("Abilities", abilities)}</Col>
          <Col sm={4}>{list("Spreads", spreads)}</Col>

          <Col sm={4}>
            <h3>Counters</h3>

            <ol>
              {countersList.map((_, i) => (
                <li key={countersList[i]}>
                  <a href={createGoodLink(createGoodLink(countersList[i]))}>{countersList[i]}</a>
                </li>
              ))}
            </ol>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default UsageDetails;
