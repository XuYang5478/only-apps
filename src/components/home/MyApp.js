import { Panel } from "rsuite";
import './stylesheet.css';
import TodoBlock from "../todo/HomepageComponent";
import CovidBlock from "../CovidTracker/HomePageBlock";

function MyApp(props) {
    return (
        <Panel shaded header={<h4>我的应用</h4>}>
            <div style={{display: "flex", flexWrap:"wrap"}}>
                <TodoBlock />
                <CovidBlock />
            </div>
        </Panel>
    );
}

export default MyApp;