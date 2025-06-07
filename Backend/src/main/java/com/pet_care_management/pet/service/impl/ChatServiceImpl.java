package com.pet_care_management.pet.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pet_care_management.pet.dto.ChatMessage;
import com.pet_care_management.pet.entity.Chat;
import com.pet_care_management.pet.entity.User;
import com.pet_care_management.pet.repository.ChatRepository;
import com.pet_care_management.pet.repository.UserRepository;
import com.pet_care_management.pet.service.ChatService;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        if (chatMessage == null) {
            throw new IllegalArgumentException("Chat message cannot be null");
        }

        // Get sender
        Optional<User> senderOpt = userRepository.findById(chatMessage.getSenderId());
        if (!senderOpt.isPresent()) {
            throw new RuntimeException("Sender not found");
        }
        User sender = senderOpt.get();

        // Get receiver
        Optional<User> receiverOpt = userRepository.findById(chatMessage.getReceiverId());
        if (!receiverOpt.isPresent()) {
            throw new RuntimeException("Receiver not found");
        }
        User receiver = receiverOpt.get();

        // Create and save chat
        Chat chat = new Chat();
        chat.setSender(sender);
        chat.setReceiver(receiver);
        chat.setMessage(chatMessage.getMessage());
        chat.setRead(false);

        Chat savedChat = chatRepository.save(chat);
        
        // Create response
        ChatMessage response = new ChatMessage();
        response.setId(savedChat.getId());
        response.setSenderId(sender.getId());
        response.setReceiverId(receiver.getId());
        response.setSenderName(sender.getUsername());
        response.setMessage(savedChat.getMessage());
        response.setCreatedAt(savedChat.getCreatedAt());
        response.setRead(savedChat.isRead());

        // Send message to specific user
        messagingTemplate.convertAndSendToUser(
            receiver.getUsername(),
            "/topic/private",
            response
        );

        return response;
    }

    @Override
    public List<ChatMessage> getChatHistory(Integer userId1, Integer userId2) {
        List<Chat> chats = chatRepository.findChatsBetweenUsers(userId1, userId2);
        List<ChatMessage> messages = new ArrayList<>();
        for (Chat chat : chats) {
            messages.add(convertToDTO(chat));
        }
        return messages;
    }

    @Override
    @Transactional
    public void markMessagesAsRead(Integer senderId, Integer receiverId) {
        List<Chat> unreadMessages = chatRepository.findChatsBetweenUsers(senderId, receiverId);
        List<Chat> messagesToUpdate = new ArrayList<>();
        
        for (Chat chat : unreadMessages) {
            if (!chat.isRead() && chat.getReceiver().getId().equals(receiverId)) {
                chat.setRead(true);
                messagesToUpdate.add(chat);
            }
        }
        
        if (!messagesToUpdate.isEmpty()) {
            chatRepository.saveAll(messagesToUpdate);
        }
    }

    @Override
    public Long getUnreadMessageCount(Integer userId) {
        return chatRepository.countUnreadMessages(userId);
    }

    @Override
    public List<User> getUsersChattedWithDoctor() {
        return chatRepository.findUsersChattedWithDoctor();
    }

    private ChatMessage convertToDTO(Chat chat) {
        if (chat == null) {
            throw new IllegalArgumentException("Chat cannot be null");
        }

        ChatMessage dto = new ChatMessage();
        dto.setId(chat.getId());
        dto.setSenderId(chat.getSender().getId());
        dto.setReceiverId(chat.getReceiver().getId());
        dto.setSenderName(chat.getSender().getUsername());
        dto.setMessage(chat.getMessage());
        dto.setCreatedAt(chat.getCreatedAt());
        dto.setRead(chat.isRead());
        return dto;
    }
} 