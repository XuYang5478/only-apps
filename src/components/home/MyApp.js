import { Panel } from "rsuite";
import './stylesheet.css';
import TodoBlock from "../todo/HomepageComponent";
import CovidBlock from "../CovidTracker/HomePageBlock";
import NoteBlock from "../note/HomepageComponent";

function MyApp(props) {
    return (
        <Panel shaded header={<h4>ζηεΊη¨</h4>}>
            <div style={{display: "flex", flexWrap:"wrap", justifyContent: "space-around"}}>
                <TodoBlock />
                <NoteBlock />
                <CovidBlock />
            </div>
        </Panel>
    );
}

export default MyApp;