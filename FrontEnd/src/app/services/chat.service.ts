import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './user.service';
import { map } from 'rxjs/operators';

declare const SockJS: any;
declare const Stomp: any;

export interface ChatMessage {
  senderId: number;
  receiverId: number;
  message: string;
  senderName?: string;
  createdAt?: string;
  isSticker?: boolean;
}

interface ChatUser {
  id: number;
  username: string;
  fullName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any = null;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  public message$ = this.messageSubject.asObservable();
  private isConnected = false;
  private currentUserId: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: User
  ) {}

  connect(userId: number): void {
    if (this.stompClient) {
      this.disconnect();
    }

    try {
      console.log('Connecting to WebSocket...');
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);
      
      // Disable debug logging
      this.stompClient.debug = null;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('Attempting to connect with headers:', headers);

      this.stompClient.connect(headers, 
        (frame: any) => {
          console.log('Connected to WebSocket:', frame);
          this.onConnected(userId);
        },
        (error: any) => {
          console.error('WebSocket connection error:', error);
          this.onError(error);
        }
      );
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }

  private onConnected(userId: number): void {
    console.log('WebSocket connected, subscribing to messages...');
    this.isConnected = true;
    this.currentUserId = userId;

    // Subscribe to private messages
    this.stompClient.subscribe(
      `/user/${userId}/queue/messages`,
      (message: any) => {
        console.log('Raw message received:', message);
        try {
          const chatMessage = JSON.parse(message.body);
          console.log('Parsed message:', chatMessage);
          
          // Add timestamp if not present
          if (!chatMessage.createdAt) {
            chatMessage.createdAt = new Date().toISOString();
          }
          
          // Add sender name if not present
          if (!chatMessage.senderName) {
            chatMessage.senderName = 'Unknown';
          }

          // Emit message immediately
          this.messageSubject.next(chatMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      },
      (error: any) => {
        console.error('Error in message subscription:', error);
      }
    );

    // Also subscribe to the general topic for debugging
    this.stompClient.subscribe('/topic/messages', (message: any) => {
      console.log('Message received on general topic:', message);
    });
  }

  private onError(error: any): void {
    console.error('WebSocket Error:', error);
    this.isConnected = false;
    this.stompClient = null;
  }

  sendMessage(message: ChatMessage): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('Cannot send message: Not connected');
      return;
    }

    try {
      // Add timestamp if not present
      if (!message.createdAt) {
        message.createdAt = new Date().toISOString();
      }

      // Add sender name if not present
      if (!message.senderName) {
        message.senderName = 'Unknown';
      }

      console.log('Sending message:', message);
      this.stompClient.send(
        "/app/chat.send",
        {},
        JSON.stringify(message)
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  loadChatHistory(userId: number, receiverId: number): Observable<ChatMessage[]> {
    console.log('Loading chat history:', { userId, receiverId });
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for chat history');
      return new Observable(subscriber => {
        subscriber.error('No authentication token found');
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ChatMessage[]>(
      `http://localhost:8080/api/chat/history/${userId}/${receiverId}`,
      { headers }
    );
  }

  markMessageAsRead(senderId: number, receiverId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable(subscriber => {
        subscriber.error('No authentication token found');
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(
      `http://localhost:8080/api/chat/read/${senderId}/${receiverId}`,
      {},
      { headers }
    );
  }

  disconnect(): void {
    if (this.stompClient) {
      console.log('Disconnecting from WebSocket...');
      this.stompClient.disconnect();
      this.stompClient = null;
      this.isConnected = false;
    }
  }

  getUsersChattedWithDoctor(): Observable<ChatUser[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable(subscriber => {
        subscriber.error('No authentication token found');
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ChatUser[]>(
      'http://localhost:8080/api/chat/users-chatted-with-doctor',
      { headers }
    );
  }

  getAllUsers(): Observable<ChatUser[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable(subscriber => {
        subscriber.error('No authentication token found');
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(
      'http://localhost:8080/api/users',
      { headers }
    ).pipe(
      map(users => users.map(user => ({
        id: user.id,
        username: user.username || '',
        fullName: user.fullName || user.name || user.username || `User ${user.id}`
      })))
    );
  }

  getUserDetails(userId: number): Observable<any> {
    return this.userService.getUserById(userId);
  }
}
