package com.paymentmanagement.repository;

import com.paymentmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomerId(Long customerId);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID'")
    Double getTotalAmountReceived();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'MISSED'")
    Long getMissedPaymentsCount();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID' AND p.paymentDate BETWEEN :startDate AND :endDate")
    Double getAmountCollectedBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate AND p.status = 'PAID'")
    List<Payment> findPaidPaymentsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}