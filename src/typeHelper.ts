import {
  jsonNode,
  jsonLeaf,
  jsonArray,
  jsonObject,
  nodeBaseType,
  useJsonNodeProps,
  jsonNodeProps,
  jsonNodeRender,
  jsonKeyRender,
  renderJsonNodeProps,
  renderTypeDef,
  renderTypeDefProps,
} from "./types";

export type renderTypeHelper = {
  string: (props: renderTypeDefProps<string>) => renderTypeDef<string>;
  number: (props: renderTypeDefProps<number>) => renderTypeDef<number>;
  boolean: (props: renderTypeDefProps<boolean>) => renderTypeDef<boolean>;
  null: (props: renderTypeDefProps<null>) => renderTypeDef<null>;
  array: (props: renderTypeDefProps<jsonArray>) => renderTypeDef<jsonArray>;
  object: (props: renderTypeDefProps<jsonObject>) => renderTypeDef<jsonObject>;
  leaf: <TNode extends jsonLeaf>(baseType: nodeBaseType<TNode>) => (props: renderTypeDefProps<TNode>) => renderTypeDef<TNode>;
  internal: <TNode extends jsonArray|jsonObject>(baseType: nodeBaseType<TNode>) => (props: renderTypeDefProps<TNode>) => renderTypeDef<TNode>;
}


export function createRenderTypeHelper(
  nodeRender: jsonNodeRender<any>,
  keyRender?: jsonKeyRender<any>,
): renderTypeHelper {

  const leafTypeDefFn = <TNode extends jsonLeaf>(baseType: nodeBaseType<TNode>) => {
    return ( props: renderTypeDefProps<TNode>) => {
      return {
        name: baseType,
        baseType: (baseType as nodeBaseType<TNode>),
        isType: (_nodeprops: useJsonNodeProps<TNode>) => true,
        getRenderPropsArray: (nodeprops:jsonNodeProps<TNode>) => [nodeprops],
        nodeRender: (nodeProps: renderJsonNodeProps<TNode>) => nodeRender({
          renderJsonValue: props.valueRender,
          renderJsonKey: props.keyRender? props.keyRender: keyRender,
          ...nodeProps, 
        }),
        ...props
      }
    }
  }

  const internalTypeDefFn = <TNode extends jsonArray|jsonObject>(baseType: nodeBaseType<TNode>) => {
    return ( props: renderTypeDefProps<TNode>) => {
      return {
        name: baseType,
        baseType: (baseType as nodeBaseType<TNode>),
        isType: (_nodeprops: useJsonNodeProps<TNode>) => true,
        getRenderPropsArray: (nodeprops:jsonNodeProps<TNode>) => {
          const propsArray: jsonNodeProps[] = []
          propsArray.push(nodeprops)
          if (nodeprops.folded===false && nodeprops.children) {
            nodeprops.children.forEach( child => {propsArray.push(...child.renderPropsArray!())})
            if (props.getEndNodeProps) {
              propsArray.push(props.getEndNodeProps(nodeprops))
            }
          }
          return propsArray
        },
        nodeRender: (nodeProps: renderJsonNodeProps<TNode>) => nodeRender({
          renderJsonValue: props.valueRender,
          renderJsonKey: props.keyRender? props.keyRender: keyRender,
          ...nodeProps, 
        }),
        ...props
      }
    }
  }

  return {
    string: leafTypeDefFn("string"),
    number: leafTypeDefFn("number"),
    boolean: leafTypeDefFn("boolean"),
    null: leafTypeDefFn("null"),
    array: internalTypeDefFn("array"),
    object: internalTypeDefFn("object"),
    leaf: leafTypeDefFn,
    internal: internalTypeDefFn,
  }
}

export class RenderTypeDefs {
  #defs: renderTypeDef<jsonNode>[]

  constructor(typeDefs: renderTypeDef<any>[]) {
    this.checkTypeDefDuplication(typeDefs)
    this.#defs = this.removeTypeDefDuplication(typeDefs)
  }
  
  checkTypeDefDuplication(typeDefs: renderTypeDef<jsonNode>[]) {
    const typeNames = [...new Set(typeDefs.map(typeDef => typeDef.name))]
    const typeDefCounts = typeNames.map( typeName => {
      return typeDefs.filter( typeDef => typeDef.name===typeName).length
    })
    const duplicateTypeNames = typeNames.filter( (_typeName, index) => typeDefCounts[index]>1)
    if (duplicateTypeNames.length>0) {
      console.warn(`duplicate render type Defs: ${duplicateTypeNames.join(",")}. Only the first will be used.`)
    }
  }

  removeTypeDefDuplication(typeDefs: renderTypeDef<jsonNode>[]) {
    const firstAppeardTypeDefs: renderTypeDef<jsonNode>[] = []
    const typeNames = [...new Set(typeDefs.map(typeDef => typeDef.name))]
    typeNames.forEach( typeName => {
      const typeDef = typeDefs.find( typeDef => typeDef.name===typeName)
      if (typeDef) {
        firstAppeardTypeDefs.push(typeDef)
      }
    })
    return firstAppeardTypeDefs
  }

  withBaseType(baseType: nodeBaseType<jsonNode>):renderTypeDef<jsonNode>[] {
    const defs = this.#defs.filter( typeDef => typeDef.baseType===baseType&&typeDef.name!==baseType)
    defs.push(this.#defs.find( typeDef => typeDef.name===baseType)!)
    return defs
  }

  renderType(name: string): renderTypeDef<jsonNode> {
    const typeDef = this.#defs.find( typeDef => typeDef.name===name)
    if (typeDef) {
      return typeDef
    } else {
      throw new Error(`render type ${name} not found`)
    }
  }
}