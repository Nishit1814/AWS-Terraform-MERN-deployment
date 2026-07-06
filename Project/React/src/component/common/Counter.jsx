import React, { useCallback, useState } from "react";

const Child = React.memo(({ onClick }) => {
    console.log("Child rendered");
    return <button style={{ padding: "10px", border: "1px solid" }} onClick={onClick}>Click Me</button>;
});

export default function Counter() {
    const [count, setCount] = useState(0);

    // This function is recreated on every render
    const handleClick = useCallback(() => {
        console.log("Button clicked");
    },[]);

    return (
        <div style={{ background: "grey" }}>
            <p>Count: {count}</p>
            <button style={{ padding: "10px", border: "1px solid" }} onClick={() => setCount(count + 1)}>Increase</button>
            <Child onClick={handleClick} />
        </div>
    );
}
