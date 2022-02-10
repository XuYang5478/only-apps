import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { InputGroup, Input, Icon, Button, FlexboxGrid, List, Placeholder, SelectPicker, Alert } from "rsuite";


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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
            <Link to='editor/-1'>
                <Button appearance="primary" disabled={props.current_dir.id==-1} >新建笔记</Button>
            </Link>

        </div>
    );
}

class TitleList extends React.Component {

    state = {
        sort_by: "0",
        titles: []
    }

    componentDidMount() {
        this.update_titles();
    }

    change_sort_way = (way) => {
        this.setState({ sort_by: way });
    }

    update_titles = () => {
        axios.get("/api/note/all_notes?" + `userId=${this.props.userId}&dirId=${this.props.current_dir.id}`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ titles: response.data });
                    console.log(response.data);
                } else {
                    Alert.warning("无法刷新笔记列表：" + `${response.status} ${response.statusText}`);
                }
            }).catch((e) => { console.error("无法刷新笔记列表", e) })
    }

    render() {
        const { Paragraph } = Placeholder;
        let num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <div>
                <ListTopTool sort_by={this.state.sort_by} change_sort_way={this.change_sort_way}
                    current_dir={this.props.current_dir} />
                <FlexboxGrid style={{ padding: "12px" }}>
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
                </FlexboxGrid>
                <List hover style={{ paddingLeft: "12px" }}>
                    {num.map((item) => (<List.Item key={item}>
                        {/* <FlexboxGrid style={{ padding: "12px" }}>
                            <FlexboxGrid.Item colspan={18}> */}
                        <div style={{ padding: "12px 0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h3>{"Title " + item}</h3>
                                <div>
                                    <Button appearance="link">修改</Button>
                                    <Button appearance="link" color="red">删除</Button>
                                </div>
                            </div>

                            <Paragraph rows={3} active />
                            <span style={{ marginTop: '8px', color: 'grey' }}>更新于：{new Date().toLocaleDateString()}</span>
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