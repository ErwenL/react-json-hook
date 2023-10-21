import {
  jsonNode,
  jsonArray,
  jsonObject,
  getJsonNodeBaseType,
  useJsonNodeProps,
  useJsonNodePropsWithType,
  jsonNodeProps,
} from "./types";
import { RenderTypeDefs } from "./typeHelper";
import { useCallback, useMemo, useState } from "react";

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
  _props.renderPropsArray = useCallback(
    () =>
      renderTypeDefs.renderType(_props.renderType).getRenderPropsArray(_props),
    [
      _props.renderType,
      _props.folded,
      _props.children?.map((child) => child.renderPropsArray),
      renderTypeDefs,
    ],
  );

  return _props;
};

const useRenderTypeDefs = <TNode extends jsonNode>(
  props: useJsonNodeProps<TNode>,
  renderTypeDefs: RenderTypeDefs,
): useJsonNodePropsWithType<TNode> => {
  const baseType = getJsonNodeBaseType(props.value);

  const validRenderTypes = useMemo(() => {
    const _validRenderTypes: string[] = [];
    renderTypeDefs.withBaseType(baseType).forEach((typeDef) => {
      if (typeDef.isType(props)) {
        _validRenderTypes.push(typeDef.name);
      }
    });
    return _validRenderTypes;
  }, [props.value, renderTypeDefs]);

  const [renderType, setRenderType] = useState<string>(validRenderTypes[0]);

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
  const [folded, setFolded] = useState<boolean>(true);
  const toggleFolded = () => {
    setFolded((prev) => !prev);
  };

  let children: jsonNodeProps<jsonNode>[] = [];

  if (props.baseType === "array") {
    children = (props.value as jsonArray).map((child, index) =>
      useJsonNode(
        {
          value: child,
          nodeKey: index.toString(),
          id: `${props.id}.${index.toString()}`,
          level: props.level + 1,
        },
        renderTypeDefs,
      ),
    );
  } else if (props.baseType === "object") {
    children = Object.keys(props.value as jsonObject).map((key) =>
      useJsonNode(
        {
          value: (props.value as jsonObject)[key],
          nodeKey: key,
          id: `${props.id}.${key}`,
          level: props.level + 1,
        },
        renderTypeDefs,
      ),
    );
  } else {
    return { ...props, degree: 0, isLeaf: true };
  }

  const isLeaf = useMemo(
    () =>
      renderTypeDefs.renderType(props.renderType).isLeaf === true
        ? true : false,
    [props.value, props.renderType, renderTypeDefs],
  );

  const foldAllSubBranches = () => {
    children.forEach((child) => {
      if (!child.isLeaf && typeof child.foldBranch === "function") {
        child.foldBranch();
      }
    });
  };

  const foldBranch = () => {
    foldAllSubBranches();
    if (!folded) {
      setFolded((_prev) => true);
    }
  };

  const unfoldAllSubBranches = () => {
    children.forEach((child) => {
      if (!child.isLeaf && typeof child.unfoldBranch === "function") {
        child.unfoldBranch();
      }
    });
  };

  const unfoldBranch = () => {
    if (folded) {
      setFolded((_prev) => false);
    }
    unfoldAllSubBranches();
  };

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
