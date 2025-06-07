package com.pet_care_management.pet.service.impl;

import com.pet_care_management.pet.entity.Blog;
import com.pet_care_management.pet.repository.BlogRepository;
import com.pet_care_management.pet.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public List<Blog> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAllByOrderByCreatedAtDesc();
        return blogs;
    }

    @Override
    public Blog getBlogById(Integer id) {
        Optional<Blog> blogOpt = blogRepository.findById(id);
        if (!blogOpt.isPresent()) {
            throw new EntityNotFoundException("Blog not found with id: " + id);
        }
        return blogOpt.get();
    }

    @Override
    public Blog createBlog(Blog blog) {
        if (blog == null) {
            throw new IllegalArgumentException("Blog cannot be null");
        }
        return blogRepository.save(blog);
    }

    @Override
    public Blog updateBlog(Integer id, Blog blogDetails) {
        if (blogDetails == null) {
            throw new IllegalArgumentException("Blog details cannot be null");
        }

        Blog blog = getBlogById(id);
        
        // Update only if new values are not null
        if (blogDetails.getTitle() != null) {
            blog.setTitle(blogDetails.getTitle());
        }
        if (blogDetails.getContent() != null) {
            blog.setContent(blogDetails.getContent());
        }
        
        return blogRepository.save(blog);
    }

    @Override
    public void deleteBlog(Integer id) {
        Blog blog = getBlogById(id);
        blogRepository.delete(blog);
    }
} 