package com.firebird.service;

import com.firebird.model.Share;
import com.firebird.repository.ShareRepository;
import com.firebird.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShareService {
    
    private final ShareRepository shareRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityService activityService;
    
    public Share shareWithUser(String resourceId, String resourceType, String ownerId, 
                               String sharedWithEmail, String permission) {
        var user = userRepository.findByEmail(sharedWithEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        var existingShare = shareRepository.findByResourceIdAndSharedWith(resourceId, user.getId());
        if (existingShare.isPresent()) {
            Share share = existingShare.get();
            share.setPermission(permission);
            return shareRepository.save(share);
        }
        
        Share share = new Share();
        share.setResourceId(resourceId);
        share.setResourceType(resourceType);
        share.setOwnerId(ownerId);
        share.setSharedWith(user.getId());
        share.setPermission(permission);
        
        share = shareRepository.save(share);
        activityService.logActivity(ownerId, "SHARE", resourceId, resourceType, "Shared with " + sharedWithEmail);
        
        return share;
    }
    
    public Share createPublicLink(String resourceId, String resourceType, String ownerId, 
                                  String password, LocalDateTime expiresAt) {
        String token = UUID.randomUUID().toString();
        
        Share share = new Share();
        share.setResourceId(resourceId);
        share.setResourceType(resourceType);
        share.setOwnerId(ownerId);
        share.setToken(token);
        share.setPermission("VIEWER");
        share.setExpiresAt(expiresAt);
        
        if (password != null && !password.isEmpty()) {
            share.setPassword(passwordEncoder.encode(password));
        }
        
        return shareRepository.save(share);
    }
    
    public Share getShareByToken(String token) {
        Share share = shareRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid share link"));
        
        if (share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Share link has expired");
        }
        
        share.setAccessCount(share.getAccessCount() + 1);
        return shareRepository.save(share);
    }
    
    public boolean validateSharePassword(String shareId, String password) {
        Share share = shareRepository.findById(shareId)
            .orElseThrow(() -> new RuntimeException("Share not found"));
        
        if (share.getPassword() == null) {
            return true;
        }
        
        return passwordEncoder.matches(password, share.getPassword());
    }
    
    public List<Share> getSharedWithMe(String userId) {
        return shareRepository.findBySharedWith(userId);
    }
    
    public List<Share> getSharedByMe(String userId) {
        return shareRepository.findByOwnerId(userId);
    }
    
    public void removeShare(String shareId, String userId) {
        Share share = shareRepository.findById(shareId)
            .orElseThrow(() -> new RuntimeException("Share not found"));
        
        if (!share.getOwnerId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        shareRepository.delete(share);
    }
    
    public boolean hasAccess(String resourceId, String userId) {
        return shareRepository.findByResourceIdAndSharedWith(resourceId, userId).isPresent();
    }
}
