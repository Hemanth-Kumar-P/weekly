package com.paymentmanagement.service;

import com.paymentmanagement.dto.PaymentDTO;
import com.paymentmanagement.entity.Payment;
import com.paymentmanagement.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<PaymentDTO> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByCustomerId(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO updatePaymentStatus(Long paymentId, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        
        payment.setStatus(status);
        Payment updatedPayment = paymentRepository.save(payment);
        return convertToDTO(updatedPayment);
    }

    public void deletePayment(Long paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }

    public List<PaymentDTO> getPaymentReports(String startDate, String endDate, Payment.PaymentStatus status) {
        List<Payment> payments = paymentRepository.findAll();
        
        // Apply filters
        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            payments = payments.stream()
                    .filter(p -> p.getPaidDate() != null && 
                               !p.getPaidDate().isBefore(start) && 
                               !p.getPaidDate().isAfter(end))
                    .collect(Collectors.toList());
        }
        
        if (status != null) {
            payments = payments.stream()
                    .filter(p -> p.getStatus() == status)
                    .collect(Collectors.toList());
        }
        
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void saveAllPayments(List<Payment> payments) {
        paymentRepository.saveAll(payments);
    }

    public Double getTotalAmountReceived() {
        Double amount = paymentRepository.getTotalAmountReceived();
        return amount != null ? amount : 0.0;
    }

    public Long getMissedPaymentsCount() {
        Long count = paymentRepository.getMissedPaymentsCount();
        return count != null ? count : 0L;
    }

    public Double getThisWeekCollectedAmount() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        
        Double amount = paymentRepository.getAmountCollectedBetweenDates(startOfWeek, endOfWeek);
        return amount != null ? amount : 0.0;
    }

    public PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus());
        dto.setWeekNumber(payment.getWeekNumber());
        dto.setPaidDate(payment.getPaidDate());
        dto.setCustomerId(payment.getCustomer().getId());
        return dto;
    }

    private Payment convertToEntity(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setAmount(dto.getAmount());
        payment.setStatus(dto.getStatus());
        payment.setWeekNumber(dto.getWeekNumber());
        payment.setPaidDate(dto.getPaidDate());
        return payment;
    }
}