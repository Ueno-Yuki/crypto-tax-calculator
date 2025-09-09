package com.cryptotax.service;

import com.cryptotax.model.Transaction;
import com.cryptotax.model.TaxCalculationResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {

    private final Map<String, List<Transaction>> sessionTransactions = new HashMap<>();

    public List<Transaction> getTransactionsBySession(String sessionId) {
        return sessionTransactions.getOrDefault(sessionId, new ArrayList<>());
    }

    public Transaction addTransaction(Transaction transaction) {
        String sessionId = transaction.getSessionId();
        sessionTransactions.computeIfAbsent(sessionId, k -> new ArrayList<>()).add(transaction);
        transaction.setId(generateId());
        return transaction;
    }

    public void deleteTransaction(String sessionId, Long transactionId) {
        List<Transaction> transactions = sessionTransactions.get(sessionId);
        if (transactions != null) {
            transactions.removeIf(t -> Objects.equals(t.getId(), transactionId));
        }
    }

    public void clearSessionData(String sessionId) {
        sessionTransactions.remove(sessionId);
    }

    public TaxCalculationResult calculateTax(String sessionId) {
        List<Transaction> transactions = getTransactionsBySession(sessionId);
        
        if (transactions.isEmpty()) {
            return new TaxCalculationResult(
                BigDecimal.ZERO, 
                BigDecimal.ZERO, 
                BigDecimal.ZERO, 
                new ArrayList<>(),
                sessionId
            );
        }

        // Group transactions by cryptocurrency symbol
        Map<String, List<Transaction>> transactionsBySymbol = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getSymbol));

        List<TaxCalculationResult.TransactionSummary> summaries = new ArrayList<>();
        BigDecimal totalGainLoss = BigDecimal.ZERO;
        BigDecimal totalPurchaseAmount = BigDecimal.ZERO;
        BigDecimal totalSaleAmount = BigDecimal.ZERO;

        // Calculate tax for each cryptocurrency using Moving Average Method
        for (Map.Entry<String, List<Transaction>> entry : transactionsBySymbol.entrySet()) {
            String symbol = entry.getKey();
            List<Transaction> symbolTransactions = entry.getValue();
            
            // Sort transactions by date
            symbolTransactions.sort(Comparator.comparing(Transaction::getTransactionDate));
            
            TaxCalculationResult.TransactionSummary summary = calculateForSymbol(symbol, symbolTransactions);
            summaries.add(summary);
            
            totalGainLoss = totalGainLoss.add(summary.getGainLoss());
            totalPurchaseAmount = totalPurchaseAmount.add(summary.getTotalPurchasePrice());
            totalSaleAmount = totalSaleAmount.add(summary.getTotalSalePrice());
        }

        return new TaxCalculationResult(
            totalGainLoss,
            totalPurchaseAmount,
            totalSaleAmount,
            summaries,
            sessionId
        );
    }

    private TaxCalculationResult.TransactionSummary calculateForSymbol(String symbol, List<Transaction> transactions) {
        BigDecimal totalHoldings = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalSalePrice = BigDecimal.ZERO;
        BigDecimal totalGainLoss = BigDecimal.ZERO;

        for (Transaction transaction : transactions) {
            BigDecimal amount = transaction.getAmount();
            BigDecimal priceJpy = transaction.getPriceJpy() != null ? 
                transaction.getPriceJpy() : BigDecimal.ZERO;

            switch (transaction.getType().toUpperCase()) {
                case "BUY":
                case "RECEIVE":
                    // Add to holdings
                    totalHoldings = totalHoldings.add(amount);
                    totalCost = totalCost.add(amount.multiply(priceJpy));
                    break;

                case "SELL":
                case "SEND":
                    if (totalHoldings.compareTo(BigDecimal.ZERO) > 0) {
                        // Calculate average cost
                        BigDecimal averageCost = totalCost.divide(totalHoldings, 8, RoundingMode.HALF_UP);
                        
                        // Calculate cost for this sale
                        BigDecimal saleCost = amount.multiply(averageCost);
                        BigDecimal saleRevenue = amount.multiply(priceJpy);
                        
                        // Calculate gain/loss for this transaction
                        BigDecimal transactionGainLoss = saleRevenue.subtract(saleCost);
                        totalGainLoss = totalGainLoss.add(transactionGainLoss);
                        totalSalePrice = totalSalePrice.add(saleRevenue);
                        
                        // Update holdings
                        totalHoldings = totalHoldings.subtract(amount);
                        totalCost = totalCost.subtract(saleCost);
                        
                        // Ensure no negative holdings
                        if (totalHoldings.compareTo(BigDecimal.ZERO) < 0) {
                            totalHoldings = BigDecimal.ZERO;
                            totalCost = BigDecimal.ZERO;
                        }
                    }
                    break;
            }
        }

        return new TaxCalculationResult.TransactionSummary(
            symbol,
            totalHoldings,
            totalCost,
            totalSalePrice,
            totalGainLoss
        );
    }

    private Long generateId() {
        return System.currentTimeMillis() + (long)(Math.random() * 1000);
    }
}