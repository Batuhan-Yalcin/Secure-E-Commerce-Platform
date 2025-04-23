package com.batuhanyalcin.controller;

import com.batuhanyalcin.dto.product.ProductCreateDTO;
import com.batuhanyalcin.dto.product.ProductResponseDTO;
import com.batuhanyalcin.dto.product.ProductUpdateDTO;
import com.batuhanyalcin.service.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        logger.info("Tüm ürünler talep ediliyor");
        List<ProductResponseDTO> products = productService.getAllProducts();
        logger.info("Toplam {} ürün bulundu", products.size());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        logger.info("ID: {} olan ürün talep ediliyor", id);
        ProductResponseDTO product = productService.getProductById(id);
        logger.info("Ürün bulundu: {}", product.getName());
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductCreateDTO productCreateDTO) {
        logger.info("Yeni ürün oluşturma talebi: {}", productCreateDTO.getName());
        ProductResponseDTO createdProduct = productService.createProduct(productCreateDTO);
        logger.info("Yeni ürün oluşturuldu: {}, ID: {}", createdProduct.getName(), createdProduct.getId());
        return ResponseEntity.ok(createdProduct);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateDTO productUpdateDTO) {
        logger.info("ID: {} olan ürün güncelleme talebi", id);
        ProductResponseDTO updatedProduct = productService.updateProduct(id, productUpdateDTO);
        logger.info("Ürün güncellendi: {}, ID: {}", updatedProduct.getName(), updatedProduct.getId());
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        logger.info("ID: {} olan ürün silme talebi", id);
        productService.deleteProduct(id);
        logger.info("Ürün başarıyla silindi, ID: {}", id);
        return ResponseEntity.ok("Ürün başarıyla silindi");
    }
} 