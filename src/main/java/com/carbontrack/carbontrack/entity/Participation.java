package com.carbontrack.carbontrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "participations")
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @Column(nullable = false)
    private Double baselineFootprint;

    @Column(nullable = false)
    private Double currentFootprint;

    @Column(nullable = false)
    private Double reductionPercentage;

    public Participation() {
    }

    public Long getId() {
        return id;
    }

    public Household getHousehold() {
        return household;
    }

    public void setHousehold(Household household) {
        this.household = household;
    }

    public Challenge getChallenge() {
        return challenge;
    }

    public void setChallenge(Challenge challenge) {
        this.challenge = challenge;
    }

    public Double getBaselineFootprint() {
        return baselineFootprint;
    }

    public void setBaselineFootprint(Double baselineFootprint) {
        this.baselineFootprint = baselineFootprint;
    }

    public Double getCurrentFootprint() {
        return currentFootprint;
    }

    public void setCurrentFootprint(Double currentFootprint) {
        this.currentFootprint = currentFootprint;
    }

    public Double getReductionPercentage() {
        return reductionPercentage;
    }

    public void setReductionPercentage(Double reductionPercentage) {
        this.reductionPercentage = reductionPercentage;
    }
}