package com.pet_care_management.pet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pet_care_management.pet.entity.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {
    
    @Query("SELECT c FROM Chat c WHERE (c.sender.id = :userId1 AND c.receiver.id = :userId2) " +
           "OR (c.sender.id = :userId2 AND c.receiver.id = :userId1) ORDER BY c.createdAt")
    List<Chat> findChatsBetweenUsers(@Param("userId1") Integer userId1, @Param("userId2") Integer userId2);

    @Query("SELECT COUNT(c) FROM Chat c WHERE c.receiver.id = :userId AND c.isRead = false")
    Long countUnreadMessages(@Param("userId") Integer userId);

    @Query("SELECT DISTINCT c.sender FROM Chat c WHERE c.receiver.id = 9 AND c.sender.id <> 9")
    List<com.pet_care_management.pet.entity.User> findUsersChattedWithDoctor();
}