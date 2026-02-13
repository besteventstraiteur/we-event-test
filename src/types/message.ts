/**
 * Message & Conversation Types - Types pour la messagerie
 * 
 * Messagerie temps réel entre clients et partenaires
 */

import { BaseEntity } from './api';

// ============================
// CONVERSATION ENTITY
// ============================

/**
 * Conversation
 * Représente une conversation entre 2 utilisateurs
 */
export interface Conversation extends BaseEntity {
  // Participants
  participants: string[]; // Array of user IDs
  participant_details?: ConversationParticipant[];
  
  // Dernier message
  last_message?: Message;
  last_message_at?: string;
  
  // Métadonnées
  unread_count: Record<string, number>; // { user_id: count }
  is_archived?: boolean;
  is_muted?: boolean;
  
  // Contexte (optionnel)
  event_id?: string;
  booking_id?: string;
  
  // Statut
  status: ConversationStatus;
}

/**
 * Conversation Participant
 */
export interface ConversationParticipant {
  user_id: string;
  full_name: string;
  email: string;
  role: 'client' | 'partner' | 'admin';
  profile_picture_url?: string;
  is_online?: boolean;
  last_seen?: string;
}

/**
 * Conversation Status
 */
export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  CLOSED = 'closed',
}

// ============================
// MESSAGE ENTITY
// ============================

/**
 * Message
 * Représente un message dans une conversation
 */
export interface Message extends BaseEntity {
  // Conversation
  conversation_id: string;
  
  // Expéditeur
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  
  // Contenu
  content: string;
  message_type: MessageType;
  
  // Pièces jointes
  attachments?: MessageAttachment[];
  
  // Métadonnées
  is_read: boolean;
  read_at?: string;
  read_by?: string[];
  
  is_edited: boolean;
  edited_at?: string;
  
  is_deleted: boolean;
  deleted_at?: string;
  
  // Réponse
  reply_to?: string; // ID du message auquel on répond
  reply_to_message?: Message;
}

/**
 * Message Type
 */
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  AUDIO = 'audio',
  SYSTEM = 'system', // Messages système (ex: "Réservation confirmée")
}

/**
 * Message Attachment
 */
export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string; // MIME type
  size: number; // bytes
  thumbnail_url?: string;
}

// ============================
// DTOs
// ============================

/**
 * Create Conversation DTO
 */
export interface CreateConversationDTO {
  participants: string[]; // User IDs
  initial_message?: string;
  event_id?: string;
  booking_id?: string;
}

/**
 * Send Message DTO
 */
export interface SendMessageDTO {
  conversation_id: string;
  content: string;
  message_type?: MessageType;
  attachments?: MessageAttachment[];
  reply_to?: string;
}

/**
 * Update Message DTO
 */
export interface UpdateMessageDTO {
  id: string;
  content?: string;
}

// ============================
// QUERY PARAMS
// ============================

/**
 * Conversation Filters
 */
export interface ConversationFilters {
  status?: ConversationStatus;
  is_archived?: boolean;
  event_id?: string;
  booking_id?: string;
  search?: string;
}

/**
 * Conversation List Params
 */
export interface ConversationListParams extends ConversationFilters {
  page?: number;
  limit?: number;
  sort?: 'last_message_at' | 'created_at';
  order?: 'asc' | 'desc';
}

/**
 * Message List Params
 */
export interface MessageListParams {
  conversation_id: string;
  page?: number;
  limit?: number;
  before?: string; // Message ID (for pagination)
  after?: string; // Message ID (for pagination)
}

// ============================
// REAL-TIME EVENTS
// ============================

/**
 * WebSocket Event Types
 */
export enum SocketEventType {
  MESSAGE_SENT = 'message:sent',
  MESSAGE_RECEIVED = 'message:received',
  MESSAGE_READ = 'message:read',
  USER_TYPING = 'user:typing',
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
}

/**
 * Typing Event Data
 */
