package com.paymentmanagement.controller;

import com.paymentmanagement.dto.AdminStatsDTO;
import com.paymentmanagement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String phone = credentials.get("phone");
        String password = credentials.get("password");
        
        boolean isAuthenticated = adminService.authenticateAdmin(phone, password);
        
        if (isAuthenticated) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "role", "admin"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid credentials"
            ));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        
        boolean success = adminService.changePassword(phone, currentPassword, newPassword);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password changed successfully"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid current password"
            ));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        AdminStatsDTO stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }
}