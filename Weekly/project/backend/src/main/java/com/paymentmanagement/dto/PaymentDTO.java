package com.paymentmanagement.dto;

import com.paymentmanagement.entity.Payment;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class PaymentDTO {
    private Long id;
    
    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    private Payment.PaymentStatus status;
    private Integer weekNumber;
    private LocalDate paidDate;
    private Long customerId;

    // Constructors
    public PaymentDTO() {}

    public PaymentDTO(LocalDate paymentDate, Double amount, Payment.PaymentStatus status, Integer weekNumber) {
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.status = status;
        this.weekNumber = weekNumber;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Payment.PaymentStatus getStatus() { return status; }
    public void setStatus(Payment.PaymentStatus status) { this.status = status; }

    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
}