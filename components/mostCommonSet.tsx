type StringPercent = {
  [key: string]: number;
};

type MostCommonSetProps = {
  moves?: StringPercent;
  items?: StringPercent;
  abilities?: StringPercent;
  spreads?: StringPercent;
};

const colors = [
  "#FF5959",
  "#F5AC78",
  "#FAE078",
  "#9DB7F5",
  "#A7DB8D",
  "#FA92B2",
];

const createGoodLink = (name: string, baseUrl = ""): string => {
  let poke = name.toLowerCase();
  poke = poke.replace(/[^\w\s-]/gi, "");
  return baseUrl + poke.replace(" ", "-");
};

const SMOGON_ABILITIES_URL = "https://www.smogon.com/dex/sv/abilities/";
const SMOGON_MOVES_URL = "https://www.smogon.com/dex/sv/moves/";
const SMOGON_ITEMS_URL = "https://www.smogon.com/dex/sv/items/";

const MostCommonSet = ({ moves, items, abilities, spreads }: MostCommonSetProps) => {
  const topMoves = moves ? Object.keys(moves).slice(0, 4) : [];
  const topItem = items ? Object.keys(items)[0] : null;
  const topAbility = abilities ? Object.keys(abilities)[0] : null;
  const topSpread = spreads ? Object.keys(spreads)[0] : null;

  const hasUsageData = topMoves.length > 0 || topItem || topAbility || topSpread;

  if (!hasUsageData) return null;

  return (
    <>
      {topMoves.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <strong>Moves</strong>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            {topMoves.map((move) => (
              <a
                key={move}
                href={createGoodLink(move, SMOGON_MOVES_URL)}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "#6b9bd1" }}
              >
                {move}
              </a>
            ))}
          </div>
        </div>
      )}

      {topAbility && (
        <div style={{ marginBottom: "12px" }}>
          <strong>Ability: </strong>
          <a
            href={createGoodLink(topAbility, SMOGON_ABILITIES_URL)}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "#6b9bd1" }}
          >
            {topAbility}
          </a>
        </div>
      )}

      {topItem && (
        <div style={{ marginBottom: "12px" }}>
          <strong>Item: </strong>
          <a
            href={createGoodLink(topItem, SMOGON_ITEMS_URL)}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "#6b9bd1" }}
          >
            {topItem}
          </a>
        </div>
      )}

      {topSpread && (
        <div>
          <strong>Nature / EVs</strong>
          <div style={{ marginTop: "8px", fontFamily: "monospace" }}>
            {(() => {
              const parts = topSpread.split(":");
              const nature = parts[0];
              const stats = parts[1].split("/");

              return (
                <div style={{ display: "flex", gap: "16px" }}>
                  <span>{nature}:</span>
                  <span style={{ display: "flex", gap: "8px" }}>
                    {stats.map((stat, index) => (
                      <span key={index} style={{ color: colors[index] }}>
                        {stat}
                      </span>
                    ))}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default MostCommonSet;
