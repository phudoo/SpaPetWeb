import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface ChatUser {
  id: number;
  username?: string;
  fullName?: string;
}

@Component({
  selector: 'app-chatrealtime',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatrealtime.component.html',
  styleUrl: './chatrealtime.component.css'
})
export class ChatrealtimeComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  currentMessage = '';
  receiverId: number | null = null;
  userId: number | null = null;
  username: string | null = null;
  isConnected = false;
  isDoctor = false;
  usersList: ChatUser[] = [];
  private messageSubscription: Subscription | null = null;
  showEmojiPicker = false;
  showPicker = false;
  activeTab: 'emoji' | 'sticker' = 'emoji';
  selectedUser: ChatUser | null = null;

  emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
    '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
    '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
    '🤠', '💩', '👻', '👽', '👾', '🤖', '😺', '😸',
    '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈',
    '🙉', '🙊', '💌', '💘', '💝', '💖', '💗', '💓',
    '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛',
    '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢',
    '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️',
    '🗨️', '🗯️', '💭', '💤'
  ];

  stickers = [
    'assets/sticker1.png',
    'assets/sticker2.png',
    'assets/sticker3.png',
    'assets/sticker4.png',
    'assets/sticker5.png',
    'assets/sticker6.png',
    'assets/sticker7.png',
    'assets/sticker8.png',
    'assets/sticker9.png',
    'assets/sticker10.png',
    'assets/sticker11.png',
    'assets/sticker12.png'
  ];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Get userId and username from token
    this.userId = this.authService.getUserIdFromToken();
    this.username = this.authService.getUsername();
    
    if (this.userId) {
      this.isDoctor = this.userId === 3;
      this.connect();
      this.loadAllUsers();
    }

    // Subscribe to incoming messages
    this.messageSubscription = this.chatService.message$.subscribe(message => {
      if (message) {
        console.log('Received message in component:', message);
        
        // Check if message is relevant to current chat
        const isRelevantMessage = this.receiverId 
          ? (message.senderId === this.receiverId || message.receiverId === this.receiverId)
          : false;

        if (isRelevantMessage) {
          this.messages = [...this.messages, message];
          this.cdr.detectChanges();
          
          setTimeout(() => {
            if (this.messageContainer) {
              this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
            }
          });
        }

        // Update users list if needed
        if (message.senderId !== this.userId && !this.usersList.some(u => u.id === message.senderId)) {
          this.loadAllUsers();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.chatService.disconnect();
  }

  connect() {
    if (!this.userId) {
      alert('Please login first');
      return;
    }

    this.chatService.connect(this.userId);
    this.isConnected = true;
    console.log('Connected with user ID:', this.userId);
  }

  sendMessage() {
    if (!this.isConnected || !this.receiverId || !this.currentMessage) {
      console.log('Cannot send message:', { isConnected: this.isConnected, receiverId: this.receiverId, message: this.currentMessage });
      return;
    }

    const message: ChatMessage = {
      senderId: this.userId!,
      receiverId: this.receiverId,
      message: this.currentMessage,
      senderName: this.authService.getUsername() || 'You',
      createdAt: new Date().toISOString()
    };

    // Add message to UI immediately
    this.messages = [...this.messages, message];
    this.cdr.detectChanges();
    
    // Scroll to bottom
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    });

    // Clear input
    this.currentMessage = '';

    // Send message to server
    console.log('Sending message:', message);
    this.chatService.sendMessage(message);
  }

  loadChatHistory() {
    if (!this.userId || !this.receiverId) {
      return;
    }

    console.log('Loading chat history for:', { userId: this.userId, receiverId: this.receiverId });
    
    // Clear existing messages
    this.messages = [];
    
    this.chatService.loadChatHistory(this.userId, this.receiverId)
      .subscribe({
        next: (messages) => {
          console.log('Loaded messages:', messages);
          if (messages && messages.length > 0) {
            // Gán isSticker nếu là sticker
            messages.forEach(msg => {
              if (
                typeof msg.message === 'string' &&
                (msg.message.startsWith('assets/') || msg.message.startsWith('/assets/')) &&
                (msg.message.endsWith('.png') || msg.message.endsWith('.jpg') || msg.message.endsWith('.jpeg') || msg.message.endsWith('.gif'))
              ) {
                msg.isSticker = true;
              } else {
                msg.isSticker = false;
              }
            });

            // Sort messages by date, oldest first
            messages.sort((a, b) => {
              const dateA = new Date(a.createdAt || 0).getTime();
              const dateB = new Date(b.createdAt || 0).getTime();
              return dateA - dateB;
            });
            
            // Add messages to array
            this.messages = messages;
            this.cdr.detectChanges();
            
            // Scroll to bottom
            setTimeout(() => {
              if (this.messageContainer) {
                this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
              }
            });
          }
        },
        error: (error) => {
          console.error('Error loading chat history:', error);
        }
      });
  }

  loadAllUsers() {
    console.log('Loading all users...');
    this.chatService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Loaded users:', users);
        // Filter out current user from the list
        this.usersList = users.filter(user => user.id !== this.userId);
        console.log('Filtered users list:', this.usersList);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users list:', error);
      }
    });
  }

  getSelectedUserInitial(): string {
    if (!this.receiverId) return '';
    const user = this.usersList.find(u => u.id === this.receiverId);
    if (user) {
      return (user.fullName || user.username || 'U').charAt(0).toUpperCase();
    }
    return 'U';
  }

  getSelectedUserName(): string {
    if (!this.receiverId) return '';
    const user = this.usersList.find(u => u.id === this.receiverId);
    if (user) {
      return user.fullName || user.username || `User ${user.id}`;
    }
    return `User ${this.receiverId}`;
  }

  selectUser(userId: number) {
    console.log('Selecting user:', userId);
    this.receiverId = userId;
    
    // Find user in the list first
    const user = this.usersList.find(u => u.id === userId);
    if (user) {
      this.selectedUser = user;
      this.loadChatHistory();
      
      // Ensure scroll to bottom after messages are loaded
      setTimeout(() => {
        if (this.messageContainer) {
          this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        }
      }, 100);
    } else {
      // If user not in list, get details from server
      this.chatService.getUserDetails(userId).subscribe({
        next: (userData) => {
          console.log('Got user details:', userData);
          this.selectedUser = {
            id: userData.id,
            username: userData.username || '',
            fullName: userData.fullName || userData.name || userData.username || `User ${userData.id}`
          };
          this.loadChatHistory();
          
          // Ensure scroll to bottom after messages are loaded
          setTimeout(() => {
            if (this.messageContainer) {
              this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
            }
          }, 100);
        },
        error: (error) => {
          console.error('Error loading user details:', error);
        }
      });
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  togglePicker() {
    this.showPicker = !this.showPicker;
  }

  setActiveTab(tab: 'emoji' | 'sticker') {
    this.activeTab = tab;
  }

  addEmoji(emoji: string) {
    this.currentMessage += emoji;
  }

  sendSticker(stickerUrl: string) {
    if (!this.isConnected || !this.receiverId) {
      console.log('Cannot send sticker:', { isConnected: this.isConnected, receiverId: this.receiverId });
      return;
    }

    const message: ChatMessage = {
      senderId: this.userId!,
      receiverId: this.receiverId,
      message: stickerUrl,
      senderName: this.authService.getUsername() || 'You',
      createdAt: new Date().toISOString(),
      isSticker: true
    };

    console.log('Sending sticker:', message);
    this.chatService.sendMessage(message);
    
    // Add message to UI immediately
    this.messages.push(message);
    this.cdr.detectChanges();
    
    // Scroll to bottom
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    });
  }
}
