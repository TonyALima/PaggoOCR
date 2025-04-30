"use client"
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/components/sign-out";
import { MyDocuments, Document } from "@/components/my-documents";
import { MessageBubble } from "@/components/ui/message-bubble";
import { Session } from "next-auth";

// Define a type for messages
type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

const Chat = ({ session }: { session: Session }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! Anexe um documento para começar!", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [userDocuments, setUserDocuments] = useState<Document[]>([]); // Example documents
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isWaitingForResponse) {
      inputRef.current?.focus(); // Focus input after bot response
    }
  }, [isWaitingForResponse]);

  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        const response = await fetch("/api/chat/userDocuments", {
          credentials: "include",
        });
        if (response.ok) {
          const documents = await response.json();
          setUserDocuments(documents);
        } else {
          console.error("Failed to fetch user documents");
        }
      } catch (error) {
        console.error("Error fetching user documents:", error);
      }
    };

    fetchUserDocuments();
  }, [session]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || isWaitingForResponse) return;
  
    const userMessage = { id: messages.length + 1, text: newMessage, isUser: true };
    setMessages([...messages, userMessage]);
    setIsWaitingForResponse(true); // Block further messages
  
    try {
      const response = await fetch("/api/chat/message", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: JSON.stringify({ message: newMessage }),
      });
  
      const data = await response.json();
      const botMessage = { id: messages.length + 2, text: data.response, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsWaitingForResponse(false); // Allow new messages
      setNewMessage("");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const userMessage = { id: messages.length + 1, text: `📄 Documento enviado: ${file.name}`, isUser: true };
    setMessages([...messages, userMessage]);
    setIsWaitingForResponse(true); // Block further messages
  
    try {
      const response = await fetch("/api/chat/upload", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: JSON.stringify({ fileName: file.name }),
      });
  
      const data = await response.json();
      const botMessage = { id: messages.length + 2, text: data.response.messsage, isUser: false };
      const documentId = data.response.docId;
      setMessages((prev) => [...prev, botMessage]);
      setUserDocuments((prev) => [
        ...prev,
        { id: documentId, fileName: file.name },
      ]);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsWaitingForResponse(false); // Allow new messages
    }
  
    setFileUploaded(true); // Hide file input
  };

  const setDocHistory = async (
    history: [{ query: string; answer: string; timestamp: string }] | null,
    fileName: string
  ) => {
    if (!history) {
      setMessages([
        { id: 1, text: `📄 Documento selecionado: ${fileName}`, isUser: true },
      ]);
      return;
    }
    // order history by timestamp
    history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const fileMessage = `📄 Documento selecionado: ${fileName}`;
    history[0].query = fileMessage;
    const newMessages: Message[] = [];
    history.forEach((item) => {
      const userMessage: Message = { id: newMessages.length + 1, text: item.query, isUser: true };
      const botMessage: Message = { id: newMessages.length + 2, text: item.answer, isUser: false };
      newMessages.push(userMessage);
      newMessages.push(botMessage);
    });
    setMessages(newMessages);
  };

  const handleDocumentClick = async (document: Document) => {
    if (document.id === "0") {
      setMessages([
        { id: 1, text: "Olá! Anexe um documento para começar!", isUser: false },
      ]);
      setFileUploaded(false); // Show file input
      return;
    }

    const fetchDocumentHistory = async (): Promise<[{ query: string; answer: string; timestamp: string }]|null> => {
      try {
        const response = await fetch("/api/chat/history", {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: document.id }),
        });

        if (response.ok) {
          const history = await response.json();
          return history;
        } else {
          console.error("Failed to fetch document history");
          return null;
        }
      } catch (error) {
        console.error("Error fetching document history:", error);
        return null;
      }
    };

    setIsWaitingForResponse(true); // Block further messages

    const history = await fetchDocumentHistory();
    setDocHistory(history, document.fileName);

    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setFileUploaded(true); // Hide file input
    setIsWaitingForResponse(false); // Reset waiting state
  };

  return (
    <div className="w-[100%]">
      <div className="absolute top-4 left-4">
        <MyDocuments 
          documentNames={userDocuments} // Pass userDocuments to MyDocuments
          onDocumentClick={handleDocumentClick} 
        />
      </div>
      <div className="absolute top-4 right-4">
        <SignOut />
      </div>
      <div className="relative flex flex-col items-center p-4 mx-auto w-[70%]">
        <h1 className="text-center text-xl font-bold mb-4">Chat</h1>

        <div className="flex flex-col w-full h-[700px] bg-white border rounded-lg shadow-sm p-4 overflow-y-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} text={message.text} isUser={message.isUser} />
          ))}
          <div ref={messageEndRef} />
        </div>

        {!fileUploaded && (
          <div className="flex items-center w-full max-w-2xl mt-2 bg-white p-2 rounded-md">
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}
        <div className="flex items-center w-full max-w-2xl mt-4">
          <Input
            ref={inputRef} // Attach ref to input
            className="flex-1 mr-2"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && newMessage.trim() && fileUploaded && !isWaitingForResponse) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!fileUploaded || isWaitingForResponse} // Disable input until file is uploaded and no pending response
          />
          <Button 
            variant="default" 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || !fileUploaded || isWaitingForResponse} // Disable button if waiting for response
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Chat };
