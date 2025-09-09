package com.cryptotax.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class TaxCalculationResult {
    
    private BigDecimal totalGainLoss;
    private BigDecimal totalPurchaseAmount;
    private BigDecimal totalSaleAmount;
    private List<TransactionSummary> transactionSummaries;
    private LocalDateTime calculatedAt;
    private String sessionId;
    
    // Constructors
    public TaxCalculationResult() {
        this.calculatedAt = LocalDateTime.now();
    }
    
    public TaxCalculationResult(BigDecimal totalGainLoss, 
                              BigDecimal totalPurchaseAmount, 
                              BigDecimal totalSaleAmount,
                              List<TransactionSummary> transactionSummaries,
                              String sessionId) {
        this.totalGainLoss = totalGainLoss;
        this.totalPurchaseAmount = totalPurchaseAmount;
        this.totalSaleAmount = totalSaleAmount;
        this.transactionSummaries = transactionSummaries;
        this.sessionId = sessionId;
        this.calculatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public BigDecimal getTotalGainLoss() { return totalGainLoss; }
    public void setTotalGainLoss(BigDecimal totalGainLoss) { this.totalGainLoss = totalGainLoss; }
    
    public BigDecimal getTotalPurchaseAmount() { return totalPurchaseAmount; }
    public void setTotalPurchaseAmount(BigDecimal totalPurchaseAmount) { this.totalPurchaseAmount = totalPurchaseAmount; }
    
    public BigDecimal getTotalSaleAmount() { return totalSaleAmount; }
    public void setTotalSaleAmount(BigDecimal totalSaleAmount) { this.totalSaleAmount = totalSaleAmount; }
    
    public List<TransactionSummary> getTransactionSummaries() { return transactionSummaries; }
    public void setTransactionSummaries(List<TransactionSummary> transactionSummaries) { this.transactionSummaries = transactionSummaries; }
    
    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    // Inner class for transaction summary
    public static class TransactionSummary {
        private String symbol;
        private BigDecimal totalAmount;
        private BigDecimal totalPurchasePrice;
        private BigDecimal totalSalePrice;
        private BigDecimal gainLoss;
        
        public TransactionSummary() {}
        
        public TransactionSummary(String symbol, BigDecimal totalAmount, 
                                BigDecimal totalPurchasePrice, BigDecimal totalSalePrice, 
                                BigDecimal gainLoss) {
            this.symbol = symbol;
            this.totalAmount = totalAmount;
            this.totalPurchasePrice = totalPurchasePrice;
            this.totalSalePrice = totalSalePrice;
            this.gainLoss = gainLoss;
        }
        
        // Getters and Setters
        public String getSymbol() { return symbol; }
        public void setSymbol(String symbol) { this.symbol = symbol; }
        
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        
        public BigDecimal getTotalPurchasePrice() { return totalPurchasePrice; }
        public void setTotalPurchasePrice(BigDecimal totalPurchasePrice) { this.totalPurchasePrice = totalPurchasePrice; }
        
        public BigDecimal getTotalSalePrice() { return totalSalePrice; }
        public void setTotalSalePrice(BigDecimal totalSalePrice) { this.totalSalePrice = totalSalePrice; }
        
        public BigDecimal getGainLoss() { return gainLoss; }
        public void setGainLoss(BigDecimal gainLoss) { this.gainLoss = gainLoss; }
    }
}