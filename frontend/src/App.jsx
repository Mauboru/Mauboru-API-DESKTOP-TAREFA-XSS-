import { useEffect, useState } from 'react';
import './App.css';

// Funções para carregar e salvar mensagens
async function loadMessages(setMessages) {
    try {
        const res = await fetch('http://localhost:4000/messages', {
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
    const res = await fetch('http://localhost:4000/message', {
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

// Função para limpar todas as mensagens
async function clearMessages(setMessages) {
    try {
        const res = await fetch('http://localhost:4000/messages/clear', {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        setMessages([]); // Limpar as mensagens no estado
    } catch (ex) {
        console.error(ex);
        alert(ex.message);
    }
}


function App() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        loadMessages(setMessages);
    }, []);

    return (
        <main className="app-container">
            <header>
                <h1 className="title">Segurança de Sistemas -  XSS</h1>
            </header>
            <hr />
            <form
                className="message-form"
                onSubmit={async (ev) => {
                    ev.preventDefault();

                    await saveMessage(newMessage);
                    await loadMessages(setMessages);
                    setNewMessage(''); // Limpar o campo após envio
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

export default App;
