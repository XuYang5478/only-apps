import { Panel } from "rsuite";
import './stylesheet.css';
import TodoBlock from "../todo/HomepageComponent";

function MyApp(props) {
    return (
        <Panel shaded header={<h4>我的应用</h4>}>
            <TodoBlock />
        </Panel>
    );
}

export default MyApp;