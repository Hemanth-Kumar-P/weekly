package com.paymentmanagement.service;

import com.paymentmanagement.dto.CustomerDTO;
import com.paymentmanagement.entity.Customer;
import com.paymentmanagement.entity.Payment;
import com.paymentmanagement.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PaymentService paymentService;

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return convertToDTO(customer);
    }

    public List<CustomerDTO> getCustomersByPhone(String phone) {
        return customerRepository.findByPhone(phone).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CustomerDTO> searchCustomers(String query) {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .filter(customer -> 
                    customer.getName().toLowerCase().contains(query.toLowerCase()) ||
                    customer.getPhone().contains(query))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = convertToEntity(customerDTO);
        customer = customerRepository.save(customer);
        
        // Generate weekly payments starting from next week
        generateWeeklyPayments(customer);
        
        return convertToDTO(customer);
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        
        existingCustomer.setName(customerDTO.getName());
        existingCustomer.setPhone(customerDTO.getPhone());
        existingCustomer.setTotalAmount(customerDTO.getTotalAmount());
        existingCustomer.setDateOfAmountTaken(customerDTO.getDateOfAmountTaken());
        
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return convertToDTO(updatedCustomer);
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    private void generateWeeklyPayments(Customer customer) {
        List<Payment> payments = new ArrayList<>();
        LocalDate startDate = customer.getDateOfAmountTaken().plusWeeks(1); // Start from next week
        
        for (int i = 0; i < 10; i++) { // Fixed 10 weeks
            LocalDate paymentDate = startDate.plusWeeks(i);
            Payment.PaymentStatus status = determinePaymentStatus(paymentDate);
            
            Payment payment = new Payment(
                paymentDate,
                customer.getWeeklyAmount(),
                status,
                i + 1,
                customer
            );
            payments.add(payment);
        }
        
        paymentService.saveAllPayments(payments);
    }

    private Payment.PaymentStatus determinePaymentStatus(LocalDate paymentDate) {
        LocalDate today = LocalDate.now();
        
        if (paymentDate.isBefore(today)) {
            return Payment.PaymentStatus.MISSED;
        } else if (paymentDate.isEqual(today)) {
            return Payment.PaymentStatus.DUE;
        } else {
            return Payment.PaymentStatus.DUE;
        }
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setPhone(customer.getPhone());
        dto.setTotalAmount(customer.getTotalAmount());
        dto.setDateOfAmountTaken(customer.getDateOfAmountTaken());
        dto.setDayOfAmountTaken(customer.getDayOfAmountTaken());
        dto.setWeeklyAmount(customer.getWeeklyAmount());
        
        if (customer.getPayments() != null) {
            dto.setPayments(customer.getPayments().stream()
                    .map(paymentService::convertToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private Customer convertToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setPhone(dto.getPhone());
        customer.setTotalAmount(dto.getTotalAmount());
        customer.setDateOfAmountTaken(dto.getDateOfAmountTaken());
        return customer;
    }
}