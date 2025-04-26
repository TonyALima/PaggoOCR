import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styles from '@/styles/Chat.module.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  data: File;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! Anexe um documento para começar!", isUser: false, timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && attachments.length === 0) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsProcessing(true);
    
    // Check if this is the first user message and if it doesn't have attachments
    const isFirstUserMessage = !messages.some(m => m.isUser);
    
    // Simulate response (in a real app, this would call an API)
    setTimeout(() => {
      let responseText = "";
      
      if (isFirstUserMessage && attachments.length === 0) {
        responseText = "Para começar o processamento, preciso que você anexe um documento. Por favor, clique no botão de anexo e escolha um arquivo.";
      } else {
        responseText = `Recebi sua mensagem${attachments.length > 0 ? ' e ' + attachments.length + ' arquivo(s)' : ''}. Em um sistema real, eu processaria isso e responderia adequadamente.`;
      }
      
      const botResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setAttachments([]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newAttachments: FileAttachment[] = [];
    
    Array.from(files).forEach(file => {
      newAttachments.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data: file
      });
    });
    
    setAttachments([...attachments, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat - Paggo OCR</title>
        <meta name="description" content="Chat interface for Paggo OCR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.chatBox}>
          <h2>Chat</h2>
          
          {/* Messages area */}
          <div className={styles.messagesArea}>
            <ul className={styles.messagesList}>
              {messages.map((message) => (
                <li 
                  key={message.id} 
                  className={`${styles.messageItem} ${message.isUser ? styles.userMessage : styles.botMessage}`}
                >
                  <div className={styles.messageBubble}>
                    <div className={styles.messageText}>{message.text}</div>
                    <small className={styles.messageTime}>{message.timestamp.toLocaleTimeString()}</small>
                  </div>
                </li>
              ))}
              <div ref={messageEndRef} />
            </ul>
          </div>
          
          {/* Attachments area */}
          {attachments.length > 0 && (
            <div className={styles.attachmentsArea}>
              <h5 className={styles.attachmentsTitle}>Anexos:</h5>
              <div className={styles.attachmentsList}>
                {attachments.map((file, index) => (
                  <div 
                    key={index}
                    className={styles.attachmentItem}
                  >
                    <span>{`${file.name} (${Math.round(file.size / 1024)} KB)`}</span>
                    <button 
                      onClick={() => removeAttachment(index)}
                      className={styles.removeAttachmentButton}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className={styles.inputArea}>
            <button 
              className={styles.attachButton}
              onClick={() => fileInputRef.current?.click()}
            >
              📎
            </button>
            
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
            
            <textarea
              className={styles.messageInput}
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              rows={1}
            />
            
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={isProcessing || (newMessage.trim() === '' && attachments.length === 0)}
            >
              Enviar ➤
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
