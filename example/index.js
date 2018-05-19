import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import reactJSON, { createStructure } from '../dist/index';

const ListItem = ({ text, complete, handleToggleTodo, handleDeleteTodo, ...props }) => (
  <li>
    <span
      style={{ 
        display: 'flex',
        width: '240px',
        justifyContent: 'space-between',
        padding: '5px 0',
      }}
      title="Toggle complete status"
      {...props}
    >
      <span
        style={{
          flexGrow: 1,
          cursor: 'pointer',
          textDecoration: complete ? 'line-through' : 'inherit'
        }}
        onClick={handleToggleTodo}
      >
        {text}
      </span>

      <button
        type="button"
        style={{ cursor: 'pointer' }}
        title="Remove todo"
        onClick={handleDeleteTodo}
      >
        x
      </button>
    </span>
  </li>
);

const withComponentStructure = (WrapperComponent) => {
  class ComponentStructure extends Component {
    constructor(props) {
      super(props);

      this.componentStructure = createStructure();

      this.state = {
        structure: this.getStructure()
      };

      this.handleGetNode = this.handleGetNode.bind(this);
      this.handleAddNode = this.handleAddNode.bind(this);
      this.handleUpdateNode = this.handleUpdateNode.bind(this);
      this.handleRemoveNode = this.handleRemoveNode.bind(this);
      this.getStructure = this.getStructure.bind(this);
    }

    handleGetNode(id) {
      return this.componentStructure.get(id);
    }

    handleAddNode(node, parent) {
      const newNode = this.componentStructure.add(node, parent);
      this.setState({ structure: this.getStructure() });

      return newNode;
    }

    handleUpdateNode(id, values = {}) {
      const updatedNode = this.componentStructure.update(id, values);
      
      this.setState({ structure: this.getStructure() });
      return updatedNode;
    }

    handleRemoveNode(id) {
      const oldNode = this.componentStructure.remove(id);
      
      this.setState({ structure: this.getStructure() });
      return oldNode;
    }

    getStructure() {
      return this.componentStructure.structure();
    }

    render() {
      return (
        <WrapperComponent
          handleGetNode={this.handleGetNode}
          handleAddNode={this.handleAddNode}
          handleUpdateNode={this.handleUpdateNode}
          handleRemoveNode={this.handleRemoveNode}
          structure={this.state.structure}
          {...this.props}
        />
      );
    }
  }
  
  return ComponentStructure;
};

class Todos extends Component {
  constructor(props) {
    super(props);

    this.props.handleAddNode({ type: 'div', props: { key: 'a' } });
    this.props.handleAddNode({ type: 'ul', props: { key: 'b', style: { display: 'flex', flexDirection: 'column', padding: 0, margin: 0 } } }, 0);

    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.badPracticeKeyHandling = 0;
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const value = event.target.todo.value;

    // Reset the input's value, but use the value to create a node from it
    this.setState(
      { value: '' },
      this.handleAdd(value)
    );
  }

  handleAdd(text) {
    const { id, props } = this.props.handleAddNode(
      {
        type: 'ListItem',
        props: {
          key: this.badPracticeKeyHandling++,
          complete: false,
          text: text
        }
      },
      1 // parent id is known before hand to make this simpler
    );

    // Add functions to node for managing the toggling/removing of the todo
    this.props.handleUpdateNode(id, {
      props: {
        ...props,
        handleToggleTodo: () => {
          // Get the node
          const { props } = this.props.handleGetNode(id);

          // Toggle the complete status
          const newProps = {
            ...props,
            complete: !props.complete
          };

          // Update its props with the new status
          this.props.handleUpdateNode(id, {
            props: newProps
          })
        },
        handleDeleteTodo: () => this.handleRemove(id)
      }
    });
  }

  handleRemove(id) {
    this.props.handleRemoveNode(id);
  }

  render() {
    const { value } = this.state;
    const { structure } = this.props;

    // More components would go here
    const componentInventory = {
      ListItem,
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="todo"
            placeholder="Add todo"
            onChange={this.handleChange}
            value={value}
          />
          <button type="submit" disabled={!value}>Add todo</button>
        </form>

        {reactJSON(structure, componentInventory)}
      </div>
    );
  }
}

const TodosWithComponentStructure = withComponentStructure(Todos);
const root = document.querySelector('#root');

ReactDOM.render(<TodosWithComponentStructure />, root);
