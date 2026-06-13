package com.taxibooking.backend.services;

import com.taxibooking.backend.models.Destination;
import com.taxibooking.backend.repositories.DestinationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    @PostConstruct
    public void seedDestinations() {
        if (destinationRepository.count() == 0) {
            List<Destination> defaults = new ArrayList<>();
            
            defaults.add(new Destination(null, "Ooty", 
                "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=600&q=80", 
                "Queen of Hill Stations, known for its expansive tea gardens, pleasant climate, and scenic Pykara lakes.", 
                260.0));
                
            defaults.add(new Destination(null, "Guruvayur", 
                "https://images.unsplash.com/photo-1627894562479-798eb4bbf949?auto=format&fit=crop&w=600&q=80", 
                "Famous pilgrimage town home to the historic Guruvayur Sri Krishna Temple, a spiritual haven for devotees.", 
                340.0));
                
            defaults.add(new Destination(null, "Mysuru", 
                "https://images.unsplash.com/photo-1590766948562-0f69f159e21a?auto=format&fit=crop&w=600&q=80", 
                "City of Palaces, rich in royal heritage, featuring the spectacular Mysore Palace, Chamundi Hills, and Brindavan Gardens.", 
                150.0));
                
            defaults.add(new Destination(null, "Coorg", 
                "https://images.unsplash.com/photo-1588598126786-fb7c6dcf0f19?auto=format&fit=crop&w=600&q=80", 
                "The Scotland of India, famous for coffee plantations, mist-covered valleys, Abbey waterfalls, and lush spice estates.", 
                250.0));
                
            defaults.add(new Destination(null, "Wayanad", 
                "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&w=600&q=80", 
                "Stunning Kerala hill station featuring the ancient Edakkal Caves, Chembra Peak heart-lake, and spice plantations.", 
                280.0));
                
            defaults.add(new Destination(null, "Chikmagalur", 
                "https://images.unsplash.com/photo-1622180556111-e6e7372d8293?auto=format&fit=crop&w=600&q=80", 
                "The birthplace of coffee in India, offering spectacular trekking trails like Mullayanagiri, waterfalls, and scenic viewpoints.", 
                240.0));
                
            defaults.add(new Destination(null, "Mangalore", 
                "https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=600&q=80", 
                "Bustling coastal port city renowned for its pristine Panambur beach, historical temples, and delectable local seafood.", 
                350.0));
                
            destinationRepository.saveAll(defaults);
            System.out.println("Default destinations seeded successfully!");
        }
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
