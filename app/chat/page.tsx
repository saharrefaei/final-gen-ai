"use client";
import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import { runGeminiAi } from "@/actions/gemini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatFeed, Message as ChatMessage } from "react-chat-ui";

// 1. Define the Message interface
interface Message {
  id: number;
  message: string;
}

export default function Contact() {
  // 2. Set up state variables
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 3. Create a ref for the last message container
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // const handleSubmit = () => {}

  // 4. Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim() === "") return;

    // 5. Add user message to chat
    const userMessage = new ChatMessage({
      id: 1, // User id is 1
      message,
    });
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 6. Clear input and show loading state
    setMessage("");
    setIsLoading(true);

    try {
      // 7. Call Gemini AI API
      const botResponse = await runGeminiAi(message);

      // 8. Add bot response to chat
      const botMessage = new ChatMessage({
        id: 0, // Bot id is 0
        message: botResponse ?? "No response",
      });
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error running Gemini AI:", error);
    } finally {
      // 9. Stop loading
      setIsLoading(false);
    }
  };

  // 10. Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // 11. Auto-scroll to the last message
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chat with AI Assistant</h1>

      {/* 12. Render chat messages */}
      <div className="chat-box mb-4 max-h-96 overflow-y-auto">
        <ChatFeed
          messages={messages}
          isTyping={isLoading}
          hasInputField={false}
          showSenderName={false}
          bubblesCentered={false}
        />

        {/* 13. Scroll anchor for the last message */}
        <div ref={lastMessageRef} />
      </div>

      {/* 14. Render input form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          className="flex-1"
          placeholder="Type your message..."
          value={message}
          onChange={handleInputChange}
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  );
}
