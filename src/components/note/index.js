import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { FlexboxGrid, Alert } from "rsuite";
import { SidePanel } from "./SidePanel";
import { TitleList } from "./NoteList";
import { NoteEditor } from "./NoteEditor";
import { NotePreviewer } from "./NotePreview";



class NoteContent extends React.Component {

    state = {
        current_dir: { id: "-1", name: "所有笔记" },
        notes: []
    }

    componentDidMount() {
        this.update_notes();
    }

    on_select_folder = (folder) => {
        this.setState({ current_dir: folder });
        this.update_notes(folder);
    }

    update_notes = (folder) => {
        let url = "";
        if (folder == undefined) {
            url = "/api/note/all_notes?" + `userId=${this.props.user.id}&dirId=${this.state.current_dir.id}`;
        } else {
            url = "/api/note/all_notes?" + `userId=${this.props.user.id}&dirId=${folder.id}`
        }

        axios.get(url).then((response) => {
            if (response.status === 200) {
                this.setState({ notes: response.data });
                console.log(response.data);
            } else {
                Alert.warning("无法刷新笔记列表：" + `${response.status} ${response.statusText}`);
            }
        }).catch((e) => { console.error("无法刷新笔记列表", e) })
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
                                <Route path='/note/editor/:id'>
                                    <NoteEditor userId={this.props.user.id} current_dir={this.state.current_dir} />
                                </Route>

                                <Route path='/note/preview/:id'>
                                    <NotePreviewer userId={this.props.user.id} />
                                </Route>

                                <Route path='/note'>
                                    <TitleList notes={this.state.notes} userId={this.props.user.id} current_dir={this.state.current_dir}
                                        on_delete={this.update_notes} />
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