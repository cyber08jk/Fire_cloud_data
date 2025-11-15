package com.firebird.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "shares")
public class Share {
    @Id
    private String id;
    
    @Indexed
    private String resourceId; // File or Folder ID
    
    private String resourceType; // "FILE" or "FOLDER"
    
    @Indexed
    private String ownerId;
    
    @Indexed
    private String sharedWith; // User ID (null for public links)
    
    private String permission; // "VIEWER", "EDITOR"
    
    @Indexed
    private String token; // For public link sharing
    
    private String password; // Hashed password for protected links
    private LocalDateTime expiresAt;
    
    private Long accessCount = 0L;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
