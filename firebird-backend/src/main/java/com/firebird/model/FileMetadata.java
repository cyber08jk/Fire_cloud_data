package com.firebird.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "files")
public class FileMetadata {
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    @Indexed
    private String ownerId;
    
    private String folderId; // null for root
    private String path; // Full path for display
    
    private String gridFsId; // Reference to GridFS file
    private Long size;
    private String mimeType;
    private String extension;
    
    private boolean starred = false;
    private boolean trashed = false;
    private LocalDateTime trashedAt;
    
    private List<String> tags = new ArrayList<>();
    
    private String thumbnailGridFsId; // For image previews
    
    private Long downloadCount = 0L;
    private LocalDateTime lastAccessedAt;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
