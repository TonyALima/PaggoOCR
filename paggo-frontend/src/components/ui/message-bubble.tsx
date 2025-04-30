import ReactMarkdown from "react-markdown";

export const MessageBubble = ({
  text,
  isUser,
}: {
  text: string;
  isUser: boolean;
}) => {
  return (
    <div
      className={`mb-2 p-2 rounded-md inline-block max-w-[80%] ${
        isUser ? "bg-blue-100 text-right self-end" : "bg-gray-100 text-left self-start"
      }`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};
