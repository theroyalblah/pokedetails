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

const colorNames = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];

const SMOGON_ABILITIES_URL = "https://www.smogon.com/dex/sv/abilities/";
const SMOGON_MOVES_URL = "https://www.smogon.com/dex/sv/moves/";
const SMOGON_ITEMS_URL = "https://www.smogon.com/dex/sv/items/";
const INTERNAL_URL = "";

const handleSpreads = (spreads: StringPercent, n = 5) => {
  const keyList = Object.keys(spreads).slice(0, n);

  const borderBottom = "2px solid #444";
  const padding = "8px";

  return (
    <>
      <h3>Spreads</h3>

      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9em" }}
      >
        <thead>
          <tr>
            <th style={{ padding, borderBottom }}>Nature</th>

            {colorNames.map((name, index) => (
              <th
                key={name}
                style={{
                  padding,
                  textAlign: "center",
                  borderBottom,
                  color: colors[index],
                }}
              >
                {name}
              </th>
            ))}

            <th style={{ padding, borderBottom }}>Usage</th>
          </tr>
        </thead>

        <tbody>
          {keyList.map((listItem) => {
            const parts = listItem.split(":");
            const nature = parts[0];
            const stats = parts[1].split("/");

            return (
              <tr key={listItem} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding }}>{nature}</td>
                {colors.map((color, index) => (
                  <td
                    key={index}
                    style={{ padding, textAlign: "center", color }}
                  >
                    {stats[index]}
                  </td>
                ))}
                <td style={{ padding, textAlign: "right" }}>
                  {toPercentageString(spreads[listItem])}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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

          <Col sm={4}>{handleSpreads(spreads)}</Col>
        </Row>
      </Container>
    </section>
  );
};

export default UsageDetails;
