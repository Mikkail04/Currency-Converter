package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.ConversionHistory;

public interface ConversionHistoryRepository
        extends JpaRepository<ConversionHistory, Long> {
}