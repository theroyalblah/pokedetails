type StringPercent = {
  [key: string]: number;
};

type UsageListProps = {
  title: string;
  data: StringPercent;
  count?: number;
  baseUrl?: string;
};

const toPercentageString = (num: number) => `${(num * 100).toFixed(2)}%`;

const createGoodLink = (name: string, baseUrl = ""): string => {
  let poke = name.toLowerCase();
  poke = poke.replace(/[^\w\s-]/gi, "");
  return baseUrl + poke.replace(" ", "-");
};

const UsageList = ({ title, data, count = 10, baseUrl = "" }: UsageListProps) => {
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
              <a href={createGoodLink(listItem, baseUrl)} {...noFollow}>
                {listItem}
              </a>

              <span>: {toPercentageString(data[listItem])}</span>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default UsageList;
