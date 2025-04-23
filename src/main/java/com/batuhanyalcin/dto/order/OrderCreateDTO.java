package com.batuhanyalcin.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class OrderCreateDTO {
    @NotEmpty(message = "Sipariş öğeleri boş olamaz")
    private List<@Valid OrderItemDTO> orderItems;
} 