package com.example.AdoptaFacil.DTO;

import com.example.AdoptaFacil.Entity.Role;
import lombok.Data;

@Data

public class PersonDTO {

    private Long idPerson;
    private String name;
    private String lastName;
    private String email;
    private String password;
    private Role role;

}
