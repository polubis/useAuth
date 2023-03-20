export interface TimelineGroupItem {
  avatar: string;
  title: string;
}

export interface TimelineDataGroup {
  date: Date;
  top: boolean;
  displayed: boolean;
  blank: boolean;
  empty: boolean;
  items: TimelineGroupItem[];
}

export type TimelineData = TimelineDataGroup[];
