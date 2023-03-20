import { addDays } from "date-fns";
import { TimelineData, TimelineGroupItem } from "timeline/models";

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
  SMALL: {
    label: "Small amount of data",
    data: generate({
      groupsCount: 20,
      groupItemsCount: (i) => i % 3,
      date: (i) => addDays(TODAY, i + 1),
      top: (i) => i % 4 === 0,
      displayed: (i) => i % 4 === 0 || i % 5 === 0,
      blank: () => false,
      empty: () => false,
      title: (j) => `This is title with idx: ${j}`,
    }),
  },
  BOTTOM_ONLY: {
    label: "Data visible on bottom only",
    data: generate({
      groupsCount: 2,
      groupItemsCount: (i) => (i === 0 ? 0 : 3),
      date: (i) => (i === 0 ? TODAY : addDays(TODAY, 5)),
      top: () => false,
      displayed: () => true,
      blank: () => false,
      empty: () => false,
      title: () => "TDD in React ddd",
    }),
  },
  TOP_ONLY: {
    label: "Data visible on top only",
    data: generate({
      groupsCount: 2,
      groupItemsCount: (i) => (i === 0 ? 4 : 0),
      date: (i) => (i === 0 ? TODAY : addDays(TODAY, 5)),
      top: () => true,
      displayed: () => true,
      blank: () => false,
      empty: () => false,
      title: () => "TDD in React ddd",
    }),
  },
  EMPTY: {
    label: "Any data available",
    data: [],
  },
};

export type DataSetsKeys = keyof typeof DATA_SETS;
