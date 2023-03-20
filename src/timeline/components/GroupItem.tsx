import { GroupItemProps } from "timeline/models";

export const GroupItem = ({
  groupIdx,
  group,
  setup,
  itemIdx,
  item,
}: GroupItemProps) => {
  const top =
    setup.group.padding +
    setup.item.height +
    setup.item.height * itemIdx +
    setup.item.gap * itemIdx;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        transition: "0.3s transform ease-in-out",
        cursor: "pointer",
        height: setup.item.height,
        width: setup.item.width,
        transform: `translate(${
          groupIdx * (setup.marker.gap + setup.marker.size) -
          setup.marker.size / 2
        }px, ${group.top ? `-${top}px` : `${top}px`})`,
        ...{ [group.top ? "top" : "bottom"]: 0 },
      }}
    >
      <img
        src={item.avatar}
        alt="Timeline avatar"
        style={{
          height: "100%",
          borderRadius: "50%",
          maxWidth: "100%",
        }}
      />
      {group.empty || (
        <span
          style={{
            marginLeft: setup.marker.size / 2 + "px",

            fontFamily: "Lexend, sans-serif",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {item.title}
        </span>
      )}
    </div>
  );
};
