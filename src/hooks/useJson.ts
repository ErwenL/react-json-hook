import {
  jsonNode,
  jsonArray,
  jsonObject,
  getJsonNodeBaseType,
  useJsonNodeProps,
  useJsonNodePropsWithType,
  jsonNodeProps,
} from "../types";
import { RenderTypeDefs } from "../typeHelper";
// import { useCallback, useMemo, useState } from "react";
import React from "react";

export const useJson = <T extends jsonNode = jsonNode>(
  value: T,
  renderTypeDefs: RenderTypeDefs,
) =>
  useJsonNode({ value, nodeKey: "root", id: "root", level: 0 }, renderTypeDefs);

export const useJsonNode = <TNode extends jsonNode>(
  props: useJsonNodeProps<TNode>,
  renderTypeDefs: RenderTypeDefs,
): jsonNodeProps<TNode> => {
  const propsWidthType = useRenderTypeDefs(props, renderTypeDefs);
  const _props = useInternalNode(propsWidthType, renderTypeDefs);
  _props.renderPropsArray = React.useCallback(
    () =>
      renderTypeDefs.renderType(_props.renderType).getRenderPropsArray(_props),
    [_props, renderTypeDefs],
  );

  return _props;
};

const useRenderTypeDefs = <TNode extends jsonNode>(
  props: useJsonNodeProps<TNode>,
  renderTypeDefs: RenderTypeDefs,
): useJsonNodePropsWithType<TNode> => {
  const baseType = React.useMemo(() => getJsonNodeBaseType(props.value), [props]);

  const validRenderTypes = React.useMemo(() => {
    const _validRenderTypes: string[] = [];
    renderTypeDefs.withBaseType(baseType).forEach((typeDef) => {
      if (typeDef.isType(props)) {
        _validRenderTypes.push(typeDef.name);
      }
    });
    return _validRenderTypes;
  }, [baseType, props, renderTypeDefs]);

  const [renderType, setRenderType] = React.useState<string>(validRenderTypes[0]);

  const cycleRenderType =
    validRenderTypes.length > 1
      ? () => {
          const index = validRenderTypes.indexOf(renderType);
          setRenderType(
            validRenderTypes[(index + 1) % validRenderTypes.length],
          );
        }
      : undefined;

  return {
    ...props,
    baseType,
    validRenderTypes,
    renderType,
    setRenderType,
    cycleRenderType,
  };
};

const useInternalNode = <TNode extends jsonNode>(
  props: useJsonNodePropsWithType<TNode>,
  renderTypeDefs: RenderTypeDefs,
): jsonNodeProps<TNode> => {
  const [folded, setFolded] = React.useState<boolean>(true);
  const toggleFolded = () => {
    setFolded((prev) => !prev);
  };

  const useChildNodePropsArray: useJsonNodeProps<jsonNode>[] = [];

  if (props.baseType === "array") {
    (props.value as jsonArray).forEach((child, index) => {
      useChildNodePropsArray.push({
        value: child,
        nodeKey: index.toString(),
        id: `${props.id}.${index.toString()}`,
        level: props.level + 1,
      });
    });
  } else if (props.baseType === "object") {
    Object.keys(props.value as jsonObject).map((key) => {
      useChildNodePropsArray.push({
        value: (props.value as jsonObject)[key],
        nodeKey: key,
        id: `${props.id}.${key}`,
        level: props.level + 1,
      });
    });
  }

  const children: jsonNodeProps<jsonNode>[] = useChildNodePropsArray.map(
    (childNodeProps) =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useJsonNode(childNodeProps, renderTypeDefs),
  );

  const isLeaf = React.useMemo(
    () => !!(renderTypeDefs.renderType(props.renderType).isLeaf === true),
    [props.renderType, renderTypeDefs],
  );

  const foldAllSubBranches = !isLeaf ? () => {
    children.forEach((child) => {
      if (!child.isLeaf && typeof child.foldBranch === "function") {
        child.foldBranch();
      }
    });
  } : undefined;

  const foldBranch = !isLeaf ? () => {
    foldAllSubBranches!();
    if (!folded) {
      setFolded(() => true);
    }
  } : undefined ;

  const unfoldAllSubBranches = !isLeaf ? () => {
    children.forEach((child) => {
      if (!child.isLeaf && typeof child.unfoldBranch === "function") {
        child.unfoldBranch();
      }
    });
  } : undefined;

  const unfoldBranch = !isLeaf ? () => {
    if (folded) {
      setFolded(() => false);
    }
    unfoldAllSubBranches!();
  } : undefined;

  return {
    ...props,
    children,
    degree: children.length,
    isLeaf,
    folded,
    setFolded,
    toggleFolded,
    foldBranch,
    foldAllSubBranches,
    unfoldBranch,
    unfoldAllSubBranches,
  };
};
