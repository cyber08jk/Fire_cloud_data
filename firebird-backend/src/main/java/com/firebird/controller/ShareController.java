package com.firebird.controller;

import com.firebird.dto.ApiResponse;
import com.firebird.model.Share;
import com.firebird.security.UserPrincipal;
import com.firebird.service.ShareService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/share")
@RequiredArgsConstructor
public class ShareController {
    
    private final ShareService shareService;
    
    @PostMapping("/users")
    public ResponseEntity<ApiResponse<Share>> shareWithUser(
            @RequestBody ShareUserRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Share share = shareService.shareWithUser(
            request.getResourceId(),
            request.getResourceType(),
            principal.getId(),
            request.getEmail(),
            request.getPermission()
        );
        
        return ResponseEntity.ok(ApiResponse.success("Shared successfully", share));
    }
    
    @PostMapping("/link")
    public ResponseEntity<ApiResponse<Share>> createPublicLink(
            @RequestBody CreateLinkRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Share share = shareService.createPublicLink(
            request.getResourceId(),
            request.getResourceType(),
            principal.getId(),
            request.getPassword(),
            request.getExpiresAt()
        );
        
        return ResponseEntity.ok(ApiResponse.success("Link created", share));
    }
    
    @GetMapping("/received")
    public ResponseEntity<ApiResponse<List<Share>>> getSharedWithMe(
            @AuthenticationPrincipal UserPrincipal principal) {
        
        List<Share> shares = shareService.getSharedWithMe(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Shared items retrieved", shares));
    }
    
    @GetMapping("/by-me")
    public ResponseEntity<ApiResponse<List<Share>>> getSharedByMe(
            @AuthenticationPrincipal UserPrincipal principal) {
        
        List<Share> shares = shareService.getSharedByMe(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Shared items retrieved", shares));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeShare(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        shareService.removeShare(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Share removed", null));
    }
    
    @Data
    static class ShareUserRequest {
        private String resourceId;
        private String resourceType;
        private String email;
        private String permission;
    }
    
    @Data
    static class CreateLinkRequest {
        private String resourceId;
        private String resourceType;
        private String password;
        private LocalDateTime expiresAt;
    }
}
