package com.paymentmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;

public class CustomerDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Phone number is required")
    private String phone;
    
    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private Double totalAmount;
    
    @NotNull(message = "Date of amount taken is required")
    private LocalDate dateOfAmountTaken;
    
    private String dayOfAmountTaken;
    private Double weeklyAmount;
    private List<PaymentDTO> payments;

    // Constructors
    public CustomerDTO() {}

    public CustomerDTO(String name, String phone, Double totalAmount, LocalDate dateOfAmountTaken) {
        this.name = name;
        this.phone = phone;
        this.totalAmount = totalAmount;
        this.dateOfAmountTaken = dateOfAmountTaken;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getDateOfAmountTaken() { return dateOfAmountTaken; }
    public void setDateOfAmountTaken(LocalDate dateOfAmountTaken) { this.dateOfAmountTaken = dateOfAmountTaken; }

    public String getDayOfAmountTaken() { return dayOfAmountTaken; }
    public void setDayOfAmountTaken(String dayOfAmountTaken) { this.dayOfAmountTaken = dayOfAmountTaken; }

    public Double getWeeklyAmount() { return weeklyAmount; }
    public void setWeeklyAmount(Double weeklyAmount) { this.weeklyAmount = weeklyAmount; }

    public List<PaymentDTO> getPayments() { return payments; }
    public void setPayments(List<PaymentDTO> payments) { this.payments = payments; }
}