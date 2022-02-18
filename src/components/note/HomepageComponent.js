import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PanelGroup, Panel, Alert, List} from 'rsuite';

class Block extends React.Component {
    state = {
        notes: []
    }

    componentDidMount() {
        axios.get(`/api/note/recent_note?userId=${this.props.user.id}`).then(response => {
            if (response.status === 200) {
                this.setState({ notes: response.data });
            } else {
                Alert.error(`无法获得最新笔记列表：${response.status} ${response.statusText}`);
            }
        }).catch(e => { console.error("无法获得最新笔记列表", e)})
    }

    render() {
        return (
            <PanelGroup bordered style={{ width: "250px" }}>
                <Panel style={{ width: "250px", height: "175px", borderRadius: "0px", overflowY: "auto" }}>
                    <List hover size="sm">
                        {this.state.notes.map((item) => (
                            <List.Item key={item.id}>
                                <Link to={`/note/preview/${item.id}`}>
                                    <span style={{color: "#575757", paddingLeft: "2px"}}>{item.title}</span>
                                </Link>
                            </List.Item>
                        ))}
                    </List>
                </Panel>
                <Panel style={{ width: "250px", height: "75px", backgroundColor: "LightSkyBlue", borderRadius: "0px" }}>
                    <Link to="/note" style={{ fontSize: "20px", fontWeight: "bold", color: "#575757" }} >
                        Note
                    </Link>
                    <p style={{ marginTop: "5px" }}>归纳整理，沉淀专属智慧。</p>
                </Panel>
            </PanelGroup>
        );
    }
}

const NoteBlock = connect((store) => {
    return { user: store.userReducer.user }
})(Block);
export default NoteBlock;