package com.firebird.service;

import com.firebird.model.FileMetadata;
import com.firebird.model.User;
import com.firebird.repository.FileMetadataRepository;
import com.firebird.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    
    private final FileMetadataRepository fileMetadataRepository;
    private final UserRepository userRepository;
    private final GridFSService gridFSService;
    private final ActivityService activityService;
    
    @Transactional
    public FileMetadata uploadFile(MultipartFile file, String userId, String folderId) throws IOException {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        long fileSize = file.getSize();
        if (user.getStorageUsed() + fileSize > user.getStorageQuota()) {
            throw new RuntimeException("Storage quota exceeded");
        }
        
        String gridFsId = gridFSService.storeFile(file);
        
        FileMetadata metadata = new FileMetadata();
        metadata.setName(file.getOriginalFilename());
        metadata.setOwnerId(userId);
        metadata.setFolderId(folderId);
        metadata.setGridFsId(gridFsId);
        metadata.setSize(fileSize);
        metadata.setMimeType(file.getContentType());
        metadata.setExtension(getFileExtension(file.getOriginalFilename()));
        metadata.setLastAccessedAt(LocalDateTime.now());
        
        metadata = fileMetadataRepository.save(metadata);
        
        user.setStorageUsed(user.getStorageUsed() + fileSize);
        userRepository.save(user);
        
        activityService.logActivity(userId, "UPLOAD", metadata.getId(), "FILE", metadata.getName());
        
        return metadata;
    }
    
    public FileMetadata getFile(String fileId, String userId) {
        FileMetadata file = fileMetadataRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId) && !hasAccessPermission(fileId, userId)) {
            throw new RuntimeException("Access denied");
        }
        
        file.setLastAccessedAt(LocalDateTime.now());
        file.setDownloadCount(file.getDownloadCount() + 1);
        fileMetadataRepository.save(file);
        
        return file;
    }
    
    public GridFsResource downloadFile(String fileId, String userId) {
        FileMetadata file = getFile(fileId, userId);
        activityService.logActivity(userId, "DOWNLOAD", fileId, "FILE", file.getName());
        return gridFSService.getFile(file.getGridFsId());
    }
    
    public List<FileMetadata> listFiles(String userId, String folderId) {
        return fileMetadataRepository.findByOwnerIdAndFolderIdAndTrashedFalse(userId, folderId);
    }
    
    public List<FileMetadata> getStarredFiles(String userId) {
        return fileMetadataRepository.findByOwnerIdAndStarredTrueAndTrashedFalse(userId);
    }
    
    public List<FileMetadata> getRecentFiles(String userId, Pageable pageable) {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        return fileMetadataRepository.findRecentFiles(userId, since, pageable);
    }
    
    public Page<FileMetadata> searchFiles(String userId, String query, Pageable pageable) {
        return fileMetadataRepository.findByOwnerIdAndNameContainingIgnoreCaseAndTrashedFalse(
            userId, query, pageable);
    }
    
    @Transactional
    public void deleteFile(String fileId, String userId) {
        FileMetadata file = fileMetadataRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        file.setTrashed(true);
        file.setTrashedAt(LocalDateTime.now());
        fileMetadataRepository.save(file);
        
        activityService.logActivity(userId, "DELETE", fileId, "FILE", file.getName());
    }
    
    @Transactional
    public void permanentlyDeleteFile(String fileId, String userId) {
        FileMetadata file = fileMetadataRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        gridFSService.deleteFile(file.getGridFsId());
        fileMetadataRepository.delete(file);
        
        User user = userRepository.findById(userId).orElseThrow();
        user.setStorageUsed(user.getStorageUsed() - file.getSize());
        userRepository.save(user);
    }
    
    public FileMetadata toggleStar(String fileId, String userId) {
        FileMetadata file = fileMetadataRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        file.setStarred(!file.isStarred());
        return fileMetadataRepository.save(file);
    }
    
    public FileMetadata renameFile(String fileId, String newName, String userId) {
        FileMetadata file = fileMetadataRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        file.setName(newName);
        return fileMetadataRepository.save(file);
    }
    
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1) : "";
    }
    
    private boolean hasAccessPermission(String fileId, String userId) {
        // Check if file is shared with user - implement with ShareService
        return false;
    }
}
