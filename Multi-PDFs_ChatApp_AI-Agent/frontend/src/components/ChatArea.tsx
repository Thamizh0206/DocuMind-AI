import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { askQuestion } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatAreaProps {
  isReady: boolean;
}

const ChatArea = ({ isReady }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !isReady) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await askQuestion(userMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: data.answer,
        },
      ]);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to get answer");
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, I encountered an error while processing your request.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="px-8 py-5 border-b border-border bg-card/50 backdrop-blur-sm">
        <h1 className="font-display text-2xl font-bold text-foreground">
          DocuMind AI 📚 — Chat Agent 🤖
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload PDFs and ask questions about their content
        </p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length === 0 ? (
          <EmptyState isReady={isReady} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-8 py-5 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isReady
                ? "Ask a question from your PDF files... ✍️📝"
                : "Upload and process PDFs first..."
            }
            disabled={!isReady}
            className="flex-1 px-5 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!isReady || !input.trim()}
            className="gradient-coral text-primary-foreground rounded-xl px-5 py-3 font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
};



const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full gradient-sage flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-accent-foreground" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-hidden ${isUser
          ? "gradient-coral text-chat-user-foreground rounded-br-md"
          : "bg-chat-bot text-chat-bot-foreground rounded-bl-md"
          }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
            li: ({ node, ...props }) => <li className="" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-1" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
            code: ({ node, ...props }) => <code className="bg-black/10 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
            pre: ({ node, ...props }) => <pre className="bg-black/10 p-2 rounded mb-2 overflow-x-auto text-xs" {...props} />,
            strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
            a: ({ node, ...props }) => <a className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-3 justify-start">
    <div className="w-8 h-8 rounded-full gradient-sage flex items-center justify-center shrink-0">
      <Bot className="w-4 h-4 text-accent-foreground" />
    </div>
    <div className="bg-chat-bot rounded-2xl rounded-bl-md px-4 py-3 flex gap-1 items-center">
      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

const EmptyState = ({ isReady }: { isReady: boolean }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 rounded-2xl gradient-sage flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-10 h-10 text-accent-foreground" />
      </div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">
        {isReady ? "Ready to chat!" : "Welcome! 👋"}
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {isReady
          ? "Your PDFs have been processed. Ask any question about the content and I'll find the answer for you."
          : "Upload your PDF files using the sidebar, then click \"Submit & Process\" to get started."}
      </p>
    </div>
  </div>
);

export default ChatArea;
