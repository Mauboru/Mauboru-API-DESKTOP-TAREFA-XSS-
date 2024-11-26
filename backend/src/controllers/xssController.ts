import { Request, Response } from 'express';

const messagesDb: { id: number, messageHtml: string }[] = [];

// Rota para listar todas as mensagens
export const listarMensagens = (req: Request, res: Response) => {
    console.log('Requisição recebida para listar mensagens.');
    
    if (messagesDb.length === 0) {
        console.log('Nenhuma mensagem encontrada na base de dados.');
    } else {
        console.log(`Número de mensagens encontradas: ${messagesDb.length}`);
    }

    res.status(200).json({ messages: messagesDb });
}

// Rota para adicionar uma nova mensagem
export const adicionarMensagem = (req: Request, res: Response) => {
    const { message } = req.body;
    
    console.log('Requisição recebida para adicionar mensagem.');
    console.log('Mensagem recebida:', message);

    if (message) {
        messagesDb.push({
            id: new Date().getTime(),
            messageHtml: message
        });

        console.log('Mensagem adicionada com sucesso!');
        console.log('Total de mensagens na base de dados:', messagesDb.length);

        return res.status(200).json({ ok: true });
    } else {
        console.log('Erro: mensagem não recebida.');
        return res.status(400).json({ error: 'Mensagem não recebida.' });
    }
}

// Rota para excluir todas as mensagens
export const excluirMensagens = (req: Request, res: Response) => {
    console.log('Requisição recebida para excluir todas as mensagens.');
    console.log('Número de mensagens antes da exclusão:', messagesDb.length);

    messagesDb.length = 0; // Limpa todas as mensagens

    console.log('Todas as mensagens foram excluídas.');
    console.log('Número de mensagens após a exclusão:', messagesDb.length);

    return res.status(200).json({ message: 'Todas as mensagens foram removidas.' });
}


// Rota para simular o roubo de um token
export const rouboToken = (req: Request, res: Response) => {
    const token = req.query.token;

    if (token) {
        console.log(`Token recebido: ${token}`);
        
        // Simulando o armazenamento do token roubado (apenas para fins de exemplo)
        console.log(`Token foi "roubado" e armazenado na aplicação: ${token}`);

        return res.status(200).json({ message: 'Token "roubado" registrado com sucesso.' });
    } else {
        console.log('Erro: Nenhum token foi fornecido.');
        return res.status(400).json({ error: 'Token não encontrado na requisição.' });
    }
}