import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User, MessageCircle, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

const MessagingPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user-id'; // Replace with actual user ID

  // Mock data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participantId: 'user-1',
        participantName: 'Marie Dupont',
        lastMessage: 'Merci pour votre réponse rapide !',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: '2',
        participantId: 'user-2',
        participantName: 'Jean Martin',
        lastMessage: 'Est-ce que vous êtes disponible le 15 juin ?',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: '3',
        participantId: 'user-3',
        participantName: 'Sophie Bernard',
        lastMessage: 'Le package mariage semble parfait !',
        lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
        unreadCount: 1,
        isOnline: true,
      },
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const mockMessages: Message[] = [
      {
        id: '1',
        conversationId: selectedConversation.id,
        senderId: selectedConversation.participantId,
        senderName: selectedConversation.participantName,
        content: 'Bonjour ! Je suis intéressé par votre package mariage.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      },
      {
        id: '2',
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        senderName: 'Vous',
        content: 'Bonjour ! Je serais ravi de discuter de votre projet. Quelle est votre date prévue ?',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        read: true,
      },
      {
        id: '3',
        conversationId: selectedConversation.id,
        senderId: selectedConversation.participantId,
        senderName: selectedConversation.participantName,
        content: 'Nous prévoyons le 15 juin 2024. Environ 150 invités.',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        read: true,
      },
      {
        id: '4',
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        senderName: 'Vous',
        content: 'Parfait ! Cette date est disponible. Je vous propose de discuter des détails. Quand êtes-vous disponible pour un appel ?',
        timestamp: new Date(Date.now() - 2700000).toISOString(),
        read: true,
      },
      {
        id: '5',
        conversationId: selectedConversation.id,
        senderId: selectedConversation.participantId,
        senderName: selectedConversation.participantName,
        content: 'Merci pour votre réponse rapide !',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ];

    setMessages(mockMessages);
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderName: 'Vous',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Update conversation last message
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
          : conv
      )
    );

    setTimeout(scrollToBottom, 100);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffHours < 48) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM', { locale: fr });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition ${
                    selectedConversation?.id === conv.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-lg">
                        {conv.participantName[0]}
                      </span>
                    </div>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.participantName}</h3>
                      <span className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">{conv.unreadCount}</span>
                    </div>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">
                      {selectedConversation.participantName[0]}
                    </span>
                  </div>
                  {selectedConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{selectedConversation.participantName}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.isOnline ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === currentUserId;
                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwn
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {format(new Date(message.timestamp), 'HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Envoyer
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sélectionnez une conversation</h2>
              <p className="text-gray-600">Choisissez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
