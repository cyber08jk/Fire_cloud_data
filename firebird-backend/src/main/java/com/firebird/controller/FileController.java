package com.firebird.controller;

import com.firebird.dto.ApiResponse;
import com.firebird.model.FileMetadata;
import com.firebird.security.UserPrincipal;
import com.firebird.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {
    
    private final FileService fileService;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<FileMetadata>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) String folderId,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {
        
        FileMetadata metadata = fileService.uploadFile(file, principal.getId(), folderId);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", metadata));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<FileMetadata>>> listFiles(
            @RequestParam(value = "folderId", required = false) String folderId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        List<FileMetadata> files = fileService.listFiles(principal.getId(), folderId);
        return ResponseEntity.ok(ApiResponse.success("Files retrieved", files));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FileMetadata>> getFile(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        FileMetadata file = fileService.getFile(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("File retrieved", file));
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<InputStreamResource> downloadFile(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {
        
        GridFsResource resource = fileService.downloadFile(id, principal.getId());
        FileMetadata metadata = fileService.getFile(id, principal.getId());
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getName() + "\"")
                .contentType(MediaType.parseMediaType(metadata.getMimeType()))
                .contentLength(metadata.getSize())
                .body(new InputStreamResource(resource.getInputStream()));
    }
    
    @GetMapping("/starred")
    public ResponseEntity<ApiResponse<List<FileMetadata>>> getStarredFiles(
            @AuthenticationPrincipal UserPrincipal principal) {
        
        List<FileMetadata> files = fileService.getStarredFiles(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Starred files retrieved", files));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<FileMetadata>>> getRecentFiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<FileMetadata> files = fileService.getRecentFiles(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Recent files retrieved", files));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<FileMetadata>>> searchFiles(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<FileMetadata> files = fileService.searchFiles(principal.getId(), q, pageable);
        return ResponseEntity.ok(ApiResponse.success("Search results", files));
    }
    
    @PostMapping("/{id}/star")
    public ResponseEntity<ApiResponse<FileMetadata>> toggleStar(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        FileMetadata file = fileService.toggleStar(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Star toggled", file));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FileMetadata>> renameFile(
            @PathVariable String id,
            @RequestParam String name,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        FileMetadata file = fileService.renameFile(id, name, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("File renamed", file));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        fileService.deleteFile(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("File moved to trash", null));
    }
}
