package com.allforest01.UserManagement.controller;

import com.allforest01.UserManagement.dto.ReqRes;
import com.allforest01.UserManagement.entity.Users;
import com.allforest01.UserManagement.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes req) {
        return ResponseEntity.ok(userManagementService.register(req));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req) {
        return ResponseEntity.ok(userManagementService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refresh(@RequestBody ReqRes req) {
        return ResponseEntity.ok(userManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUserByID(@PathVariable int userId) {
        return ResponseEntity.ok(userManagementService.getUsersById(userId));
    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable int userId, @RequestBody Users updatedUser) {
        return ResponseEntity.ok(userManagementService.updateUser(userId, updatedUser));
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable int userId) {
        return ResponseEntity.ok(userManagementService.deleteUser(userId));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = userManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
