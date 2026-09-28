package com.carbontrack.carbontrack.repository;

import com.carbontrack.carbontrack.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    boolean existsByHouseholdIdAndChallengeId(
            Long householdId,
            Long challengeId
    );
}