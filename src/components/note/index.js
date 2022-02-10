import { Edit, CheckOutline } from "@rsuite/icons/lib/icons";
import React, { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Breadcrumb, Button, Input, Dropdown, FlexboxGrid, List, Nav, Panel, Sidenav, Placeholder, Affix, IconButton, Modal, Alert, Tree } from "rsuite";
import Vditor from 'vditor';
import { SidePanel } from "./SidePanel";
import { TitleList } from "./NoteList";
import { connect } from "react-redux";


function DisplayTitle(props) {
    return (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <h3 style={{ display: "inline", marginRight: "8px" }}>文章标题</h3>
            <IconButton icon={<Edit />} size="sm" onClick={() => props.toDisplay(false)} />
        </div>
    )
}

function EditTitle(props) {
    return (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <Input value="文章标题" size="lg" style={{ marginRight: "8px" }} />
            <IconButton icon={<CheckOutline />} size="sm" onClick={() => props.toDisplay(true)} />
        </div>
    )
}

function EditorTop(props) {
    const [display, set_display] = useState(true);

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: '8px' }}>
            {display ? (<DisplayTitle toDisplay={(value) => set_display(value)} />) : (<EditTitle toDisplay={(value) => set_display(value)} />)}
            <Button appearance="primary" onClick={() => props.onSave()}>保存</Button>
        </div>
    )
}

class NoteEditor extends React.Component {
    state = {
        editor: null
    }

    onSave = () => {
        console.log(this.state.editor.getValue());
        this.props.history.push("/note/list");
    }

    componentDidMount() {
        const vditor = new Vditor('vditor', {
            height: 660,
            counter: {
                enable: true
            },
            outline: {
                enable: true,
                position: 'right'
            },
            after() {
                vditor.setValue('从**这里**开始书写 :)')
            }
        })
        this.setState({ editor: vditor });
    }

    render() {
        return (
            <div>
                <EditorTop onSave={() => this.onSave()} />
                <div id="vditor"></div>
            </div>
        );
    }
}

function PreviewerTop(props) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '8px' }}>
            <Link to="/note/list"><Button>返回</Button></Link>
            <h3>{props.note.title}</h3>
            <Link to={"/note/editor/" + props.note.id}><Button appearance="primary">编辑</Button></Link>
        </div>
    )
}

class NotePreviewer extends React.Component {

    componentDidMount() {
        let markdown = '*这是*预览';
        Vditor.preview(document.getElementById("note-content"), markdown, {
            speech: {
                enable: true,
            },
            anchor: 1,
        })
    }

    render() {
        let id = this.props.match.params.id;

        return (
            <div>
                <PreviewerTop note={{ id, title: "Title" + id }} />
                <div id="note-content"></div>
            </div>
        );
    }
}

class NoteContent extends React.Component {

    state = {
        current_dir: { id: "-1", name: "所有笔记" }
    }

    on_select_folder = (folder) => {
        this.setState({ current_dir: folder });
    }

    render() {
        return (
            <div>
                <div style={{ height: "18px" }}></div>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={5}>
                        <SidePanel user={this.props.user} current_dir={this.state.current_dir} on_select_folder={this.on_select_folder} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={17}>
                        <div style={{ paddingLeft: "14px" }}>
                            <Switch>
                                <Route path='/note'>
                                    <TitleList userId={this.props.user.id} current_dir={this.state.current_dir} />
                                </Route>
                                <Route path='/note/editor/:id' component={NoteEditor} />
                                <Route path='/note/preview/:id' component={NotePreviewer}>
                                </Route>
                            </Switch>
                        </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}

const NotePage = connect((store) => {
    return { user: store.userReducer.user }
})(NoteContent);

export default NotePage;