package com.firebird.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class GridFSService {
    
    private final GridFsTemplate gridFsTemplate;
    
    public String storeFile(MultipartFile file) throws IOException {
        ObjectId fileId = gridFsTemplate.store(
            file.getInputStream(),
            file.getOriginalFilename(),
            file.getContentType()
        );
        return fileId.toString();
    }
    
    public String storeFile(InputStream inputStream, String filename, String contentType) {
        ObjectId fileId = gridFsTemplate.store(inputStream, filename, contentType);
        return fileId.toString();
    }
    
    public GridFsResource getFile(String id) {
        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        if (gridFSFile == null) {
            throw new RuntimeException("File not found: " + id);
        }
        return gridFsTemplate.getResource(gridFSFile);
    }
    
    public void deleteFile(String id) {
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(id)));
    }
    
    public GridFSFile getFileMetadata(String id) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
    }
}
