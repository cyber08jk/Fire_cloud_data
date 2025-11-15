package com.firebird.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activities")
public class Activity {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String action; // UPLOAD, DOWNLOAD, DELETE, SHARE, etc.
    
    @Indexed
    private String resourceId;
    
    private String resourceType; // FILE, FOLDER
    private String resourceName;
    
    private Map<String, Object> details = new HashMap<>();
    
    private String ipAddress;
    private String userAgent;
    
    @CreatedDate
    private LocalDateTime timestamp;
}
