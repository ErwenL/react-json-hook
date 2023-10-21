"use client";
import {
  jsonNode,
  jsonNodeProps,
  nodeBaseType,
  renderJsonNodeProps,
  createRenderTypeHelper,
  RenderTypeDefs
} from "../../src";
import React from "react";

const INDENT = 32;

const LeafNodeRender: React.FC<renderJsonNodeProps<jsonNode>> = (
  props: renderJsonNodeProps<jsonNode>
) => {
  return (
    <>
      <div style={{ paddingLeft: `${props.level * INDENT}px` }}>
        <button style={{ visibility: "hidden", width: 8 }}>{">"}</button>
        {props.renderJsonKey!(props)}
        {props.renderJsonValue!(props)}
      </div>
    </>
  );
};

const InternalNodeRender: React.FC<renderJsonNodeProps<jsonNode>> = (
  props: renderJsonNodeProps<jsonNode>
) => {
  return (
    <>
      <div style={{ paddingLeft: `${props.level * INDENT}px` }}>
        <button
          title={props.folded ? "unfold node" : "fold node"}
          style={{ color: "white", width: 8 }}
          onClick={props.toggleFolded}
        >
          {props.folded ? ">" : "v"}
        </button>
        {props.renderJsonKey!(props)}
        {props.renderJsonValue!(props)}
        {props.folded && (
          <button
            title="unfold branch"
            style={{ color: "white", paddingLeft: 16 }}
            onClick={props.unfoldBranch}
          >
            +
          </button>
        )}
        {!props.folded && (
          <button
            title="fold branch"
            style={{ color: "white", paddingLeft: 16 }}
            onClick={props.foldBranch}
          >
            -
          </button>
        )}
      </div>
    </>
  );
};

const NodeRender: React.FC<renderJsonNodeProps<jsonNode>> = (
  props: renderJsonNodeProps<jsonNode>
) => {
  return (
    <>
      {props.isLeaf && <LeafNodeRender key={props.id} {...props} />}
      {!props.isLeaf && <InternalNodeRender key={props.id} {...props} />}
    </>
  );
};

const KeyRender: React.FC<jsonNodeProps<jsonNode>> = (
  props: jsonNodeProps<jsonNode>
) => {
  return (
    <>
      <span style={{ paddingLeft: 8, color: "yellow" }}>"{props.nodeKey}"</span>
      <span style={{ color: "yellow", paddingRight: 4 }}>:</span>
    </>
  );
};

const renderTypeHelper = createRenderTypeHelper(NodeRender, KeyRender);

const renderTypeDefs = new RenderTypeDefs([
  renderTypeHelper.string({
    name: "InternalEnd",
    baseType: "" as nodeBaseType<string>,
    valueRender: (props) => (
      <span style={{ color: "white", paddingLeft: 8 }}>{props.value}</span>
    ),
    keyRender: (props) => <></>,
  }),
  renderTypeHelper.string({
    valueRender: (props) => (
      <span style={{ color: "greenyellow" }}>"{props.value}"</span>
    ),
  }),
  renderTypeHelper.number({
    valueRender: (props) => (
      <span style={{ color: "cyan" }}>{props.value.toString()}</span>
    ),
  }),
  renderTypeHelper.boolean({
    valueRender: (props) => (
      <span style={{ color: "orange" }}>{props.value.toString()}</span>
    ),
  }),
  renderTypeHelper.null({
    valueRender: (props) => <span style={{ color: "gray" }}>null</span>,
  }),
  renderTypeHelper.array({
    getEndNodeProps: (props) => {
      return {
        value: "]",
        nodeKey: `${props.nodeKey}[end]`,
        id: `${props.id}[end]`,
        level: props.level,
        renderType: "InternalEnd",
        degree: 0,
        isLeaf: true,
      };
    },
    valueRender: (props) => (
      <>
        {props.folded && (
          <>
            <span style={{ color: "white" }}>{"["}</span>
            <button style={{ color: "white" }} onClick={props.toggleFolded}>
              ...
            </button>
            <span style={{ color: "white" }}>{"]"}</span>
          </>
        )}
        {!props.folded && <span style={{ color: "white" }}>{"["}</span>}
      </>
    ),
  }),
  renderTypeHelper.object({
    getEndNodeProps: (props) => {
      return {
        value: "}",
        nodeKey: `${props.nodeKey}[end]`,
        id: `${props.id}[end]`,
        level: props.level,
        renderType: "InternalEnd",
        degree: 0,
        isLeaf: true,
      };
    },
    valueRender: (props) => (
      <>
        {props.folded && (
          <>
            <span style={{ color: "white" }}> {"{"}</span>
            <button style={{ color: "white" }} onClick={props.toggleFolded}>
              ...
            </button>
            <span style={{ color: "white" }}>{"}"}</span>
          </>
        )}
        {!props.folded && <span style={{ color: "white" }}>{"{"}</span>}
      </>
    ),
  }),
]);

export default renderTypeDefs;
