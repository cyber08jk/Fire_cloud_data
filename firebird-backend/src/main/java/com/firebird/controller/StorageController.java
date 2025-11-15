package com.firebird.controller;

import com.firebird.dto.ApiResponse;
import com.firebird.model.User;
import com.firebird.security.UserPrincipal;
import com.firebird.service.AuthService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
public class StorageController {
    
    private final AuthService authService;
    
    @GetMapping("/usage")
    public ResponseEntity<ApiResponse<StorageUsage>> getStorageUsage(
            @AuthenticationPrincipal UserPrincipal principal) {
        
        User user = authService.getCurrentUser();
        StorageUsage usage = new StorageUsage(
            user.getStorageUsed(),
            user.getStorageQuota(),
            calculatePercentage(user.getStorageUsed(), user.getStorageQuota())
        );
        
        return ResponseEntity.ok(ApiResponse.success("Storage usage retrieved", usage));
    }
    
    private double calculatePercentage(long used, long quota) {
        return quota > 0 ? (used * 100.0) / quota : 0;
    }
    
    @Data
    @AllArgsConstructor
    static class StorageUsage {
        private Long used;
        private Long quota;
        private Double percentage;
    }
}
