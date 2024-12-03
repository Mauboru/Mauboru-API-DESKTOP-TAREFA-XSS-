import { useState, useEffect } from 'react';
import './App.css';

async function login(email, senha, setLoggedIn) {
    try {
        const res = await fetch('http://localhost:3000/fazerLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        if (res.status === 404) throw new Error('Login falhou');
        else { setLoggedIn(true); }
    } catch (err) {
        alert(err.message);
    }
}

async function loadMessages(setMessages) {
    try {
        const res = await fetch('http://localhost:3000/messages', {
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        const json = await res.json();
        setMessages(json.messages);
    } catch (ex) {
        console.error(ex);
        alert(ex.message);
    }
}

async function saveMessage(newMessage) {
    const res = await fetch('http://localhost:3000/message', {
        method: 'POST',
        body: JSON.stringify({ message: newMessage }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
    }
}

async function clearMessages(setMessages) {
    try {
        const res = await fetch('http://localhost:3000/messages/clear', {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        setMessages([]);
    } catch (ex) {
        console.error(ex);
        alert(ex.message);
    }
}

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (loggedIn) {
            loadMessages(setMessages);
        }
    }, [loggedIn]);

    if (!loggedIn) {
        return (
            <div className="login-container">
                <h2 className="title">Login</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        login(username, password, setLoggedIn);
                    }}
                    className="message-form"
                >
                    <input
                        type="email"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="message-input"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="message-input"
                    />
                    <button className="submit-button" type="submit">
                        Entrar
                    </button>
                </form>
            </div>
        );
    } else {
        return (
            <main className="app-container">
                <header>
                    <h1 className="title">Segurança de Sistemas - XSS</h1>
                </header>
                <hr />
                <form
                    className="message-form"
                    onSubmit={async (ev) => {
                        ev.preventDefault();

                        await saveMessage(newMessage);
                        await loadMessages(setMessages);
                        
                        setNewMessage(''); 
                    }}
                >
                    <textarea
                        className="message-input"
                        value={newMessage}
                        onChange={(ev) => setNewMessage(ev.nativeEvent.target.value)}
                        placeholder="Digite sua mensagem aqui..."
                    />
                    <button className="submit-button" type="submit">
                        Enviar Mensagem
                    </button>
                    {/* Botão para limpar todas as mensagens */}
                    <button className="clear-button" onClick={() => clearMessages(setMessages)}>
                        Limpar Todas as Mensagens
                    </button>
                </form>
                <hr />
                <div className="messages-container">
                    {messages.map((m) => (
                        <div key={m.id} className="message-card">
                            <div
                                className="message-content"
                                dangerouslySetInnerHTML={{ __html: m.messageHtml }}
                            />
                        </div>
                    ))}
                </div>
            </main>
        );
    }
}

export default App;