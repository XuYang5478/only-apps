import React, { useState } from "react";
import { Button, Input, Nav, Panel, Sidenav, Affix, Modal, Alert, Tree, Dropdown } from "rsuite";
import { AiOutlineDelete, AiOutlineFolderAdd, AiOutlineMenu } from 'react-icons/ai';
import { CgRename} from 'react-icons/cg'
import axios from "axios";
import { connect } from "react-redux";

function CreateFolderModal(props) {
    let [name, setName] = useState('');

    const cancel_create = () => {
        props.open_modal(false);
        setName('');
    }

    const on_create = () => {
        axios.post("/api/note/create_dir", {
            userId: props.userId,
            name,
            current_dir: props.current_folder.id
        }).then(response => {
            if (response.status === 200) {
                props.onCreate(response.data);
                Alert.success("创建成功");
            } else {
                console.log("network error: " + response.status + " " + response.statusText);
                Alert.warning("创建失败，" + response.status + " " + response.statusText)
            }
        }).catch((e) => {
            console.error(e);
            Alert.error("创建失败");
        })
        cancel_create();
    }

    return (
        <Nav.Item eventKey="create_folder" icon={<AiOutlineFolderAdd size="1.5em" onClick={() => props.open_modal(true)} />}>
            <Modal show={props.open} onHide={cancel_create}>
                <Modal.Header>
                    <Modal.Title>新文件夹名称：</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input value={name} onChange={(value) => setName(value)} /> <br />
                    将会创建在：{props.current_folder.id == "-1" ? "/" : props.current_folder.name}
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" onClick={on_create} disabled={name == ""}>创建</Button>
                    <Button onClick={cancel_create} >取消</Button>
                </Modal.Footer>
            </Modal>
        </Nav.Item>
    )
}

function RenameFolderModal(props) {
    let [name, setName] = useState(props.current_folder.name);

    const cancel_rename = () => {
        props.open_modal(false);
        setName("");
    }

    const on_rename = () => {
        axios.post("/api/note/rename_dir", {
            id: props.current_folder.id,
            name,
            userId: props.userId
        }).then((response) => {
            if (response.status === 200) {
                Alert.success(`已重命名为"${name}"`);
                props.onRename(response.data);
                cancel_rename();
            } else {
                Alert.warning(`操作失败：${response.status} ${response.statusText}`);
            }
        }).catch(e => {
            Alert.warning(`操作失败!`);
            console.error(e);
        })
    }

    return (
        <Modal show={props.open} onHide={cancel_rename}>
            <Modal.Header>
                <Modal.Title>重命名：</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input value={name} onChange={(value)=>setName(value)}  />
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary" onClick={on_rename} disabled={name == ""}>确定</Button>
                <Button onClick={cancel_rename} >取消</Button>
            </Modal.Footer>
        </Modal>
    )
}

function DeleteFolderModal(props) {
    const cancel_delete = () => {
        props.open_modal(false);
    }

    const on_delete = () => {
        axios.post("/api/note/delete_dir", {
            userId: props.userId,
            id: props.current_folder.id
        }).then((response) => {
            if (response.status == 200) {
                Alert.success(`已删除“${props.current_folder.name}”`);
                props.onDelete(response.data);
                cancel_delete();
            } else {
                Alert.warning(`操作失败：${response.status} ${response.statusText}`);
            }
        }).catch(e => {
            Alert.warning(`操作失败!`);
            console.error(e);
        })
    }

    return (
        <Modal show={props.open} onHide={cancel_delete}>
            <Modal.Header>
                <Modal.Title>确认删除</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>确定删除{`“${props.current_folder.name}”`}及其中的子文件夹和笔记吗？</p>
                <p>删除之后无法恢复！</p>
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary" color="red" onClick={on_delete}>确定</Button>
                <Button onClick={cancel_delete} >取消</Button>
            </Modal.Footer>
        </Modal>
    )
}

class SideContent extends React.Component {

    state = {
        selected_menu: "folder",
        expand_folders: [], //展开的文件夹
        folder_record: null,//从根节点到所选文件夹的路径
        folders: [],
        create_folder_modal: false,
        rename_folder_modal: false,
        delete_folder_modal: false
    }
    
    open_create_modal = (open) => {
        this.setState({ create_folder_modal: open });
    }
    
    open_rename_modal = (open) => {
        this.setState({ rename_folder_modal: open });
    }
    
    open_delete_modal = (open) => {
        this.setState({ delete_folder_modal: open });
    }

