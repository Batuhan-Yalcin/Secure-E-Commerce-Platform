package com.batuhanyalcin.repository;

import com.batuhanyalcin.model.Order;
import com.batuhanyalcin.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    Long countByStatus(String status);
} 