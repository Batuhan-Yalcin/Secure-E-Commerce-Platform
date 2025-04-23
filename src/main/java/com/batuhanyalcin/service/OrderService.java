package com.batuhanyalcin.service;

import com.batuhanyalcin.dto.order.OrderCreateDTO;
import com.batuhanyalcin.dto.order.OrderItemDTO;
import com.batuhanyalcin.dto.order.OrderResponseDTO;
import com.batuhanyalcin.exception.InsufficientStockException;
import com.batuhanyalcin.exception.InvalidOrderStatusException;
import com.batuhanyalcin.exception.ResourceNotFoundException;
import com.batuhanyalcin.model.Order;
import com.batuhanyalcin.model.OrderItem;
import com.batuhanyalcin.model.Product;
import com.batuhanyalcin.model.User;
import com.batuhanyalcin.repository.OrderRepository;
import com.batuhanyalcin.repository.ProductRepository;
import com.batuhanyalcin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final List<String> VALID_STATUSES = Arrays.asList(
            "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public OrderResponseDTO createOrder(Long userId, OrderCreateDTO orderCreateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        List<OrderItem> orderItems = orderCreateDTO.getOrderItems().stream()
                .map(itemDTO -> {
                    Product product = productRepository.findById(itemDTO.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + itemDTO.getProductId()));

                    if (product.getStockQuantity() < itemDTO.getQuantity()) {
                        throw new InsufficientStockException("Yetersiz stok: " + product.getName());
                    }

                    product.setStockQuantity(product.getStockQuantity() - itemDTO.getQuantity());
                    productRepository.save(product);

                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(itemDTO.getQuantity());
                    orderItem.setPrice(product.getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order.setTotalAmount(calculateTotalAmount(orderItems));

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    public List<OrderResponseDTO> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));

        return orderRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı: " + id));
        return convertToDTO(order);
    }
    
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long id, String newStatus) {
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new InvalidOrderStatusException("Geçersiz sipariş durumu: " + newStatus);
        }
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı: " + id));
        
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }
    
    @Transactional
    public OrderResponseDTO cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı: " + id));
        
        // Sadece PENDING veya PROCESSING durumundaki siparişler iptal edilebilir
        if (!("PENDING".equals(order.getStatus()) || "PROCESSING".equals(order.getStatus()))) {
            throw new InvalidOrderStatusException("Bu durumda sipariş iptal edilemez: " + order.getStatus());
        }
        
        // Stok miktarlarını geri yükle
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
        
        order.setStatus("CANCELLED");
        Order cancelledOrder = orderRepository.save(order);
        return convertToDTO(cancelledOrder);
    }

    // Admin Panel için yeni metodlar
    
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Long getOrderCount() {
        return orderRepository.count();
    }
    
    public BigDecimal getTotalRevenue() {
        // Tamamlanmış ve gönderilmiş siparişlerin toplam tutarını hesapla
        return orderRepository.findAll().stream()
                .filter(order -> "DELIVERED".equals(order.getStatus()) || "SHIPPED".equals(order.getStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, (subtotal, orderAmount) -> subtotal.add(orderAmount));
    }
    
    public List<OrderResponseDTO> getRecentOrders(int count) {
        PageRequest pageRequest = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "orderDate"));
        return orderRepository.findAll(pageRequest).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Map<String, Long> getOrderStatusCounts() {
        Map<String, Long> statusCounts = new HashMap<>();
        
        for (String status : VALID_STATUSES) {
            statusCounts.put(status, orderRepository.countByStatus(status));
        }
        
        return statusCounts;
    }

    private BigDecimal calculateTotalAmount(List<OrderItem> orderItems) {
        return orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private OrderResponseDTO convertToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        
        dto.setOrderItems(order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setProductId(item.getProduct().getId());
                    itemDTO.setQuantity(item.getQuantity());
                    return itemDTO;
                })
                .collect(Collectors.toList()));
        
        return dto;
    }
} 