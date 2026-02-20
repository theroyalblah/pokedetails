import { createLinkWithGeneration, shouldExcludeValue } from "../utils/helpers";

type StringPercent = {
  [key: string]: number;
};

type UsageListProps = {
  title: string;
  data: StringPercent;
  count?: number;
  baseUrl?: string;
  currentGeneration?: number;
};

const toPercentageString = (num: number) => `${(num * 100).toFixed(2)}%`;

const UsageList = ({ title, data, count = 10, baseUrl = "", currentGeneration }: UsageListProps) => {
  const keyList = Object.keys(data);
  const noFollow =
    baseUrl !== "" ? { rel: "noreferrer noopener", target: "_blank" } : {};

  return (
    <>
      <h3>{title}</h3>

      <ol>
        {[...Array(count)].map((_, i) => {
          const listItem = keyList[i];

          if (!listItem) return null;

          return (
            <li key={listItem}>
              {shouldExcludeValue(listItem) ? (
                <span style={{ color: "#b0b0b0" }}>{listItem}</span>
              ) : (
                <a href={createLinkWithGeneration(listItem, baseUrl, currentGeneration)} {...noFollow}>
                  {listItem}
                </a>
              )}

              <span>: {toPercentageString(data[listItem])}</span>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default UsageList;
