"use client";
import { Button } from "@/components/ui/button";

export interface Document {
    id: string;
    fileName: string;
}

interface MyDocumentsProps {
    documentNames: Document[];
    onDocumentClick: (documentId: string) => void;
}

const MyDocuments = ({ documentNames, onDocumentClick }: MyDocumentsProps) => {
    return (
        <div className="flex flex-col items-center bg-white p-4 rounded-md">
            <div className="mb-4">
                <h1 className="font-bold">Meus Documentos</h1>
            </div>
            <div className="flex flex-col gap-2">
                <Button variant="secondary" key={'0'} onClick={() => onDocumentClick('0')}>
                    Novo Documento
                </Button>
                {documentNames.map((doc) => (
                    <Button variant="secondary" key={doc.id} onClick={() => onDocumentClick(doc.id)}>
                        {doc.fileName}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export { MyDocuments };