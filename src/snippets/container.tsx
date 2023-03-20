import { TimelineProps } from "timeline";
import { Container } from "timeline/components";
import { DEFAULT_SETUP } from "timeline/setup";
import { useCount } from "timeline/utils";

export const Timeline = ({ data, setup = DEFAULT_SETUP }: TimelineProps) => {
  const count = useCount(data);

  return (
    <Container setup={setup} count={count}>
      <>Content</>
    </Container>
  );
};
