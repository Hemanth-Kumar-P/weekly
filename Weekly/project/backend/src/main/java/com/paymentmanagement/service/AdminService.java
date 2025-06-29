package com.paymentmanagement.service;

import com.paymentmanagement.dto.AdminStatsDTO;
import com.paymentmanagement.entity.Admin;
import com.paymentmanagement.repository.AdminRepository;
import com.paymentmanagement.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean authenticateAdmin(String phone, String password) {
        Optional<Admin> adminOpt = adminRepository.findByPhone(phone);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return passwordEncoder.matches(password, admin.getPassword());
        }
        return false;
    }

    public boolean changePassword(String phone, String currentPassword, String newPassword) {
        Optional<Admin> adminOpt = adminRepository.findByPhone(phone);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(currentPassword, admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(newPassword));
                adminRepository.save(admin);
                return true;
            }
        }
        return false;
    }

    public AdminStatsDTO getAdminStats() {
        Long totalCustomers = customerRepository.getTotalCustomersCount();
        Double totalAmountGiven = customerRepository.getTotalAmountGiven();
        Double amountReceived = paymentService.getTotalAmountReceived();
        Double thisWeekCollected = paymentService.getThisWeekCollectedAmount();
        Long missedPayments = paymentService.getMissedPaymentsCount();

        return new AdminStatsDTO(
            totalCustomers != null ? totalCustomers : 0L,
            totalAmountGiven != null ? totalAmountGiven : 0.0,
            amountReceived != null ? amountReceived : 0.0,
            thisWeekCollected != null ? thisWeekCollected : 0.0,
            missedPayments != null ? missedPayments : 0L
        );
    }

    public void createDefaultAdmin() {
        if (adminRepository.findByPhone("7815981315").isEmpty()) {
            Admin admin = new Admin("7815981315", passwordEncoder.encode("Phk@1234"));
            adminRepository.save(admin);
        }
    }
}