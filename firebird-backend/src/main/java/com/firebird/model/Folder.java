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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "folders")
public class Folder {
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    @Indexed
    private String ownerId;
    
    private String parentId; // null for root folders
    private String path; // Full path: /Projects/2025
    
    private boolean starred = false;
    private boolean trashed = false;
    private LocalDateTime trashedAt;
    
    // Password protection
    private boolean locked = false;
    private String passwordHash; // BCrypt hashed password
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
