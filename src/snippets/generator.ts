import { addDays } from "date-fns";
import { TimelineData, TimelineGroupItem } from "../timeline";

interface GeneratorConfig {
  groupsCount: number;
  groupItemsCount: (i: number) => number;
  top: (i: number) => boolean;
  displayed: (i: number) => boolean;
  empty: (i: number) => boolean;
  date: (i: number) => Date;
  blank: (i: number) => boolean;
  title: (j: number) => string;
}

type DataSet = Record<
  string,
  {
    label: string;
    data: TimelineData;
  }
>;

const AVATAR =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80";
const TODAY = new Date(1994, 11, 19, 0, 0, 0);

const generate = (config: GeneratorConfig): TimelineData => {
  return Array.from({ length: config.groupsCount }).map((_, i) => ({
    date: config.date(i),
    top: config.top(i),
    displayed: config.displayed(i),
    empty: config.empty(i),
    blank: config.blank(i),
    items: Array.from(
      { length: config.groupItemsCount(i) },
      (_, j): TimelineGroupItem => ({
        avatar: AVATAR,
        title: config.title(j),
      })
    ),
  }));
};

export const DATA_SETS: DataSet = {
  BIG: {
    label: "A lot of data",
    data: generate({
      groupsCount: 50,
      date: (i) => addDays(TODAY, i + 1),
      groupItemsCount: (i) => i % 3,
      top: (i) => i % 4 === 0,
      displayed: (i) => i % 4 === 0 || i === 49 || i === 7,
      empty: (i) => i % 10 === 0,
      blank: (i) => i % 5 === 0,
      title: (j) => `This is title with idx: ${j}`,
    }),
  },
};
