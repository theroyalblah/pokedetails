import { Container, Row, Col } from "react-bootstrap";
import UsageList from "./usageList";
import { createLinkWithGeneration, getSmogonUrl } from "../utils/helpers";

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

const colors = [
  "#FF5959",
  "#F5AC78",
  "#FAE078",
  "#9DB7F5",
  "#A7DB8D",
  "#FA92B2",
];

const colorNames = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];

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
  currentGeneration = 9,
}: SmogonStats & { currentGeneration?: number }) => {
  const countersList = Object.keys(counters);
  
  const smogonAbilitiesUrl = getSmogonUrl("abilities", currentGeneration);
  const smogonMovesUrl = getSmogonUrl("moves", currentGeneration);
  const smogonItemsUrl = getSmogonUrl("items", currentGeneration);

  return (
    <section className="usage">
      <h3>Usage: {toPercentageString(usage.weighted)}</h3>

      <Container>
        <Row>
          <Col sm={4}>
            <UsageList title="Moves" data={moves} count={20} baseUrl={smogonMovesUrl} />
          </Col>
          <Col sm={4}>
            <UsageList title="Items" data={items} count={20} baseUrl={smogonItemsUrl} />
          </Col>
          <Col sm={4}>
            <UsageList 
              title="Teammates" 
              data={teammates} 
              count={20} 
              baseUrl={INTERNAL_URL} 
              currentGeneration={currentGeneration}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <UsageList title="Abilities" data={abilities} count={10} baseUrl={smogonAbilitiesUrl} />
          </Col>

          <Col sm={4}>
            <h3>Counters</h3>

            <ol>
              {countersList.map((_, i) => (
                <li key={countersList[i]}>
                  <a href={createLinkWithGeneration(countersList[i], "", currentGeneration)}>
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
