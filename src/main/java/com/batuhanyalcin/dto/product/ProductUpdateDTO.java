package com.batuhanyalcin.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductUpdateDTO {
    @NotBlank(message = "Ürün adı boş olamaz")
    private String name;

    @NotBlank(message = "Ürün açıklaması boş olamaz")
    private String description;

    @NotNull(message = "Fiyat boş olamaz")
    @Positive(message = "Fiyat pozitif olmalıdır")
    private BigDecimal price;

    @NotNull(message = "Stok miktarı boş olamaz")
    @PositiveOrZero(message = "Stok miktarı negatif olamaz")
    private Integer stockQuantity;

    private String imageUrl;
} 