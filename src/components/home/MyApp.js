import { Link } from "react-router-dom";
import { Checkbox, Panel, PanelGroup } from "rsuite";
import './stylesheet.css';

function MyApp(props) {
    return (
        <Panel shaded header={<h4>我的应用</h4>}>
            <PanelGroup bordered style={{width: "250px"}}>
                <Panel style={{ width: "250px", height: "175px", borderRadius: "0px", overflowY: "auto" }}>
                    <Checkbox>todo 1: 点滴记录，生活不再盲目。</Checkbox>
                    <Checkbox>todo 2: 点滴记录，生活不再盲目。</Checkbox>
                    <Checkbox>todo 3: 点滴记录，生活不再盲目。</Checkbox>
                    <Checkbox>todo 4: 点滴记录，生活不再盲目。</Checkbox>
                    <Checkbox>todo 5: 点滴记录，生活不再盲目。</Checkbox>
                    <Checkbox>todo 6: 点滴记录，生活不再盲目。</Checkbox>
                </Panel>
                <Panel style={{ width: "250px", height: "75px", backgroundColor: "lightgrey", borderRadius: "0px"}}>
                    <Link to="/todo" style={{ fontSize: "20px", fontWeight: "bold", color: "#575757"}} >
                        To-Do
                    </Link>
                    <p style={{marginTop: "5px"}}>点滴记录，生活不再盲目。</p>
                </Panel>
            </PanelGroup>

        </Panel>
    );
}

export default MyApp;