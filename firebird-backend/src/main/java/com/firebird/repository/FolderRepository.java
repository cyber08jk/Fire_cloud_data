package com.firebird.repository;

import com.firebird.model.Folder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String> {
    List<Folder> findByOwnerIdAndParentIdAndTrashedFalse(String ownerId, String parentId);
    List<Folder> findByOwnerIdAndTrashedFalse(String ownerId);
    List<Folder> findByOwnerIdAndStarredTrueAndTrashedFalse(String ownerId);
    List<Folder> findByOwnerIdAndTrashedTrue(String ownerId);
    Optional<Folder> findByOwnerIdAndNameAndParentId(String ownerId, String name, String parentId);
    List<Folder> findByPathStartingWith(String pathPrefix);
}
