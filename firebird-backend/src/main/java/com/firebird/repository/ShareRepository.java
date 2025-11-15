package com.firebird.repository;

import com.firebird.model.Share;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShareRepository extends MongoRepository<Share, String> {
    List<Share> findByResourceId(String resourceId);
    List<Share> findBySharedWith(String userId);
    List<Share> findByOwnerId(String ownerId);
    Optional<Share> findByToken(String token);
    Optional<Share> findByResourceIdAndSharedWith(String resourceId, String sharedWith);
}
