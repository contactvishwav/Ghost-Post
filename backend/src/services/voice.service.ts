import { Server as WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import logger from '../utils/logger';
import config from '../config';

export function setupVoiceRelay(server: Server) {
    const wss = new WebSocketServer({ server, path: '/api/voice/relay' });

    wss.on('connection', (clientWs: WebSocket) => {
        logger.info('Client connected to voice relay');

        if (!config.deepgram.apiKey) {
            logger.error('Deepgram API Key not configured');
            clientWs.send(JSON.stringify({ type: 'error', message: 'Deepgram API key not configured on server' }));
            clientWs.close();
            return;
        }

        // Connect to Deepgram
        const deepgramUrl = 'wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&model=nova-2&smart_format=true&interim_results=true';
        
        const deepgramWs = new WebSocket(deepgramUrl, {
            headers: {
                Authorization: `Token ${config.deepgram.apiKey}`,
            },
        });

        deepgramWs.on('open', () => {
            logger.info('Connected to Deepgram WebSocket');
            clientWs.send(JSON.stringify({ type: 'status', message: 'Ready' }));
        });

        deepgramWs.on('message', (data: any) => {
            // Forward Deepgram transcription back to client
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data.toString());
            }
        });

        deepgramWs.on('close', () => {
            logger.info('Deepgram WebSocket closed');
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.close();
            }
        });

        deepgramWs.on('error', (err: any) => {
            logger.error({ err }, 'Deepgram WebSocket error');
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'error', message: 'Deepgram connection error' }));
                clientWs.close();
            }
        });

        // Client -> Deepgram
        clientWs.on('message', (data: any) => {
            if (deepgramWs.readyState === WebSocket.OPEN) {
                deepgramWs.send(data);
            }
        });

        clientWs.on('close', () => {
            logger.info('Client disconnected from voice relay');
            if (deepgramWs.readyState === WebSocket.OPEN) {
                deepgramWs.send(JSON.stringify({ type: 'CloseStream' }));
            }
        });

        clientWs.on('error', (err: any) => {
            logger.error({ err }, 'Client WebSocket error');
            if (deepgramWs.readyState === WebSocket.OPEN) {
                deepgramWs.close();
            }
        });
    });
}
