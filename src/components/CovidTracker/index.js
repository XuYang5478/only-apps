import axios from "axios";
import React from "react";
import { FlexboxGrid, Loader, Nav, Panel, Placeholder } from "rsuite";
import { Cell, Column, HeaderCell, Table } from "rsuite-table";
import Chart from 'chart.js/auto';

const titleDataStyle = {
    CONFIRMED: {
        color: "orange",
        marginBottom: "16px",
        marginTop: "8px",
        marginLeft: "8px"
    },
    CONFIRMED_INC: {
        color: "red",
        marginBottom: "16px",
        marginTop: "8px",
        marginLeft: "8px"
    },
    DEATH: {
        color: "black",
        marginBottom: "16px",
        marginTop: "8px",
        marginLeft: "8px"
    },
    SUSPECTED: {
        color: "red",
        marginBottom: "16px",
        marginTop: "8px",
        marginLeft: "8px"
    },
}

function TablePanel(props) {
    return (
        <Panel bordered bodyFill>
            <Table data={props.detail} autoHeight loading={props.loading}>
                {props.area === "China" ? (
                    <Column flexGrow={1}>
                        <HeaderCell>省份</HeaderCell>
                        <Cell dataKey="provinceName" />
                    </Column>) : (
                    <Column flexGrow={1}>
                        <HeaderCell>国家</HeaderCell>
                        <Cell dataKey="countryName" />
                    </Column>)}
                <Column flexGrow={1}>
                    <HeaderCell>现存确诊</HeaderCell>
                    <Cell dataKey="currentConfirmedCount" />
                </Column>
                <Column flexGrow={1}>
                    <HeaderCell>境外输入</HeaderCell>
                    <Cell dataKey="suspectedCount" />
                </Column>
                <Column flexGrow={1}>
                    <HeaderCell>累计死亡</HeaderCell>
                    <Cell dataKey="deadCount" />
                </Column>
                <Column flexGrow={1}>
                    <HeaderCell>累计痊愈</HeaderCell>
                    <Cell dataKey="curedCount" />
                </Column>
            </Table>
        </Panel>
    );
}

class ChinaPanel extends React.Component {
    state = {
        detail: [/* {
            "locationId": 110000,
            "continentName": "亚洲",
            "continentEnglishName": "Asia",
            "countryName": "中国",
            "countryEnglishName": "China",
            "countryFullName": null,
            "provinceName": "北京市",
            "provinceEnglishName": "Beijing",
            "provinceShortName": "北京",
            "currentConfirmedCount": 9,
            "confirmedCount": 1191,
            "suspectedCount": 164,
            "curedCount": 1173,
            "deadCount": 9,
            "comment": "北京卫健委未明确大部分治愈与死亡病例的分区归属，因此北京市下辖分区的现存确诊暂无法获取。",
            "updateTime": "2021-11-30T01:04:40.370+00:00",
            } */],
        detail_loading: true
    }

    componentDidMount() {
        axios.get("/api/covid/China_detail").then(response => {
            if (response.status === 200) {
                let data = response.data;
                this.setState({ detail: data, detail_loading: false });
                this.drawChart(data);
            } else {
                console.warn(response.statusText + " 无法获取China detail数据");
            }
        }).catch(e => {
            console.warn(e);
        });
    }

