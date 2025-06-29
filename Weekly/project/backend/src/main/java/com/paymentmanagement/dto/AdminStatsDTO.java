package com.paymentmanagement.dto;

public class AdminStatsDTO {
    private Long totalCustomers;
    private Double totalAmountGiven;
    private Double amountReceived;
    private Double thisWeekCollected;
    private Long missedPayments;

    // Constructors
    public AdminStatsDTO() {}

    public AdminStatsDTO(Long totalCustomers, Double totalAmountGiven, Double amountReceived, 
                        Double thisWeekCollected, Long missedPayments) {
        this.totalCustomers = totalCustomers;
        this.totalAmountGiven = totalAmountGiven;
        this.amountReceived = amountReceived;
        this.thisWeekCollected = thisWeekCollected;
        this.missedPayments = missedPayments;
    }

    // Getters and Setters
    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public Double getTotalAmountGiven() { return totalAmountGiven; }
    public void setTotalAmountGiven(Double totalAmountGiven) { this.totalAmountGiven = totalAmountGiven; }

    public Double getAmountReceived() { return amountReceived; }
    public void setAmountReceived(Double amountReceived) { this.amountReceived = amountReceived; }

    public Double getThisWeekCollected() { return thisWeekCollected; }
    public void setThisWeekCollected(Double thisWeekCollected) { this.thisWeekCollected = thisWeekCollected; }

    public Long getMissedPayments() { return missedPayments; }
    public void setMissedPayments(Long missedPayments) { this.missedPayments = missedPayments; }
}