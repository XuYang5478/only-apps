import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { PanelGroup, Panel, Checkbox, Alert } from 'rsuite';
import axios from "axios";

import './stylesheet.css';

class Block extends React.Component {
    state = {
        todos: []
    }

    componentDidMount() {
        if (this.props.user) {
            let user = this.props.user;
            axios.get("/api/todo/unfinished_top?userId=" + user.id + "&num=3")
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            todos: response.data
                        })
                    }
                });
        } else {
            this.setState({
                todos: []
            });
        }
    }

    afterChangedTodoStatus = (value, checked) => {
        if (checked) {
            value.finished = true;
            value.finishTime = new Date().getTime();
            axios.post("/api/todo/edit", value)
                .then(response => {
                    if (response.status === 200) {
                        Alert.success("已完成");
                        let data = response.data;
                        let todos = [];
                        this.state.todos.forEach(item => {
                            if (item.id === data.id)
                                todos.push(data);
                            else
                                todos.push(item);
                        })
                        this.setState({
                            todos
                        });
                    } else {
                        Alert.error("无法修改状态……");
                        console.log(response);
                    }
                })
                .catch(e => {
                    Alert.error("网络错误");
                    console.log(e);
                });
        } else {
            value.finished = false;
            value.finishTime = null;
            axios.post("/api/todo/edit", value)
                .then(response => {
                    if (response.status === 200) {
                        Alert.success("已取消");
                        let data = response.data;
                        let todos = [];
                        this.state.todos.forEach(item => {
                            if (item.id === data.id)
                                todos.push(data);
                            else
                                todos.push(item);
                        })
                        this.setState({
                            todos
                        });
                    } else {
                        Alert.error("无法修改状态……");
                        console.log(response);
                    }
                })
                .catch(e => {
                    Alert.error("网络错误");
                    console.log(e);
                });
        }
    }

    render() {
        return (
            <PanelGroup bordered style={{ width: "250px" }}>
                <Panel style={{ width: "250px", height: "175px", borderRadius: "0px", overflowY: "auto" }}>
                    {this.state.todos.map(todo => {
                        return (
                            <Checkbox value={todo} onChange={this.afterChangedTodoStatus}
                                style={{ borderBottom: "1px solid #ddd" }}>
                                <span className={todo.finished ? "finished-todo" : null}>{todo.content}</span>
                            </Checkbox>
                        )
                    })}
                </Panel>
                <Panel style={{ width: "250px", height: "75px", backgroundColor: "wheat", borderRadius: "0px" }}>
                    <Link to="/todo" style={{ fontSize: "20px", fontWeight: "bold", color: "#575757" }} >
                        To-Do
                    </Link>
                    <p style={{ marginTop: "5px" }}>点滴记录，生活不再盲目。</p>
                </Panel>
            </PanelGroup>
        )
    };
}

const TodoBlock = connect(store => { return { user: store.userReducer.user } })(Block);
export default TodoBlock;