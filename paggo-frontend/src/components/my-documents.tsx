"use client";
import { Button } from "@/components/ui/button";

export interface Document {
    id: string;
    fileName: string;
}

interface MyDocumentsProps {
    documentNames: Document[];
    onDocumentClick: (document: Document) => void;
}

const MyDocuments = ({ documentNames, onDocumentClick }: MyDocumentsProps) => {
    return (
        <div className="flex flex-col items-center bg-white p-4 rounded-md">
            <div className="mb-4">
                <h1 className="font-bold">Meus Documentos</h1>
            </div>
            <div className="flex flex-col gap-2">
                <Button variant="secondary" key={'0'} onClick={() => onDocumentClick({ id: '0', fileName: 'Novo Documento' })}>
                    Novo Documento
                </Button>
                {documentNames.map((doc) => (
                    <Button variant="secondary" key={doc.id} onClick={() => onDocumentClick(doc)}>
                        {doc.fileName}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export { MyDocuments };