package com.taxibooking.backend.services;

import com.taxibooking.backend.models.Destination;
import com.taxibooking.backend.repositories.DestinationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    @PostConstruct
    public void seedDestinations() {
        String[][] defaultsInfo = {
            {"Ooty", "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80", "Queen of Hill Stations, known for its expansive tea gardens, pleasant climate, and scenic Pykara lakes.", "260.0"},
            {"Guruvayur", "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80", "Famous pilgrimage town home to the historic Guruvayur Sri Krishna Temple, a spiritual haven for devotees.", "340.0"},
            {"Mysuru", "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80", "City of Palaces, rich in royal heritage, featuring the spectacular Mysore Palace, Chamundi Hills, and Brindavan Gardens.", "150.0"},
            {"Coorg", "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80", "The Scotland of India, famous for coffee plantations, mist-covered valleys, Abbey waterfalls, and lush spice estates.", "250.0"},
            {"Wayanad", "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&w=600&q=80", "Stunning Kerala hill station featuring the ancient Edakkal Caves, Chembra Peak heart-lake, and spice plantations.", "280.0"},
            {"Chikmagalur", "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80", "The birthplace of coffee in India, offering spectacular trekking trails like Mullayanagiri, waterfalls, and scenic viewpoints.", "240.0"},
            {"Mangalore", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", "Bustling coastal port city renowned for its pristine Panambur beach, historical temples, and delectable local seafood.", "350.0"}
        };

        for (String[] info : defaultsInfo) {
            String name = info[0];
            String imageUrl = info[1];
            String desc = info[2];
            double dist = Double.parseDouble(info[3]);

            Optional<Destination> existing = destinationRepository.findByName(name);
            Destination dest;
            if (existing.isPresent()) {
                dest = existing.get();
            } else {
                dest = new Destination();
                dest.setName(name);
            }
            dest.setImage(imageUrl);
            dest.setDescription(desc);
            dest.setDistance(dist);
            destinationRepository.save(dest);
        }
        System.out.println("Default destinations successfully seeded/force-updated!");
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestinationById(String id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with ID: " + id));
    }

    public Destination saveDestination(Destination destination) {
        return destinationRepository.save(destination);
    }

    public Destination updateDestination(String id, Destination details) {
        Destination destination = getDestinationById(id);
        destination.setName(details.getName());
        destination.setImage(details.getImage());
        destination.setDescription(details.getDescription());
        destination.setDistance(details.getDistance());
        return destinationRepository.save(destination);
    }

    public void deleteDestination(String id) {
        Destination destination = getDestinationById(id);
        destinationRepository.delete(destination);
    }
}
