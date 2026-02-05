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

const createGoodLink = (name: string, baseUrl = ""): string => {
  let poke = name.toLowerCase();
  poke = poke.replace(/[^\w\s-]/gi, "");
  return baseUrl + poke.replace(" ", "-");
};

const colors = [
  "#FF5959",
  "#F5AC78",
  "#FAE078",
  "#9DB7F5",
  "#A7DB8D",
  "#FA92B2",
];

const SMOGON_ABILITIES_URL = "https://www.smogon.com/dex/sv/abilities/";
const SMOGON_MOVES_URL = "https://www.smogon.com/dex/sv/moves/";
const SMOGON_ITEMS_URL = "https://www.smogon.com/dex/sv/items/";
const INTERNAL_URL = "";

const handleSpreads = (spreads: StringPercent, n = 10) => {
  const keyList = Object.keys(spreads);
  return (
    <>
      <h3>Spreads</h3>
      <ol>
        {[...Array(n)].map((_, i) => {
          const listItem = keyList[i];

          if (!listItem) return null;

          const parts = listItem.split(":");
          const nature = parts[0];
          const stats = parts[1].split("/");

          const coloredText = stats.map((stat, index) => {
            return (
              <>
                <span key={stat} style={{ color: colors[index] }}>
                  {stat}
                </span>
                {index < stats.length - 1 ? " / " : ""}
              </>
            );
          });

          return (
            <li key={listItem}>
              {nature} : {coloredText} : {toPercentageString(spreads[listItem])}
            </li>
          );
        })}
      </ol>
    </>
  );
};

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

  const list = (name: string, list: StringPercent, n = 10, baseUrl: string) => {
    const keyList = Object.keys(list);
    const noFollow =
      baseUrl !== "" ? { rel: "noreferrer noopener", target: "_blank" } : {};

    return (
      <>
        <h3>{name}</h3>

        <ol>
          {[...Array(n)].map((_, i) => {
            const listItem = keyList[i];

            if (!listItem) return null;

            return (
              <li key={listItem}>
                <a href={createGoodLink(listItem, baseUrl)} {...noFollow}>
                  {listItem}
                </a>

                <span>: {toPercentageString(list[listItem])}</span>
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
          <Col sm={4}>{list("Moves", moves, 20, SMOGON_MOVES_URL)}</Col>
          <Col sm={4}>{list("Items", items, 20, SMOGON_ITEMS_URL)}</Col>
          <Col sm={4}>{list("Teammates", teammates, 20, INTERNAL_URL)}</Col>
        </Row>

        <Row>
          <Col sm={4}>
            {list("Abilities", abilities, 10, SMOGON_ABILITIES_URL)}
          </Col>

          <Col sm={4}>{handleSpreads(spreads)}</Col>

          <Col sm={4}>
            <h3>Counters</h3>

            <ol>
              {countersList.map((_, i) => (
                <li key={countersList[i]}>
                  <a href={createGoodLink(countersList[i])}>
                    {countersList[i]}
                  </a>
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
