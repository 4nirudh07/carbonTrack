package com.carbontrack.carbontrack.repository;

import com.carbontrack.carbontrack.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}