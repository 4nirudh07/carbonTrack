package com.carbontrack.carbontrack.service;

import com.carbontrack.carbontrack.entity.Challenge;
import com.carbontrack.carbontrack.entity.Household;
import com.carbontrack.carbontrack.entity.Participation;
import com.carbontrack.carbontrack.repository.ChallengeRepository;
import com.carbontrack.carbontrack.repository.HouseholdRepository;
import com.carbontrack.carbontrack.repository.ParticipationRepository;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

@Service
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final HouseholdRepository householdRepository;
    private final ChallengeRepository challengeRepository;
    private final CarbonCalculationService carbonCalculationService;

    public ParticipationService(
            ParticipationRepository participationRepository,
            HouseholdRepository householdRepository,
            ChallengeRepository challengeRepository,
            CarbonCalculationService carbonCalculationService) {

        this.participationRepository = participationRepository;
        this.householdRepository = householdRepository;
        this.challengeRepository = challengeRepository;
        this.carbonCalculationService = carbonCalculationService;
    }

    public List<Participation> getAllParticipations() {
        return participationRepository.findAll();
    }

    public Participation joinChallenge(
            Long householdId,
            Long challengeId,
            YearMonth currentMonth) {

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() ->
                        new RuntimeException("Household not found"));

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() ->
                        new RuntimeException("Challenge not found"));
        if (participationRepository.existsByHouseholdIdAndChallengeId(
        householdId,
        challengeId)) {

    throw new IllegalArgumentException(
            "Household has already joined this challenge"
    );
}

        YearMonth challengeStart =
                YearMonth.from(challenge.getStartDate());

        YearMonth challengeEnd =
                YearMonth.from(challenge.getEndDate());

        if (currentMonth.isBefore(challengeStart)
                || currentMonth.isAfter(challengeEnd)) {

            throw new IllegalArgumentException(
                    "Participation month must be within the challenge period"
            );
        }

        double currentFootprint =
                carbonCalculationService.calculateMonthlyFootprint(
                        householdId,
                        currentMonth
                );

        double baselineFootprint =
                carbonCalculationService.calculateMonthlyFootprint(
                        householdId,
                        currentMonth.minusMonths(1)
                );

        if (baselineFootprint <= 0) {
            throw new IllegalArgumentException(
                    "Baseline footprint must be greater than zero"
            );
        }

        double reductionPercentage =
                ((baselineFootprint - currentFootprint)
                        / baselineFootprint) * 100;

        Participation participation = new Participation();

        participation.setHousehold(household);
        participation.setChallenge(challenge);
        participation.setBaselineFootprint(baselineFootprint);
        participation.setCurrentFootprint(currentFootprint);
        participation.setReductionPercentage(reductionPercentage);

        return participationRepository.save(participation);
    }
}