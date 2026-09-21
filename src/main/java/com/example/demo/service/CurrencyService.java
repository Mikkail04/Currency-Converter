package com.example.demo.service;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.demo.dto.ExchangeRateResponse;
import com.example.demo.model.ConversionHistory;
import com.example.demo.repository.ConversionHistoryRepository;

@Service
public class CurrencyService {

    private final ConversionHistoryRepository repository;
    private final RestClient restClient;

    public CurrencyService(
        ConversionHistoryRepository repository, 
        RestClient restClient) {
        this.repository = repository;
        this.restClient = restClient;
    }

    private double getExchangeRate(
        String from, String to
    ) {
        ExchangeRateResponse response =
            restClient
                .get()
                .uri("https://api.frankfurter.dev/v2/rate/" + from + "/" + to)
                .retrieve()
                .body(ExchangeRateResponse.class);

        return response.getRate();
    }

    public ExchangeRateResponse getRate(
        String from,
        String to) {

            return restClient
                .get()
                .uri("https://api.frankfurter.dev/v2/rate/" + from + "/" + to)
                .retrieve()
                .body(ExchangeRateResponse.class);
        }

    public ConversionHistory convert(
            String from,
            String to,
            double amount) {

        from = from.toUpperCase();
        to = to.toUpperCase();    
        
        double exchangeRate = getExchangeRate(from, to);

        double convertedAmount = Math.round(amount * exchangeRate * 100.0) / 100.0;

        ConversionHistory history = new ConversionHistory();

        history.setFromCurrency(from);
        history.setToCurrency(to);
        history.setAmount(amount);
        history.setConvertedAmount(convertedAmount);
        history.setExchangeRate(exchangeRate);
        history.setTimestamp(ZonedDateTime.now());

        return repository.save(history);
    }

    public void deleteHistory(Long id) {
        repository.deleteById(id);
    }

    public List<ConversionHistory> getHistory() {
        return repository.findAll();
    }
}