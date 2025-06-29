package com.paymentmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Phone number is required")
    @Column(nullable = false)
    private String phone;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    @Column(nullable = false)
    private Double totalAmount;

    @NotNull(message = "Date of amount taken is required")
    @Column(nullable = false)
    private LocalDate dateOfAmountTaken;

    @Column(nullable = false)
    private String dayOfAmountTaken;

    @Column(nullable = false)
    private Double weeklyAmount;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments;

    // Constructors
    public Customer() {}

    public Customer(String name, String phone, Double totalAmount, LocalDate dateOfAmountTaken) {
        this.name = name;
        this.phone = phone;
        this.totalAmount = totalAmount;
        this.dateOfAmountTaken = dateOfAmountTaken;
        this.dayOfAmountTaken = dateOfAmountTaken.getDayOfWeek().toString();
        this.weeklyAmount = Math.ceil(totalAmount / 10.0);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { 
        this.totalAmount = totalAmount;
        this.weeklyAmount = Math.ceil(totalAmount / 10.0);
    }

    public LocalDate getDateOfAmountTaken() { return dateOfAmountTaken; }
    public void setDateOfAmountTaken(LocalDate dateOfAmountTaken) { 
        this.dateOfAmountTaken = dateOfAmountTaken;
        this.dayOfAmountTaken = dateOfAmountTaken.getDayOfWeek().toString();
    }

    public String getDayOfAmountTaken() { return dayOfAmountTaken; }
    public void setDayOfAmountTaken(String dayOfAmountTaken) { this.dayOfAmountTaken = dayOfAmountTaken; }

    public Double getWeeklyAmount() { return weeklyAmount; }
    public void setWeeklyAmount(Double weeklyAmount) { this.weeklyAmount = weeklyAmount; }

    public List<Payment> getPayments() { return payments; }
    public void setPayments(List<Payment> payments) { this.payments = payments; }
}