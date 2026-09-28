package com.carbontrack.carbontrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @NotNull
    @Column(nullable = false)
    private LocalDate activityDate;

    @NotNull
    @Column(nullable = false)
    private String commuteMode;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double commuteDistanceKm;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double electricityUnits;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double wasteGenerated;

    public ActivityLog() {
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

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public String getCommuteMode() {
        return commuteMode;
    }

    public void setCommuteMode(String commuteMode) {
        this.commuteMode = commuteMode;
    }

    public Double getCommuteDistanceKm() {
        return commuteDistanceKm;
    }

    public void setCommuteDistanceKm(Double commuteDistanceKm) {
        this.commuteDistanceKm = commuteDistanceKm;
    }

    public Double getElectricityUnits() {
        return electricityUnits;
    }

    public void setElectricityUnits(Double electricityUnits) {
        this.electricityUnits = electricityUnits;
    }

    public Double getWasteGenerated() {
        return wasteGenerated;
    }

    public void setWasteGenerated(Double wasteGenerated) {
        this.wasteGenerated = wasteGenerated;
    }
}   