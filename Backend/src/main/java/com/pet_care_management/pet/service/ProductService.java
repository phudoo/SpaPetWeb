package com.pet_care_management.pet.service;

import com.pet_care_management.pet.entity.Product;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProductService {
    // Create
    Product createProduct(Product product, MultipartFile image);
    
    // Read
    Product getProduct(Integer id);
    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByName(String name);
    byte[] getProductImage(Integer id);
    
    // Update
    Product updateProduct(Integer id, Product product, MultipartFile image, String username);
    
    // Delete
    void deleteProduct(Integer id);
    
    // Stock management
    boolean updateStock(Integer id, Integer quantity);
} 