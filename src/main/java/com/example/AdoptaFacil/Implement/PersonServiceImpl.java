package com.example.AdoptaFacil.Implement;

import com.example.AdoptaFacil.DTO.PersonDTO;
import com.example.AdoptaFacil.Entity.Person;
import com.example.AdoptaFacil.Repository.PersonRepository;
import com.example.AdoptaFacil.Service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PersonServiceImpl implements PersonService {

    @Autowired
    private PersonRepository personRepository;

    // 🔹 Convertir Entity a DTO
    private PersonDTO convertToDTO(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setIdPerson(person.getIdPerson());
        dto.setName(person.getName());
        dto.setLastName(person.getLastName());
        dto.setEmail(person.getEmail());
        dto.setPassword(person.getPassword());
        dto.setRole(person.getRole());
        return dto;
    }

    // 🔹 Convertir DTO a Entity
    private Person convertToEntity(PersonDTO dto) {
        Person person = new Person();
        person.setIdPerson(dto.getIdPerson());
        person.setName(dto.getName());
        person.setLastName(dto.getLastName());
        person.setEmail(dto.getEmail());
        person.setPassword(dto.getPassword());
        person.setRole(dto.getRole());
        return person;
    }

    @Override
    public List<PersonDTO> listPersons() {
        return personRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PersonDTO> listPersonByRole(String roleType) {
        try {
            com.example.AdoptaFacil.Entity.Role.RoleType typeEnum = com.example.AdoptaFacil.Entity.Role.RoleType.valueOf(roleType.toUpperCase());
            return personRepository.findByRole_RoleType(typeEnum)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            // Si el rol no existe, retorna lista vacía
            return List.of();
        }
    }

    @Override
    public PersonDTO getPersonByEmail(String email) {
        return personRepository.findByEmail(email)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public PersonDTO getPersonById(Long personId) {
        return personRepository.findById(personId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public PersonDTO createPerson(PersonDTO personDTO) {
        Person saved = personRepository.save(convertToEntity(personDTO));
        return convertToDTO(saved);
    }

    @Override
    public PersonDTO updatePerson(Long personId, PersonDTO personDTO) {
        Optional<Person> existingPerson = personRepository.findById(personId);

        if (existingPerson.isPresent()) {
            Person person = existingPerson.get();
            person.setName(personDTO.getName());
            person.setLastName(personDTO.getLastName());
            person.setEmail(personDTO.getEmail());
            person.setPassword(personDTO.getPassword());
            person.setRole(personDTO.getRole());

            Person updated = personRepository.save(person);
            return convertToDTO(updated);
        }
        return null;
    }

    @Override
    public void deletePerson(Long personId) {
        personRepository.deleteById(personId);
    }
}