    componentDidMount() {
        axios.get("/api/note/all_dirs?userId=" + this.props.user.id).then((response) => {
            if (response.status === 200) {
                this.update_folder_list(response.data);
            } else {
                console.log("network error: " + response.status + " " + response.statusText);
            }
        }).catch((e) => {
            console.error(e);
        })
    }

    process_folder = (folder) => {
        if (folder.children && folder.children.length > 0) {
            let children = [];
            folder.children.forEach((item) => children.push(this.process_folder(item)))
            folder.children = children;
        } else {
            folder.children = null;
        }
        return folder;
    }

    update_folder_list = (data) => {
        let folders = [{ id: "-1", name: "所有笔记" }];
        data.forEach(item => folders.push(this.process_folder(item)));
        this.setState({
            folders,
            create_folder_modal: false
        });
    }

    on_select_folder = (folder, value) => {
        let expand_folders = [...this.state.expand_folders];
        expand_folders.push(value);
        this.setState({
            expand_folders
        });
        this.props.on_select_folder(folder);
    }

    on_expand_folder = (expandItemValues, currentFolder) => {
        this.setState({
            expand_folders: expandItemValues,
        });
        this.props.on_select_folder(currentFolder);
    }

    render() {
        let folders = [{ id: 1, name: "Folder 1" }, { id: 2, name: "Folder 2" }, {
            id: 3,
            name: "Folder 3",
            children: [{ id: 4, name: "Child Folder 1" }, {
                id: 5, name: "Child Folder 2", children: [
                    { id: 10, name: "Child 2 Folder 1" }, { id: 11, name: "Child 2 Folder 2" }
                ]
            }, { id: 6, name: "Child Folder 3" }, { id: 7, name: "Child Folder 4" }]
        }, { id: 8, name: "Folder 4" }, { id: 9, name: "Folder 5" }];

        return (
            <Affix top={18}>
                <Panel shaded bodyFill style={{ backgroundColor: "whitesmoke", marginRight: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#eee" }}>
                        <Nav appearance="subtle" activeKey={this.state.selected_menu} onSelect={(eventKey) => this.setState({ selected_menu: eventKey })}>
                            <Nav.Item eventKey="folder">文件夹</Nav.Item>
                            <Nav.Item eventKey="catalog">目录</Nav.Item>
                        </Nav>
                        <Nav pullRight>
                            <CreateFolderModal current_folder={this.props.current_dir} open={this.state.create_folder_modal}
                                userId={this.props.user.id} open_modal={this.open_create_modal} onCreate={this.update_folder_list} />
                            
                            <Dropdown icon={<AiOutlineMenu size="1.5em" />} noCaret placement="bottomEnd" disabled={this.props.current_dir.id=="/"}>
                                <Dropdown.Item onSelect={()=>this.open_create_modal(true)}>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        {<AiOutlineFolderAdd />}
                                        <span>&nbsp;&nbsp;创建子文件夹</span>
                                    </div>
                                </Dropdown.Item>
                                
                                <Dropdown.Item onSelect={()=>this.open_rename_modal(true)}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <CgRename />
                                        <span>&nbsp;&nbsp;重命名</span>
                                    </div>
                                </Dropdown.Item>
                                <RenameFolderModal current_folder={this.props.current_dir} open={this.state.rename_folder_modal}
                                    userId={this.props.user.id} open_modal={this.open_rename_modal} onRename={this.update_folder_list} />
                                
                                <Dropdown.Item onSelect={()=>this.open_delete_modal(true)}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <AiOutlineDelete />
                                        <span>&nbsp;&nbsp;删除</span>
                                    </div>
                                </Dropdown.Item>
                                <DeleteFolderModal current_folder={this.props.current_dir} open={this.state.delete_folder_modal}
                                    userId={this.props.user.id} open_modal={this.open_delete_modal} onDelete={this.update_folder_list}/>
                            </Dropdown>
                        </Nav>
                    </div>

                    <Sidenav>
                        <Sidenav.Body>
                            <Tree data={this.state.folders} valueKey="id" labelKey="name" onSelect={this.on_select_folder} value={this.props.current_dir.id}
                                onExpand={this.on_expand_folder} expandItemValues={this.state.expand_folders}
                                style={{ maxHeight: "80%", backgroundColor: "#F5F5F5" }} />
                        </Sidenav.Body>
                    </Sidenav>
                </Panel>
            </Affix>
        );
    }
}

const SidePanel = SideContent;


export { SidePanel };