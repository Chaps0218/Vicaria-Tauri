import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const CheckUsername = () => {
    const [input, setInput] = useState('');
    const [count, setCount] = useState(null);

    const handleCheckUsername = async () => {
        try {
            const response = await invoke('check_username', { input: input });
            setCount(response);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleCheckUsername}>Check Username</button>
            {count !== null && <p>Count: {count}</p>}
        </div>
    );
};

export default CheckUsername;
