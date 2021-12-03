import React from "react";
import { Link } from "react-router-dom";
import { PanelGroup, Panel} from 'rsuite';

class Block extends React.Component {
    render() {
        return (
            <PanelGroup bordered style={{ width: "250px" }}>
                <Panel style={{ width: "250px", height: "175px", borderRadius: "0px", overflowY: "auto" }}>
                    <p>这是一条笔记</p>
                    <p>这是一条笔记</p>
                    <p>这是一条笔记</p>
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

const NoteBlock = Block;
export default NoteBlock;