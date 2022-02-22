import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Divider } from "rsuite";
import Vditor from 'vditor/dist/method.min';

function PreviewerTop(props) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '16px' }}>
            <Link to="/note"><Button onClick={()=>{props.set_menu("folder")}}>返回</Button></Link>
            <h3>{props.note.title}</h3>
            <Link to={"/note/editor/" + props.note.id}><Button appearance="primary" onClick={() => { props.set_menu("folder") }}>编辑</Button></Link>
        </div>
    )
}

class NotePreviewer extends React.Component {
    componentDidMount() {
        let noteId = Number(window.location.pathname.split("/").pop());
        axios.get(`/api/note/get_note?userId=${this.props.userId}&noteId=${noteId}`)
            .then(response => {
                if (response.status === 200) {
                    if (response.data != null) {
                        this.props.select_note(response.data)
                        Vditor.preview(document.getElementById("note-content"), response.data.content, {
                            hljs: {
                                lineNumber: true
                            },
                            math: {
                                inlineDigit: true
                            },
                            speech: {
                                enable: true,
                            },
                            anchor: 1,
                        })
                    } else {
                        console.warn(response);
                        this.setState({ note: { id: -1, title: "null" } });
                }
                } else {
                    Alert.error(`无法获取笔记：${response.status} ${response.statusText}`);
                    window.history.back();
            }
            }).catch(e => {
                Alert.error(`无法获取笔记，请检查网络设置。`);
                console.error(e);
        })
        
    }

    render() {
        return (
            <div>
                <PreviewerTop note={this.props.note} set_menu={this.props.set_menu} />
                <div id="note-content"></div>
                <Divider>
                    Powered by <a href="https://b3log.org/vditor/">Vditor</a>.
                </Divider>
            </div>
        );
    }
}

export { NotePreviewer };