export interface TypingEvent {
  conversation_id: string;
  user_id: string;
  user_name: string;
  is_typing: boolean;
}

/**
 * Online Status Event
 */
export interface OnlineStatusEvent {
  user_id: string;
  is_online: boolean;
  last_seen?: string;
}

// ============================
// STATISTICS
// ============================

/**
 * Message Statistics
 */
export interface MessageStats {
  total_conversations: number;
  active_conversations: number;
  total_messages_sent: number;
  total_messages_received: number;
  unread_messages: number;
  average_response_time_minutes: number;
}

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Get conversation status label
 */
export function getConversationStatusLabel(status: ConversationStatus): string {
  const labels: Record<ConversationStatus, string> = {
    [ConversationStatus.ACTIVE]: 'Active',
    [ConversationStatus.ARCHIVED]: 'Archivée',
    [ConversationStatus.CLOSED]: 'Fermée',
  };
  return labels[status];
}

/**
 * Get message type label
 */
export function getMessageTypeLabel(type: MessageType): string {
  const labels: Record<MessageType, string> = {
    [MessageType.TEXT]: 'Texte',
    [MessageType.IMAGE]: 'Image',
    [MessageType.VIDEO]: 'Vidéo',
    [MessageType.FILE]: 'Fichier',
    [MessageType.AUDIO]: 'Audio',
    [MessageType.SYSTEM]: 'Système',
  };
  return labels[type];
}

/**
 * Format message time
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Moins d'une minute
  if (diff < 60000) {
    return 'À l\'instant';
  }
  
  // Moins d'une heure
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Il y a ${minutes} min`;
  }
  
  // Moins de 24 heures
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours}h`;
  }
  
  // Aujourd'hui
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Cette semaine
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `Il y a ${days}j`;
  }
  
  // Plus ancien
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

/**
 * Get unread count for user
 */
export function getUnreadCount(conversation: Conversation, userId: string): number {
  return conversation.unread_count[userId] || 0;
}

/**
 * Check if user is typing
 */
export function isUserTyping(typingUsers: Map<string, TypingEvent>, userId: string): boolean {
  const typing = typingUsers.get(userId);
  return typing?.is_typing || false;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get other participant (for 1-on-1 conversations)
 */
export function getOtherParticipant(
  conversation: Conversation,
  currentUserId: string
): ConversationParticipant | undefined {
  return conversation.participant_details?.find(p => p.user_id !== currentUserId);
}

/**
 * Check if message is from current user
 */
export function isMyMessage(message: Message, currentUserId: string): boolean {
  return message.sender_id === currentUserId;
}

/**
 * Group messages by date
 */
export function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const groups = new Map<string, Message[]>();
  
  messages.forEach(message => {
    const date = new Date(message.created_at).toDateString();
    const existing = groups.get(date) || [];
    groups.set(date, [...existing, message]);
  });
  
  return groups;
}

// ============================
// VALIDATION
// ============================

/**
 * Validate message content
 */
export function validateMessageContent(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Le message ne peut pas être vide' };
  }
  
  if (content.length > 10000) {
    return { valid: false, error: 'Le message est trop long (max 10000 caractères)' };
  }
  
  return { valid: true };
}

/**
 * Validate attachment size
 */
export function validateAttachmentSize(sizeBytes: number, maxMB: number = 10): { valid: boolean; error?: string } {
  const maxBytes = maxMB * 1024 * 1024;
  
  if (sizeBytes > maxBytes) {
    return { valid: false, error: `Le fichier est trop volumineux (max ${maxMB} MB)` };
  }
  
  return { valid: true };
}

// ============================
// EXPORT DEFAULT
// ============================

export default {
  getConversationStatusLabel,
  getMessageTypeLabel,
  formatMessageTime,
  getUnreadCount,
  isUserTyping,
  formatFileSize,
  getOtherParticipant,
  isMyMessage,
  groupMessagesByDate,
  validateMessageContent,
  validateAttachmentSize,
};
