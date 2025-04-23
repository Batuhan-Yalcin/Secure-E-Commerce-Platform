package com.batuhanyalcin.controller;

import com.batuhanyalcin.dto.order.OrderResponseDTO;
import com.batuhanyalcin.dto.UserDTO;
import com.batuhanyalcin.service.OrderService;
import com.batuhanyalcin.service.ProductService;
import com.batuhanyalcin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private ProductService productService;

    // Tüm kullanıcıları getir
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Tüm siparişleri getir
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Dashboard istatistikleri
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Toplam kullanıcı sayısı
        stats.put("totalUsers", userService.getUserCount());
        
        // Toplam sipariş sayısı
        stats.put("totalOrders", orderService.getOrderCount());
        
        // Toplam ürün sayısı
        stats.put("totalProducts", productService.getProductCount());
        
        // Toplam gelir
        stats.put("revenue", orderService.getTotalRevenue());
        
        // Son 5 sipariş
        stats.put("recentOrders", orderService.getRecentOrders(5));
        
        // Duruma göre sipariş sayıları
        stats.put("orderStatusCounts", orderService.getOrderStatusCounts());
        
        return ResponseEntity.ok(stats);
    }
} 