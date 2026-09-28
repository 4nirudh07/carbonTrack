package com.carbontrack.carbontrack.service;

import com.carbontrack.carbontrack.entity.Challenge;
import com.carbontrack.carbontrack.repository.ChallengeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

    public ChallengeService(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    public Challenge createChallenge(Challenge challenge) {

        if (!challenge.getStartDate().isBefore(challenge.getEndDate())) {
            throw new IllegalArgumentException(
                    "Start date must be before end date"
            );
        }

        return challengeRepository.save(challenge);
    }

    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public Challenge getChallenge(Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Challenge not found"));
    }
}