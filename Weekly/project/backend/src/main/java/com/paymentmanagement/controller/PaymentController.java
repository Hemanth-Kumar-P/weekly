package com.paymentmanagement.controller;

import com.paymentmanagement.dto.PaymentDTO;
import com.paymentmanagement.entity.Payment;
import com.paymentmanagement.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByCustomerId(@PathVariable Long customerId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByCustomerId(customerId);
        return ResponseEntity.ok(payments);
    }

    @PutMapping("/{paymentId}/status")
    public ResponseEntity<PaymentDTO> updatePaymentStatus(
            @PathVariable Long paymentId, 
            @RequestParam Payment.PaymentStatus status) {
        try {
            PaymentDTO updatedPayment = paymentService.updatePaymentStatus(paymentId, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Map<String, String>> deletePayment(@PathVariable Long paymentId) {
        try {
            paymentService.deletePayment(paymentId);
            return ResponseEntity.ok(Map.of("message", "Payment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<PaymentDTO>> getPaymentReports(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Payment.PaymentStatus status) {
        List<PaymentDTO> payments = paymentService.getPaymentReports(startDate, endDate, status);
        return ResponseEntity.ok(payments);
    }
}