package com.pet_care_management.pet.dto;

import java.time.LocalDateTime;

public class ServiceReviewResponse {
    private String username;
    private String serviceName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ServiceReviewResponse(com.pet_care_management.pet.entity.ServiceReview review) {
        this.username = review.getUser().getUsername();
        this.serviceName = review.getService().getName();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
    }

	// Getters and setters
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
} 