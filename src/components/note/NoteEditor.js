import { Edit, CheckOutline } from "@rsuite/icons/lib/icons";
import axios from "axios";
import React, { useState } from "react";
import { Button, Input, IconButton, Alert, Divider } from "rsuite";
import Vditor from 'vditor';

function DisplayTitle(props) {
    return (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <h3 style={{ display: "inline", marginRight: "8px", marginLeft: "2px" }}>{props.header}</h3>
            <IconButton icon={<Edit />} size="sm" onClick={() => props.toDisplay(false)} />
        </div>
    )
}

function EditTitle(props) {
    return (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <Input value="文章标题" size="lg" style={{ marginRight: "8px" }} value={props.header} onChange={(value) => props.edit_header(value)} />
            <IconButton icon={<CheckOutline />} size="sm" onClick={() => props.toDisplay(true)} />
        </div>
    )
}

function EditorTop(props) {
    const [display, set_display] = useState(true);

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: '8px' }}>
            {display ? (<DisplayTitle toDisplay={(value) => set_display(value)} header={props.header} />)
                : (<EditTitle toDisplay={(value) => set_display(value)} header={props.header} edit_header={props.edit_header} />)}
            <div>
                <Button style={{marginRight: "14px"}} onClick={() => props.onCancel()}>取消</Button>
                <Button appearance="primary" onClick={() => props.onSave()}>保存</Button>
            </div>
            
        </div>
    )
}

class NoteEditor extends React.Component {
    state = {
        editor: null,
        header: "新建笔记",
        noteId: -1
    };

    componentDidMount() {
        let userId = this.props.userId;
        let noteId = Number(window.location.pathname.split("/").pop());
        let edit_header = this.edit_header;
        const vditor = new Vditor('vditor', {
            height: 660,
            counter: {
                enable: true,
                type: "text"
            },
            outline: {
                enable: true,
                position: 'right'
            },
            upload: {
                accept: 'image/*, .mp3, .wav, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .pdf, .zip, .rar',
                url: "/api/file/upload",
                filename(name) {
                    return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
                        replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
                        replace('/\\s/g', '')
                },
            },
            after() {
                if (noteId > 0) {
                    axios.get(`/api/note/get_note?userId=${userId}&noteId=${noteId}`)
                        .then(response => {
                            if (response.status === 200 && response.data != null) {
                                vditor.setValue(response.data.content);
                                edit_header(response.data.title);
                            } else {
                                vditor.setValue("从**这里**开始书写 :)")
                            }
                        })
                } else {
                    vditor.setValue("从**这里**开始书写 :)")                    
                }
            }
        })
        this.setState({ editor: vditor, noteId});
    }

    edit_header = (header) => {
        this.setState({ header });
    }

    onSave = () => {
        let note = {
            noteId: this.state.noteId,
            userId: this.props.userId,
            dirId: this.props.current_dir.id,
            header: this.state.header,
            content: this.state.editor.getValue()
        }

        axios.post("/api/note/add_note", note)
            .then((response) => {
                if (response.status == 200) {
                    if (response.data) {
                        Alert.success("保存成功");
                        window.location.href = "/note";
                    } else {
                        Alert.error("保存失败，请检查后重试。")
                }
                } else {
                    Alert.error(`保存失败：${response.status} ${response.statusText}`);
            }
            }).catch(e => {
                Alert.error(`保存失败，请检查网络设置。`);
                console.error(e);
        })
    }

    onCancel = () => {
        this.setState({
            editor: null,
            header: "新建笔记",
            noteId: -1
        });
        this.props.set_menu("folder");
        window.history.back();
    }

    render() {
        return (
            <div>
                <EditorTop onSave={this.onSave} onCancel={this.onCancel} header={this.state.header} edit_header={this.edit_header} />
                <div id="vditor"></div>
                <div style={{marginTop: "12px", textAlign: "center"}}>
                    Powered by <a href="https://b3log.org/vditor/">Vditor</a>.
                </div>
            </div>
        );
    }
}

export { NoteEditor };
