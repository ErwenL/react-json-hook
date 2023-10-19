"use client";
import {
  jsonNode,
  jsonNodeProps,
  nodeBaseType,
  renderJsonNodeProps,
} from "../types";
import { createRenderTypeHelper, RenderTypeDefs } from "../typeHelper";
import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const INDENT = 16;

const LeafNodeRender: React.FC<renderJsonNodeProps<jsonNode>> = (
  props: renderJsonNodeProps<jsonNode>,
) => {
  return (
    <>
      <div
        className="group my-[0.5px] flex h-min w-full items-center px-1 hover:bg-sky-200/20"
        style={{ paddingLeft: `${props.level * INDENT}px` }}
      >
        <div className="mx-1 h-3 w-3 rounded-sm"></div>
        <div className="w-fit">
          {props.renderJsonKey!(props)}
          {props.renderJsonValue!(props)}
        </div>
      </div>
    </>
  );
};

const InternalNodeRender: React.FC<renderJsonNodeProps<jsonNode>> = (
  props: renderJsonNodeProps<jsonNode>,
) => {
  return (
    <>
      <div
        className="group my-[0.5px] flex h-min w-full items-center px-1 hover:bg-sky-200/20"
        style={{ paddingLeft: `${props.level * INDENT}px` }}
      >
        {props.degree === 0 && (
          <div className="mx-1 rounded-sm text-slate-500 outline-1 group-hover:outline">
            <ChevronRightIcon className="h-3 w-3" />
          </div>
        )}
        {props.degree > 0 && (
          <button
            title="toggle_node"
            className="mx-1 rounded-sm text-pink-400 outline-1 group-hover:outline"
            onClick={props.folded ? props.unfoldBranch : props.foldBranch}
          >
            <ChevronRightIcon
              className={`h-3 w-3 ${
                !props.folded ? "rotate-90 transform" : ""
              }`}
            />
          </button>
        )}
        <div className="w-fit">
          {props.renderJsonKey!(props)}
          {props.renderJsonValue!(props)}
        </div>
      </div>
    </>
  );
};

const NodeRender: React.FC<renderJsonNodeProps<jsonNode>> = (
  props: renderJsonNodeProps<jsonNode>,
) => {
  return (
    <>
      {props.isLeaf && <LeafNodeRender key={props.id} {...props} />}
      {!props.isLeaf && <InternalNodeRender key={props.id} {...props} />}
    </>
  );
};

const KeyRender: React.FC<jsonNodeProps<jsonNode>> = (
  props: jsonNodeProps<jsonNode>,
) => {
  const isNumKey = !isNaN(Number(props.nodeKey));
  return (
    <>
      {!isNumKey && (
        <span className="pr-2 font-sans text-sm font-semibold text-pink-400">
          {props.nodeKey}:
        </span>
      )}
      {isNumKey && (
        <span className="pr-2 font-mono text-sm font-semibold text-pink-400">
          {props.nodeKey}:
        </span>
      )}
    </>
  );
};

const renderTypeHelper = createRenderTypeHelper(NodeRender, KeyRender);

const renderTypeDefs = new RenderTypeDefs([
  renderTypeHelper.string({
    valueRender: (props) => (
      <span className="font-mono text-sm text-slate-400 group-hover:text-sky-400">
        "{props.value}"
      </span>
    ),
  }),
  renderTypeHelper.number({
    valueRender: (props) => (
      <span className="font-mono text-sm font-medium text-green-400 group-hover:text-sky-400">
        {props.value.toString()}
      </span>
    ),
  }),
  renderTypeHelper.boolean({
    valueRender: (props) => (
      <span className="font-serif text-sm text-slate-500 group-hover:text-sky-400">
        {props.value.toString()}
      </span>
    ),
  }),
  renderTypeHelper.null({
    valueRender: (props) => (
      <span className="font-serif text-sm text-slate-500">null</span>
    ),
  }),
  renderTypeHelper.array({
    valueRender: (props) => (
      <button
        className="text-sm text-slate-500 group-hover:text-sky-400"
        onClick={props.toggleFolded}
      >
        <span className="font-serif">{"Array ("} </span>
        <span className="font-mono">{`${props.degree}`}</span>
        <span className="font-serif">{" items)"}</span>
      </button>
    ),
  }),
  renderTypeHelper.object({
    name: "ObjectId",
    isType: (props) => {
      return "$oid" in props.value;
    },
    isLeaf: true,
    getRenderPropsArray: (nodeprops) => [nodeprops],
    valueRender: (props) => (
      <span className="text-sm font-extralight text-slate-500 group-hover:text-orange-500">
        {`ObjectId("${props.value["$oid"]}")`}
      </span>
    ),
  }),
  renderTypeHelper.object({
    name: "PhyQty",
    isType: (props) => {
      return (
        props.value.pyclass === "PhyQty" &&
        typeof props.value.value === "number" &&
        typeof props.value.unit === "string"
      );
    },
    isLeaf: true,
    getRenderPropsArray: (nodeprops) => [nodeprops],
    valueRender: (props) => (
      <>
        <span className="pr-0.5 font-mono text-sm text-slate-400 group-hover:text-sky-400">
          {props.value.value?.toString()}
        </span>
        <span className="font-serif text-sm font-semibold italic text-slate-400 group-hover:text-sky-400">
          {props.value.unit as string}
        </span>
      </>
    ),
  }),
  renderTypeHelper.object({
    valueRender: (props) => (
      <button
        className="text-sm text-slate-500 group-hover:text-sky-400"
        onClick={props.toggleFolded}
      >
        <span className="font-serif">{"Object ("}</span>
        <span className="font-mono">{`${props.degree}`}</span>
        <span className="font-serif">{" items)"}</span>
      </button>
    ),
  }),
]);

export default renderTypeDefs;
