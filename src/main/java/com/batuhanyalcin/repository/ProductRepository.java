package com.batuhanyalcin.repository;

import com.batuhanyalcin.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
} 