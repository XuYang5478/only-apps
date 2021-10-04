import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Button, Checkbox, FlexboxGrid, List, Modal, Input, Alert, Tag } from "rsuite";
import "./stylesheet.css";

function dateFormat(d) {
    let date = new Date(d);
    let month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return ` ${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
}

function AddTodoModal(props) {
    let [content, setContent] = useState("");
    let [open, setOpen] = useState(false);

    const onAddTodo = () => {
        axios.post("/api/todo/add", {
            userId: props.userId,
            content
        }).then(response => {
            if (response.status === 200) {
                Alert.success("添加成功");
                props.afterAdd(response.data);
            } else {
                Alert.error("添加失败");
            }
        }).catch(e => {
            Alert.error("网络错误");
        });
        setOpen(false);
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)} appearance="primary">添加</Button>

            <Modal show={open} onHide={() => { setOpen(false) }}>
                <Modal.Header>
                    <Modal.Title>添加待办：</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input componentClass="textarea" rows={6} onChange={(value) => { setContent(value) }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" onClick={onAddTodo}>添加</Button>
                    <Button onClick={() => { setOpen(false) }} >取消</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function EditTodoModal(props) {
    let [content, setContent] = useState(props.todo.content);
    let [open, setOpen] = useState(false);

    const onEditTodo = () => {
        let todo = props.todo;
        todo.content = content;
        axios.post("/api/todo/edit", todo).then(response => {
            if (response.status === 200) {
                Alert.success("修改成功");
                props.afterEdit(response.data);
            } else {
                Alert.error("修改失败");
            }
        }).catch(e => {
            Alert.error("网络错误");
        });
        setOpen(false);
    }

    return (
        <div style={{ display: "inline-block" }}>
            <Button onClick={() => setOpen(true)} appearance="link" color="blue" disabled={props.disable}>编辑</Button>

            <Modal show={open} onHide={() => { setOpen(false) }}>
                <Modal.Header>
                    <Modal.Title>编辑待办：</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input componentClass="textarea" rows={6} value={content} onChange={(value) => { setContent(value) }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" onClick={onEditTodo}>确定</Button>
                    <Button onClick={() => { setOpen(false) }} >取消</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function DeleteTodoModal(props) {
    let [open, setOpen] = useState(false);

    const deleteTodo = () => {
        axios.get("/api/todo/delete?id=" + props.todo.id)
            .then(response => {
                if (response.status === 200) {
                    props.afterDelete(props.todo.id);
                    Alert.success("删除成功");
                } else {
                    console.log(response);
                    Alert.error("删除失败");
                }
            }).catch(e => {
                console.log(e);
                Alert.error("网络错误");
            });
        setOpen(false);
    }

    return (
        <div style={{ display: "inline-block" }}>
            <Button appearance="link" color="red" onClick={() => setOpen(true)} > 删除 </Button>

            <Modal show={open} onHide={() => setOpen(false)}>
                <Modal.Header>
                    <Modal.Title>确认删除这项代办？</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.todo.finished ?
                        (<div>
                            <Tag color="green">已完成</Tag>
                            <span style={{ fontSize: "12px", color: "#aaa" }}>
                                {dateFormat(props.todo.finishTime)}
                            </span>
                        </div>) :
                        (<div>
                            <Tag color="orange">未完成</Tag>
                        </div>)}
                    <br />
                    <div style={{ textAlign: "justify" }}>
                        {props.todo.content}
                    </div>
                    <br />
                    <span style={{ fontSize: "12px", color: "#aaa" }}>
                        创建于{dateFormat(props.todo.createTime)}
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" color="red" onClick={deleteTodo}>删除</Button>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

class TodoContent extends React.Component {
    state = {
        todos: [],
        finished: []
    };

    componentDidMount() {
        if (!this.props.user)
            return;
        
        axios.get("/api/todo/all?userId=" + this.props.user.id)
            .then((response) => {
                if (response.status === 200) {
                    let data = response.data;
                    this.setState({
                        todos: data.filter((item) => !item.finished),
                        finished: data.filter((item) => item.finished)
                    });
                } else {
                    Alert.error("无法获取到数据");
                    console.log(response);
                }
            }).catch((e) => {
                Alert.error("无法获取到数据");
                console.log(e);
            });
    }

    afterAddTodo = (todo) => {
        this.setState({
            todos: [].concat(todo, this.state.todos)
        });
    };

    afterEditTodo = (todo) => {
        let position = this.state.todos.findIndex((item) => item.id === todo.id);
        if (position > 0) {
            let todos = [...this.state.todos];
            todos.splice(position, 1, todo);
            this.setState({
                todos
            });
        }

    }

    afterDeleteTodo = (id) => {
        this.setState({
            todos: this.state.todos.filter((todo) => todo.id !== id),
            finished: this.state.finished.filter((todo) => todo.id !== id)
        });
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
                        let finished = [...this.state.finished];
                        finished.unshift(data);

                        this.setState({
                            todos: this.state.todos.filter((todo) => todo.id !== data.id),
                            finished
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
                        let todos = [...this.state.todos];
                        todos.unshift(data);
                        this.setState({
                            todos,
                            finished: this.state.finished.filter((todo) => todo.id !== data.id)
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
        if (!this.props.user)
            return (<Redirect to="/" />);
        
        let todos = [...this.state.todos];
        todos.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
        let finished = [...this.state.finished];
        finished.sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime());
        //todo: 显示每条todo的创建和完成时间
        return (
            <div>
                <FlexboxGrid justify="center" style={{ marginBottom: "15px", marginTop:"20px" }}>
                    <FlexboxGrid.Item colspan={18}>
                        <FlexboxGrid align="middle">
                            <FlexboxGrid.Item colspan={21}>
                                <h3>{`有${this.state.todos.length}项代办未完成：`}</h3>
                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item colspan={3} style={{ textAlign: "center" }}>
                                <AddTodoModal userId={this.props.user.id} afterAdd={this.afterAddTodo} />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FlexboxGrid.Item>
                </FlexboxGrid>

                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={18}>
                        <List>

                            {todos.map((todo) => {
                                return (
                                    <List.Item key={todo.id}>
                                        <FlexboxGrid align="middle">
                                            <FlexboxGrid.Item colspan={21} style={{ textAlign: "justify" }}>
                                                <Checkbox value={todo} onChange={this.afterChangedTodoStatus}>
                                                    {todo.content}
                                                    <div style={{paddingTop: "10px", fontSize:"12px", color:"#aaa"}}>
                                                        创建于{dateFormat(todo.createTime)}
                                                    </div>
                                                </Checkbox>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item colspan={3} style={{ textAlign: "center" }}>
                                                <EditTodoModal todo={todo} afterEdit={this.afterEditTodo} />
                                                <DeleteTodoModal todo={todo} afterDelete={this.afterDeleteTodo} />
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                );
                            })}

                            {finished.map((todo) => {
                                return (
                                    <List.Item key={todo.id}>
                                        <FlexboxGrid align="middle">
                                            <FlexboxGrid.Item colspan={21} style={{ textAlign: "justify" }}>
                                                <Checkbox defaultChecked value={todo} onChange={this.afterChangedTodoStatus}>
                                                    <span className="finished-todo">{todo.content}</span>

                                                    <div style={{ paddingTop: "10px", fontSize: "12px", color: "#aaa" }}>
                                                        创建于{dateFormat(todo.createTime)}&nbsp;&nbsp;/&nbsp;&nbsp;完成于{dateFormat(todo.finishTime)}
                                                    </div>
                                                </Checkbox>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item colspan={3} style={{ textAlign: "center" }}>
                                                <EditTodoModal disable={true} todo={todo} afterEdit={this.afterEditTodo} />
                                                <DeleteTodoModal todo={todo} afterDelete={this.afterDeleteTodo} />
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                );
                            })}

                        </List>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}

const TodoPage = connect(
    (store) => {
        return { user: store.userReducer.user };
    }
)(TodoContent);

export default TodoPage;