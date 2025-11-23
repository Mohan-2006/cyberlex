import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from '../types';
import { geminiService } from '../services/geminiService';
import MarkdownMessage from './MarkdownMessage';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "**Welcome to CyberLex.** \n\nI am your automated cyber law consultant. You can ask me about:\n- Data Breach Reporting Protocols\n- GDPR & CCPA Compliance\n- Computer Fraud and Abuse Act\n- Intellectual Property in AI\n\n*Note: I am an AI, not a human attorney. My advice is for informational purposes only.*",
      sender: Sender.BOT,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: Sender.USER,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    // Mapping internal types to Gemini format is simplified here for the example
    const history = messages
      .filter(m => m.sender !== Sender.SYSTEM) // Filter out system msgs if any
      .map(m => ({
        role: m.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    // Add current user message to history context for the API call
    history.push({ role: 'user', parts: [{ text: userMsg.text }] });

    const botMsgId = (Date.now() + 1).toString();
    const initialBotMsg: Message = {
      id: botMsgId,
      text: '',
      sender: Sender.BOT,
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialBotMsg]);

    try {
      let accumulatedText = '';
      const stream = geminiService.streamChatResponse(history.slice(0, -1), userMsg.text); // Slice to match method signature expectations if necessary, or just pass history.

      for await (const chunk of stream) {
        accumulatedText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: accumulatedText }
            : msg
        ));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, text: "**System Error:** Unable to connect to legal database. Please try again." }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-cyber-darker/50">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-lg relative ${
                msg.sender === Sender.USER
                  ? 'bg-blue-700/80 text-white rounded-br-none border border-blue-500/30'
                  : 'glass-panel text-slate-200 rounded-bl-none border border-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 opacity-70 border-b border-white/10 pb-1">
                 <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                    {msg.sender === Sender.USER ? 'YOU' : 'CYBERLEX AI'}
                 </span>
                 <span className="text-[10px] ml-auto">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <MarkdownMessage content={msg.text} />
              {msg.isStreaming && (
                <span className="inline-block w-2 h-2 bg-cyber-accent rounded-full animate-pulse ml-2 mt-1"></span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-cyber-darker border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-700 focus-within:border-cyber-accent/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your legal query here..."
            rows={1}
            className="w-full bg-transparent text-slate-200 p-3 outline-none resize-none font-sans min-h-[50px] max-h-[150px]"
            style={{ height: 'auto', overflow: 'hidden' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="mb-1 p-3 rounded-lg bg-cyber-accent text-cyber-darker font-bold hover:bg-cyber-glow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-2">
          AI generated content may be inaccurate. Consult a human lawyer for professional advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;