package com.batuhanyalcin.SecureECommercePlatform;

import com.batuhanyalcin.dto.order.OrderCreateDTO;
import com.batuhanyalcin.dto.order.OrderItemDTO;
import com.batuhanyalcin.dto.order.OrderResponseDTO;
import com.batuhanyalcin.exception.InsufficientStockException;
import com.batuhanyalcin.exception.ResourceNotFoundException;
import com.batuhanyalcin.model.Order;
import com.batuhanyalcin.model.Product;
import com.batuhanyalcin.model.User;
import com.batuhanyalcin.repository.OrderRepository;
import com.batuhanyalcin.repository.ProductRepository;
import com.batuhanyalcin.repository.UserRepository;
import com.batuhanyalcin.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Product testProduct;
    private OrderCreateDTO orderCreateDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testUser");

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(new BigDecimal("100.00"));
        testProduct.setStockQuantity(10);
        System.out.println(testProduct.getName());
        System.out.println(testProduct.getPrice());
       System.out.println(testProduct.getStockQuantity());

        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setQuantity(2);
        System.out.println(itemDTO.getProductId());
        System.out.println(itemDTO.getQuantity());

        orderCreateDTO = new OrderCreateDTO();
        orderCreateDTO.setOrderItems(List.of(itemDTO));
        System.out.println(orderCreateDTO.getOrderItems());
    }

    @Test
    void createOrder_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        OrderResponseDTO response = orderService.createOrder(1L, orderCreateDTO);

        assertNotNull(response);
        verify(productRepository).save(any(Product.class));
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            orderService.createOrder(1L, orderCreateDTO);
        });
    }

    @Test
    void createOrder_InsufficientStock() {
        testProduct.setStockQuantity(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        assertThrows(InsufficientStockException.class, () -> {
            orderService.createOrder(1L, orderCreateDTO);
        });
    }

    @Test
    void getUserOrders_Success() {
        List<Order> orders = new ArrayList<>();
        Order order = new Order();
        order.setUser(testUser);
        orders.add(order);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(orderRepository.findByUser(testUser)).thenReturn(orders);

        List<OrderResponseDTO> response = orderService.getUserOrders(1L);

        assertNotNull(response);
        assertFalse(response.isEmpty());
        verify(orderRepository).findByUser(testUser);
    }
} 