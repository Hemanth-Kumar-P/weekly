package com.paymentmanagement.config;

import com.paymentmanagement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin if not exists
        adminService.createDefaultAdmin();
    }
}