
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Video, MessageSquare, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "text" | "audio" | "video";
  content: string;
  author: string;
  date: Date;
}

const GuestBook = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("text");
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "text",
      content: "Félicitations pour votre mariage ! Nous vous souhaitons beaucoup de bonheur.",
      author: "Marie et Jean",
      date: new Date(2023, 5, 15)
    },
    {
      id: "2",
      type: "text",
      content: "Que votre amour grandisse chaque jour un peu plus.",
      author: "Catherine",
      date: new Date(2023, 5, 16)
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "text",
      content: message,
      author: "Invité", // In a real app, this would be the current user's name
      date: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été ajouté au livre d'or",
    });
  };

  const handleStartRecording = (type: "audio" | "video") => {
    setIsRecording(true);
    
    // In a real app, this would start actual recording
    toast({
      title: `Enregistrement ${type} démarré`,
      description: "Cliquez à nouveau pour arrêter l'enregistrement",
    });
    
    // For demonstration purposes, we'll simulate stopping after 3 seconds
    setTimeout(() => {
      handleStopRecording(type);
    }, 3000);
  };

  const handleStopRecording = (type: "audio" | "video") => {
    setIsRecording(false);
    
    // In a real app, this would stop recording and save the file
    const newMessage: Message = {
      id: Date.now().toString(),
      type: type,
      content: type === "audio" ? "/dummy-audio-url.mp3" : "/dummy-video-url.mp4",
      author: "Invité", // In a real app, this would be the current user's name
      date: new Date()
    };
    
    setMessages([...messages, newMessage]);
    
    toast({
      title: "Enregistrement terminé",
      description: `Votre message ${type} a été ajouté au livre d'or`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Livre d'or
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="text" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> Texte
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-1">
              <Mic className="h-4 w-4" /> Audio
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <Video className="h-4 w-4" /> Vidéo
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Écrivez votre message pour les mariés..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audio">
            <div className="text-center p-6 space-y-4">
              <Button 
                size="lg" 
                className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}
                onClick={() => handleStartRecording("audio")}
              >
                <Mic className="h-5 w-5 mr-2" />
                {isRecording ? "Enregistrement en cours..." : "Enregistrer un message audio"}
              </Button>
              <p className="text-sm text-gray-500">
                Cliquez pour enregistrer un message vocal pour les mariés
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="video">
            <div className="text-center p-6 space-y-4">
              <Button 
                size="lg" 
                className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}
                onClick={() => handleStartRecording("video")}
              >
                <Video className="h-5 w-5 mr-2" />
                {isRecording ? "Enregistrement en cours..." : "Enregistrer un message vidéo"}
              </Button>
              <p className="text-sm text-gray-500">
                Cliquez pour enregistrer un message vidéo pour les mariés
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Messages précédents</h3>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 p-3 border rounded-md">
                <Avatar>
                  <AvatarFallback>{msg.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{msg.author}</span>
                    <span className="text-xs text-gray-500">
                      {msg.date.toLocaleDateString()}
                    </span>
                  </div>
                  {msg.type === "text" ? (
                    <p className="text-gray-700">{msg.content}</p>
                  ) : msg.type === "audio" ? (
                    <audio controls className="w-full mt-2">
                      <source src={msg.content} type="audio/mpeg" />
                      Votre navigateur ne supporte pas la lecture audio.
                    </audio>
                  ) : (
                    <video controls className="w-full mt-2 rounded">
                      <source src={msg.content} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestBook;
