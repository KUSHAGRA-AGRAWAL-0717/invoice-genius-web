import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, X } from "lucide-react";
import { Document } from "@/types/document";

interface AIAssistantProps {
  document: Document;
  onFieldUpdate: (fieldKey: string, value: any) => void;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: string;
}

const AIAssistant = ({ document, onFieldUpdate, onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm here to help you review and correct the OCR data for ${document.name}. I can help clarify field values, suggest corrections, or auto-fill missing information. What would you like assistance with?`,
      type: 'assistant',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      type: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Mock AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, document);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        type: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (message: string, doc: Document) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('vendor') || lowerMessage.includes('company')) {
      return `Based on the document, I can see the vendor name appears to be "${doc.ocrData.vendor_name}". This looks correct based on typical invoice formats. Would you like me to suggest any corrections?`;
    }
    
    if (lowerMessage.includes('amount') || lowerMessage.includes('total')) {
      return `The total amount detected is $${doc.ocrData.total_amount}. I can help verify this by checking if the subtotal ($${doc.ocrData.subtotal}) plus tax ($${doc.ocrData.tax_amount}) equals the total. Would you like me to recalculate?`;
    }
    
    if (lowerMessage.includes('date')) {
      return `I see the invoice date is ${doc.ocrData.invoice_date} and due date is ${doc.ocrData.due_date}. These dates look properly formatted. Do you need help with date validation or reformatting?`;
    }
    
    if (lowerMessage.includes('line items') || lowerMessage.includes('items')) {
      return `I found ${doc.ocrData.line_items?.length || 0} line items. I can help verify quantities, prices, and descriptions. Would you like me to check the calculations for each line item?`;
    }
    
    return `I understand you need help with "${message}". I can assist with field validation, data correction suggestions, or help fill in missing information. Could you be more specific about which field you'd like help with?`;
  };

  const quickActions = [
    {
      label: "Validate all amounts",
      action: () => {
        const message = "Please validate all monetary amounts in this document";
        setInputMessage(message);
        handleSendMessage();
      }
    },
    {
      label: "Check vendor information",
      action: () => {
        const message = "Help me verify the vendor information";
        setInputMessage(message);
        handleSendMessage();
      }
    },
    {
      label: "Review line items",
      action: () => {
        const message = "Can you help me review the line items for accuracy?";
        setInputMessage(message);
        handleSendMessage();
      }
    }
  ];

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0">
                    {message.type === 'user' ? (
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.action}
                className="text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about the document data..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
