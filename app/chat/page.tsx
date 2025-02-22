// "use client";
// import React, {
//   useState,
//   useRef,
//   useEffect,
//   FormEvent,
//   ChangeEvent,
// } from "react";
// import { runGeminiAi } from "@/actions/gemini";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ChatFeed, Message as ChatMessage } from "react-chat-ui";

// interface Message {
//   id: number;
//   message: string;
// }

// export default function Contact() {
//   const [message, setMessage] = useState<string>("");
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const lastMessageRef = useRef<HTMLDivElement>(null);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (message.trim() === "") return;

//     const userMessage = new ChatMessage({
//       id: 1,
//       message,
//     });
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     setMessage("");
//     setIsLoading(true);

//     try {
//       const botResponse = await runGeminiAi(message);

//       const botMessage = new ChatMessage({
//         id: 0,
//         message: botResponse ?? "No response",
//       });
//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Error running Gemini AI:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setMessage(e.target.value);
//   };

//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   return (
//     <div className="max-w-lg mx-auto p-6">
//       <h1 className="text-2xl text-center font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent  bg-clip-text animate-[pulse_3s_ease-in-out_infinite]">
   
//         Chat with AI Assistant
//       </h1>

//       <div className="chat-box mb-4 max-h-96 overflow-y-auto">
//         <ChatFeed
//           messages={messages}
//           isTyping={isLoading}
//           hasInputField={false}
//           showSenderName={false}
//           bubblesCentered={false}
//         />

//         <div ref={lastMessageRef} />
//       </div>

//       <form onSubmit={handleSubmit} className="flex space-x-2">
//         <Input
//           className="flex-1"
//           placeholder="Type your message..."
//           value={message}
//           onChange={handleInputChange}
//         />
//         <Button type="submit" disabled={isLoading}>
//           Send
//         </Button>
//       </form>
//     </div>
//   );
// }
