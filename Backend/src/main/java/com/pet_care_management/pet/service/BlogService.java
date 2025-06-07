package com.pet_care_management.pet.service;

import com.pet_care_management.pet.entity.Blog;
import java.util.List;

public interface BlogService {
    List<Blog> getAllBlogs();
    Blog getBlogById(Integer id);
    Blog createBlog(Blog blog);
    Blog updateBlog(Integer id, Blog blog);
    void deleteBlog(Integer id);
} 