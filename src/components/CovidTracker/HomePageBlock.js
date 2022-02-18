import React from "react";
import { Link } from "react-router-dom";
import { PanelGroup, Panel } from 'rsuite';
import axios from "axios";

class CovidBlock extends React.Component{

    state = {
        total: {
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
        }
    };

    componentDidMount() {
        axios.get("/api/covid/total").then(response => {
            if (response.status === 200) {
                this.setState({ total: response.data });
            } else {
                console.warn(response.statusText + " 无法获取total数据");
            }
        }).catch(e => {
            console.warn(e);
        })
    }

    render() {
        return (
            <PanelGroup bordered style={{ width: "250px"}}>
                <Panel style={{ width: "250px", height: "175px", borderRadius: "0px", overflowY: "auto" }}>
                    <h4>国内</h4>
                    <span style={{ color: "orange" }}>今日新增确诊：{Number(this.state.total.currentConfirmedIncr).toLocaleString()}</span> <br />
                    <span style={{ color: "#575757" }}>今日新增死亡：{Number(this.state.total.deadIncr).toLocaleString()}</span>
                    <h4 style={{marginTop:"7px"}}>全球</h4>
                    <span style={{ color: "orange" }}>今日新增确诊：{Number(this.state.total.globalStatistics.currentConfirmedIncr).toLocaleString()}</span> <br />
                    <span style={{ color: "#575757" }}>今日新增死亡：{Number(this.state.total.globalStatistics.deadIncr).toLocaleString()}</span>
                </Panel>
                <Panel style={{ width: "250px", height: "75px", backgroundColor: "lightpink", borderRadius: "0px" }}>
                    <Link to="/covid" style={{ fontSize: "20px", fontWeight: "bold", color: "#575757" }} >
                        新冠跟踪
                    </Link>
                    <p style={{ marginTop: "5px" }}>刻骨铭心，警钟长鸣</p>
                </Panel>
            </PanelGroup>
        );
    }
}

export default CovidBlock;