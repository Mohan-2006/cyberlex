import React from 'react';

interface MarkdownMessageProps {
  content: string;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // Simple formatter to handle basic markdown-like syntax for better readability
  // In a real production app, use 'react-markdown' or 'rehype'
  
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Bold handling: **text**
      const boldParts = line.split(/(\*\*.*?\*\*)/g);
      
      const formattedLine = boldParts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-cyber-glow font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-cyber-accent mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3 border-b border-cyber-dim/30 pb-1">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 list-disc text-gray-300 mb-1">{formattedLine}</li>; // Nested formatting inside list
      }

      return <p key={index} className={`mb-2 leading-relaxed ${line.trim() === '' ? 'h-2' : ''}`}>{formattedLine}</p>;
    });
  };

  return (
    <div className="markdown-body font-sans text-sm md:text-base">
      {formatText(content)}
    </div>
  );
};

export default MarkdownMessage;