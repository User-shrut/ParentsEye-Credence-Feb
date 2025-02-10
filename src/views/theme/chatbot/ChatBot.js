import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CFormInput, CButton, CListGroup, CListGroupItem } from '@coreui/react';

// Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true
// });

const ChatBot = () => {
  const [activeChats, setActiveChats] = useState([
    {
      id: '1',
      name: 'AI Assistant',
      role: 'Assistant',
      lastMessage: 'How can I help you today?',
      date: new Date().toLocaleDateString(),
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'AI Assistant',
      content: 'Hello! How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: newMessage }],
        model: 'gpt-3.5-turbo',
      });

      const aiResponse = {
        id: Date.now().toString(),
        sender: 'AI Assistant',
        content: completion.choices[0].message.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiResponse]);
      setActiveChats(prev => [{
        ...prev[0],
        lastMessage: newMessage,
        date: new Date().toLocaleDateString()
      }, ...prev.slice(1)]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'System',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <CContainer fluid className="py-4">
      <CRow className="justify-content-center">
        <CCol md={4}>
          <CCard>
            <CCardHeader>
              <CFormInput type="search" placeholder="Search conversations..." />
            </CCardHeader>
            <CCardBody className="overflow-auto" style={{ maxHeight: '70vh' }}>
              <CListGroup flush>
                {activeChats.map(chat => (
                  <CListGroupItem key={chat.id} className="d-flex align-items-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`}
                      alt={chat.name}
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div className="flex-grow-1">
                      <div className="fw-bold">{chat.name}</div>
                      <small className="text-muted">{chat.lastMessage}</small>
                    </div>
                    <small className="text-muted">{chat.date}</small>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={8}>
          <CCard>
            <CCardHeader className="d-flex align-items-center">
              <img
                src={`https://ui-avatars.com/api/?name=AI+Assistant&background=random`}
                alt="AI Assistant"
                className="rounded-circle me-3"
                width="40"
                height="40"
              />
              <div>
                <h6 className="mb-0">AI Assistant</h6>
                <small className="text-muted">Always here to help</small>
              </div>
            </CCardHeader>
            <CCardBody className="overflow-auto p-3" style={{ maxHeight: '60vh' }}>
              {messages.map(message => (
                <div key={message.id} className={`d-flex ${message.sender === 'You' ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                  {message.sender !== 'You' && (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender)}&background=random`}
                      alt={message.sender}
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                    />
                  )}
                  <div className={`p-2 rounded ${message.sender === 'You' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%' }}>
                    <p className="mb-1">{message.content}</p>
                    <small className="text-muted">{message.timestamp}</small>
                  </div>
                  {message.sender === 'You' && (
                    <img
                      src={`https://ui-avatars.com/api/?name=You&background=random`}
                      alt="You"
                      className="rounded-circle ms-2"
                      width="30"
                      height="30"
                    />
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="d-flex align-items-center text-muted">
                  <div className="spinner-grow spinner-grow-sm me-1"></div>
                  <div className="spinner-grow spinner-grow-sm me-1"></div>
                  <div className="spinner-grow spinner-grow-sm"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CCardBody>
            <CCardBody>
              <form onSubmit={handleSendMessage} className="d-flex">
                <CFormInput
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="me-2"
                  disabled={isTyping}
                />
                <CButton type="submit" color="primary" disabled={isTyping}>
                  Send
                </CButton>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ChatBot;
