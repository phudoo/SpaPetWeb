package com.pet_care_management.pet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pet_care_management.pet.dto.ChatMessage;
import com.pet_care_management.pet.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage savedMessage = chatService.sendMessage(chatMessage);
        
        // Send to sender
        messagingTemplate.convertAndSendToUser(
            savedMessage.getSenderId().toString(),
            "/queue/messages",
            savedMessage
        );
        
        // Send to receiver
        messagingTemplate.convertAndSendToUser(
            savedMessage.getReceiverId().toString(),
            "/queue/messages",
            savedMessage
        );
    }

    @GetMapping("/history/{userId1}/{userId2}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable Integer userId1,
            @PathVariable Integer userId2) {
        return ResponseEntity.ok(chatService.getChatHistory(userId1, userId2));
    }

    @PostMapping("/read/{senderId}/{receiverId}")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId) {
        chatService.markMessagesAsRead(senderId, receiverId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Long> getUnreadMessageCount(@PathVariable Integer userId) {
        return ResponseEntity.ok(chatService.getUnreadMessageCount(userId));
    }

    @GetMapping("/users-chatted-with-doctor")
    public ResponseEntity<List<com.pet_care_management.pet.entity.User>> getUsersChattedWithDoctor() {
        return ResponseEntity.ok(chatService.getUsersChattedWithDoctor());
    }
} 