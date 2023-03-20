import { Fragment } from "react";
import { TimelineProps } from "timeline";
import { Container, EdgeMarker, LineX, MidMarker } from "timeline/components";
import { DEFAULT_SETUP } from "timeline/setup";
import { useCount } from "timeline/utils";

export const Timeline = ({ data, setup = DEFAULT_SETUP }: TimelineProps) => {
  const count = useCount(data);

  return (
    <Container setup={setup} count={count}>
      <LineX setup={setup} count={count} data={data}>
        {data.map((group, groupIdx) => {
          return (
            <Fragment key={group.date.toDateString()}>
              {group.blank || <MidMarker setup={setup} groupIdx={groupIdx} />}

              {group.items.length > 0 && group.displayed && !group.blank && (
                <>
                  <EdgeMarker groupIdx={groupIdx} group={group} setup={setup} />
                </>
              )}
            </Fragment>
          );
        })}
      </LineX>
    </Container>
  );
};
