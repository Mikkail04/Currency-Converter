package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ConversionRequest;
import com.example.demo.dto.ExchangeRateResponse;
import com.example.demo.model.ConversionHistory;
import com.example.demo.service.CurrencyService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@Tag(
    name = "Currency Converter",
    description = "Endpoints for currency conversion and conversion history"
)
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @Operation(
        summary = "Convert currency using query parameters",
        description = "Converts an amount from one currency to another and saves the conversion history"
    )
    @GetMapping("/convert")
    public ConversionHistory convert(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam double amount) {

        return currencyService.convert(from, to, amount);
    }

    @Operation(
        summary = "Convert currency using JSON request body",
        description = "Converts an amount using a POST request and saves the conversion history"
    )
    @PostMapping("/convert")
    public ConversionHistory convertPost(
        @Valid @RequestBody ConversionRequest request) {

        return currencyService.convert(
            request.getFrom(),
            request.getTo(),
            request.getAmount());
        }

    @Operation(
        summary = "Get conversion history",
        description = "Returns all saved currency conversions"
    )
    @GetMapping("/history")
    public List<ConversionHistory> history() {
        return currencyService.getHistory();
    }

    @Operation(
        summary = "Get exchange rate",
        description = "Returns the current exchange rate between two currencies"
    )
    @GetMapping("/rate/{from}/{to}")
    public ExchangeRateResponse getRate(
        @PathVariable String from,
        @PathVariable String to) {

        return currencyService.getRate(from, to);
    }

    @DeleteMapping("/history/{id}")
    public void deleteHistory(
        @PathVariable Long id) {
        currencyService.deleteHistory(id);
    }   
}
