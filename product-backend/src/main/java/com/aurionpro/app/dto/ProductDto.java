package com.aurionpro.app.dto;

import com.aurionpro.app.validation.OnCreate;
import com.aurionpro.app.validation.OnUpdate; 
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ProductDto {
    private Long id;

    private String productId;

    @NotEmpty(message = "Product name cannot be empty", groups = {OnCreate.class, OnUpdate.class})
    private String name;

    private String description;
    
    private Long categoryId;
}
