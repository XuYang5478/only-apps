import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { PanelGroup, Panel, Checkbox, Alert } from 'rsuite';

class CovidBlock extends React.Component{
    render() {
        return (
            <PanelGroup bordered style={{ width: "250px", display: "inline-block", marginLeft:"16px" }}>
                <Panel style={{ width: "250px", height: "175px", borderRadius: "0px", overflowY: "auto" }}>
                    <h4>国内</h4>
                    今日确诊：38,956 <br/>
                    今日治愈：2,435
                    <h4>全球</h4>
                    今日确诊：38,956 <br/>
                    今日治愈：2,435
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