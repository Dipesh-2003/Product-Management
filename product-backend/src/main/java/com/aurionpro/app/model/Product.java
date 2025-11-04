package com.aurionpro.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;


@Entity
@Table(name = "products", uniqueConstraints = {
	    @UniqueConstraint(columnNames = "product_id"),
	    @UniqueConstraint(columnNames = "name")
	})
@Data
public class Product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "product_id",nullable = false)
	private String productId;
	
	@Column(nullable = false)
	private String name ;
	
	
	private String description;
	
	@Column(name = "is_deleted")
	private boolean isDeleted = false;
	
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
	
}
