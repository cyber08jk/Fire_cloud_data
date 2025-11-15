package com.firebird.controller;

import com.firebird.dto.ApiResponse;
import com.firebird.model.Folder;
import com.firebird.security.UserPrincipal;
import com.firebird.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
public class FolderController {
    
    private final FolderService folderService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<Folder>> createFolder(
            @RequestParam String name,
            @RequestParam(required = false) String parentId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Folder folder = folderService.createFolder(name, parentId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder created", folder));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Folder>>> listFolders(
            @RequestParam(required = false) String parentId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        List<Folder> folders = folderService.listFolders(principal.getId(), parentId);
        return ResponseEntity.ok(ApiResponse.success("Folders retrieved", folders));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Folder>> getFolder(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Folder folder = folderService.getFolder(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder retrieved", folder));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Folder>> renameFolder(
            @PathVariable String id,
            @RequestParam String name,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Folder folder = folderService.renameFolder(id, name, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder renamed", folder));
    }
    
    @PostMapping("/{id}/star")
    public ResponseEntity<ApiResponse<Folder>> toggleStar(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Folder folder = folderService.toggleStar(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Star toggled", folder));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFolder(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        folderService.deleteFolder(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder moved to trash", null));
    }
    
    @PostMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<Folder>> lockFolder(
            @PathVariable String id,
            @RequestParam String password,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Folder folder = folderService.lockFolder(id, password, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder locked", folder));
    }
    
    @PostMapping("/{id}/unlock")
    public ResponseEntity<ApiResponse<Folder>> unlockFolder(
            @PathVariable String id,
            @RequestParam String password,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Folder folder = folderService.unlockFolder(id, password, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder unlocked", folder));
    }
    
    @PostMapping("/{id}/verify-password")
    public ResponseEntity<ApiResponse<Boolean>> verifyPassword(
            @PathVariable String id,
            @RequestParam String password,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        boolean valid = folderService.verifyFolderPassword(id, password, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Password verified", valid));
    }
}
