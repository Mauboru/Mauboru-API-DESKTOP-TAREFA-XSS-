import { useEffect, useState } from 'react';
// import DOMPurify from 'dompurify';
import './App.css';

const saveToken = (token) => localStorage.setItem('authToken', token);
const getToken = () => localStorage.getItem('authToken');

async function login(username, password, setLoggedIn) {
    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) throw new Error('Login falhou');

        const data = await res.json();
        saveToken(data.token);
        setLoggedIn(true);
    } catch (err) {
        alert(err.message);
    }
}

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (loggedIn) loadMessages(setMessages);
    }, [loggedIn]);

    if (!loggedIn) {
        return (
            <div className="login-container">
                <h2>Login</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        login(username, password, setLoggedIn);
                    }}
                >
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Entrar</button>
                </form>
            </div>
        );
    }

    return (
        <main className="app-container">
            <header>
                <h1>Segurança de Sistemas - XSS</h1>
            </header>
            <form
                className="message-form"
                onSubmit={async (e) => {
                    e.preventDefault();
                    await saveMessage(newMessage);
                    await loadMessages(setMessages);
                    setNewMessage('');
                }}
            >
                <textarea
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem aqui..."
                />
                <button className="submit-button" type="submit">
                    Enviar Mensagem
                </button>
            </form>
            <hr />
            <div className="messages-container">
                {messages.map((m) => (
                    <div key={m.id} className="message-card">
                        <div
                            className="message-content"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(m.messageHtml),
                            }}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}

export default App;