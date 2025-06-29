package com.paymentmanagement.repository;

import com.paymentmanagement.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByPhone(String phone);
    
    @Query("SELECT SUM(c.totalAmount) FROM Customer c")
    Double getTotalAmountGiven();
    
    @Query("SELECT COUNT(c) FROM Customer c")
    Long getTotalCustomersCount();
}