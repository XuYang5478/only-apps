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
        notes: [],
        note: { id: -1, title: "null", content: "" },
        sort_by: "0",
        side_panel_menu: "folder"
    }

    componentDidMount() {
        this.update_notes(this.state.current_dir);
    }

    on_select_folder = (folder) => {
        this.setState({ current_dir: folder});
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
                console.log(response.data);
                this.setState({ notes: response.data });
                this.on_sort("0");
            } else {
                Alert.warning("无法刷新笔记列表：" + `${response.status} ${response.statusText}`);
            }
        }).catch((e) => { console.error("无法刷新笔记列表", e) })
    }

    on_sort = (way) => {
        let notes = [...this.state.notes];
        switch (way) {
            case "0":
                notes.sort((a, b) => new Date(b.modified_time).getTime() - new Date(a.modified_time).getTime())
                break;
            case "1":
                notes.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
                break;
            case "2":
                notes.sort((a, b) => a.title.localeCompare(b.title))
                break;

            default:
                break;
        }
        this.setState({ sort_by: way, notes });
    }

    select_note = (note) => {
        this.setState({ note, side_panel_menu: "catalog" });
    }

    set_side_panel = (menu) => {
        this.setState({ side_panel_menu: menu });
    }

    search_notes = (keyword) => {
        let data = {
            userId: this.props.user.id,
            keyword
        };
        axios.post("/api/note/search_note", data).then(response => {
            if (response.status === 200) {
                console.log(response.data);
                this.setState({ notes: response.data, current_dir: { id: "-1", name: "所有笔记" } });
                this.on_sort("0");
            } else {
                Alert.warning("无法获得搜索结果：" + `${response.status} ${response.statusText}`);
            }
        }).catch((e) => { console.error("无法获得搜索结果", e) });
    }

    render() {
        return (
            <div>
                <div style={{ height: "18px" }}></div>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={5}>
                        <SidePanel user={this.props.user} current_dir={this.state.current_dir} on_select_folder={this.on_select_folder}
                            note={this.state.note} menu={this.state.side_panel_menu} set_menu={this.set_side_panel} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={17}>
                        <div style={{ paddingLeft: "14px" }}>
                            <Switch>
                                <Route path='/note/editor/:id'>
                                    <NoteEditor userId={this.props.user.id} current_dir={this.state.current_dir} set_menu={this.set_side_panel} />
                                </Route>

                                <Route path='/note/preview/:id'>
                                    <NotePreviewer userId={this.props.user.id} note={this.state.note} select_note={this.select_note} set_menu={this.set_side_panel} />
                                </Route>

                                <Route path='/note'>
                                    <TitleList notes={this.state.notes} userId={this.props.user.id} current_dir={this.state.current_dir}
                                        on_delete={this.update_notes} sort_by={this.state.sort_by} on_sort={this.on_sort} on_search={this.search_notes} />
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