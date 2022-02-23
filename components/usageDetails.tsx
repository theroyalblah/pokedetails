import { Container, Row, Col } from "react-bootstrap";

export type UsageDetailsType = {
  tier: string;
  rank: string;
  pokemon: string;
  moves: { [key: string]: string };
  teammates: { [key: string]: string };
  checks: {
    [key: string]: {
      ko: string;
      switched: string;
    };
  };
  items: { [key: string]: string };
  abilities: { [key: string]: string };
  spreads: {
    [key: string]: {
      [key: string]: string;
    };
  };
  ranks: string;
  usage: string;
  error: string;
};

const UsageDetails = ({
  rank,
  usage,
  moves,
  teammates,
  checks,
  abilities,
  items,
  spreads,
}: UsageDetailsType) => {
  const moveList = Object.keys(moves);
  const teammateList = Object.keys(teammates);
  const checksList = Object.keys(checks);
  const abilityList = Object.keys(abilities);
  const naturesList = Object.keys(spreads);
  const itemsList = Object.keys(items);

  return (
    <section className="usage">
      <h2>
        Gen 8 OU Rank: {rank}, Usage: {usage}
      </h2>

      <Container>
        <Row>
          <Col sm={4}>
            <h3>Moves</h3>
            <ol>
              {moveList.map((move) => (
                <li>
                  {move} : {moves[move]}
                </li>
              ))}
            </ol>
          </Col>

          <Col sm={4}>
            <h3>Abilities</h3>
            <ol>
              {abilityList.map((ability) => (
                <li>
                  {ability} : {abilities[ability]}
                </li>
              ))}
            </ol>
          </Col>

          <Col sm={4}>
            <h3>Items</h3>
            <ol>
              {itemsList.map((item) => (
                <li>
                  {item} : {items[item]}
                </li>
              ))}
            </ol>
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <h3>Spreads</h3>

            <ol>
              {naturesList.map((nature, i) => (
                <li>
                  {nature}

                  {i < naturesList.length - 1 ? (
                    <ol>
                      {Object.keys(spreads[nature]).map((spread) => {
                        return (
                          <li>
                            {spread}: {spreads[nature][spread]}
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <>: {spreads["Other"]}</>
                  )}
                </li>
              ))}
            </ol>
          </Col>

          <Col sm={4}>
            <h3>Teammates</h3>

            <ol>
              {teammateList.map((teammate) => (
                <li>
                  {teammate} : {teammates[teammate]}
                </li>
              ))}
            </ol>
          </Col>

          <Col sm={4}>
            <h3>Checks</h3>

            <ol>
              {checksList.map((check) => (
                <li>
                  {check}: KO: {checks[check].ko}, switched:{" "}

                  {checks[check].switched}
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
