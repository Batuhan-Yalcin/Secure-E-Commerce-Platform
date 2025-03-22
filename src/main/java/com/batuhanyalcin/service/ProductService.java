package com.batuhanyalcin.service;

import com.batuhanyalcin.dto.product.ProductCreateDTO;
import com.batuhanyalcin.dto.product.ProductResponseDTO;
import com.batuhanyalcin.exception.ResourceNotFoundException;
import com.batuhanyalcin.model.Product;
import com.batuhanyalcin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + id));
        return convertToDTO(product);
    }

    @Transactional
    public ProductResponseDTO createProduct(ProductCreateDTO productCreateDTO) {
        Product product = new Product();
        product.setName(productCreateDTO.getName());
        product.setDescription(productCreateDTO.getDescription());
        product.setPrice(productCreateDTO.getPrice());
        product.setStockQuantity(productCreateDTO.getStockQuantity());
        product.setImageUrl(productCreateDTO.getImageUrl());

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    private ProductResponseDTO convertToDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }
} 