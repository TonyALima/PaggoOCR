"use client"
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/components/sign-out";
import { MyDocuments, Document } from "@/components/my-documents";
import { Session } from "next-auth";

const Chat = ({ session }: { session: Session }) => {
  const [messages, setMessages] = useState([
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
    console.log("User session:", session);
    setUserDocuments([
      { id: "1", fileName: "documento1.pdf" },
      { id: "2", fileName: "documento2.pdf" },
      { id: "3", fileName: "documento3.pdf" },
    ]);
  }, [session]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || isWaitingForResponse) return;

    const userMessage = { id: messages.length + 1, text: newMessage, isUser: true };
    setMessages([...messages, userMessage]);
    setIsWaitingForResponse(true); // Block further messages

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Recebi sua mensagem. Em um sistema real, eu processaria isso.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsWaitingForResponse(false); // Allow new messages
    }, 1000);

    setNewMessage("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const userMessage = { id: messages.length + 1, text: `📄 Documento enviado: ${file.name}`, isUser: true };
    setMessages([...messages, userMessage]);
    setIsWaitingForResponse(true); // Block further messages

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Documento recebido. Em um sistema real, eu processaria isso.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsWaitingForResponse(false); // Allow new messages
    }, 1000);

    setFileUploaded(true); // Hide file input
  };

  const handleDocumentClick = (documentId: string) => {
    if (documentId === "0") {
      setMessages([
        { id: 1, text: "Olá! Anexe um documento para começar!", isUser: false },
      ]);
      setFileUploaded(false); // Show file input
      return;
    }
    setMessages([
      { id: 1, text: `📄 Documento selecionado: ${documentId}`, isUser: true },
      { id: 2, text: `Você selecionou o documento "${documentId}". Em um sistema real, eu processaria isso.`, isUser: false },
    ]);
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
      <div className="relative flex flex-col items-center p-4 mx-auto w-[60%]">
        <h1 className="text-center text-xl font-bold mb-4">Chat</h1>

        <div className="flex flex-col w-full max-w-2xl h-[600px] bg-white border rounded-lg shadow-sm p-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded-md inline-block max-w-[80%] ${message.isUser ? "bg-blue-100 text-right self-end" : "bg-gray-100 text-left self-start"
                }`}
            >
              {message.text}
            </div>
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
