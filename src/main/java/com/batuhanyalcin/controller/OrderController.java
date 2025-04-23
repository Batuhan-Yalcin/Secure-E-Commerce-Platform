package com.batuhanyalcin.controller;

import com.batuhanyalcin.dto.order.OrderCreateDTO;
import com.batuhanyalcin.dto.order.OrderResponseDTO;
import com.batuhanyalcin.dto.order.OrderStatusUpdateDTO;
import com.batuhanyalcin.security.UserPrincipal;
import com.batuhanyalcin.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDTO> createOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OrderCreateDTO orderCreateDTO) {
        return ResponseEntity.ok(orderService.createOrder(currentUser.getId(), orderCreateDTO));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.hasUserId(authentication, #userId)")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOrderOwner(authentication, #id)")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusUpdateDTO.getStatus()));
    }
    
    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOrderOwner(authentication, #id)")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
} 