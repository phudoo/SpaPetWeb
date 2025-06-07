package com.pet_care_management.pet.service.impl;

import com.pet_care_management.pet.entity.Product;
import com.pet_care_management.pet.repository.ProductRepository;
import com.pet_care_management.pet.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import org.springframework.util.StringUtils;
import java.nio.file.StandardCopyOption;
import com.pet_care_management.pet.repository.CartRepository;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Value("${file.upload-dir.products}")
    private String uploadDir;

    @Override
    @Transactional
    public Product createProduct(Product product, MultipartFile image) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        // Save product first
        Product savedProduct = productRepository.save(product);
        // Handle image
        if (image != null && !image.isEmpty()) {
            String fileName = storeFile(image, savedProduct.getId());
            savedProduct.setImagePath(fileName);
            return productRepository.save(savedProduct);
        }
        return savedProduct;
    }

    @Override
    public Product getProduct(Integer id) {
        Optional<Product> productOpt = productRepository.findByIdAndIsDeletedFalse(id);
        if (!productOpt.isPresent()) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        return productOpt.get();
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAllByIsDeletedFalse();
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        return productRepository.findByCategoryAndIsDeletedFalse(category);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        return productRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(name);
    }

    @Override
    public byte[] getProductImage(Integer id) {
        try {
            Product product = getProduct(id);
            if (product.getImagePath() == null) {
                throw new RuntimeException("No image found for product with id: " + id);
            }
            Path filePath = Paths.get(uploadDir).resolve(product.getImagePath());
            if (!Files.exists(filePath)) {
                throw new RuntimeException("Image file not found for product with id: " + id);
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Error reading image file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public Product updateProduct(Integer id, Product product, MultipartFile image, String username) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        // Get existing product
        Product existingProduct = getProduct(id);
        // Update product fields
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        // Handle image
        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            if (existingProduct.getImagePath() != null) {
                deleteFile(existingProduct.getImagePath());
            }
            String fileName = storeFile(image, existingProduct.getId());
            existingProduct.setImagePath(fileName);
        }
        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = getProduct(id);
        // Không cho phép xóa nếu sản phẩm đang có trong giỏ hàng
        if (cartRepository.existsByProductId(id)) {
            throw new RuntimeException("Cannot delete product: This product is currently in one or more carts.");
        }
        // Soft delete: set isDeleted = true
        product.setIsDeleted(true);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public boolean updateStock(Integer id, Integer quantity) {
        Product product = getProduct(id);
        int newStock = product.getStock() + quantity;
        if (newStock >= 0) {
            product.setStock(newStock);
            productRepository.save(product);
            return true;
        }
        return false;
    }

    private String storeFile(MultipartFile file, Integer id) {
        try {
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate filename based on product id
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = "product_" + id + fileExtension;

            // Save file
            Path targetLocation = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    private void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + fileName, e);
        }
    }
} 