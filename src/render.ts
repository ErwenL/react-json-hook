import {
  jsonNode,
  jsonNodeProps,
} from "./types";
import {
  RenderTypeDefs,
} from "./typeHelper";

export const nodeRender = <TNode extends jsonNode>(
  props:jsonNodeProps<TNode>,
  renderTypeDefs: RenderTypeDefs,
) => renderTypeDefs.renderType(props.renderType).nodeRender(props)
