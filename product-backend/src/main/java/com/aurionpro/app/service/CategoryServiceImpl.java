package com.aurionpro.app.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aurionpro.app.dto.CategoryDto;
import com.aurionpro.app.model.Category;
import com.aurionpro.app.repository.CategoryRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j 
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        // We set the ID to null to make sure we're creating a new entry.
        categoryDto.setId(null); 

        Category category = modelMapper.map(categoryDto, Category.class);
        Category savedCategory = categoryRepository.save(category);
        log.info("Saved new category '{}' with ID: {}", savedCategory.getName(), savedCategory.getId());
        return modelMapper.map(savedCategory, CategoryDto.class);
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        log.debug("Fetching all categories from the database.");
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> modelMapper.map(category, CategoryDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) throws Exception {
        // Find the existing category or throw an error if it's not there.

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found with id: " + id));
        log.info("Updating category name from '{}' to '{}'", category.getName(), categoryDto.getName());
        category.setName(categoryDto.getName());
        Category updatedCategory = categoryRepository.save(category);
        return modelMapper.map(updatedCategory, CategoryDto.class);
    }

    @Override
    public void deleteCategory(Long id) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found with id: " + id));
        // You can't delete a category if it has products linked to it.

        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new Exception("Cannot delete category: It is currently associated with one or more products.");
        }

        log.warn("Deleting category '{}' with ID: {}. This is a permanent action.", category.getName(), id);
        categoryRepository.delete(category);
    }
}

