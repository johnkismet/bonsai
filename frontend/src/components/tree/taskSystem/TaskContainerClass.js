import axios from "axios";
import { Component } from "react";
import Task from "./Task";
import { v4 as uuid } from "uuid";

export default class TaskContainerClass extends Component {
  state = {
    id: this.props.id,
    tasks: [],
    itemsCompleted: 0,
    currentName: "",
  };

  componentDidMount() {
    fetch(`http://localhost:4000/getTasks/${this.state.id}`)
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          tasks: data,
        })
      );
  }

  componentWillUnmount() {
    axios
      .post(`http://localhost:4000/setTasks/${this.state.id}`, {
        tasks: this.state.tasks,
        itemsCompleted: 0,
      })
      .then((res) => console.log(res));
  }

  showTasks() {
    return this.state.tasks.map((task, index) => (
      <Task
        className="task"
        name={task.name}
        onChange={this.ToggleCompleted}
        completed={task.completed}
        taskId={task.taskId}
        key={index}
      />
    ));
  }

  addTask = () => {
    let newTaskName = this.state.currentName;
    this.setState({
      currentName: "",
    });
    let newId = uuid();
    let newTask = {
      name: newTaskName,
      parentId: this.state.id,
      taskId: newId,
      completed: false,
    };
    let newTasks = [...this.state.tasks, newTask];
    this.setState({
      tasks: newTasks,
    });
  };

  ToggleCompleted = (changedId) => {
    console.log(changedId);
    const newTasks = [...this.state.tasks];
    console.log(newTasks);
    // let filteredTasks = newTasks.filter((task) => task.taskId === changedId);
    // console.log(filteredTasks);
    for (let i = 0; i < newTasks.length; i++) {
      console.log(`current ID: ${newTasks[i].taskId}`);
      console.log(`Clicked ID: ${changedId}`);
      if (newTasks[i].taskId === changedId) {
        newTasks[i].completed = !newTasks[i].completed;
      }
    }
    this.setState({
      tasks: newTasks,
    });
    //newTasks[taskId].completed = !newTasks[taskId].completed;
  };

  handleChange = (event) => {
    this.setState({
      currentName: event.target.value,
    });
  };

  render() {
    return (
      <div className="Tasks">
        <div className="inputContainer">
          <input
            placeholder="What're you working on?"
            className="taskInput"
            value={this.state.currentName}
            onChange={this.handleChange}
          ></input>
          <input
            className="submitTask"
            onClick={this.addTask}
            type="button"
            value="Submit"
          />
        </div>
        <div className="taskContainer">
          <div>{this.showTasks()}</div>
        </div>
      </div>
    );
  }
}
