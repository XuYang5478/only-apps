import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputGroup, Input, Icon, Button, List, Placeholder, SelectPicker, Alert, Modal } from "rsuite";


function ListTopTool(props) {
    let sort_way = [
        {
            "label": "更新时间",
            "value": "0",
            "role": "Master"
        },
        {
            "label": "创建时间",
            "value": "1",
            "role": "Master"
        },
        {
            "label": "名称",
            "value": "2",
            "role": "Master"
        }];

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
                <InputGroup inside style={{ paddingLeft: "12px", marginRight: "24px", width: "300px", display: "inline-block" }}>
                    <Input placeholder="搜索笔记……" />
                    <InputGroup.Button>
                        <Icon icon="search" />
                    </InputGroup.Button>
                </InputGroup>

                <span>显示顺序：</span>

                <SelectPicker data={sort_way} appearance="subtle" searchable={false} cleanable={false}
                    value={props.sort_by} onChange={(value) => props.change_sort_way(value)} />
            </div>
            <Link to='/note/editor/-1'>
                <Button appearance="primary" disabled={props.current_dir.id==-1} >新建笔记</Button>
            </Link>

        </div>
    );
}

function DeleteModal(props) {
    const [open, setOpen] = useState(false);

    const delete_note = () => {
        let data = {
            userId: props.userId,
            dirId: props.dirId,
            noteId: props.noteId
        };
        axios.post("/api/note/delete_note", data)
            .then((response) => {
                if (response.status === 200) {
                    Alert.success("删除成功");
                    props.on_delete();
                } else {
                    Alert.error(`删除失败：${response.status} ${response.statusText}`);
                }
            }).catch(e => {
                console.error(e);
                Alert.error(`删除失败`);
            });
        setOpen(false);
    }

    return (
        <div style={{display: "inline-block"}}>
            <Button appearance="link" color="red" onClick={()=>setOpen(true)} disabled={props.dirId<0}>删除</Button>
            <Modal show={open} onHide={()=>setOpen(false)}>
                <Modal.Header>
                    <Modal.Title>确定删除吗？</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    删除之后无法恢复！
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => delete_note()} appearance="primary" color="red">
                        确定
                    </Button>
                    <Button onClick={() => setOpen(false)} >
                        取消
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

class TitleList extends React.Component {

    state = {
        sort_by: "0",
    }

    change_sort_way = (way) => {
        this.setState({ sort_by: way });
    }

    render() {
        const { Paragraph } = Placeholder;
        let num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <div>
                <ListTopTool sort_by={this.state.sort_by} change_sort_way={this.change_sort_way}
                    current_dir={this.props.current_dir} />
                {/* <FlexboxGrid style={{ padding: "12px" }}>
                    <FlexboxGrid.Item colspan={18}>
                        <Link to="preview/1">
                            <h3>应用随机过程</h3>
                        </Link>

                        <Paragraph rows={3} active />
                        <span style={{ marginTop: '8px', color: 'grey' }}>更新于：{new Date().toLocaleDateString()}</span>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={6}>
                        <Placeholder.Graph active />
                    </FlexboxGrid.Item>
                </FlexboxGrid> */}
                <List hover style={{ paddingLeft: "12px" }}>
                    {this.props.notes.map((item) => (<List.Item key={item.id}>
                        {/* <FlexboxGrid style={{ padding: "12px" }}>
                            <FlexboxGrid.Item colspan={18}> */}
                        <div style={{ padding: "12px 0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Link to={"/note/preview/"+item.id}>
                                    <h3>{item.title}</h3>
                                </Link>
                                <div>
                                    {/*TODO: 鼠标悬停上面才显示  */}
                                    <Link to={`/note/editor/${item.id}`}>
                                        <Button appearance="link">修改</Button>
                                    </Link>
                                    <DeleteModal userId={this.props.userId} dirId={this.props.current_dir.id} noteId={item.id}
                                        on_delete={this.props.on_delete} />
                                </div>
                            </div>

                            <p style={{overflow: "hidden", textOverflow: "ellipsis", lineHeight: "18px", maxHeight: "36px", margin: "8px 0"}}>
                                {item.content}
                            </p>

                            <span style={{ marginTop: '8px', color: 'grey' }}>更新于：{new Date(item.modified_time).toLocaleDateString()}</span>
                        </div>

                        {/* </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={6}>
                                <Placeholder.Graph active />
                            </FlexboxGrid.Item>
                        </FlexboxGrid> */}
                    </List.Item>)
                    )}
                </List>
            </div>

        );
    }
}

export { TitleList };