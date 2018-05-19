const reactJSON = require('./react-json');

const structure = reactJSON.createStructure();

beforeEach(() => {
  structure.destroy();
});

describe('reactJSON', () => {
  test('tests should work', () => {
    expect(true).toBeTruthy();  
  });
});

describe('node', () => {
  test('generate a node', () => {
    const node = new reactJSON.Node({ id: 0 });

    expect(node)
      .toEqual({
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: []
      });  
  });

  test('generate a node with a parent id', () => {
    const node = new reactJSON.Node({ id: 0 }, 1);

    expect(node)
      .toEqual({
        id: 0,
        parent: 1,
        type: 'div',
        props: {},
        children: []
      });  
  });
});

describe('structure', () => {
  describe('#build', () => {
    test('it should handle a case where no structure is provided', () => {
      expect(() => structure.build(undefined)).toThrow();  
    });

    test('it should return a generated structure', () => {
      const structureToBuild = {
        children: [
          { 
            children: [
              {},
              {}
            ]
          }, 
          {}
        ]
      };

      const mockedStructure = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: [
          {
            id: 1,
            parent: 0,
            type: 'div',
            props: {},    
            children: [
              {  
                id: 3,
                parent: 1,
                type: 'div',
                props: {},
                children: []
              },
              {  
                id: 4,
                parent: 1,
                type: 'div',
                props: {},
                children: [] 
              }
            ]   
          },
          {  
            id: 2,
            parent: 0,
            type: 'div',
            props: {},
            children: [] 
          }
        ]
      };

      structure.build(structureToBuild);

      expect(structure.structure()).toEqual(mockedStructure);  
    });
  });

  describe('#add', () => {
    test('it should handle a case where no data is provided', () => {
      expect(() => structure.add()).toThrow();  
    });

    test('it should return the added node', () => {
      const returnedNodeData = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: []
      };
      
      expect(structure.add({})).toEqual(returnedNodeData);  
    });

    test('it should add a node at the root', () => {
      const nodeData = {
        type: 'div'
      };
 
      const returnedNodeData = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: []
      };
      expect(structure.add(nodeData)).toEqual(returnedNodeData);  
    });

    test('it should add a node to a parent node', function() {
      structure.add({ id: 0 });

      const returnedNodeData = {
        id: 1,
        parent: 0,
        type: 'div',
        props: {},
        children: []
      };
      expect(structure.add({ id: 1 }, 0)).toEqual(returnedNodeData);  
    });
  });

  describe('#remove', () => {
    test('it should handle a case where no id is provided', () => {
      expect(() => structure.remove()).toThrow();  
    });

    test('it should handle removing the root node', () => {
      const mockStructure = {
        children: [
          {}, 
          {
            children: [{}]
          }
        ]
      };
      
      // Build a structure from the mock
      structure.build(mockStructure);

      // Remove the root node
      structure.remove(0);

      // Get the structure
      expect(structure.structure()).toEqual(null);  
    });

    test('it should handle removing a deeply nested node', () => {
      const mockStructure = {
        children: [
          {}, 
          {
            children: [{}]
          }
        ]
      };
      
      // Build a structure from the mock
      structure.build(mockStructure);

      const returnedStructure = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: [
          {
            id: 1,
            parent: 0,
            type: 'div',
            props: {},
            children: []
          },
          {
            id: 2,
            parent: 0,
            type: 'div',
            props: {},
            children: []
          }
        ]
      };

      structure.remove(3)

      expect(structure.structure()).toEqual(returnedStructure);  
    });

    test('it should return the removed node', () => {
      const mockStructure = {};
      
      // Build a structure from the mock
      structure.build(mockStructure);

      const returnedNode = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: []
      };

      expect(structure.remove(0)).toEqual(returnedNode);  
    });
  });

  describe('#update', () => {
    test('it should handle a case where no id is provided', () => {
      expect(() => structure.update()).toThrow();  
    });

    test('it should handle a case where no data is provided', () => {
      expect(() => structure.update(1, )).toThrow();  
    });

    test('it should handle updating a node', () => {
      const mockStructure = {
        children: [
          {}, 
          {}
        ]
      };
      
      // Build a structure from the mock
      structure.build(mockStructure);

      // Remove the root node
      structure.update(1, {
        type: 'span',
        newProperty: 'works'
      });

      const returnedStructure = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: [
          {
            id: 1,
            parent: 0,
            type: 'span',
            newProperty: 'works',
            props: {},
            children: []
          },
          {
            id: 2,
            parent: 0,
            type: 'div',
            props: {},
            children: []
          }
        ]
      };

      // Get the structure
      expect(structure.structure()).toEqual(returnedStructure);  
    });
  });

  describe('#get', () => {
    test('it should handle a case where no id is provided', () => {
      expect(() => structure.get()).toThrow();  
    });

    test('it should handle getting a node', () => {
      const mockStructure = {
        children: [
          {}, 
          {}
        ]
      };
      
      // Build a structure from the mock
      structure.build(mockStructure);

      const returnedNode = {
        id: 2,
        parent: 0,
        type: 'div',
        props: {},
        children: []
      };

      // Get the structure
      expect(structure.get(2)).toEqual(returnedNode);  
    });
  });

  describe('#destroy', () => {
    test('it should handle destroying the structure', () => {
      const mockStructure = {
        children: [
          {}, 
          {}
        ]
      };
      
      // Build a structure from the mock
      structure.build(mockStructure);

      const returnedStructure = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: [
          {
            id: 1,
            parent: 0,
            type: 'div',
            props: {},
            children: []
          },
          {
            id: 2,
            parent: 0,
            type: 'div',
            props: {},
            children: []
          }
        ]
      };

      // Test that the structure is intact
      expect(structure.structure()).toEqual(returnedStructure);  
      
      structure.destroy();

      // Test that the structure was destroyed
      expect(structure.structure()).toEqual(null);  
    });

    test('it should reset the id counter', () => {
      structure.add({});

      const returnedStructure = {
        id: 0,
        parent: null,
        type: 'div',
        props: {},
        children: []
      };

      // Test that the structure is intact
      expect(structure.structure()).toEqual(returnedStructure);  
      
      structure.destroy();

      // Test that the structure was destroyed
      expect(structure.add({})).toEqual(returnedStructure);  
    });
  });
});