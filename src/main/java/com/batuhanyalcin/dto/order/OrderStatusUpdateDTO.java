package com.batuhanyalcin.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
 
@Data
public class OrderStatusUpdateDTO {
    @NotBlank(message = "Sipariş durumu boş olamaz")
    private String status;
} 