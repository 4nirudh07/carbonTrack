package com.carbontrack.carbontrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "households")
public class Household {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String householdName;

    @Column(nullable = false)
    private String location;

    public Household() {
    }

    public Household(String householdName, String location) {
        this.householdName = householdName;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public String getHouseholdName() {
        return householdName;
    }

    public void setHouseholdName(String householdName) {
        this.householdName = householdName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}