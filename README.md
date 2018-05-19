# react-json
> In goes JSON out comes React

Dynamic structures happen, this is an exercise in wrangling that problem

## Features

- CRUD operations
- Great for dashboards/GUI's, any visual interface
  - (GUI <-> JSON) -> React
- Uses React elements/JSX objects under the hood
  - System agnostic (GUI can be any framework as long as it outputs the correct structure)
- ~1k gzipped

## Notes

- Import the components you will use
- Wrap the CRUD operations in handlers

## Improvements

- Provide React components to interfce with the structure
- Using a hash map internally instead of a tree data structure
- CRUD promises to reduce blocking in large structures
- Server-side rendering


## Usage

### Getting started

It's as easy as installing the nodes

`npm run install`


### Starting

There's a basic todo app demonstrating the potential of this lib

`npm run start`

Testing

`npm run test`

Building

`npm run build`

## A distilled example:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import reactJSON, { createStructure } from '../dist/index';

// When adding a component, if the "type" property is capitalized it will look for a React component
// This represents our (huge) inventory of components
const componentInventory = {
  Text: props => <span onClick={props.onClick} {...props}>{props.text}{props.children}</span>
};

const componentStructure = createStructure();

// Lets say you already have a UI for adding/updating/removing components
// The following .add(), .update(), .remove() would represent the core of the actions

// Adding our first object to the structure, it's our root
componentStructure.add({ type: 'div', props: { children: 'root', key: 'a' } });

// Adding another object to the structure
// Darn, looks like there's a typo, we'll have to update it
const { id: updateId, props } = componentStructure.add(
  { 
    type: 'Text', 
    props: { 
      text: 'first chidl', // typo
      key: 'b' 
    } 
  }, 
  0
);

// Updating the text
componentStructure.update(
  updateId, 
  // Shallow merging
  { 
    props: { 
      ...props,
      text: 'first child'
    } 
  }
);

// Add a few more objects
componentStructure.add({ type: 'Text', props: { text: 'second child', key: 'c' } }, 0);
componentStructure.add({ type: 'Text', props: { text: 'first grand child', key: 'd' } }, 1);
componentStructure.add({ props: { key: 'e' }, children: 'second grand child' }, 2);
componentStructure.add({ props: { key: 'f' }, children: 'first great grand child' }, 3);

// We'll add this one again so we can remove it
const { id: removeId } = componentStructure.add(
  { 
    props: { key: 'f' }, 
    children: 'first great grand child' 
  }, 
  3
);

// Removing the redunant component
componentStructure.remove(removeId);

// This would need to be wrapped in a provider
// When an operation is performed on the structure, it should generate a new version of it
// This new version could then be passed down as a prop
// As it stands this will only generate a structure once
const structure = reactJSON(componentStructure.structure(), componentInventory);

const App = () => (
  <div>
    {structure}
  </div>
);

const root = document.querySelector('#root');

ReactDOM.render(<App />, root);
```