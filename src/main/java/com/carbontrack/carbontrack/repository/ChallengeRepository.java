package com.carbontrack.carbontrack.repository;

import com.carbontrack.carbontrack.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
}