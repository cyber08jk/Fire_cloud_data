package com.firebird.service;

import com.firebird.model.Folder;
import com.firebird.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderService {
    
    private final FolderRepository folderRepository;
    private final ActivityService activityService;
    
    public Folder createFolder(String name, String parentId, String userId) {
        if (folderRepository.findByOwnerIdAndNameAndParentId(userId, name, parentId).isPresent()) {
            throw new RuntimeException("Folder with this name already exists");
        }
        
        Folder folder = new Folder();
        folder.setName(name);
        folder.setParentId(parentId);
        folder.setOwnerId(userId);
        folder.setPath(buildPath(parentId, name, userId));
        
        folder = folderRepository.save(folder);
        activityService.logActivity(userId, "CREATE_FOLDER", folder.getId(), "FOLDER", name);
        
        return folder;
    }
    
    public List<Folder> listFolders(String userId, String parentId) {
        return folderRepository.findByOwnerIdAndParentIdAndTrashedFalse(userId, parentId);
    }
    
    public Folder getFolder(String folderId, String userId) {
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        if (!folder.getOwnerId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        return folder;
    }
    
    @Transactional
    public void deleteFolder(String folderId, String userId) {
        Folder folder = getFolder(folderId, userId);
        
        folder.setTrashed(true);
        folder.setTrashedAt(LocalDateTime.now());
        folderRepository.save(folder);
        
        // Soft delete all subfolders
        List<Folder> subfolders = folderRepository.findByPathStartingWith(folder.getPath() + "/");
        subfolders.forEach(sf -> {
            sf.setTrashed(true);
            sf.setTrashedAt(LocalDateTime.now());
        });
        folderRepository.saveAll(subfolders);
        
        activityService.logActivity(userId, "DELETE_FOLDER", folderId, "FOLDER", folder.getName());
    }
    
    public Folder renameFolder(String folderId, String newName, String userId) {
        Folder folder = getFolder(folderId, userId);
        
        String oldPath = folder.getPath();
        folder.setName(newName);
        folder.setPath(buildPath(folder.getParentId(), newName, userId));
        
        folder = folderRepository.save(folder);
        
        // Update paths of all subfolders
        updateSubfolderPaths(oldPath, folder.getPath());
        
        return folder;
    }
    
    public Folder toggleStar(String folderId, String userId) {
        Folder folder = getFolder(folderId, userId);
        folder.setStarred(!folder.isStarred());
        return folderRepository.save(folder);
    }
    
    private String buildPath(String parentId, String name, String userId) {
        if (parentId == null) {
            return "/" + name;
        }
        
        Folder parent = folderRepository.findById(parentId)
            .orElseThrow(() -> new RuntimeException("Parent folder not found"));
        
        return parent.getPath() + "/" + name;
    }
    
    private void updateSubfolderPaths(String oldPath, String newPath) {
        List<Folder> subfolders = folderRepository.findByPathStartingWith(oldPath + "/");
        subfolders.forEach(folder -> {
            String relativePath = folder.getPath().substring(oldPath.length());
            folder.setPath(newPath + relativePath);
        });
        folderRepository.saveAll(subfolders);
    }
    
    public Folder lockFolder(String folderId, String password, String userId) {
        Folder folder = getFolder(folderId, userId);
        
        if (folder.isLocked()) {
            throw new RuntimeException("Folder is already locked");
        }
        
        // Hash the password using BCrypt
        String hashedPassword = org.springframework.security.crypto.bcrypt.BCrypt.hashpw(password, org.springframework.security.crypto.bcrypt.BCrypt.gensalt(12));
        
        folder.setLocked(true);
        folder.setPasswordHash(hashedPassword);
        
        folder = folderRepository.save(folder);
        activityService.logActivity(userId, "LOCK_FOLDER", folderId, "FOLDER", folder.getName());
        
        return folder;
    }
    
    public Folder unlockFolder(String folderId, String password, String userId) {
        Folder folder = getFolder(folderId, userId);
        
        if (!folder.isLocked()) {
            throw new RuntimeException("Folder is not locked");
        }
        
        // Verify password
        if (!org.springframework.security.crypto.bcrypt.BCrypt.checkpw(password, folder.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }
        
        folder.setLocked(false);
        folder.setPasswordHash(null);
        
        folder = folderRepository.save(folder);
        activityService.logActivity(userId, "UNLOCK_FOLDER", folderId, "FOLDER", folder.getName());
        
        return folder;
    }
    
    public boolean verifyFolderPassword(String folderId, String password, String userId) {
        Folder folder = getFolder(folderId, userId);
        
        if (!folder.isLocked()) {
            return true; // Not locked, no password needed
        }
        
        return org.springframework.security.crypto.bcrypt.BCrypt.checkpw(password, folder.getPasswordHash());
    }

}