    drawChart(raw_data) {
        let data = [...raw_data].sort((a, b) => b.currentConfirmedCount - a.currentConfirmedCount);
        let labels = data.map(item => item.provinceName);
        let confirmed_data = data.map(item => item.currentConfirmedCount);
        let suspected_data = data.map(item => item.suspectedCount);
        let config = {
            data: {
                labels: labels,
                datasets: [{
                    type: "bar",
                    label: "当前确诊人数",
                    data: confirmed_data,
                    backgroundColor: "#59afff",
                    borderColor: "#3498FF",
                    order: 2
                }, {
                    type: "line",
                    label: "境外输入",
                    data: suspected_data,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    order: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
        const DataChart = new Chart(document.getElementById("ChinaDataChart"), config);
    }

    render() {
        let { Paragraph } = Placeholder;
        return (
            <div>
                <Panel bordered shaded style={{ marginTop: "18px", marginBottom: "18px", backgroundColor: "whitesmoke" }}>
                    {this.state.detail_loading ? (
                        <Paragraph rows={14}>
                            <Loader backdrop content="loading..." />
                        </Paragraph>
                    ) : (
                        <FlexboxGrid align="middle">
                            <FlexboxGrid.Item colspan={6}>
                                <div>
                                    <div style={titleDataStyle.CONFIRMED}>
                                        <h3>现存确诊：{Number(this.props.total_data.currentConfirmedCount).toLocaleString()}</h3>
                                        <span>&nbsp;昨日增加：{Number(this.props.total_data.currentConfirmedIncr).toLocaleString()}</span>
                                    </div>
                                    <div style={titleDataStyle.DEATH}>
                                        <h3>累计死亡：{Number(this.props.total_data.deadCount).toLocaleString()}</h3>
                                        <span>&nbsp;昨日增加：{Number(this.props.total_data.deadIncr).toLocaleString()}</span>
                                    </div>
                                    <div style={titleDataStyle.SUSPECTED}>
                                        <h3>境外输入：{Number(this.props.total_data.suspectedCount).toLocaleString()}</h3>
                                        <span>&nbsp;昨日增加：{Number(this.props.total_data.suspectedIncr).toLocaleString()}</span>
                                    </div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={18}>
                                <div>
                                    <canvas id="ChinaDataChart"></canvas>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                    )}
                </Panel>

                <TablePanel loading={this.state.detail_loading} detail={this.state.detail} area="China" />
            </div>
        );
    }
}

class GlobalPanel extends React.Component {
    state = {
        detail: [/* {
            "locationId": 0,
            "continentName": "非洲",
            "continentEnglishName": "Africa",
            "countryName": "赞比亚共和国",
            "countryEnglishName": null,
            "countryFullName": "The Republic of Zambia",
            "provinceName": "赞比亚共和国",
            "provinceEnglishName": null,
            "provinceShortName": "赞比亚共和国",
            "currentConfirmedCount": 84,
            "confirmedCount": 210143,
            "suspectedCount": 0,
            "curedCount": 206392,
            "deadCount": 3667,
            "comment": "",
            "updateTime": "2021-11-30T12:50:01.979+00:00",
            "cities": []
    }*/],
        detail_loading: true
    }

    componentDidMount() {
        axios.get("/api/covid/global_detail").then(response => {
            if (response.status === 200) {
                let data = response.data;
                this.setState({ detail: data, detail_loading: false });
                this.drawChart(data);
            } else {
                console.warn(response.statusText + " 无法获取global_detail数据");
            }
        }).catch(e => {
            console.warn(e);
        });
    }

    drawChart(raw_data) {
        let data = [...raw_data].sort((a, b) => b.currentConfirmedCount - a.currentConfirmedCount).slice(0, 35);
        let labels = data.map(item => item.provinceName);
        let confirmed_data = data.map(item => item.currentConfirmedCount);
        let dead_data = data.map(item => item.deadCount);
        let config = {
            data: {
                labels: labels,
                datasets: [{
                    type: "bar",
                    label: "当前确诊人数",
                    data: confirmed_data,
                    backgroundColor: "#59afff",
                    borderColor: "#3498FF",
                    order: 2
                }, {
                    type: "line",
                    label: "累计死亡人数",
                    data: dead_data,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    order: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
        const DataChart = new Chart(document.getElementById("GlobalDataChart"), config);
    }

    render() {
        let { Paragraph } = Placeholder;
        return (
            <div>
                <Panel bordered shaded style={{ marginTop: "18px", marginBottom: "18px", backgroundColor: "whitesmoke" }}>
                    {this.state.detail_loading ? (
                        <Paragraph rows={14}>
                            <Loader backdrop content="loading..." />
                        </Paragraph>
                    ) : (
                        <FlexboxGrid align="middle">
                            <FlexboxGrid.Item colspan={6}>
                                <div>
                                    <h3 style={titleDataStyle.CONFIRMED}>现存确诊：{Number(this.props.total_data.currentConfirmedCount).toLocaleString()}</h3>
                                    <h3 style={titleDataStyle.CONFIRMED_INC}>新增确诊：{Number(this.props.total_data.currentConfirmedIncr).toLocaleString()}</h3>
                                    <div style={titleDataStyle.DEATH}>
                                        <h3>累计死亡：{Number(this.props.total_data.deadCount).toLocaleString()}</h3>
                                        <span>&nbsp;昨日新增：{Number(this.props.total_data.deadIncr).toLocaleString()}</span>
                                    </div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={18}>
                                <div>
                                    <canvas id="GlobalDataChart"></canvas>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    )}
                </Panel>

                <TablePanel loading={this.state.detail_loading} detail={this.state.detail} area="global" />
            </div>
        );
    }
}

class Covid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            area: "China",
            total_data: {
                "currentConfirmedCount": 2913,
                "currentConfirmedIncr": 47,
                "confirmedCount": 127859,
                "confirmedIncr": 95,
                "suspectedCount": 10169,
                "suspectedIncr": 18,
                "curedCount": 119249,
                "curedIncr": 48,
                "deadCount": 5697,
                "deadIncr": 0,
                "seriousCount": 462,
                "seriousIncr": 6,
                "updateTime": 1638288074150,
                "globalStatistics": {
                    "currentConfirmedCount": 44699530,
                    "confirmedCount": 262996482,
                    "curedCount": 213077366,
                    "deadCount": 5219586,
                    "currentConfirmedIncr": 242187,
                    "confirmedIncr": 769996,
                    "curedIncr": 517702,
                    "deadIncr": 10107,
                    "yesterdayConfirmedCountIncr": 0
                }
            },
        };
    }

    componentDidMount() {
        axios.get("/api/covid/total").then((response) => {
            if (response.status === 200) {
                this.setState({ total_data: response.data, total_loading: false });
            } else {
                console.warn("无法加载total数据。" + response.statusText);
            }
        }).catch((e) => {
            console.error(e);
        })
    }

    render() {
        return (
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={18}>
                    <div style={{ height: "16px" }}></div>
                    <Nav appearance="tabs" activeKey={this.state.area} onSelect={(area) => this.setState({ area })} >
                        <Nav.Item eventKey="China">国内</Nav.Item>
                        <Nav.Item eventKey="Global">全球</Nav.Item>
                    </Nav>

                    {this.state.area === "China" ?
                        <ChinaPanel total_data={this.state.total_data} /> :
                        <GlobalPanel total_data={this.state.total_data.globalStatistics} />}

                    <div style={{ marginTop: "16px", marginBottom: "8px", color: "gray" }}>
                        更新时间：{new Date(this.state.total_data.updateTime).toLocaleString()} <br />
                        数据来源：<a href="https://ncov.dxy.cn/ncovh5/view/pneumonia">全球新冠肺炎疫情地图 - 丁香园·丁香医生</a> <br />
                        Powered By：<a href="https://lab.isaaclin.cn/nCoV/">BlankerL/DXY-COVID-19-Crawler</a>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        );
    }
}

const CovidPage = Covid;
export default CovidPage;