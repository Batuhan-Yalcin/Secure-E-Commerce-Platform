package com.batuhanyalcin.SecureECommercePlatform;

import com.batuhanyalcin.dto.product.ProductCreateDTO;
import com.batuhanyalcin.dto.product.ProductResponseDTO;
import com.batuhanyalcin.exception.ResourceNotFoundException;
import com.batuhanyalcin.model.Product;
import com.batuhanyalcin.repository.ProductRepository;
import com.batuhanyalcin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private ProductCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Description");
        testProduct.setPrice(new BigDecimal("100.00"));
        testProduct.setStockQuantity(10);
        
        System.out.println("Product Id : " + testProduct.getId());
        System.out.println("Product name : " + testProduct.getName());
        System.out.println("Product description : " + testProduct.getDescription());
        System.out.println("Product price : " + testProduct.getPrice());
        System.out.println("Product stockQuantity : " + testProduct.getStockQuantity());

        createDTO = new ProductCreateDTO();
        createDTO.setName("New Product");
        createDTO.setDescription("New Description");
        createDTO.setPrice(new BigDecimal("150.00"));
        createDTO.setStockQuantity(20);
        
        System.out.println("dto name : " + createDTO.getName());
        System.out.println("dto description : " + createDTO.getDescription());
        System.out.println("dto price : " + createDTO.getPrice());
        System.out.println("dto Stock Quantity : " + createDTO.getStockQuantity());
    }

    @Test
    void getAllProducts_Success() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(testProduct));

        List<ProductResponseDTO> results = productService.getAllProducts();
        
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals(testProduct.getName(), results.get(0).getName());
        System.out.println("getAll Product's : " + results);
    }

    @Test
    void getProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        ProductResponseDTO result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(testProduct.getName(), result.getName());
        System.out.println("FindById" + result);
    }

    @Test
    void getProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById(1L);
        });
    }

    @Test
    void createProduct_Success() {
        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(1L);
            return p;
        });

        ProductResponseDTO result = productService.createProduct(createDTO);

        assertNotNull(result);
        assertEquals(createDTO.getName(), result.getName());
        verify(productRepository).save(any(Product.class));
    }
} 