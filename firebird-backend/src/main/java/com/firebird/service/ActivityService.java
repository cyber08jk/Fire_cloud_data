package com.firebird.service;

import com.firebird.model.Activity;
import com.firebird.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    
    public void logActivity(String userId, String action, String resourceId, 
                           String resourceType, String resourceName) {
        Activity activity = new Activity();
        activity.setUserId(userId);
        activity.setAction(action);
        activity.setResourceId(resourceId);
        activity.setResourceType(resourceType);
        activity.setResourceName(resourceName);
        
        activityRepository.save(activity);
    }
    
    public Page<Activity> getUserActivities(String userId, Pageable pageable) {
        return activityRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
    }
    
    public List<Activity> getResourceActivities(String resourceId) {
        return activityRepository.findByResourceIdOrderByTimestampDesc(resourceId);
    }
}
