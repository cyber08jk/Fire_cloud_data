package com.firebird.repository;

import com.firebird.model.FileMetadata;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FileMetadataRepository extends MongoRepository<FileMetadata, String> {
    List<FileMetadata> findByOwnerIdAndFolderIdAndTrashedFalse(String ownerId, String folderId);
    List<FileMetadata> findByOwnerIdAndTrashedFalse(String ownerId);
    List<FileMetadata> findByOwnerIdAndStarredTrueAndTrashedFalse(String ownerId);
    List<FileMetadata> findByOwnerIdAndTrashedTrue(String ownerId);
    
    Page<FileMetadata> findByOwnerIdAndNameContainingIgnoreCaseAndTrashedFalse(
        String ownerId, String name, Pageable pageable);
    
    @Query("{ 'ownerId': ?0, 'trashed': false, 'lastAccessedAt': { $gte: ?1 } }")
    List<FileMetadata> findRecentFiles(String ownerId, LocalDateTime since, Pageable pageable);
    
    @Query("{ 'ownerId': ?0, 'trashedAt': { $lt: ?1 } }")
    List<FileMetadata> findFilesForPermanentDeletion(String ownerId, LocalDateTime before);
}
