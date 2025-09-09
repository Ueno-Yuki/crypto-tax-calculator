package com.cryptotax.controller;

import com.cryptotax.model.Transaction;
import com.cryptotax.model.TaxCalculationResult;
import com.cryptotax.service.TransactionService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(HttpSession session) {
        String sessionId = session.getId();
        List<Transaction> transactions = transactionService.getTransactionsBySession(sessionId);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@Valid @RequestBody Transaction transaction, 
                                                     HttpSession session) {
        String sessionId = session.getId();
        transaction.setSessionId(sessionId);
        Transaction savedTransaction = transactionService.addTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, HttpSession session) {
        String sessionId = session.getId();
        transactionService.deleteTransaction(sessionId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calculate-tax")
    public ResponseEntity<TaxCalculationResult> calculateTax(HttpSession session) {
        String sessionId = session.getId();
        TaxCalculationResult result = transactionService.calculateTax(sessionId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearSessionData(HttpSession session) {
        String sessionId = session.getId();
        transactionService.clearSessionData(sessionId);
        return ResponseEntity.ok(Map.of("message", "Session data cleared successfully"));
    }
}