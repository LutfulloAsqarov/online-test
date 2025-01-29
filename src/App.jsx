import { useState } from "react";

import "./App.css";
import Test from "./components/test";
import TestComponent from "./components/test";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <TestComponent/>
        </>
    );
}

export default App;
