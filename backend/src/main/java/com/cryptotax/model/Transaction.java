package com.cryptotax.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Transaction type is required")
    @Column(nullable = false)
    private String type; // BUY, SELL, SEND, RECEIVE
    
    @NotBlank(message = "Cryptocurrency symbol is required")
    @Column(nullable = false)
    private String symbol; // BTC, ETH, etc.
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Column(nullable = false, precision = 18, scale = 8)
    private BigDecimal amount;
    
    @Column(precision = 18, scale = 8)
    private BigDecimal priceJpy; // Price in Japanese Yen at time of transaction
    
    @NotNull(message = "Transaction date is required")
    @Column(nullable = false)
    private LocalDateTime transactionDate;
    
    private String exchange; // Exchange name where transaction occurred
    
    private String notes; // Additional notes
    
    @Column(name = "session_id")
    private String sessionId; // For session-based data isolation
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Transaction() {}
    
    public Transaction(String type, String symbol, BigDecimal amount, 
                      BigDecimal priceJpy, LocalDateTime transactionDate, 
                      String exchange, String sessionId) {
        this.type = type;
        this.symbol = symbol;
        this.amount = amount;
        this.priceJpy = priceJpy;
        this.transactionDate = transactionDate;
        this.exchange = exchange;
        this.sessionId = sessionId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public BigDecimal getPriceJpy() { return priceJpy; }
    public void setPriceJpy(BigDecimal priceJpy) { this.priceJpy = priceJpy; }
    
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    
    public String getExchange() { return exchange; }
    public void setExchange(String exchange) { this.exchange = exchange; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}