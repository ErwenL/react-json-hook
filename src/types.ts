import React from "react";

// base types
export type jsonNode =
  | string
  | number
  | boolean
  | null
  | jsonNode[]
  | { [key: string]: jsonNode };
export type jsonLeaf = string | number | boolean | null;
export type jsonArray = jsonNode[];
export type jsonObject = { [key: string]: jsonNode };

export const getJsonNodeBaseType = <Tnode extends jsonNode>(node: Tnode) => {
  if (typeof node === "string") return "string";
  if (typeof node === "number") return "number";
  if (typeof node === "boolean") return "boolean";
  if (node === null) return "null";
  if (Array.isArray(node)) return "array";
  return "object";
}

export type nodeBaseType<TNode extends jsonNode = jsonNode> = ReturnType<typeof getJsonNodeBaseType<TNode>> 

// hook types
export interface useJsonNodeProps<TNode extends jsonNode> {
  value: TNode;
  nodeKey: string;
  id: string;
  level: number;
}
export interface useJsonNodePropsWithType<TNode extends jsonNode> extends useJsonNodeProps<TNode> {
  baseType: nodeBaseType<TNode>;
  validRenderTypes: string[];
  renderType: string;
  setRenderType: (x: string) => void;
  cycleRenderType?: () => void;
  isLeaf: boolean;
}
export interface jsonNodeProps<TNode extends jsonNode = jsonNode> extends useJsonNodeProps<TNode> {
  baseType?: nodeBaseType<TNode>;
  validRenderTypes?: string[];
  renderType: string;
  setRenderType?: (x: string) => void;
  cycleRenderType?: () => void;
  degree: number;
  isLeaf: boolean;
  children?: jsonNodeProps[];
  folded?: boolean;
  setFolded?: (x:boolean) => void;
  toggleFolded?: () => void;
  foldBranch?: () => void;
  foldAllSubBranches?: () => void;
  unfoldBranch?: () => void;
  unfoldAllSubBranches?: () => void;
  renderPropsArray?: () => jsonNodeProps[];
} 

// render node types
export interface renderJsonNodeProps<TNode extends jsonNode> extends jsonNodeProps<TNode> {
  renderJsonValue?: jsonValueRender<TNode>; 
  renderJsonKey?: jsonKeyRender<TNode>;
}
// export type jsonKeyRender<TKey = string> = React.FC<TKey>
// export type jsonValueRender<TValue extends jsonNode> = React.FC<{value: TValue}>
export type jsonKeyRender<TNode extends jsonNode> = React.FC<jsonNodeProps<TNode>>
export type jsonValueRender<TNode extends jsonNode> = React.FC<jsonNodeProps<TNode>>
export type jsonNodeRender<TNode extends jsonNode> = React.FC<renderJsonNodeProps<TNode>>;


// type defs
export interface renderTypeDef<TNode extends jsonNode> {
  name: string;
  baseType: nodeBaseType<TNode>;
  isLeaf: boolean;
  isType: <TProps extends useJsonNodeProps<TNode> >(props: TProps) => boolean; 
  getEndNodeProps?: <TProps extends jsonNodeProps<TNode> >(props: TProps) => jsonNodeProps;
  getRenderPropsArray: <TProps extends jsonNodeProps<TNode> >(props: TProps) => jsonNodeProps[];
  nodeRender: jsonNodeRender<TNode>;
  keyRender?: jsonKeyRender<TNode>;
  valueRender?: jsonValueRender<TNode>;
}

export interface renderTypeDefProps<TNode extends jsonNode> extends Partial<renderTypeDef<TNode>> {
  valueRender: jsonValueRender<TNode>;
}



