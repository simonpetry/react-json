import { createElement as element } from 'react';

function reactJSON(structure, components = {}) {
  if (!structure) {
    return null;
  }

  const { type, props, children } = structure;

  const handledType = components && isComponent(type)
    ? components[type]
    : type;

  return element(
    handledType,
    props,
    Array.isArray(children)
      ? children.map(child => reactJSON(child, components))
      : children
  );
}

/**
 * Determine if the type of a node is a component or not
 * @param  {string}  type A node's type
 * @return {boolean}      Determine if the type is a comonent
 */
function isComponent(type = '') {
  return /[A-Z]/.test(type[0]);
}

/**
 * Generate a node
 * @param {object} The node properties
 * @param {number} The node's parent id
 */
function Node({ id = null, type = 'div', props = {}, children = [] }, parentId = null) {
  return {
    id: id,
    parent: parentId,
    type: type,
    props: props,
    children: children
  };
}

function createStructure() {
  let root = null;
  let id = 0;

  // Parse a structure?
  function build(structure) {
    if (typeof structure === 'undefined') {
      throw new Error('createStructure().build(structure) requires a structure to be provided');
    }

    // Break the reference
    const localStructure = Object.assign({}, structure);

    root = traverseDFS(
      Node(handleId(localStructure)),
      (node, parent = null) => {
        if (Array.isArray(node.children) && node.children.length) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            node.children[i] = Node(handleId(child), !!node ? node.id : null);
          }
        }

        return node;
      }
    );
  
    return root;
  }

  // TODO:
  // Add a flag to provide granular ways of updating:
  // 1. Updating/adding any property that's provided: default
  // 2. Only updating properties that are already set
  // 3. Updating properties that are already set and removing properties that aren't provided
  function update(id, data) {
    if (typeof id === 'undefined') {
      throw new Error('createStructure().update(id, node) requires an id to be provided');
    }

    if (typeof data === 'undefined') {
      throw new Error('createStructure().update(id, node) requires node data to update');
    }

    let node = get(id);

    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      node[keys[i]] = data[keys[i]];
    }

    return node;
  }

  function remove(id) {
    if (typeof id === 'undefined') {
      throw new Error('createStructure().remove(id) requires an id to be provided');
    }

    const node = get(id);
    
    // Assumes root
    if (node.parent === null) {
      const copiedRoot = Object.assign({}, root);

      root = null;
      return copiedRoot;
    }

    const parentNode = get(node.parent);

    parentNode.children = parentNode.children
      .filter(node => node.id !== id);

    const copiedNode = Object.assign({}, node);
    return copiedNode;
  }

  function get(id) {
    if (typeof id === 'undefined') {
      throw new Error('createStructure().get(id) requires an id to be provided');
    }

    // Exit early
    if (!root) {
      return false;
    }

    const result = traverseBFS(
      root, 
      node => node, 
      node => node.id === id
    );

    // If there's no match return false
    return result || false;
  }

  function traverseDFS(structure = root, callback, breakCondition = false) {
    let breakFlag = false;

    function recurse(current, parent) {
      const value = callback(current, parent);

      if (breakCondition && breakCondition(current, parent)) {
        breakFlag = true;
      }

      const children = current.children && current.children.length;
      if (children) {
        for (let i = 0; i < children; i++) {
          if (breakFlag) break;
          recurse(current.children[i], current);
        }
      }

      return value;
    };

    return recurse(structure, null);
  }

  function traverseBFS(structure = root, callback, breakCondition = false) {
    let queue = [structure];
    let current;

    while(queue.length) {
      current = queue.shift();

      let value = callback(current);

      // Stop the traversal and use the node
      if (breakCondition && breakCondition(current)) {
        return value;
      }
      
      // Stop the while loop
      if (!current.children) continue;

      for (let i = 0; i < current.children.length; i++) {
        queue.push(current.children[i]);
      }
    }
  }

  function add(data, parent = null) {
    if (typeof data === 'undefined') {
      throw new Error('createStructure().add(data, parent) requires node data be provided');
    }

    const generatedNode = Node(handleId(data));

    // Assume's that if there's no parent id, then it's the root
    if (parent === null || parent === undefined) {
      root = generatedNode;
      return root;
    }

    const parentNode = get(parent);

    if (parentNode) {
      // Convenient place to handle adding the parent id to the node
      generatedNode.parent = parentNode.id;
      parentNode.children.push(generatedNode);
    }

    return generatedNode;
  }

  function structure() {
    return root;
  }

  function destroy() {
    root = null;
    id = 0;
  }

  function handleId(node) {
    if (node && node.id === undefined) {
      node.id = id++;
    }
    return node;
  }

  return {
    add,
    get,
    update,
    remove,
    build,
    structure,
    destroy
  };
}

export default reactJSON;

export {
  Node,
  createStructure
};