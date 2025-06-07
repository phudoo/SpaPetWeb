package com.pet_care_management.pet.service;

import java.util.List;

import com.pet_care_management.pet.dto.ChatMessage;
import com.pet_care_management.pet.entity.User;

public interface ChatService {
    ChatMessage sendMessage(ChatMessage chatMessage);
    List<ChatMessage> getChatHistory(Integer userId1, Integer userId2);
    void markMessagesAsRead(Integer senderId, Integer receiverId);
    Long getUnreadMessageCount(Integer userId);
    List<User> getUsersChattedWithDoctor();
} 